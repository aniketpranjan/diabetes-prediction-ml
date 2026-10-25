"""
Basic test suite to verify project structure and environment readiness.
"""
import os
from pathlib import Path

def test_project_structure():
    """Verify all required folders and core files exist."""
    base_dir = Path(__file__).resolve().parent.parent

    required_paths = [
        base_dir / "data",
        base_dir / "models",
        base_dir / "tests",
        base_dir / "requirements.txt",
        base_dir / "README.md",
        base_dir / "app.py",
        base_dir / "train_model.py",
    ]

    for path in required_paths:
        assert path.exists(), f"Required path missing: {path}"

if __name__ == "__main__":
    test_project_structure()
    print("Project structure test passed successfully!")
