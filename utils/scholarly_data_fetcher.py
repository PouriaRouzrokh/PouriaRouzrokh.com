import json
import requests
import time
from typing import Dict, List, Optional, Union
from scholarly import scholarly
from tqdm.auto import tqdm
from pathlib import Path

class ScholarlyDataFetcher:
    def __init__(self, author_name: str, output_path: Union[str, Path]):
        self.author_name = author_name
        self.output_path = Path(output_path)
        self.author_data = None
        self.author_metrics = None
        self.articles = []

    def fetch_author_data(self) -> None:
        """Fetch and fill author data from Google Scholar."""
        search_query = scholarly.search_author(self.author_name)
        first_result = next(search_query)
        self.author_data = scholarly.fill(first_result)

        # Extract author metrics
        self.author_metrics = {
            "citations": self.author_data.get('citedby', 0),
            "h_index": self.author_data.get('hindex', 0),
            "i10_index": self.author_data.get('i10index', 0),
            "cited_by_5_years": self.author_data.get('citedby5y', 0),
        }

    def fetch_article_data(self) -> None:
        """Fetch detailed data for all author's publications."""
        if not self.author_data:
            raise ValueError("Author data not fetched. Call fetch_author_data() first.")

        print("Fetching detailed article data...")
        self.articles = [
            scholarly.fill(article)
            for article in tqdm(self.author_data['publications'])
        ]

    @staticmethod
    def get_doi(title: str) -> Optional[str]:
        """Fetch DOI for an article using CrossRef API."""
        url = "https://api.crossref.org/works"
        params = {
            'query.title': title,
            'rows': 1,
            'select': 'DOI,title'
        }

        try:
            time.sleep(1)  # Respect API rate limits
            response = requests.get(url, params=params)
            response.raise_for_status()

            data = response.json()
            return data['message']['items'][0]['DOI'] if data['message']['items'] else None

        except (requests.exceptions.RequestException, KeyError) as e:
            print(f"Error fetching DOI for '{title}': {e}")
            return None

    @staticmethod
    def sanitize_text(text: Union[str, None],
                     allowed_special_chars: str = ".,!?-'\"():;") -> str:
        """Clean and sanitize text input."""
        if not isinstance(text, str):
            return ""

        allowed_chars = set(
            'abcdefghijklmnopqrstuvwxyz'
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            '0123456789 ' + allowed_special_chars
        )

        text = ''.join(char for char in str(text).strip() if char in allowed_chars)
        while '  ' in text:
            text = text.replace('  ', ' ')
        return text.strip()

    @staticmethod
    def create_bibtex(paper: Dict) -> str:
        """Generate BibTeX entry from paper metadata."""
        if not isinstance(paper, dict):
            return ""

        # Create citation key
        first_author = paper.get('authors', '').split(',')[0].split()[-1] if paper.get('authors') else 'Unknown'
        year = str(paper.get('year', ''))
        title_first_word = paper.get('title', '').split()[0].lower() if paper.get('title') else 'untitled'
        citation_key = f"{first_author}{year}{title_first_word}"

        # Build BibTeX entry
        fields = ['title', 'authors', 'year', 'journal', 'volume', 'number', 'pages', 'doi', 'url']
        bibtex = [f"@article{{{citation_key},"]

        for field in fields:
            if paper.get(field):
                value = str(paper[field]).replace("&", "\\&").replace("_", "\\_")
                bibtex.append(f"    {field} = {{{value}}},")

        bibtex.append("}")
        return '\n'.join(bibtex)

    def process_articles(self) -> List[Dict]:
        """Process and clean article data for frontend consumption."""
        print("Processing articles...")
        cleaned_articles = []

        for article in tqdm(self.articles):
            bib = article.get('bib', {})
            cleaned_article = {
                'title': bib.get('title'),
                'authors': ', '.join(bib.get('author', '').split(' and ')),
                'year': bib.get('pub_year'),
                'journal': bib.get('journal'),
                'volume': bib.get('volume'),
                'number': bib.get('number'),
                'pages': bib.get('pages'),
                'abstract': self.sanitize_text(bib.get('abstract')),
                'num_citations': article.get('num_citations'),
                'url': article.get('pub_url'),
                'doi': self.get_doi(bib.get('title', ''))
            }

            # Remove None values and generate BibTeX
            cleaned_article = {k: v for k, v in cleaned_article.items() if v is not None}
            cleaned_article['bibtex'] = self.create_bibtex(cleaned_article)
            cleaned_articles.append(cleaned_article)

        return cleaned_articles

    def save_to_json(self) -> None:
        """Save processed article data to JSON file."""
        if not self.author_metrics:
            raise ValueError("Author metrics not available. Call fetch_author_data() first.")

        cleaned_articles = self.process_articles()

        output_data = {
            'author': self.author_name,
            'metrics': self.author_metrics,
            'articles': cleaned_articles,
            'total_articles': len(cleaned_articles),
            'total_citations': sum(article.get('num_citations', 0) for article in cleaned_articles)
        }

        # Create directory if it doesn't exist
        self.output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(self.output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {self.output_path}")

def main():
    """Main function to run the script."""
    author_name = 'Pouria Rouzrokh'
    output_path = Path('public/content/research.json')  # Updated path as per development plan

    fetcher = ScholarlyDataFetcher(author_name, output_path)

    try:
        fetcher.fetch_author_data()
        fetcher.fetch_article_data()
        fetcher.save_to_json()
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    main() 