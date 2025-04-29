# This is just a backup of the original script. The actual script that runs periodically is in the ~/bin/git_update.sh file.

#!/bin/bash
# Script to update Git repository for scholarly data

# Must provide project directory as an argument
if [ -z "$1" ]; then
  echo "Error: Project directory must be provided as argument"
  exit 1
fi

PROJECT_DIR="$1"

# Check if directory exists
if [ ! -d "$PROJECT_DIR" ]; then
  echo "Error: Directory $PROJECT_DIR does not exist"
  exit 1
fi

# Change to the project directory
cd "$PROJECT_DIR" || exit 1

# Execute git commands
git add .
git commit -m "updated google scholar reports"
git push

exit $?