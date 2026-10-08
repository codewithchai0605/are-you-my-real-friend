
import os
import zipfile

# Output zip filename
OUTPUT_ZIP = "project_archive.zip"

# Files and directories to ignore (exact names or folder names)
IGNORE_NAMES = {
    "bun.lock",
    "bun.lockb",
    ".git",
    ".turbo",
    ".next",
    "node_modules",
    OUTPUT_ZIP,  # Prevent zipping the output file itself
}

def should_ignore(path, root_dir="."):
    """Check if any parent folder or the file itself is in the ignore list."""
    rel_path = os.path.relpath(path, root_dir)
    parts = rel_path.split(os.sep)
    return any(part in IGNORE_NAMES for part in parts)

def create_zip():
    with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk("."):
            # Prune ignored directories in-place so os.walk doesn't recurse into them
            dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d))]
            
            for file in files:
                file_path = os.path.join(root, file)
                if not should_ignore(file_path):
                    # Write file to zip keeping relative path structure
                    zipf.write(file_path, os.path.relpath(file_path, "."))
                    print(f"Added: {file_path}")

    print(f"\nSuccessfully created {OUTPUT_ZIP}")

if __name__ == "__main__":
    create_zip()