import sqlite3

DB_NAME = "notes.db"

def init_db():
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                title TEXT,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
    except Exception as e:
        print(f"DB Init Error: {e}")
    finally:
        if conn: conn.close()

def save_note_to_db(user_id: str, content: str, title: str = None):
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)", (user_id, title, content))
        note_id = cursor.lastrowid
        conn.commit()
        return note_id
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def get_notes_from_db(user_id: str):
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()
