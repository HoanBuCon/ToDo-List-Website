// Lấy các element từ HTML
const textInput = document.getElementById('textInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const sendBtn = document.getElementById('sendBtn');
const responseText = document.getElementById('responseText');

// Khi người dùng bấm nút Send
sendBtn.addEventListener('click', async () => {
    // Lấy dữ liệu từ input
    const data = {
        username: textInput.value,
        email: emailInput.value,
        password: passwordInput.value
    };

    console.log("Dữ liệu chuẩn bị gửi:", data);

    try {
        // Gửi POST request về backend
        const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Nhận phản hồi từ backend
        const result = await res.json();
        console.log("Phản hồi từ backend:", result);

        // Hiển thị lên HTML
        responseText.innerText = result.message || "Gửi thành công!";

    } catch (err) {
        console.error("Lỗi khi gửi dữ liệu:", err);
        responseText.innerText = "Gửi thất bại!";
    }
});
