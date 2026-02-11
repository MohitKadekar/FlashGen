from utils import calculate_sm2
from datetime import datetime, timedelta

def test_sm2_logic():
    print("Testing SM-2 Logic...")

    # Test Case 1: First review success
    # Reps: 0 -> 1, Interval: ? -> 1, EF: 2.5 -> updated
    res = calculate_sm2(quality=4, repetition_count=0, ease_factor=2.5, current_interval=0)
    assert res['repetition_count'] == 1, f"Failed First Review Reps: {res['repetition_count']}"
    assert res['interval'] == 1, f"Failed First Review Interval: {res['interval']}"
    print("✓ First review success passed")

    # Test Case 2: Second review success
    # Reps: 1 -> 2, Interval: 1 -> 6
    res = calculate_sm2(quality=4, repetition_count=1, ease_factor=2.5, current_interval=1)
    assert res['repetition_count'] == 2, f"Failed Second Review Reps: {res['repetition_count']}"
    assert res['interval'] == 6, f"Failed Second Review Interval: {res['interval']}"
    print("✓ Second review success passed")

    # Test Case 3: Third review success
    # Reps: 2 -> 3, Interval: 6 -> 6 * 2.5 = 15
    res = calculate_sm2(quality=4, repetition_count=2, ease_factor=2.5, current_interval=6)
    assert res['repetition_count'] == 3, f"Failed Third Review Reps: {res['repetition_count']}"
    assert res['interval'] == 15, f"Failed Third Review Interval: {res['interval']}"
    print("✓ Third review success passed")

    # Test Case 4: Failed review
    # Reps: 5 -> 0, Interval: ? -> 1
    res = calculate_sm2(quality=2, repetition_count=5, ease_factor=2.5, current_interval=100)
    assert res['repetition_count'] == 0, f"Failed Review Reset Reps: {res['repetition_count']}"
    assert res['interval'] == 1, f"Failed Review Reset Interval: {res['interval']}"
    print("✓ Failed review reset passed")
    
    # Test Case 5: Ease Factor Calculation
    # Quality 5: EF' = 2.5 + (0.1 - (0) * (...)) = 2.6
    res = calculate_sm2(quality=5, repetition_count=2, ease_factor=2.5, current_interval=6)
    expected_ef = 2.5 + (0.1 - (0) * (0.08 + (0) * 0.02)) # 2.6
    assert abs(res['ease_factor'] - 2.6) < 0.001, f"Failed EF Calc: {res['ease_factor']}"
    print("✓ Ease Factor calculation passed")

    # Test Case 6: Ease Factor Lower Bound
    # Repeated low quality but >=3 should lower EF, eventually hit 1.3
    # Actually, quality 3 lowers EF.
    # Q=3: EF change = 0.1 - 2 * (0.08 + 0.04) = 0.1 - 0.24 = -0.14
    # Start with EF=1.3. Q=3 -> EF should stay 1.3
    res = calculate_sm2(quality=3, repetition_count=10, ease_factor=1.3, current_interval=100)
    assert res['ease_factor'] == 1.3, f"Failed EF Lower Bound: {res['ease_factor']}"
    print("✓ Ease Factor lower bound passed")

    print("All SM-2 logic tests passed!")

if __name__ == "__main__":
    test_sm2_logic()
