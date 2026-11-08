"""
Authentication guard for EXTRASAGA Admin Dashboard.
Secures dashboard endpoints with API keys and HTTP Basic / Bearer authentication.
"""
import secrets
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBasic, HTTPBasicCredentials, HTTPBearer, HTTPAuthorizationCredentials
from news_engine.config.settings import get_settings

security_basic = HTTPBasic(auto_error=False)
security_bearer = HTTPBearer(auto_error=False)


def verify_dashboard_access(
    request: Request,
    credentials: HTTPBasicCredentials = Depends(security_basic),
    bearer: HTTPAuthorizationCredentials = Depends(security_bearer),
) -> bool:
    """Verifies dashboard credentials via Basic Auth, Bearer token, or query key."""
    settings = get_settings()
    expected_secret = settings.ADMIN_PASSWORD

    # 1. Check Query parameter (?key=...)
    query_key = request.query_params.get("key")
    if query_key and secrets.compare_digest(query_key, expected_secret):
        return True

    # 2. Check Bearer token
    if bearer and bearer.credentials and secrets.compare_digest(bearer.credentials, expected_secret):
        return True

    # 3. Check Basic Auth (username "admin", password matching ADMIN_PASSWORD)
    if credentials:
        is_user_ok = secrets.compare_digest(credentials.username, "admin")
        is_pass_ok = secrets.compare_digest(credentials.password, expected_secret)
        if is_user_ok and is_pass_ok:
            return True

    # In local development mode without explicit auth configured, permit inspection
    if settings.APP_ENV == "development" and expected_secret == "admin123":
        return True

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorized: Valid admin credentials required for dashboard access.",
        headers={"WWW-Authenticate": "Basic"},
    )

