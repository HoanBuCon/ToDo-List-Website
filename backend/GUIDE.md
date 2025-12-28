backend guild
something change i


cấu trúc backend với flask
backend/
 ├─ app/
 │   ├─ __init__.py
 │   ├─ routes.py
 │   ├─ models.py
 │   └─ db.py
 ├─ config.py
 └─ run.py




+------------------------+
|         User           |
+------------------------+
| PK user_id             |
|    user_name           |
|    email               |
|    password            |
|    register_time       |
|    last_update_time    |
|    last_login_time     |
+------------------------+
            ^
            |
            |  (1 User có nhiều ToDoList)
            |
+------------------------+
|        ToDoList        |
+------------------------+
| PK list_id             |
| FK user_id             |
|    title               |
|    description         |
|    status              |
|    start_time          |
|    end_time            |
|    true_start_time     |
|    true_end_time       |
+------------------------+
            ^
            |
            |  (1 ToDoList có nhiều Tasks)
            |
+------------------------+
|         Tasks          |
+------------------------+
| PK task_id             |
| FK list_id             |
|    task_content        |
|    status              |
|    create_time         |
|    complete_time       |
+------------------------+
