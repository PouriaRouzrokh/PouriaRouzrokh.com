# This is just a backup of the original script. The actual script that runs periodically is in the ~/bin/run_scholarly_update.sh file.

#!/bin/bash

# Create a timestamp for this run
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Set log paths
LOG_DIR="/Users/pouria/Documents/Coding/pouriarouzrokh.com/logs"
LOG_FILE="${LOG_DIR}/scholarly_update_${TIMESTAMP}.log"

# Create the logs directory if it doesn't exist (safer than removing)
mkdir -p "${LOG_DIR}"

# Log the start time
echo "===== Job started at $(date) =====" >> "${LOG_FILE}"

# Navigate to project directory
cd /Users/pouria/Documents/Coding/pouriarouzrokh.com

# Run script with uv
echo "Running: uv run utils/scholarly_data_fetcher.py" >> "${LOG_FILE}"
uv run utils/scholarly_data_fetcher.py >> "${LOG_FILE}" 2>&1

# Check if the Python script ran successfully
if [ $? -eq 0 ]; then
  echo "Python script executed successfully. Updating Git..." >> "${LOG_FILE}"
  git add . >> "${LOG_FILE}" 2>&1
  git commit -m "updated google scholar reports" >> "${LOG_FILE}" 2>&1
  git push >> "${LOG_FILE}" 2>&1
  echo "Git repository updated successfully." >> "${LOG_FILE}"
else
  echo "Python script failed, not updating Git repository" >> "${LOG_FILE}"
fi

# Log completion
echo "===== Job completed at $(date) =====" >> "${LOG_FILE}"

# Create a symlink to the latest log for easy access
ln -sf "${LOG_FILE}" "${LOG_DIR}/latest.log"