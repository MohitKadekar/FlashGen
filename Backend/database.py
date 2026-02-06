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

def search_flashcards_db(user_id: str, query: str):
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        search_query = f"%{query}%"
        cursor.execute("""
            SELECT f.*, n.title as note_title 
            FROM flashcards f
            JOIN notes n ON f.note_id = n.id
            WHERE f.user_id = ? AND (f.question LIKE ? OR f.answer LIKE ?)
            ORDER BY f.created_at DESC
        """, (user_id, search_query, search_query))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def get_flashcard_by_id_db(user_id: str, flashcard_id: int):
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM flashcards WHERE id = ? AND user_id = ?", (flashcard_id, user_id))
        row = cursor.fetchone()
        return dict(row) if row else None
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def update_flashcard_to_db(user_id: str, flashcard_id: int, question: str, answer: str, difficulty: str):
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        # Verify ownership first (optional but good practice, though WHERE clause handles it)
        cursor.execute("UPDATE flashcards SET question = ?, answer = ?, difficulty = ? WHERE id = ? AND user_id = ?", 
                       (question, answer, difficulty, flashcard_id, user_id))
        conn.commit()
        if cursor.rowcount == 0:
            return None # Not found or not owned
        return True
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def get_flashcard_sets_from_db(user_id: str):
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                n.id as note_id,
                n.title,
                COUNT(f.id) as card_count,
                SUM(CASE WHEN f.difficulty = 'easy' THEN 1 ELSE 0 END) as mastered_count,
                MAX(f.created_at) as last_activity
            FROM notes n
            JOIN flashcards f ON n.id = f.note_id
            WHERE n.user_id = ?
            GROUP BY n.id, n.title
            ORDER BY last_activity DESC
        """, (user_id,))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def get_recent_flashcards_db(user_id: str, limit: int = 10):
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("""
            SELECT f.*, n.title as note_title 
            FROM flashcards f
            JOIN notes n ON f.note_id = n.id
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC
            LIMIT ?
        """, (user_id, limit))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def get_flashcard_stats_db(user_id: str):
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                COUNT(*) as total_cards,
                SUM(CASE WHEN difficulty = 'easy' THEN 1 ELSE 0 END) as mastered_count,
                SUM(CASE WHEN difficulty = 'hard' THEN 1 ELSE 0 END) as hard_count
            FROM flashcards 
            WHERE user_id = ?
        """, (user_id,))
        
        row = cursor.fetchone()
        return dict(row) if row else {"total_cards": 0, "mastered_count": 0, "hard_count": 0}
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()
