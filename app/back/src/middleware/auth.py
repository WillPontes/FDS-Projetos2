import os
from typing import Any

import jwt
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError

bearer = HTTPBearer()


def _decode_jwt(token: str) -> dict[str, Any]:
    secret = os.environ.get("JWT_SECRET", "")
    if not secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT_SECRET não configurado no servidor",
        )
    try:
        return jwt.decode(token, secret, algorithms=["HS256"])
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        ) from None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer),
) -> dict[str, str | None]:
    payload = _decode_jwt(credentials.credentials)
    sub = payload.get("sub")
    if sub is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token sem identificador (sub)",
        )
    email = payload.get("email")
    if email is not None and not isinstance(email, str):
        email = str(email)
    return {"id": str(sub), "email": email}
