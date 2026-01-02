from flask import Blueprint, jsonify, request
from services.auth_service import login_user, register_user

# =========================
# Tạo Blueprint cho các route liên quan đến xác thực
# =========================
auth_bp = Blueprint(
    'auth', # Tên blueprint
    __name__, #Vị trí module
    url_prefix='/api/auth' #Tiền tố URL cho tất cả các route trong blueprint này
)

# =========================
# REGISTER
# POST /api/auth/register
# =========================
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    #Validate cơ bản dữ liệu đầu vào
    if not data:
        return jsonify({
            "status": "error",
            "message": "No data provided" # Comment bằng tiếng anh cho oách
        }), 400
        
    # Lấy thông tin từ yêu cầu
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    # Kiểm tra xem có đủ thông tin không
    if not username or not email or not password:
        return jsonify({
            "status": "error",
            "message": "Missing required fields" # Đếch nhận đủ thông tin thì trả về lỗi 400
        }), 400
        
    # Gọi hàm đăng ký từ service
    result = register_user(
        username,
        email,
        password
    )
    
    status_code = 200 if result['status'] == 'success' else 400 # Thành công trả về 200, lỗi trả về 400
    return jsonify(result), status_code

# =========================
# LOGIN
# POST /api/auth/register
# =========================
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate cơ bản dữ liệu đầu vào
    if not data:
        return jsonify({
            "status": "error",
            "message": "No data provided"
        }), 400
        
    # Lấy thông tin từ yêu cầu
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    # Kiểm tra xem có đủ thông tin không
    if not (username or email) or not password:
        return jsonify({
            "status": "error",
            "message": "Missing required fields"
        }), 400
        
    # Gọi hàm đăng nhập từ service
    result = login_user(
        username,
        email,
        password
    )
        
    status_code = 200 if result['status'] == 'success' else 400 # Thành công trả về 200, lỗi trả về 400
    return jsonify(result), status_code