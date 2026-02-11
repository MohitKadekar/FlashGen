from datetime import datetime, timedelta
from math import ceil

def calculate_sm2(
    quality: int,
    repetition_count: int,
    ease_factor: float,
    current_interval: int
) -> dict:
    """
    Calculates the next review schedule using the SM-2 spaced repetition algorithm.
    
    Args:
        quality (int): User rating of the recall quality (0-5).
                       5 - perfect response
                       4 - correct response after a hesitation
                       3 - correct response recalled with serious difficulty
                       2 - incorrect response; where the correct one seemed easy to recall
                       1 - incorrect response; the correct one remembered
                       0 - complete blackout.
        repetition_count (int): How many times the card has been successfully reviewed in a row.
        ease_factor (float): The stored ease factor for the card (initial usually 2.5).
        current_interval (int): The current interval in days.
        
    Returns:
        dict: A dictionary containing:
            - repetition_count (int): Updated repetition count.
            - ease_factor (float): Updated ease factor.
            - interval (int): New interval in days.
            - next_review_date (datetime.date): The calculated next review date.
    """
    
    # Calculate new ease factor
    # Formula: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q)*0.02))
    q = quality
    new_ease_factor = ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

    if new_ease_factor < 1.3:
        new_ease_factor = 1.3

    if quality >= 3:
        # Correct response
        if repetition_count == 0:
            new_interval = 1
        elif repetition_count == 1:
            new_interval = 6
        else:
            new_interval = int(round(current_interval * ease_factor))
            
        new_repetition_count = repetition_count + 1
    else:
        # Incorrect response
        new_repetition_count = 0
        new_interval = 1
        
    # Calculate next review date
    next_review_date = datetime.now().date() + timedelta(days=new_interval)
    
    return {
        "repetition_count": new_repetition_count,
        "ease_factor": new_ease_factor,
        "interval": new_interval,
        "next_review_date": next_review_date
    }
