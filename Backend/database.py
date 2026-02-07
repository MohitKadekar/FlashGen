import sqlite3
from utils import calculate_sm2

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

def ensure_schema_updates():
    """Ensures that the flashcards table has the necessary columns for spaced repetition."""
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        # Check existing columns
        cursor.execute("PRAGMA table_info(flashcards)")
        columns = [info[1] for info in cursor.fetchall()]
        
        # Add columns if they don't exist
        if 'next_review_date' not in columns:
            cursor.execute("ALTER TABLE flashcards ADD COLUMN next_review_date DATE")
        if 'interval' not in columns:
            cursor.execute("ALTER TABLE flashcards ADD COLUMN interval INTEGER DEFAULT 0")
        if 'repetition_count' not in columns:
            cursor.execute("ALTER TABLE flashcards ADD COLUMN repetition_count INTEGER DEFAULT 0")
        if 'ease_factor' not in columns:
            cursor.execute("ALTER TABLE flashcards ADD COLUMN ease_factor REAL DEFAULT 2.5")
            
        conn.commit()
    except Exception as e:
        print(f"Schema Update Error: {e}")
    finally:
        if conn: conn.close()

def get_due_flashcards_db(user_id: str):
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Fetch cards where next_review_date is NULL (new) OR <= today
        # AND user_id matches
        # We limit to 50 to avoid overwhelming the user
        cursor.execute("""
            SELECT * FROM flashcards 
            WHERE user_id = ? 
            AND (next_review_date IS NULL OR next_review_date <= date('now'))
            ORDER BY next_review_date ASC
            LIMIT 50
        """, (user_id,))
        
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def update_flashcard_review_db(user_id: str, flashcard_id: int, rating: int):
    """
    Updates the flashcard's scheduling using the SM-2 spaced repetition algorithm.
    Algorithm details:
    1. Interval(1) = 1
    2. Interval(2) = 6
    3. Interval(n) = Interval(n-1) * EaseFactor
    4. NewEaseFactor = OldEaseFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
    5. EaseFactor must be >= 1.3
    6. If rating < 3, RepetitionCount is reset to 0, Interval is reset to 1
    """
    try:
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get current state
        cursor.execute("SELECT * FROM flashcards WHERE id = ? AND user_id = ?", (flashcard_id, user_id))
        row = cursor.fetchone()
        
        if not row:
            return None # Not found or not owned
            
        card = dict(row)
        
        # Current state values
        # Default interval to 0 if null, but SM-2 usually starts with Logic
        prev_interval = card.get('interval', 0) or 0
        prev_reps = card.get('repetition_count', 0) or 0
        prev_ease = card.get('ease_factor', 2.5) or 2.5
        
        # Calculate new scheduling using SM-2 helper
        sm2_result = calculate_sm2(
            quality=rating,
            repetition_count=prev_reps,
            ease_factor=prev_ease,
            current_interval=prev_interval
        )
        
        new_interval = sm2_result['interval']
        new_reps = sm2_result['repetition_count']
        new_ease = sm2_result['ease_factor']
        next_date = sm2_result['next_review_date'].isoformat()


        
        cursor.execute("""
            UPDATE flashcards 
            SET next_review_date = ?, interval = ?, repetition_count = ?, ease_factor = ?
            WHERE id = ?
        """, (next_date, new_interval, new_reps, new_ease, flashcard_id))
        
        conn.commit()
        
        # Return updated card
        cursor.execute("SELECT * FROM flashcards WHERE id = ?", (flashcard_id,))
        updated_row = cursor.fetchone()
        return dict(updated_row)
        
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def delete_flashcard_db(user_id: str, flashcard_id: int):
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM flashcards WHERE id = ? AND user_id = ?", (flashcard_id, user_id))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def delete_note_db(user_id: str, note_id: int):
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        # Delete associated flashcards first
        cursor.execute("DELETE FROM flashcards WHERE note_id = ? AND user_id = ?", (note_id, user_id))
        # Delete the note
        cursor.execute("DELETE FROM notes WHERE id = ? AND user_id = ?", (note_id, user_id))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()
