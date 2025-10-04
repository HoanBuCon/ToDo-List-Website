class LoadingHandler {
    // Giả lập timer loading cho ngầu
    constructor() {
        this.loadingSteps = [
            { step: 1, text: 'Loading data...', duration: 1000 },
            { step: 2, text: 'Initializing components...', duration: 1500 },
            { step: 3, text: 'Done!', duration: 500 }
        ];
        
        this.currentStep = 0;
        this.progress = 0;
        this.loadingDuration = 3000; // 3 giây
        
        this.init();
    }
    
    init() {
        // Wait for DOM ready (no dependency on domReady.js)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startLoading());
        } else {
            this.startLoading();
        }
    }
    
    async startLoading() {
        try {
            // Bắt đầu quá trình loading
            await this.simulateLoading();
            
            // Chuyển đến trang chính
            await this.redirectToHomePage();
            
        } catch (error) {
            // Nếu có lỗi, vẫn chuyển đến trang chính
            this.redirectToHomePage();
        }
    }
    
    async simulateLoading() {
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        // Chạy thanh progress
        const progressInterval = setInterval(() => {
            this.progress += 2;
            if (progressBar) {
                progressBar.style.width = `${this.progress}%`;
            }
            if (progressText) {
                progressText.textContent = `${this.progress}%`;
            }
            
            if (this.progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 60); // Update mỗi 60ms
        
        // Chạy các bước loading
        for (let i = 0; i < this.loadingSteps.length; i++) {
            await this.executeStep(i);
        }
        
        // Đảm bảo progress bar đạt 100%
        this.progress = 100;
        if (progressBar) progressBar.style.width = '100%';
        if (progressText) progressText.textContent = '100%';
        
        clearInterval(progressInterval);
    }
    
    async executeStep(stepIndex) {
        const stepData = this.loadingSteps[stepIndex];
        const stepElement = document.querySelector(`[data-step="${stepData.step}"]`);
        
        // Activate current step
        if (stepElement) {
            stepElement.classList.add('active');
            
            // Update step text if needed
            const stepText = stepElement.querySelector('span');
            if (stepText) {
                stepText.textContent = stepData.text;
            }
        }
        
        // Wait for step duration
        await this.delay(stepData.duration);
        
        // Mark as completed
        if (stepElement) {
            stepElement.classList.remove('active');
            stepElement.classList.add('completed');
            
            // Change icon to check
            const icon = stepElement.querySelector('i');
            if (icon && stepIndex === this.loadingSteps.length - 1) {
                icon.className = 'fas fa-check-circle';
            }
        }
    }
    
    async redirectToHomePage() {
        // Thêm hiệu ứng fade out
        const loadingContainer = document.querySelector('.loading-container');
        if (loadingContainer) {
            loadingContainer.classList.add('fade-out');
        }
        
        // Đợi hiệu ứng fade out hoàn thành
        await this.delay(500);
        
        // Kiểm tra xem có trang homePage không
        if (this.checkHomePageExists()) {
            // Chuyển đến trang home
            window.location.href = 'pages/html/homePage.html';
        } else {
            // Nếu không có homePage, chuyển đến trang tasks
            window.location.href = 'pages/html/tasksPage.html';
        }
    }
    
    checkHomePageExists() {
        // Kiểm tra xem file homePage.html có tồn tại không
        // Vì đây là client-side, ta sẽ giả định homePage tồn tại
        // Trong thực tế, có thể dùng fetch để kiểm tra
        return true;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Method để skip loading nếu người dùng click
    enableSkipLoading() {
        document.addEventListener('click', () => {
            this.skipLoading();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                this.skipLoading();
            }
        });
    }
    
    skipLoading() {
        // Nếu đang loading, skip ngay đến trang chính
        this.progress = 100;
        this.redirectToHomePage();
    }
}

// Khởi tạo Loading Handler
const loadingHandler = new LoadingHandler();

// Enable skip loading (optional)
// loadingHandler.enableSkipLoading();

// Export cho sử dụng khác (nếu cần)
window.LoadingHandler = LoadingHandler;