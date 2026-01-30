from fastapi import Header, HTTPException, status
from firebase_admin import auth

async def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authentication header")
    
    token = authorization.split("Bearer ")[1]
    
    try:
        # Verify the ID token while checking if the token is revoked.
        decoded_token = auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception as e:
        print(f"Token verification failed: {e}")
        # Return 401 with specific detail for debugging
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
