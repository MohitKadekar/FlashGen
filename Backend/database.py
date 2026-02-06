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
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS flashcards (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                note_id INTEGER NOT NULL,
                user_id TEXT NOT NULL,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                difficulty TEXT DEFAULT 'medium',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (note_id) REFERENCES notes(id)
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

def get_note_by_id(note_id: int, user_id: str):
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM notes WHERE id = ? AND user_id = ?", (note_id, user_id))
        row = cursor.fetchone()
        return dict(row) if row else None
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def save_flashcards_to_db(user_id: str, note_id: int, flashcards: list):
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        data = [(note_id, user_id, fc['question'], fc['answer'], fc.get('difficulty', 'medium')) for fc in flashcards]
        cursor.executemany("INSERT INTO flashcards (note_id, user_id, question, answer, difficulty) VALUES (?, ?, ?, ?, ?)", data)
        conn.commit()
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def get_flashcards_from_db(note_id: int, user_id: str):
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM flashcards WHERE note_id = ? AND user_id = ?", (note_id, user_id))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()
