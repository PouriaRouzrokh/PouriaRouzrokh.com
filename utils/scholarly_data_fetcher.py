import json
import requests
import time
import hashlib
from typing import Dict, List, Optional, Union
from scholarly import scholarly
from tqdm.auto import tqdm
from pathlib import Path
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class ScholarlyDataFetcher:
    # Add a default email for CrossRef polite pool (replace if needed)
    CROSSREF_MAILTO = "po.rouzrokh@gmail.com" # IMPORTANT: Replace with your actual email

    def __init__(self, author_name: str, output_path: Union[str, Path]):
        self.author_name = author_name
        self.output_path = Path(output_path)
        self.author_data = None
        self.author_metrics = None
        self.articles = []
        # Use a session for potential connection pooling and default headers
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': f'ScholarlyDataFetcher/1.0 (mailto:{self.CROSSREF_MAILTO})',
            'Accept': 'application/json'
        })


    def fetch_author_data(self) -> None:
        """Fetch and fill author data from Google Scholar."""
        logging.info(f"Searching for author: {self.author_name}")
        try:
            search_query = scholarly.search_author(self.author_name)
            # It's safer to check if the iterator yields anything
            first_result = next(search_query, None)
            if first_result is None:
                logging.error(f"Author '{self.author_name}' not found.")
                raise ValueError(f"Author '{self.author_name}' not found.")

            logging.info(f"Found author: {first_result.get('name')}. Fetching details...")
            # Increase timeout for potentially slow fill operations
            self.author_data = scholarly.fill(first_result, sections=['basics', 'indices', 'publications'], publication_limit=None) # Fetch all publications
            logging.info(f"Successfully fetched data for {self.author_data.get('name')}")

            # Extract author metrics more safely
            self.author_metrics = {
                "citations": self.author_data.get('citedby', 0),
                "h_index": self.author_data.get('hindex', 0),
                "i10_index": self.author_data.get('i10index', 0),
                "cited_by_5_years": self.author_data.get('citedby5y', 0),
            }
        except StopIteration:
             logging.error(f"Author '{self.author_name}' not found after initial search.")
             raise ValueError(f"Author '{self.author_name}' not found.")
        except Exception as e:
            logging.error(f"An error occurred during author data fetching: {e}", exc_info=True)
            raise

    def fetch_article_data(self) -> None:
        """Fetch detailed data for all author's publications."""
        if not self.author_data:
            raise ValueError("Author data not fetched. Call fetch_author_data() first.")

        publications = self.author_data.get('publications', [])
        if not publications:
            logging.warning(f"No publications found for author {self.author_data.get('name')}")
            self.articles = []
            return

        logging.info(f"Fetching detailed data for {len(publications)} articles...")
        filled_articles = []
        for i, article_stub in enumerate(tqdm(publications, desc="Fetching article details")):
            try:
                # Add timeout and retry mechanism if needed, scholarly fill can be flaky
                filled_article = scholarly.fill(article_stub)
                filled_articles.append(filled_article)
                # Optional: Add a small delay to avoid potential rate limits on Google Scholar side
                # time.sleep(0.5)
            except Exception as e:
                title_stub = article_stub.get('bib', {}).get('title', f'Article {i+1}')
                logging.warning(f"Could not fill details for article: '{title_stub}'. Error: {e}")
        self.articles = filled_articles
        logging.info(f"Successfully fetched details for {len(self.articles)} articles.")

    @staticmethod
    def generate_article_id(title: str, year: Union[str, int] = None, authors: str = None) -> str:
        """Generate a URL-friendly unique ID for an article based on title, year, and first author."""
        if not title:
            return "unknown-article"
            
        # Create a base for the ID
        base = title.lower().strip()
        
        # Add year if available
        if year:
            base = f"{base}-{year}"
            
        # Add first author last name if available
        if authors and isinstance(authors, str) and ',' in authors:
            try:
                first_author = authors.split(',')[0].strip()
                last_name = first_author.split()[-1].lower()
                base = f"{base}-{last_name}"
            except (IndexError, AttributeError):
                pass
        
        # Create a hash of the base string
        hash_obj = hashlib.md5(base.encode('utf-8'))
        hash_str = hash_obj.hexdigest()[:8]  # Use first 8 chars of hash
        
        # Create a URL-friendly slug from the title
        slug = ''.join(c if c.isalnum() else '-' for c in title.lower())
        slug = '-'.join(filter(None, slug.split('-')))  # Remove empty segments
        slug = slug[:40]  # Limit length
        
        # Combine slug with hash for uniqueness
        return f"{slug}-{hash_str}"

    @staticmethod
    def sanitize_text(text: Union[str, None],
                     allowed_special_chars: str = ".,!?-'\"():;") -> str:
        """Clean and sanitize text input."""
        if not isinstance(text, str):
            return ""

        # More robust sanitization - allow unicode letters and numbers
        import re
        # Keep letters (including unicode), numbers, spaces, and allowed specials
        allowed_pattern = re.compile(r'[^\w\s' + re.escape(allowed_special_chars) + ']', re.UNICODE)
        text = allowed_pattern.sub('', text)

        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    @staticmethod
    def create_bibtex(paper: Dict) -> str:
        """Generate BibTeX entry from paper metadata."""
        if not isinstance(paper, dict):
            return ""

        # Use more robust citation key generation
        try:
            first_author = paper.get('authors', '').split(',')[0].split()[-1].lower() if paper.get('authors') else 'unknown'
            # Sanitize author name for key
            first_author = ''.join(c for c in first_author if c.isalnum())
        except IndexError:
            first_author = 'unknown'

        year = str(paper.get('year', ''))
        title_first_word = paper.get('title', '').split()[0].lower() if paper.get('title') else 'untitled'
        # Sanitize title word for key
        title_first_word = ''.join(c for c in title_first_word if c.isalnum())

        # Handle potential empty strings
        if not first_author: first_author = 'unknown'
        if not year: year = 'nodate'
        if not title_first_word: title_first_word = 'untitled'

        citation_key = f"{first_author}{year}{title_first_word}"

        # Standard BibTeX fields mapping (adjust as needed)
        bib_map = {
            'title': 'title',
            'authors': 'author', # BibTeX uses 'author'
            'year': 'year',
            'journal': 'journal',
            'volume': 'volume',
            'number': 'number',
            'pages': 'pages',
            'article_id': 'note', # Store article_id in the note field
            'url': 'url',
            'abstract': 'abstract', # Can include abstract if desired
            # DOI is removed from BibTeX generation
        }

        bibtex = [f"@article{{{citation_key},"] # Default to article, change if needed based on publication type

        # Special handling for authors (needs 'and' separation)
        if 'authors' in paper and paper['authors']:
             authors_list = [a.strip() for a in paper['authors'].split(',')]
             bibtex.append(f"    author = {{{' and '.join(authors_list)}}},")

        # Handle other fields
        for source_key, bib_key in bib_map.items():
            if source_key != 'authors' and paper.get(source_key):
                # Basic BibTeX escaping (needs improvement for complex cases)
                value = str(paper[source_key])
                value = value.replace('{', '\\{').replace('}', '\\}')
                value = value.replace('&', '\\&').replace('%', '\\%').replace('_', '\\_')
                bibtex.append(f"    {bib_key} = {{{value}}},")

        bibtex.append("}")
        return '\n'.join(bibtex)

    def process_articles(self) -> List[Dict]:
        """Process and clean article data for frontend consumption."""
        logging.info("Processing articles...")
        cleaned_articles = []
        
        # Create a dictionary to track duplicates by title
        duplicate_tracker = {}
        
        for article in tqdm(self.articles, desc="Processing articles"):
            bib = article.get('bib', {})
            title = bib.get('title')
            if not title: # Skip articles without titles
                logging.warning("Skipping article with missing title.")
                continue

            # Prepare authors string
            authors_str = bib.get('author', '')
            if isinstance(authors_str, list): # Sometimes author might be a list
                authors_str = ' and '.join(authors_str)
            # Convert 'and' separators from scholarly to comma separators for display
            display_authors = ', '.join(authors_str.split(' and '))

            # Ensure year is a number (default to 0 for sorting if missing)
            year = bib.get('pub_year')
            # Convert year to int if possible, or set to 0 if missing/invalid
            try:
                year = int(year) if year else 0
            except (ValueError, TypeError):
                year = 0
                
            # Ensure num_citations is a number (default to 0 if missing)
            num_citations = article.get('num_citations')
            try:
                num_citations = int(num_citations) if num_citations is not None else 0
            except (ValueError, TypeError):
                num_citations = 0

            # Generate unique article ID instead of using DOI
            article_id = self.generate_article_id(title, year, authors_str)

            cleaned_article = {
                'title': title,
                'authors': display_authors, # Use comma-separated for display
                'year': year,
                'journal': bib.get('journal') or bib.get('venue'), # Sometimes venue holds journal/conf
                'volume': bib.get('volume'),
                'number': bib.get('number'),
                'pages': bib.get('pages'),
                # Sanitize abstract *before* adding to dict
                'abstract': self.sanitize_text(bib.get('abstract')),
                'num_citations': num_citations,
                # Prefer eprint_url if pub_url is generic (like scholar link)
                'url': article.get('eprint_url') or article.get('pub_url'),
                'article_id': article_id  # Use our generated ID instead of DOI
            }

            # Create a dict suitable for BibTeX generation (using 'and' for authors)
            bibtex_input = cleaned_article.copy()
            bibtex_input['authors'] = authors_str # Use 'and' separated authors for BibTeX

            # Remove None values before BibTeX generation and final output
            cleaned_article = {k: v for k, v in cleaned_article.items() if v is not None and v != ''}
            bibtex_input = {k: v for k, v in bibtex_input.items() if v is not None and v != ''}

            cleaned_article['bibtex'] = self.create_bibtex(bibtex_input)
            
            # Create a key for duplicate detection using normalized title as the key
            duplicate_key = title.lower().strip()
            
            # Check if we've already seen this paper
            if duplicate_key in duplicate_tracker:
                existing_article = duplicate_tracker[duplicate_key]
                
                # Get citation counts for comparison (default to 0 if missing)
                current_citations = cleaned_article.get('num_citations', 0)
                existing_citations = existing_article.get('num_citations', 0)
                
                # Prioritize by citation count first, then completeness if tied
                if current_citations > existing_citations:
                    # Keep this article as it has more citations
                    duplicate_tracker[duplicate_key] = cleaned_article
                    logging.info(f"Replaced duplicate record: '{title}' with version having more citations ({current_citations} vs {existing_citations})")
                elif current_citations == existing_citations:
                    # If citations are equal, use completeness score as tiebreaker
                    current_score = self._get_completeness_score(cleaned_article)
                    existing_score = self._get_completeness_score(existing_article)
                    
                    if current_score > existing_score:
                        # Keep this article as it has more complete data
                        duplicate_tracker[duplicate_key] = cleaned_article
                        logging.info(f"Replaced duplicate record: '{title}' with more complete version (same citations)")
            else:
                # This is a new article, add it to the tracker
                duplicate_tracker[duplicate_key] = cleaned_article
        
        # After processing all articles, get the final deduplicated list
        cleaned_articles = list(duplicate_tracker.values())
        
        # Sort articles by year (newest first) as default order, citations as secondary sort
        cleaned_articles.sort(key=lambda x: (-(x.get('year') or 0), -(x.get('num_citations') or 0)))
        
        logging.info(f"Generated article IDs for {len(cleaned_articles)} articles")
        logging.info(f"Final article count after deduplication: {len(cleaned_articles)}")
        
        return cleaned_articles
        
    def _get_completeness_score(self, article: Dict) -> int:
        """Calculate a score for how complete an article record is.
        Higher score means more fields are populated."""
        score = 0
        # Each field adds to the completeness score
        if article.get('title'): score += 1
        if article.get('authors'): score += 1
        if article.get('year'): score += 1
        if article.get('journal'): score += 1
        if article.get('volume'): score += 1
        if article.get('number'): score += 1
        if article.get('pages'): score += 1
        if article.get('abstract'): score += 1
        if article.get('url'): score += 1
        if article.get('article_id'): score += 2  # article_id is important so weighted higher
        return score

    def save_to_json(self) -> None:
        """Save processed article data to JSON file."""
        if self.author_metrics is None: # Check against None
             logging.error("Author metrics not available. Call fetch_author_data() first.")
             raise ValueError("Author metrics not available. Call fetch_author_data() first.")
        if not self.articles:
            logging.warning("No articles were fetched or processed. Saving data without articles.")
            # Decide if you want to save an empty file or raise error
            # raise ValueError("No articles fetched. Cannot save.")

        cleaned_articles = self.process_articles()

        # Recalculate totals based on cleaned articles actually processed
        total_processed_articles = len(cleaned_articles)
        total_processed_citations = sum(article.get('num_citations', 0) for article in cleaned_articles)

        output_data = {
            'author': self.author_data.get('name', self.author_name), # Use fetched name if available
            'affiliation': self.author_data.get('affiliation', 'N/A'),
            'google_scholar_id': self.author_data.get('scholar_id', 'N/A'),
            'metrics': self.author_metrics,
            'articles': cleaned_articles,
            'total_articles': total_processed_articles,  # Use the count after deduplication
            'total_citations': total_processed_citations,  # Use sum after deduplication
            # Add these for compatibility with the frontend
            'total_articles_processed': total_processed_articles, 
            'total_citations_processed': total_processed_citations,
            'fetched_at': time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()) # Add timestamp
        }

        # Create directory if it doesn't exist
        self.output_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            with open(self.output_path, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
            logging.info(f"Data successfully saved to {self.output_path}")
        except IOError as e:
            logging.error(f"Failed to write data to {self.output_path}: {e}")
            raise


def main():
    """Main function to run the script."""
    # --- Configuration ---
    author_name = 'Pouria Rouzrokh' # Example author
    output_filename = 'research.json'
    output_dir = Path('public/content')
    output_path = output_dir / output_filename
    # --- End Configuration ---

    # Get email from environment variable or use default
    email = os.environ.get('CROSSREF_MAILTO', "po.rouzrokh@gmail.com")

    # Set a polite email for CrossRef
    ScholarlyDataFetcher.CROSSREF_MAILTO = email

    if ScholarlyDataFetcher.CROSSREF_MAILTO == "your.email@example.com":
         logging.warning("Please update the CROSSREF_MAILTO email address in the main function.")

    fetcher = ScholarlyDataFetcher(author_name, output_path)

    try:
        fetcher.fetch_author_data()
        fetcher.fetch_article_data()
        fetcher.save_to_json()
    except ValueError as e:
        logging.error(f"Configuration or Data Error: {e}")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}", exc_info=True) # Log full traceback

if __name__ == "__main__":
    main()