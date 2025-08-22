from sqlalchemy import create_engine

# --- 重要：请确保这里的数据库连接信息与 main.py 中的一致 ---
DATABASE_URL = "mysql+mysqlconnector://root:6z78l905E@localhost/program"

def test_db_connection():
    try:
        engine = create_engine(DATABASE_URL)
        connection = engine.connect()
        print("数据库连接成功！")
        connection.close()
    except Exception as e:
        print(f"数据库连接失败，错误信息：\n{e}")

if __name__ == "__main__":
    test_db_connection()

