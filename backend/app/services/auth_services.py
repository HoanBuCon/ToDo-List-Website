def register_user(username: str, email: str, password: str):
    # Giả sử có logic để đăng ký người dùng ở đây (làm sau, dưới là log demo)
    
    print(f"Thông tin nhận được từ FrontEnd: {username}, Email: {email}")
    
    # Trả về kết quả đăng ký
    return {
        "status": "success",
        "message": "User registered successfully"
    }
    
def login_user(username: str, email: str, password: str):
    # Giả sử có logic để đăng nhập người dùng ở đây (làm sau, dưới là log demo)
    
    print(f"Thông tin đăng nhập từ FrontEnd: {username or email}")
    
    # Trả về kết quả đăng nhập
    return {
        "status": "success",
        "message": "User logged in successfully"
    }