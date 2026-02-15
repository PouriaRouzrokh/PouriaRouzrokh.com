# Update Research Data from Google Scholar

You are running as an automated headless agent. Your job is to update `public/content/research.json` by scraping the latest data from Google Scholar using the Playwright MCP browser tools. Follow each step exactly. Do not skip steps. Do not improvise.

---

## Step 1 — Read Current State

Read the file `public/content/research.json` and note:
- The current JSON schema (all field names and their types)
- The current number of articles (expect ~80+)
- All existing `article_id` values and their corresponding titles (you'll need this to match existing articles)
- The existing BibTeX format used in the `bibtex` field

The JSON schema is:
```json
{
  "author": "string",
  "affiliation": "string",
  "google_scholar_id": "string",
  "metrics": {
    "citations": "number",
    "h_index": "number",
    "i10_index": "number",
    "cited_by_5_years": "number"
  },
  "total_articles": "number",
  "total_citations": "number",
  "total_articles_processed": "number",
  "total_citations_processed": "number",
  "fetched_at": "string (YYYY-MM-DD HH:MM:SS UTC)",
  "articles": [
    {
      "title": "string",
      "authors": "string (comma-separated)",
      "year": "number",
      "journal": "string",
      "volume": "string",
      "number": "string",
      "pages": "string",
      "publisher": "string",
      "abstract": "string",
      "num_citations": "number",
      "url": "string",
      "article_id": "string",
      "bibtex": "string"
    }
  ]
}
```

### Article ID Generation Algorithm

For NEW articles only (preserve existing IDs for existing articles), generate `article_id` as follows:

```
1. base = title.lower().strip()
2. If year exists: base = base + "-" + str(year)
3. If authors string contains a comma:
   - first_author = authors.split(",")[0].strip()
   - last_name = first_author.split()[-1].lower()
   - base = base + "-" + last_name
4. hash = md5(base.encode("utf-8")).hexdigest()[:8]
5. slug = replace every non-alphanumeric character in title.lower() with "-"
   - collapse consecutive hyphens into one
   - remove leading/trailing hyphens
   - truncate to 40 characters
6. article_id = slug + "-" + hash
```

### BibTeX Generation Format

For NEW articles, generate BibTeX following this exact format (matching existing entries):

```
@article{<first_author_lastname><year><first_word_of_title_lowercase>,
  author = {<Author1 and Author2 and Author3>},
  title = {<Full Title>},
  journal = {<Journal Name>},
  volume = {<volume>},
  number = {<number>},
  pages = {<pages>},
  year = {<year>},
  publisher = {<Publisher>},
  url = {<url>}
}
```

- The citation key is: first author's last name (lowercase, alphanumeric only) + year + first word of title (lowercase, alphanumeric only)
- Authors in BibTeX use ` and ` as separator (convert from comma-separated)
- Only include fields that have non-empty values
- Do NOT include volume, number, pages, or publisher lines if they are empty

---

## Step 2 — Browse Google Scholar with Playwright

Use the Playwright MCP browser tools for all web browsing.

### 2a. Navigate to the profile

Navigate to: `https://scholar.google.com/citations?user=Ksv9I0sAAAAJ&hl=en`

Take a snapshot to see the page structure. If you see a CAPTCHA or "unusual traffic" message, **abort immediately** — do not modify any files and report the error.

### 2b. Extract author metrics

From the profile page, extract:
- Total citations (all time)
- h-index
- i10-index
- Citations in the last 5 years (the "Since 20XX" column)

### 2c. Load ALL publications

The profile page initially shows only 20 publications. You must click the "Show more" button at the bottom of the publication list repeatedly until ALL publications are visible. After each click, wait for the page to update before clicking again.

Keep clicking "Show more" until the button disappears or is no longer clickable. Then take a snapshot to confirm all publications are loaded.

### 2d. Extract publication listing

From the fully loaded publication list, extract for EACH publication:
- Title
- Authors (as shown — may be truncated with "...")
- Venue/journal (the line below the authors)
- Year
- Citation count (the number in the rightmost column)

---

## Step 3 — Identify New vs Existing Publications

Compare the extracted titles against the titles in the existing `research.json`:
- Use **case-insensitive** comparison
- Strip leading/trailing whitespace before comparing
- A publication is "existing" if its title matches (even approximately — sometimes Google Scholar truncates long titles)

### For EXISTING publications:
- Only update the `num_citations` field from the listing data
- Preserve ALL other fields exactly as they are (especially `article_id` and `bibtex`)

### For NEW publications (not in research.json):
- Click into the publication's detail page on Google Scholar to get additional metadata:
  - Full author list (not truncated)
  - Journal name
  - Volume, number, pages
  - Publisher
  - Description/abstract
  - URL (prefer non-Scholar links — look for "Article" or publisher links)
- After extracting details, navigate back to the profile page
- If there are many new articles, handle them one at a time

**Important:** If clicking into a detail page fails or the page doesn't load, still include the article with whatever data you have from the listing page. Set missing fields to empty strings.

---

## Step 4 — Merge and Write

Build the updated JSON:

1. Start with the existing `research.json` data
2. For each EXISTING article: update only `num_citations`
3. For each NEW article: create a complete article object with all fields:
   - `title`, `authors` (comma-separated string), `year` (number), `journal`, `volume`, `number`, `pages`, `publisher`, `abstract`, `num_citations` (number), `url`, `article_id` (generated using the algorithm above), `bibtex` (generated using the format above)
   - For any field where data is unavailable, use an empty string `""` (except `year` which should be `0` and `num_citations` which should be `0`)
4. Sort all articles: by year descending first, then by num_citations descending as tiebreaker
5. Update the top-level fields:
   - `metrics`: use the values extracted in Step 2b (directly from the Google Scholar profile sidebar)
   - `total_articles`: count of all articles in the articles array
   - `total_citations`: use `metrics.citations` (the "All" column total from the profile sidebar — do NOT sum individual article citations, as that inflates the count due to duplicates)
   - `total_articles_processed`: same as `total_articles`
   - `total_citations_processed`: same as `total_citations`
   - `fetched_at`: current UTC timestamp in format `"YYYY-MM-DD HH:MM:SS UTC"`
6. Keep `author`, `affiliation`, and `google_scholar_id` unchanged

Write the result to `public/content/research.json` with 2-space indentation.

---

## Step 5 — Validate

After writing the file:

1. Read it back and parse it as JSON to confirm it's valid
2. Verify the article count is **at least 70** (current count is ~80; if you got fewer, something went wrong with pagination)
3. Verify every article has at minimum: `title`, `article_id`, `num_citations`, `year`
4. Verify no two articles have the same `article_id`

**If validation fails:** revert the file using `git checkout public/content/research.json`, report the specific error, and exit.

---

## Step 6 — Commit and Push

Run these git commands:

```bash
git add public/content/research.json
git commit -m "Update research data from Google Scholar"
git push
```

If `git push` fails, report the error but do not retry.

---

## Step 7 — Verify Deployment

1. Wait 60 seconds for Vercel to deploy
2. Use Playwright to navigate to `https://pouriarouzrokh.com/research`
3. Take a snapshot and verify the page loads successfully and shows publications
4. Report the final status: how many articles total, how many new articles added, and whether the deployment verification succeeded

---

## Error Handling Rules

- **CAPTCHA/block**: If Google Scholar shows a CAPTCHA or blocks access at any point, abort immediately without modifying any files. Report the error.
- **Too few articles**: If fewer than 70 articles are extracted from Google Scholar, abort without modifying files. This likely means pagination failed.
- **Invalid JSON**: Never write invalid JSON to the file. If JSON serialization fails, abort.
- **Git failures**: If git commit or push fails, report the error. Do not retry.
- **Playwright failures**: If the browser fails to load a page, retry once. If it fails again, skip that specific operation and continue with what you have.
- **Always close the browser** when done, regardless of success or failure.
