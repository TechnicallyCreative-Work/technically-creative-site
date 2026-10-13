#!/usr/bin/env python3
"""
Downloads Organizer
-------------------
Sorts files out of your Downloads folder:

    apps / installers  -> Documents
    videos             -> Videos
    images             -> Pictures
    other documents    -> Documents

If a file is already at the destination (same name AND identical content), the
copy in Downloads goes to the Recycle Bin instead. If the name collides but the
content differs, the incoming file is kept and renamed "name (1).ext" so
nothing is ever overwritten or lost.

Anything it doesn't recognise (zips, audio, etc.) is left alone.

Setup (once):
    pip install send2trash

Run manually:
    python downloads_organizer.py             # do it
    python downloads_organizer.py --dry-run   # preview only, touches nothing

Run on a schedule (Windows Task Scheduler, no extra tools needed):
    python downloads_organizer.py --install-schedule 30   # every 30 minutes
    python downloads_organizer.py --remove-schedule
"""

import argparse
import hashlib
import logging
import shutil
import subprocess
import sys
import time
from pathlib import Path

try:
    from send2trash import send2trash
except ImportError:
    sys.exit("Missing dependency. Run:  pip install send2trash")

# --------------------------------------------------------------------------
# Settings you might want to tweak
# --------------------------------------------------------------------------

# Optional subfolder inside the destination ("" = drop straight into it).
# e.g. set INSTALLERS_SUBFOLDER = "Installers" to keep Documents tidy.
INSTALLERS_SUBFOLDER = ""
DOCUMENTS_SUBFOLDER = ""

# Don't touch files modified within this many seconds (avoids grabbing a
# download that's still in progress).
MIN_FILE_AGE_SECONDS = 60

TASK_NAME = "DownloadsOrganizer"

EXTENSIONS = {
    "installers": {
        ".exe", ".msi", ".msix", ".msixbundle", ".appx", ".appxbundle",
        ".dmg", ".pkg", ".deb", ".rpm", ".apk", ".appimage", ".iso",
    },
    "videos": {
        ".mp4", ".mkv", ".mov", ".avi", ".wmv", ".webm", ".flv", ".m4v",
        ".mpg", ".mpeg", ".3gp",
    },
    "images": {
        ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", ".tiff", ".webp",
        ".heic", ".heif", ".svg", ".ico", ".psd", ".raw", ".cr2", ".nef", ".arw",
    },
    "documents": {
        ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt",
        ".rtf", ".odt", ".ods", ".odp", ".csv", ".md", ".epub", ".pages",
        ".numbers", ".key",
    },
}

# Files still being downloaded by browsers
PARTIAL_SUFFIXES = {".crdownload", ".part", ".partial", ".download", ".tmp", ".opdownload"}

LOG_FILE = Path(__file__).with_suffix(".log")

# --------------------------------------------------------------------------
# Locate the real user folders (handles OneDrive-redirected Documents, etc.)
# --------------------------------------------------------------------------

_KNOWN_FOLDER_IDS = {
    "Downloads": "{374DE290-123F-4565-9164-39C4925E467B}",
    "Documents": "{FDD39AD0-238F-46AF-ADB4-6C85480369C7}",
    "Videos": "{18989B1D-99B5-455B-841C-AB7C74E4DDFC}",
    "Pictures": "{33E28130-4E1E-4676-835A-98395C3BC3BB}",
}


def user_folder(name: str) -> Path:
    """Return the user's Downloads/Documents/Videos/Pictures folder."""
    if sys.platform == "win32":
        try:
            import ctypes
            from ctypes import wintypes

            guid = ctypes.c_byte * 16
            folder_id = guid()
            ctypes.oledll.ole32.CLSIDFromString(_KNOWN_FOLDER_IDS[name], ctypes.byref(folder_id))
            path_ptr = ctypes.c_wchar_p()
            ctypes.windll.shell32.SHGetKnownFolderPath(
                ctypes.byref(folder_id), 0, wintypes.HANDLE(0), ctypes.byref(path_ptr)
            )
            if path_ptr.value:
                return Path(path_ptr.value)
        except Exception:
            pass  # fall through to the default location
    return Path.home() / name


# --------------------------------------------------------------------------
# Core logic
# --------------------------------------------------------------------------

def classify(path: Path):
    """Return (destination folder, label) for a file, or None to leave it."""
    ext = path.suffix.lower()
    if ext in EXTENSIONS["installers"]:
        return user_folder("Documents") / INSTALLERS_SUBFOLDER, "installer"
    if ext in EXTENSIONS["videos"]:
        return user_folder("Videos"), "video"
    if ext in EXTENSIONS["images"]:
        return user_folder("Pictures"), "image"
    if ext in EXTENSIONS["documents"]:
        return user_folder("Documents") / DOCUMENTS_SUBFOLDER, "document"
    return None


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def same_file(a: Path, b: Path) -> bool:
    if a.stat().st_size != b.stat().st_size:
        return False
    return sha256(a) == sha256(b)


def unique_path(dest: Path) -> Path:
    """name.ext -> name (1).ext -> name (2).ext ... first one that's free."""
    n = 1
    while True:
        candidate = dest.with_name(f"{dest.stem} ({n}){dest.suffix}")
        if not candidate.exists():
            return candidate
        n += 1


def organize(downloads: Path, dry_run: bool = False) -> dict:
    stats = {"moved": 0, "recycled": 0, "renamed": 0, "skipped": 0, "errors": 0}
    now = time.time()
    tag = "[dry-run] " if dry_run else ""

    if not downloads.is_dir():
        logging.error("Downloads folder not found: %s", downloads)
        stats["errors"] += 1
        return stats

    for item in sorted(downloads.iterdir()):
        try:
            if not item.is_file() or item.name.startswith("."):
                continue
            if item.suffix.lower() in PARTIAL_SUFFIXES:
                stats["skipped"] += 1
                continue
            if now - item.stat().st_mtime < MIN_FILE_AGE_SECONDS:
                logging.info("Skipping (modified <%ss ago): %s", MIN_FILE_AGE_SECONDS, item.name)
                stats["skipped"] += 1
                continue

            target = classify(item)
            if target is None:
                stats["skipped"] += 1
                continue
            dest_dir, label = target
            dest = dest_dir / item.name

            if dest.exists():
                if same_file(item, dest):
                    logging.info("%sAlready at destination -> Recycle Bin: %s", tag, item.name)
                    if not dry_run:
                        send2trash(str(item))
                    stats["recycled"] += 1
                    continue
                dest = unique_path(dest)
                stats["renamed"] += 1

            logging.info("%sMoving %s (%s) -> %s", tag, item.name, label, dest)
            if not dry_run:
                dest_dir.mkdir(parents=True, exist_ok=True)
                shutil.move(str(item), str(dest))
            stats["moved"] += 1

        except Exception as exc:  # one bad file shouldn't stop the run
            logging.error("Failed on %s: %s", item.name, exc)
            stats["errors"] += 1

    return stats


# --------------------------------------------------------------------------
# Scheduling (Windows Task Scheduler)
# --------------------------------------------------------------------------

def install_schedule(minutes: int) -> None:
    if sys.platform != "win32":
        sys.exit(
            "--install-schedule is Windows-only. On macOS/Linux add a cron line instead:\n"
            f"  */{minutes} * * * * {sys.executable} {Path(__file__).resolve()}"
        )
    # pythonw.exe runs without flashing a console window
    pythonw = Path(sys.executable).with_name("pythonw.exe")
    exe = pythonw if pythonw.exists() else Path(sys.executable)
    command = f'"{exe}" "{Path(__file__).resolve()}"'
    subprocess.run(
        ["schtasks", "/Create", "/F", "/SC", "MINUTE", "/MO", str(minutes),
         "/TN", TASK_NAME, "/TR", command],
        check=True,
    )
    print(f"Scheduled '{TASK_NAME}' to run every {minutes} minutes.")


def remove_schedule() -> None:
    if sys.platform != "win32":
        sys.exit("--remove-schedule is Windows-only.")
    subprocess.run(["schtasks", "/Delete", "/F", "/TN", TASK_NAME], check=True)
    print(f"Removed scheduled task '{TASK_NAME}'.")


# --------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Sort the Downloads folder into Documents/Videos/Pictures.")
    parser.add_argument("--dry-run", action="store_true", help="show what would happen without changing anything")
    parser.add_argument("--downloads", type=Path, help="override the Downloads folder to scan")
    parser.add_argument("--install-schedule", type=int, metavar="MINUTES",
                        help="create a Windows scheduled task that runs every N minutes")
    parser.add_argument("--remove-schedule", action="store_true", help="delete the scheduled task")
    args = parser.parse_args()

    if args.install_schedule:
        return install_schedule(args.install_schedule)
    if args.remove_schedule:
        return remove_schedule()

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s  %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.FileHandler(LOG_FILE, encoding="utf-8"), logging.StreamHandler()],
    )

    stats = organize(args.downloads or user_folder("Downloads"), dry_run=args.dry_run)
    logging.info(
        "Done: %(moved)d moved, %(recycled)d recycled, %(renamed)d renamed on collision, "
        "%(skipped)d skipped, %(errors)d errors", stats,
    )


if __name__ == "__main__":
    main()
