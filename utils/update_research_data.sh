#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Run the scholarly data fetcher
python utils/scholarly_data_fetcher.py

# Deactivate virtual environment
deactivate

echo "Research data update completed!" 