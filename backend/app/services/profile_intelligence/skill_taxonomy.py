import re

class SkillTaxonomy:
    """
    Canonical skill taxonomy mapper.
    Normalizes aliases and variations into a strict deterministic standard.
    """

    TAXONOMY_MAP = {
        "react": "React",
        "reactjs": "React",
        "react.js": "React",
        "node": "Node.js",
        "nodejs": "Node.js",
        "node.js": "Node.js",
        "postgres": "PostgreSQL",
        "postgresql": "PostgreSQL",
        "mongo": "MongoDB",
        "mongodb": "MongoDB",
        "python3": "Python",
        "python": "Python",
        "fastapi": "FastAPI",
        "next": "Next.js",
        "nextjs": "Next.js",
        "next.js": "Next.js",
        "ts": "TypeScript",
        "typescript": "TypeScript",
        "js": "JavaScript",
        "javascript": "JavaScript",
        "aws": "AWS",
        "amazon web services": "AWS",
        "gcp": "Google Cloud Platform",
        "google cloud": "Google Cloud Platform",
        "azure": "Microsoft Azure",
        "docker": "Docker",
        "k8s": "Kubernetes",
        "kubernetes": "Kubernetes",
        "vue": "Vue.js",
        "vuejs": "Vue.js",
        "vue.js": "Vue.js",
        "angular": "Angular",
        "angularjs": "Angular",
        "html": "HTML",
        "html5": "HTML",
        "css": "CSS",
        "css3": "CSS",
        "tailwind": "Tailwind CSS",
        "tailwindcss": "Tailwind CSS"
    }

    @staticmethod
    def normalize(skill_name: str) -> str:
        """
        Takes a raw skill string and returns its canonical representation.
        If no strict mapping is found, it returns the title-cased version.
        """
        if not skill_name:
            return ""
        
        # Clean string
        cleaned = skill_name.strip().lower()
        
        # Check explicit mapping
        if cleaned in SkillTaxonomy.TAXONOMY_MAP:
            return SkillTaxonomy.TAXONOMY_MAP[cleaned]
            
        # Fallback: Capitalize first letter of each word
        return skill_name.strip().title()

    @staticmethod
    def deduplicate(skills_list: list) -> list:
        """
        Normalizes a list of skills and removes duplicates.
        """
        if not skills_list:
            return []
            
        normalized_set = set()
        for skill in skills_list:
            if skill and isinstance(skill, str):
                normalized_set.add(SkillTaxonomy.normalize(skill))
                
        return sorted(list(normalized_set))
