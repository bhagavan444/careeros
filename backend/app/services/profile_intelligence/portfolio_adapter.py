import logging
import httpx
from bs4 import BeautifulSoup
from typing import Dict, Any, List
import re

from .skill_taxonomy import SkillTaxonomy

logger = logging.getLogger(__name__)

class PortfolioAdapter:
    """
    Data acquisition layer for Portfolio verification.
    Uses lightweight scraping to extract DOM signals without failing the pipeline on blocks.
    """

    # Basic mapping of HTML/DOM signals to raw skills
    SIGNAL_MAP = {
        r'__NEXT_DATA__': 'Next.js',
        r'react': 'React',
        r'vue': 'Vue.js',
        r'angular': 'Angular',
        r'tailwindcss': 'Tailwind CSS',
        r'bootstrap': 'Bootstrap',
        r'firebase': 'Firebase',
        r'vercel': 'Vercel',
        r'netlify': 'Netlify',
        r'gatsby': 'Gatsby',
        r'fastapi': 'FastAPI',
        r'django': 'Django'
    }

    @staticmethod
    async def extract(url: str) -> Dict[str, Any]:
        """
        Fetches the portfolio URL and extracts technology footprints.
        Never fails the pipeline; returns `no_evidence` status if blocked.
        """
        result = {
            "status": "success",
            "verified_skills": [],
            "evidence": []
        }

        if not url:
            result["status"] = "no_evidence"
            return result

        if not url.startswith("http"):
            url = f"https://{url}"

        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                response = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
                response.raise_for_status()
                
                html_content = response.text
                soup = BeautifulSoup(html_content, 'html.parser')
                
                raw_skills_found = set()
                
                # 1. Check Meta Tags
                generator = soup.find('meta', attrs={'name': 'generator'})
                if generator and generator.get('content'):
                    gen_content = generator.get('content').lower()
                    for sig, mapped_skill in PortfolioAdapter.SIGNAL_MAP.items():
                        if re.search(sig, gen_content):
                            raw_skills_found.add((mapped_skill, f"Found in meta generator tag"))

                # 2. Check Script Tags and DOM hints
                # E.g., Next.js uses __NEXT_DATA__
                if '__NEXT_DATA__' in html_content:
                    raw_skills_found.add(('Next.js', "Next.js hydration data detected in DOM"))
                    raw_skills_found.add(('React', "React derived from Next.js presence"))

                # 3. Simple text body scan for explicit mentions (Portfolio text)
                body_text = soup.get_text().lower()
                for sig, mapped_skill in PortfolioAdapter.SIGNAL_MAP.items():
                    # Look for standalone word
                    if re.search(rf'\b{sig}\b', body_text):
                        raw_skills_found.add((mapped_skill, f"Explicitly mentioned in portfolio text"))

                # Normalize and compile
                for raw_skill, evidence_desc in raw_skills_found:
                    normalized = SkillTaxonomy.normalize(raw_skill)
                    if normalized not in result["verified_skills"]:
                        result["verified_skills"].append(normalized)
                    
                    result["evidence"].append({
                        "skill": normalized,
                        "source": "Portfolio",
                        "description": evidence_desc
                    })

                result["verified_skills"].sort()

                if not result["verified_skills"]:
                    result["status"] = "no_evidence"

                return result

        except httpx.HTTPError as e:
            logger.warning(f"PortfolioAdapter: HTTP Error fetching {url}: {e}")
            result["status"] = "no_evidence"
            return result
        except Exception as e:
            logger.warning(f"PortfolioAdapter: Parsing failed for {url}: {e}")
            result["status"] = "no_evidence"
            return result
