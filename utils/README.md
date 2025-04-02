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

## Maintenance Mode

The `vercel-maintenance.mjs` script allows you to toggle maintenance mode for your Next.js website on Vercel.

### How It Works

The maintenance mode system works by:

1. Using a server-side environment variable (`MAINTENANCE_MODE`) instead of a client-side one
2. Creating an API endpoint that checks this variable at runtime
3. Using a client component that fetches from this API to determine whether to show maintenance mode

### Usage

To toggle maintenance mode on or off:

```bash
# Step 1: Run the maintenance mode script
node utils/vercel-maintenance.mjs

# Step 2: IMPORTANT - Deploy the changes
vercel --prod
```

The script will:

1. Check the current maintenance mode status
2. Ask if you want to toggle it
3. Update the environment variable on Vercel

**Important**: You MUST run `vercel --prod` after changing the maintenance mode for changes to take effect.

### Implementation Details

- `src/app/api/config/route.ts` - API endpoint that returns the current maintenance status
- `src/components/layout/MaintenanceWrapper.tsx` - Client component that checks the API and shows maintenance page if needed

### Troubleshooting

If maintenance mode isn't working as expected:

1. Ensure you've run `vercel --prod` after changing the maintenance mode
2. Check the API endpoint returns the correct status by visiting `/api/config` in your browser
3. Ensure the environment variable is set correctly on Vercel (check via `vercel env ls`)
4. Clear your browser cache, as previous settings might be cached
