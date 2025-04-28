#!/bin/bash
# Save as ~/Documents/Coding/pouriarouzrokh.com/run_scholarly_update.sh

# Navigate to project directory
cd ~/Documents/Coding/pouriarouzrokh.com

# Run script with uv
~/Documents/Coding/pouriarouzrokh.com/.venv/bin/python ~/Documents/Coding/pouriarouzrokh.com/utils/scholarly_data_fetcher.py

# Update git if successful
if [ $? -eq 0 ]; then
  git add .
  git commit -m "updated google scholar reports"
  git push
fi

# Log completion
echo "Job completed at $(date)" >> ~/scholarly_update_log.txt