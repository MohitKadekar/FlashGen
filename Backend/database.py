import os
import psycopg2
from psycopg2.extras import RealDictCursor
from utils import calculate_sm2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise e

def init_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Notes table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                title TEXT,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Flashcards table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS flashcards (
                id SERIAL PRIMARY KEY,
                note_id INTEGER NOT NULL,
                user_id VARCHAR(255) NOT NULL,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                difficulty VARCHAR(50) DEFAULT 'medium',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                next_review_date DATE,
                interval INTEGER DEFAULT 0,
                repetition_count INTEGER DEFAULT 0,
                ease_factor REAL DEFAULT 2.5,
                FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
            )
        """)
        
        conn.commit()
    except Exception as e:
        print(f"DB Init Error: {e}")
    finally:
        if conn: conn.close()

def save_note_to_db(user_id: str, content: str, title: str = None):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO notes (user_id, title, content) VALUES (%s, %s, %s) RETURNING id", 
            (user_id, title, content)
        )
        note_id = cursor.fetchone()['id']
        conn.commit()
        return note_id
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def get_notes_from_db(user_id: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM notes WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def get_note_by_id(note_id: int, user_id: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM notes WHERE id = %s AND user_id = %s", (note_id, user_id))
        row = cursor.fetchone()
        return dict(row) if row else None
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def save_flashcards_to_db(user_id: str, note_id: int, flashcards: list):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Ensure difficulty defaults to medium if missing
        data = [(note_id, user_id, fc['question'], fc['answer'], fc.get('difficulty', 'medium')) for fc in flashcards]
        
        cursor.executemany(
            "INSERT INTO flashcards (note_id, user_id, question, answer, difficulty) VALUES (%s, %s, %s, %s, %s)", 
            data
        )
        conn.commit()
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def get_flashcards_from_db(note_id: int, user_id: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM flashcards WHERE note_id = %s AND user_id = %s", (note_id, user_id))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def search_flashcards_db(user_id: str, query: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        search_query = f"%{query}%"
        # Using ILIKE for case-insensitive search
        cursor.execute("""
            SELECT f.*, n.title as note_title 
            FROM flashcards f
            JOIN notes n ON f.note_id = n.id
            WHERE f.user_id = %s AND (f.question ILIKE %s OR f.answer ILIKE %s)
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
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM flashcards WHERE id = %s AND user_id = %s", (flashcard_id, user_id))
        row = cursor.fetchone()
        return dict(row) if row else None
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def update_flashcard_to_db(user_id: str, flashcard_id: int, question: str, answer: str, difficulty: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE flashcards SET question = %s, answer = %s, difficulty = %s WHERE id = %s AND user_id = %s", 
            (question, answer, difficulty, flashcard_id, user_id)
        )
        conn.commit()
        if cursor.rowcount == 0:
            return None 
        return True
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def get_flashcard_sets_from_db(user_id: str):
    try:
        conn = get_db_connection()
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
            WHERE n.user_id = %s
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
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT f.*, n.title as note_title 
            FROM flashcards f
            JOIN notes n ON f.note_id = n.id
            WHERE f.user_id = %s
            ORDER BY f.created_at DESC
            LIMIT %s
        """, (user_id, limit))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def get_flashcard_stats_db(user_id: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                COUNT(*) as total_cards,
                SUM(CASE WHEN difficulty = 'easy' THEN 1 ELSE 0 END) as mastered_count,
                SUM(CASE WHEN difficulty = 'hard' THEN 1 ELSE 0 END) as hard_count
            FROM flashcards 
            WHERE user_id = %s
        """, (user_id,))
        
        row = cursor.fetchone()
        # row will be a dict-like object. 
        # Note: SUM returns None if no rows match, but COUNT returns 0.
        # However, count(*) will return 0 if no rows, so SUM would be null usually if group by involved or empty set.
        # But here it's an aggregate query without GROUP BY on empty table -> returns one row with 0/NULL/NULL.
        
        if row:
            return {
                "total_cards": row['total_cards'] or 0,
                "mastered_count": row['mastered_count'] or 0,
                "hard_count": row['hard_count'] or 0
            }
        return {"total_cards": 0, "mastered_count": 0, "hard_count": 0}
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def ensure_schema_updates():
    """Ensures that the flashcards table has the necessary columns for spaced repetition."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check existing columns
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'flashcards'
        """)
        columns = [row['column_name'] for row in cursor.fetchall()]
        
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
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Fetch cards where next_review_date is NULL (new) OR <= today
        # AND user_id matches
        cursor.execute("""
            SELECT * FROM flashcards 
            WHERE user_id = %s 
            AND (next_review_date IS NULL OR next_review_date <= CURRENT_DATE)
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
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get current state
        cursor.execute("SELECT * FROM flashcards WHERE id = %s AND user_id = %s", (flashcard_id, user_id))
        row = cursor.fetchone()
        
        if not row:
            return None 
            
        card = dict(row)
        
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
            SET next_review_date = %s, interval = %s, repetition_count = %s, ease_factor = %s
            WHERE id = %s
        """, (next_date, new_interval, new_reps, new_ease, flashcard_id))
        
        conn.commit()
        
        # Return updated card
        cursor.execute("SELECT * FROM flashcards WHERE id = %s", (flashcard_id,))
        updated_row = cursor.fetchone()
        return dict(updated_row)
        
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def delete_flashcard_db(user_id: str, flashcard_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM flashcards WHERE id = %s AND user_id = %s", (flashcard_id, user_id))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def delete_note_db(user_id: str, note_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Delete associated flashcards first
        cursor.execute("DELETE FROM flashcards WHERE note_id = %s AND user_id = %s", (note_id, user_id))
        # Delete the note
        cursor.execute("DELETE FROM notes WHERE id = %s AND user_id = %s", (note_id, user_id))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def get_random_distractors_db(user_id: str, flashcard_id: int):
    """Fetches random answers from other flashcards to use as distractors."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get 3 random answers from other cards
        cursor.execute("""
            SELECT answer FROM flashcards 
            WHERE user_id = %s AND id != %s
            ORDER BY RANDOM() 
            LIMIT 3
        """, (user_id, flashcard_id))
        
        rows = cursor.fetchall()
        return [row['answer'] for row in rows]
    except Exception as e:
        print(f"Error fetching random distractors: {e}")
        return []
    finally:
        if conn: conn.close()

def get_detailed_stats_db(user_id: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) as count FROM flashcards WHERE user_id = %s", (user_id,))
        total_cards = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM flashcards WHERE user_id = %s AND repetition_count = 0", (user_id,))
        new_cards = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM flashcards WHERE user_id = %s AND interval > 21", (user_id,))
        mastered_cards = cursor.fetchone()['count']
        
        learning_cards = total_cards - new_cards - mastered_cards
        
        cursor.execute("SELECT AVG(ease_factor) as avg_ease FROM flashcards WHERE user_id = %s AND repetition_count > 0", (user_id,))
        # avg_ease might be None if no cards
        avg_ease = cursor.fetchone()['avg_ease']
        
        return {
            "total_cards": total_cards,
            "new_cards": new_cards,
            "learning_cards": learning_cards,
            "mastered_cards": mastered_cards,
            "avg_ease": float(avg_ease) if avg_ease else 2.5
        }
            
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()

def export_flashcards_db(user_id: str):
    """
    Fetches all flashcards for a user to be exported.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM flashcards WHERE user_id = %s", (user_id,))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        raise Exception(f"Database error: {e}")
    finally:
        if conn: conn.close()
