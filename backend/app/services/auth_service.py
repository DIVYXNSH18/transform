from datetime import datetime, timedelta
from typing import Annotated, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
import bcrypt

from app.config import SECRET_KEY
from app.db import get_db
from app.models.schema import User
from app.models.auth import TokenData

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_or_create_default_user(db: Session) -> User:
    user = db.query(User).filter(User.username == "demo").first()
    if not user:
        user = User(username="demo", hashed_password=get_password_hash("demo123"))
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

async def get_current_user(
    token: Annotated[Optional[str], Depends(oauth2_scheme)] = None,
    db: Session = Depends(get_db)
) -> User:
    if not token:
        return get_or_create_default_user(db)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return get_or_create_default_user(db)
        token_data = TokenData(username=username)
    except JWTError:
        return get_or_create_default_user(db)
    
    user = db.query(User).filter(User.username == token_data.username).first()
    if user is None:
        return get_or_create_default_user(db)
    return user
