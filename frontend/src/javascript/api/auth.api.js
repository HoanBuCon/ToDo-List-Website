// Lấy API base path từ biến môi trường
const API_BASE_URL = (() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    } else {
        return window.location.origin + '/api';
    }
})();

// Hàm xử lý đăng ký người dùng
export async function registerUser(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to register user.');
        }
        return response;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

// Hàm xử lý đăng nhập người dùng
export async function loginUser(username, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to login user.');
        }
        return response;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
}