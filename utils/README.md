# Utilities

This directory contains utility scripts for the portfolio website.

## Scholarly Data Fetcher

The `scholarly_data_fetcher.py` script fetches publication data from Google Scholar and saves it to a JSON file for display on the website.

### Requirements

The script requires Python 3.6+ and the following dependencies:

- scholarly
- requests
- tqdm

These dependencies are specified in the project's `requirements.txt` file.

### Setup

1. Make sure you have the virtual environment activated:

   ```bash
   source venv/bin/activate
   ```

2. Install dependencies (if not already installed):
   ```bash
   pip install -r requirements.txt
   ```

### Running the Script

You can run the script directly:

```bash
python utils/scholarly_data_fetcher.py
```

Or use the provided shell script:

```bash
./utils/update_research_data.sh
```

The script will:

1. Fetch author data from Google Scholar
2. Fetch detailed data for each publication
3. Process and clean the publication data
4. Save the data to `public/content/research.json`

### Automated Updates

The research data is automatically updated weekly via GitHub Actions. The workflow is defined in `.github/workflows/update-research-data.yml`.
