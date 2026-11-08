"""
Database Backup & Disaster Recovery Utility for EXTRASAGA News Engine.
Creates timestamped gzip-compressed backups of SQLite or PostgreSQL databases.
"""
import os
import shutil
import tarfile
from datetime import datetime, timezone
from pathlib import Path
from news_engine.config.settings import get_settings


def backup_database():
    settings = get_settings()
    root_dir = Path(__file__).resolve().parent.parent
    backups_dir = root_dir / "backups"
    backups_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")

    if "sqlite" in settings.DATABASE_URL:
        # SQLite database backup
        db_file = root_dir / "extrasaga_news.db"
        if not db_file.exists():
            print(f"SQLite database file not found at {db_file}. Skipping.")
            return

        backup_file = backups_dir / f"extrasaga_news_{timestamp}.db.tar.gz"
        with tarfile.open(backup_file, "w:gz") as tar:
            tar.add(db_file, arcname="extrasaga_news.db")

        print(f"✓ Backup created successfully: {backup_file} ({backup_file.stat().st_size} bytes)")
    else:
        # PostgreSQL pg_dump backup instructions
        print("For PostgreSQL container backup, run:")
        print(f"docker exec -t extrasaga-postgres pg_dump -U newsbot extrasaga_news | gzip > backups/extrasaga_news_{timestamp}.sql.gz")


if __name__ == "__main__":
    backup_database()

