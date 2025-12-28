from flask import Flask, jsonify
import mysql.connector

# code của mấy anh ấn độ

# chạy file và kết nối đến cổng localhost:5000/get_tables để kiểm tra kết nối database

# kết nối trả về file json chứa các bảng -> kết nối thành công

app = Flask(__name__)

con = mysql.connector.connect(
    host = 'localhost',
    user = 'root',
    password = '123456',
    database = 'ToDoListDB'
)

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

if __name__ == '__main__':
    print("dang ket noi database")
    app.run(debug=True)
