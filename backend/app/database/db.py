from flask import Flask, jsonify
from mysql.connector import connect

# code của mấy anh ấn độ


app = Flask(__name__)
# Kết nối database cổng mặc định mySQL là 3306
con = connect(
    host = 'localhost',
    user = 'root',
    password = '123456',
    database = 'ToDoListDB',
    port=3306
)

# Lấy danh sách bảng trong database
@app.route('/get_tables', methods=['GET'])
def get_tables():
    cursor = con.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    cursor.close()
    con.close()
    print(tables)
    table_name = [table[0] for table in tables]
    return jsonify({"tables": table_name}),200

# Chạy Flask
if __name__ == '__main__':
    print("dang ket noi database")
    app.run(debug=True)
