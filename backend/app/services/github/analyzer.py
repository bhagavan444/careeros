import logging
from typing import List, Dict, Any, Tuple
from datetime import datetime
from collections import defaultdict

logger = logging.getLogger("github_analyzer")

class GitHubAnalyzer:
    
    @staticmethod
    def analyze_code_structure(repo_trees: Dict[str, List[str]]) -> Dict[str, Any]:
        """
        Analyzes the file trees of top repositories to determine architectural patterns.
        """
        score = 0
        patterns = set()
        strengths = []
        weaknesses = []
        
        has_src = False
        has_tests = False
        has_api = False
        has_services = False
        has_controllers = False
        has_models = False
        has_middleware = False
        has_infra = False
        
        for repo_name, tree in repo_trees.items():
            for path in tree:
                path_lower = path.lower()
                if "src/" in path_lower or "app/" in path_lower: has_src = True
                if "test/" in path_lower or "tests/" in path_lower or "__tests__" in path_lower: has_tests = True
                if "api/" in path_lower or "routes/" in path_lower: has_api = True
                if "service" in path_lower: has_services = True
                if "controller" in path_lower: has_controllers = True
                if "model" in path_lower or "entities" in path_lower or "repositories" in path_lower: has_models = True
                if "middleware" in path_lower: has_middleware = True
                if "infra" in path_lower or "deploy" in path_lower or "docker" in path_lower: has_infra = True
                
        # Evaluate Patterns
        if has_services and has_controllers:
            patterns.add("Service Layer")
            patterns.add("Layered Architecture")
            score += 30
        elif has_services or has_controllers:
            patterns.add("Partial Layered Architecture")
            score += 15
            
        if has_models and has_services:
            patterns.add("Repository Pattern")
            score += 20
            
        if has_api:
            patterns.add("API Layer")
            score += 15
            
        if has_tests:
            patterns.add("Testing Structure")
            score += 20
            
        if has_infra:
            patterns.add("Infrastructure as Code")
            score += 15
            
        # Level
        level = "Basic"
        if score >= 80:
            level = "Advanced"
            strengths.append("Demonstrates highly modular and layered architecture.")
        elif score >= 50:
            level = "Intermediate"
            strengths.append("Shows structural organization and separation of concerns.")
        else:
            weaknesses.append("Lacking explicit architectural separation (e.g., missing service/controller layers).")
            
        if not has_tests:
            weaknesses.append("No explicit testing directory structure found.")
            
        return {
            "architecture_score": min(100, score),
            "architecture_level": level,
            "patterns_detected": list(patterns),
            "strengths": strengths,
            "weaknesses": weaknesses
        }

    @staticmethod
    def analyze_repository_engineering_quality(repo_trees: Dict[str, List[str]], repo_files: Dict[str, Dict[str, str]]) -> Dict[str, Any]:
        """
        Deep analysis of engineering quality based on file trees and configuration files.
        """
        testing_score = 0
        api_score = 0
        security_score = 0
        org_score = 0
        
        patterns = set()
        strengths = set()
        weaknesses = set()
        
        has_tests = False
        has_unit_tests = False
        has_e2e_tests = False
        test_frameworks = set()
        
        api_types = set()
        has_routes = False
        
        security_signals = set()
        has_env_example = False
        exposed_secrets_risk = False
        
        org_signals = set()
        
        for repo_name, tree in repo_trees.items():
            for path in tree:
                path_lower = path.lower()
                
                # Testing
                if "test/" in path_lower or "tests/" in path_lower or "__tests__" in path_lower or ".spec." in path_lower or ".test." in path_lower:
                    has_tests = True
                if "cypress/" in path_lower or "e2e" in path_lower:
                    has_e2e_tests = True
                if "unit" in path_lower:
                    has_unit_tests = True
                    
                # API
                if "routes/" in path_lower or "api/" in path_lower or "endpoints/" in path_lower:
                    has_routes = True
                if "graphql" in path_lower:
                    api_types.add("GraphQL")
                if "websocket" in path_lower or "socket" in path_lower:
                    api_types.add("WebSockets")
                    
                # Security
                if path_lower.endswith(".env.example") or path_lower.endswith(".env.template"):
                    has_env_example = True
                if path_lower.endswith(".env"):
                    exposed_secrets_risk = True # .env committed to repo
                if "middleware/auth" in path_lower or "jwt" in path_lower:
                    security_signals.add("Auth Middleware")
                    
                # Organization
                if "controller" in path_lower: org_signals.add("Controllers")
                if "service" in path_lower: org_signals.add("Services")
                if "middleware" in path_lower: org_signals.add("Middleware")
                if "repositor" in path_lower: org_signals.add("Repositories")
                if "model" in path_lower or "schema" in path_lower: org_signals.add("Models/Schemas")
                if "config" in path_lower: org_signals.add("Config Separation")
                
            # Parse files
            if repo_files and repo_name in repo_files:
                r_files = repo_files[repo_name]
                if "package.json" in r_files:
                    try:
                        import json
                        pkg = json.loads(r_files["package.json"])
                        deps = list(pkg.get("dependencies", {}).keys()) + list(pkg.get("devDependencies", {}).keys())
                        
                        # Test frameworks
                        if "jest" in deps: test_frameworks.add("Jest")
                        if "vitest" in deps: test_frameworks.add("Vitest")
                        if "cypress" in deps: test_frameworks.add("Cypress")
                        if "@testing-library/react" in deps: test_frameworks.add("React Testing Library")
                        if "mocha" in deps: test_frameworks.add("Mocha")
                        
                        # APIs
                        if "express" in deps: api_types.add("Express APIs")
                        if "graphql" in deps or "apollo-server" in deps: api_types.add("GraphQL")
                        if "socket.io" in deps: api_types.add("WebSockets")
                        
                        # Security
                        if "jsonwebtoken" in deps or "express-jwt" in deps: security_signals.add("JWT Authentication")
                        if "bcrypt" in deps or "bcryptjs" in deps: security_signals.add("Password Hashing (bcrypt)")
                        if "passport" in deps: security_signals.add("OAuth/Passport")
                    except: pass
                
                reqs = (r_files.get("requirements.txt", "") + " " + r_files.get("pyproject.toml", "")).lower()
                if reqs:
                    if "pytest" in reqs: test_frameworks.add("Pytest")
                    if "unittest" in reqs: test_frameworks.add("Unittest")
                    if "fastapi" in reqs: api_types.add("FastAPI")
                    if "flask" in reqs: api_types.add("Flask APIs")
                    if "django" in reqs: api_types.add("Django APIs")
                    if "pyjwt" in reqs: security_signals.add("JWT Authentication")
                    if "bcrypt" in reqs: security_signals.add("Password Hashing (bcrypt)")
                    
        # 1. Evaluate Testing (Max 100)
        testing_maturity = "No tests detected"
        if len(test_frameworks) >= 2 or has_e2e_tests:
            testing_score = 95
            testing_maturity = "Production-grade testing (E2E + Unit)"
            strengths.add("Comprehensive testing strategy")
        elif test_frameworks and has_tests:
            testing_score = 80
            testing_maturity = "Good coverage signals"
            strengths.add(f"Testing tools: {', '.join(test_frameworks)}")
        elif has_tests:
            testing_score = 40
            testing_maturity = "Basic tests"
            strengths.add("Basic test structures detected")
        else:
            testing_score = 10
            weaknesses.add("Lack of automated testing suites")
            
        # 2. Evaluate API Architecture (Max 100)
        api_maturity = "Basic or no APIs"
        if len(api_types) >= 2:
            api_score = 95
            api_maturity = "Complex API Architecture"
            strengths.add(f"Diverse APIs: {', '.join(api_types)}")
        elif api_types and has_routes:
            api_score = 85
            api_maturity = "Structured API Design"
            strengths.add(f"API Frameworks: {', '.join(api_types)}")
        elif api_types:
            api_score = 70
            api_maturity = "Standard API Implementation"
        elif has_routes:
            api_score = 50
            api_maturity = "Basic Routing"
        else:
            api_score = 20
            
        # 3. Evaluate Security Posture (Max 100)
        security_posture = "Standard"
        if len(security_signals) >= 2 and has_env_example and not exposed_secrets_risk:
            security_score = 95
            security_posture = "Enterprise Grade"
            strengths.add("Strong security and auth practices")
        elif security_signals:
            security_score = 80
            security_posture = "Good Security Fundamentals"
            strengths.add(f"Security protocols: {', '.join(security_signals)}")
        elif has_env_example:
            security_score = 60
            security_posture = "Basic Config Security"
        else:
            security_score = 30
            weaknesses.add("Missing environment configuration examples")
            
        if exposed_secrets_risk:
            security_score = max(10, security_score - 40)
            security_posture = "High Risk"
            weaknesses.add("CRITICAL: Environment variables (.env) committed to repository")
            
        # 4. Evaluate Code Organization (Max 100)
        if "Services" in org_signals and "Controllers" in org_signals:
            patterns.add("Service Layer")
            patterns.add("MVC")
            org_score += 40
        elif "Services" in org_signals or "Controllers" in org_signals:
            patterns.add("Partial Layered Architecture")
            org_score += 20
            
        if "Repositories" in org_signals:
            patterns.add("Repository Pattern")
            org_score += 20
            
        if "Middleware" in org_signals:
            org_score += 20
            
        if "Models/Schemas" in org_signals:
            org_score += 10
            
        if "Config Separation" in org_signals:
            org_score += 10
            
        org_score = min(100, max(20, org_score))
        if org_score >= 80:
            strengths.add("Clean architecture and separation of concerns")
        elif org_score < 50:
            weaknesses.add("Monolithic or unstructured code organization")
            
        # 5. Engineering Quality Score
        engineering_quality_score = int(
            (testing_score * 0.25) + 
            (security_score * 0.25) + 
            (org_score * 0.30) + 
            (api_score * 0.20)
        )
        
        if not api_types and not has_routes:
            # If it's not an API project, reweight
            engineering_quality_score = int((testing_score * 0.35) + (security_score * 0.25) + (org_score * 0.40))
            
        return {
            "engineering_quality_score": engineering_quality_score,
            "testing_score": testing_score,
            "security_score": security_score,
            "api_score": api_score,
            "organization_score": org_score,
            "architecture_patterns": list(patterns),
            "testing_maturity": testing_maturity,
            "security_posture": security_posture,
            "api_architecture": api_maturity,
            "strengths": list(strengths)[:4],
            "weaknesses": list(weaknesses)[:3]
        }

    @staticmethod
    def calculate_engineering_maturity(profile: Dict[str, Any], repos: List[Dict[str, Any]], code_structure: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Calculates a 0-100 maturity score based on:
        Architecture (20), Testing (15), CI/CD (15), Documentation (20), Maintenance (15), Deployment (15).
        """
        breakdown = {
            "Architecture": 0,
            "Testing": 0,
            "CI/CD": 0,
            "Documentation": 0,
            "Maintenance": 0,
            "Deployment": 0
        }
        evidence = []
        weaknesses = []
        
        has_docker, has_k8s, has_micro = False, False, False
        has_tests, test_frameworks = False, []
        has_ci, ci_tools = False, []
        doc_count = 0
        has_deployment, deploy_tools = False, []
        
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        recent_updates = 0
        
        for repo in repos:
            name_desc = (repo.get("name", "") + " " + (repo.get("description") or "")).lower()
            topics = [t.lower() for t in repo.get("topics", [])]
            search_text = name_desc + " " + " ".join(topics)
            
            # Architecture Signals
            if "docker" in search_text: has_docker = True
            if "kubernetes" in search_text or "k8s" in search_text: has_k8s = True
            if "microservice" in search_text: has_micro = True
            
            # Testing Signals
            if "test" in search_text or "tdd" in search_text: has_tests = True
            for t in ["pytest", "jest", "vitest", "unittest"]:
                if t in search_text and t not in test_frameworks: test_frameworks.append(t)
                
            # CI/CD Signals
            if "actions" in search_text or "workflow" in search_text: has_ci = True; ci_tools.append("GitHub Actions")
            if "circleci" in search_text: has_ci = True; ci_tools.append("CircleCI")
            if "travis" in search_text: has_ci = True; ci_tools.append("Travis CI")
            
            # Documentation Signals
            if repo.get("has_pages") or "docs" in search_text:
                doc_count += 2
            elif repo.get("description"):
                doc_count += 1
                
            # Deployment Signals
            if "vercel" in search_text or "netlify" in search_text or "heroku" in search_text or repo.get("homepage"):
                has_deployment = True
                if repo.get("homepage") and "http" in repo.get("homepage"):
                    deploy_tools.append("Live URL")
            
            # Maintenance Signals
            if repo.get("updated_at"):
                try:
                    updated = datetime.strptime(repo["updated_at"], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
                    if (now - updated).days < 90:
                        recent_updates += 1
                except:
                    pass

        # Calculate Architecture (Max 20)
        arch_score = 0
        if has_micro: arch_score += 10
        if has_k8s: arch_score += 10
        if has_docker: arch_score += 10
        if code_structure and code_structure.get("architecture_score", 0) > 50: arch_score += 10
        if arch_score == 0 and len(repos) > 0: arch_score = 5
        breakdown["Architecture"] = min(20, arch_score)
        if arch_score > 10: evidence.append("Advanced containerization and architecture patterns")
        elif arch_score < 10: weaknesses.append("Lacking microservices or advanced containerization")
        
        # Calculate Testing (Max 15)
        test_score = 0
        if len(test_frameworks) > 0: test_score += 10
        if has_tests: test_score += 5
        breakdown["Testing"] = min(15, test_score)
        if test_score > 0: evidence.append(f"Testing tools detected: {', '.join(test_frameworks) or 'Test suites'}")
        else: weaknesses.append("No explicit testing frameworks detected")
        
        # Calculate CI/CD (Max 15)
        ci_score = 0
        if has_ci: ci_score += 15
        breakdown["CI/CD"] = min(15, ci_score)
        if ci_score > 0: evidence.append(f"CI/CD automation detected: {', '.join(set(ci_tools))}")
        else: weaknesses.append("Missing CI/CD pipeline automation")
        
        # Calculate Documentation (Max 20)
        doc_score = min(20, int((doc_count / max(1, len(repos))) * 15))
        breakdown["Documentation"] = doc_score
        if doc_score >= 15: evidence.append("Comprehensive repository documentation")
        elif doc_score < 10: weaknesses.append("Inconsistent documentation practices")
        
        # Calculate Maintenance (Max 15)
        maint_score = min(15, recent_updates * 3)
        breakdown["Maintenance"] = maint_score
        if maint_score >= 10: evidence.append(f"Actively maintaining {recent_updates} projects")
        elif maint_score < 5: weaknesses.append("Low recent maintenance activity")
        
        # Calculate Deployment (Max 15)
        dep_score = 0
        if has_deployment: dep_score += 15
        breakdown["Deployment"] = min(15, dep_score)
        if dep_score > 0: evidence.append("Deployment configuration and live URLs found")
        else: weaknesses.append("Missing deployment infrastructure evidence")

        score = sum(breakdown.values())
        
        return {
            "score": score,
            "breakdown": breakdown,
            "evidence": evidence,
            "weaknesses": list(set(weaknesses))
        }

    @staticmethod
    def calculate_language_distribution(repos: List[Dict[str, Any]]) -> Dict[str, float]:
        """
        Calculates language distribution across repositories.
        Returns percentages (e.g. {"Python": 45.0, "JavaScript": 30.0}).
        """
        if not repos:
            return {}
            
        lang_counts = defaultdict(int)
        total_repos_with_lang = 0
        
        for repo in repos:
            if repo.get("language"):
                lang_counts[repo["language"]] += 1
                total_repos_with_lang += 1
                
        if total_repos_with_lang == 0:
            return {}
            
        distribution = {
            lang: round((count / total_repos_with_lang) * 100, 1)
            for lang, count in lang_counts.items()
        }
        
        # Sort by percentage descending
        return dict(sorted(distribution.items(), key=lambda item: item[1], reverse=True))

    @staticmethod
    def evaluate_repository_quality(repos: List[Dict[str, Any]]) -> Tuple[int, Dict[str, str]]:
        """
        Evaluates the quality of repositories based on metadata completeness.
        Score out of 100.
        Returns: (total_score, breakdown_dict)
        """
        if not repos:
            return 0, {"Status": "No repositories found (0/100)"}

        total_repos = len(repos)
        score_desc = 0.0
        score_topics = 0.0
        score_maintenance = 0.0
        
        current_time = datetime.now()

        for repo in repos:
            if repo.get("description"):
                score_desc += 1
            if repo.get("topics") and len(repo["topics"]) > 0:
                score_topics += 1
            
            updated_at_str = repo.get("updated_at")
            if updated_at_str:
                # Handle varying formats if needed. GitHub returns ISO 8601
                updated_at = datetime.fromisoformat(updated_at_str.replace('Z', '+00:00')).replace(tzinfo=None)
                days_since_update = (current_time - updated_at).days
                if days_since_update <= 180:
                    score_maintenance += 1
                elif days_since_update <= 365:
                    score_maintenance += 0.5
        
        # Normalize to 100
        desc_weight = 35
        topics_weight = 25
        maintenance_weight = 40
        
        desc_score = (score_desc / total_repos) * desc_weight
        topics_score = (score_topics / total_repos) * topics_weight
        maintenance_score = (score_maintenance / total_repos) * maintenance_weight
        
        total_score = int(desc_score + topics_score + maintenance_score)
        
        breakdown = {
            "Description Completeness": f"{int(desc_score)}/{desc_weight}",
            "Topics Tagging": f"{int(topics_score)}/{topics_weight}",
            "Recent Maintenance": f"{int(maintenance_score)}/{maintenance_weight}"
        }
        
        return total_score, breakdown

    @staticmethod
    def evaluate_engineering_activity(profile: Dict[str, Any], repos: List[Dict[str, Any]]) -> Tuple[int, Dict[str, str]]:
        """
        Evaluates engineering activity based on number of repos and update recency.
        Score out of 100.
        Returns: (total_score, breakdown_dict)
        """
        num_repos = len(repos)
        
        if num_repos == 0:
            return 0, {"Status": "No activity found (0/100)"}
            
        # 1. Volume Score (Max 30)
        volume_score = min(30, (num_repos / 20) * 30) 
        
        # 2. Recency Score (Max 40)
        current_time = datetime.now()
        recently_updated = 0
        for repo in repos:
            updated_at_str = repo.get("updated_at")
            if updated_at_str:
                updated_at = datetime.fromisoformat(updated_at_str.replace('Z', '+00:00')).replace(tzinfo=None)
                if (current_time - updated_at).days <= 90:
                    recently_updated += 1
                    
        recency_score = min(40, (recently_updated / max(1, min(10, num_repos))) * 40)
        
        # 3. Engagement Score (Stars/Forks given to them) (Max 30)
        total_stars = sum(repo.get("stars", 0) for repo in repos)
        total_forks = sum(repo.get("forks", 0) for repo in repos)
        engagement_val = total_stars + (total_forks * 2)
        engagement_score = min(30, (engagement_val / 50) * 30)
        
        total_score = int(volume_score + recency_score + engagement_score)
        
        breakdown = {
            "Repository Volume": f"{int(volume_score)}/30",
            "Recent Activity": f"{int(recency_score)}/40",
            "Community Engagement": f"{int(engagement_score)}/30"
        }
        
        return total_score, breakdown

    @staticmethod
    def evaluate_project_complexity(repos: List[Dict[str, Any]], code_structure: Dict[str, Any] = None, repo_trees: Dict[str, List[str]] = None, repo_files: Dict[str, Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Classifies overall project complexity and performs deep analysis per repository.
        """
        if not repos:
            return {
                "tier": "Starter",
                "complexity_score": 0,
                "breakdown": {"Status": "No data (0/100)"},
                "reasoning": "No repositories found.",
                "evidence": []
            }
            
        repo_scores = []
        evidence = []
        breakdown = {
            "API Integrations": 0,
            "Database/State": 0,
            "Architecture Layers": 0
        }
        
        # Tech keywords mapping for feature detection
        stack_keywords = ["react", "vue", "angular", "next.js", "express", "django", "fastapi", "flask", "spring", "mongodb", "postgresql", "mysql", "redis", "tensorflow", "pytorch", "docker", "kubernetes", "aws", "gcp", "azure"]
        feature_keywords = {
            "Authentication": ["auth", "login", "jwt", "oauth", "passport", "cognito", "firebase auth"],
            "REST APIs": ["api", "rest", "endpoint", "swagger", "openapi", "graphql"],
            "AI Integration": ["ai", "machine learning", "ml", "nlp", "llm", "openai", "gemini", "tensorflow", "pytorch"],
            "Analytics": ["analytics", "dashboard", "metrics", "chart", "d3", "recharts"],
            "Admin Panels": ["admin", "cms", "dashboard"],
            "Payments": ["stripe", "payment", "checkout", "paypal"],
            "Chat Systems": ["chat", "message", "socket.io", "websocket", "realtime"],
            "File Uploads": ["upload", "s3", "storage", "multer", "file"]
        }
        
        for repo in repos:
            repo_name = repo.get("name")
            desc = (repo.get("description") or "").lower()
            topics = [t.lower() for t in repo.get("topics", [])]
            search_text = desc + " " + " ".join(topics)
            name_desc = (repo_name + " " + desc).lower()
            
            repo_score = 0
            detected_stack = [k for k in stack_keywords if k in search_text]
            features = [k for k, v in feature_keywords.items() if any(kw in search_text for kw in v)]
            deployment = []
            testing = []
            strengths = []
            weaknesses = []
            files_found = []

            # Determine file structures
            if repo_trees and repo_name in repo_trees:
                tree = repo_trees[repo_name]
                for path in tree:
                    path_lower = path.lower()
                    if path_lower == "package.json": files_found.append("package.json")
                    if path_lower == "requirements.txt": files_found.append("requirements.txt")
                    if path_lower == "pyproject.toml": files_found.append("pyproject.toml")
                    if path_lower == "dockerfile": files_found.append("Dockerfile")
                    if ".github/workflows" in path_lower: files_found.append(".github/workflows")

            # Parse dependencies
            if repo_files and repo_name in repo_files:
                r_files = repo_files[repo_name]
                if "package.json" in r_files:
                    try:
                        import json
                        pkg = json.loads(r_files["package.json"])
                        deps = list(pkg.get("dependencies", {}).keys()) + list(pkg.get("devDependencies", {}).keys())
                        if "react" in deps or "react-dom" in deps: detected_stack.append("React")
                        if "next" in deps: detected_stack.append("Next.js")
                        if "vue" in deps: detected_stack.append("Vue")
                        if "@angular/core" in deps: detected_stack.append("Angular")
                        if "express" in deps: detected_stack.append("Express")
                        if "redux" in deps: detected_stack.append("Redux")
                        if "tailwindcss" in deps: detected_stack.append("Tailwind")
                        if "vite" in deps: detected_stack.append("Vite")
                    except: pass
                
                reqs = (r_files.get("requirements.txt", "") + " " + r_files.get("pyproject.toml", "")).lower()
                if reqs:
                    if "flask" in reqs: detected_stack.append("Flask")
                    if "fastapi" in reqs: detected_stack.append("FastAPI")
                    if "django" in reqs: detected_stack.append("Django")
                    if "tensorflow" in reqs or "tf" in reqs: detected_stack.append("TensorFlow")
                    if "torch" in reqs: detected_stack.append("PyTorch")
                    if "scikit-learn" in reqs or "sklearn" in reqs: detected_stack.append("Scikit-learn")
                    if "pandas" in reqs: detected_stack.append("Pandas")
                    if "numpy" in reqs: detected_stack.append("NumPy")

            if repo.get("language"):
                detected_stack.append(repo.get("language"))

            detected_stack_clean = list(set([str(s).title() if len(str(s)) > 3 else str(s).upper() for s in detected_stack]))
            
            # Architecture & Tech Depth
            if len(detected_stack_clean) > 2:
                repo_score += 30
                strengths.append(f"Rich tech stack ({len(detected_stack_clean)} tools)")
            elif len(detected_stack_clean) > 0:
                repo_score += 15
            else:
                weaknesses.append("No explicit tech stack detected")
                
            # Feature Complexity
            if len(features) > 2:
                repo_score += 20
                strengths.append(f"Complex features: {', '.join(features[:3])}")
            elif len(features) > 0:
                repo_score += 10
            else:
                weaknesses.append("Basic feature set")
                
            # Testing
            if "test" in name_desc or "tdd" in search_text:
                repo_score += 20
                testing.append("Test suites indicated")
                strengths.append("Includes testing")
            else:
                testing.append("Unverified testing")
                weaknesses.append("Missing test suite documentation")
                
            # Deployment & CI/CD
            if "Dockerfile" in files_found:
                deployment.append("Docker Containerization")
            if ".github/workflows" in files_found:
                deployment.append("GitHub Actions CI/CD")
            if "deploy" in name_desc or "vercel" in search_text or "netlify" in search_text or repo.get("homepage"):
                deployment.append("Deployment configuration detected")
                
            if deployment:
                repo_score += 20
                strengths.append("Production ready")
            else:
                deployment.append("No explicit deployment")
                weaknesses.append("No deployment pipeline")
                
            # Stars (Minor supporting signal, max 10)
            stars = repo.get("stars", 0)
            star_score = min(10, stars)
            repo_score += star_score
            if stars > 10:
                strengths.append(f"Community validation ({stars} stars)")
                
            # Backend Logging Requirements
            logger.debug(f"\n====================================================")
            logger.debug(f"Repository: {repo_name}")
            logger.debug(f"Files Found:\n" + "\n".join(set(files_found)) if files_found else "Files Found:\nNone")
            logger.debug(f"\nDetected Technologies:\n" + "\n".join(detected_stack_clean) if detected_stack_clean else "Detected Technologies:\nNone")
            logger.debug(f"\nDetected Features:\n" + "\n".join(features) if features else "Detected Features:\nNone")
            logger.debug(f"====================================================\n")
                
            # Finalize repo score
            repo_score = min(100, repo_score)
            if repo_score >= 80: repo["tier"] = "Flagship"
            elif repo_score >= 60: repo["tier"] = "Professional"
            elif repo_score >= 40: repo["tier"] = "Advanced"
            elif repo_score >= 20: repo["tier"] = "Intermediate"
            else: repo["tier"] = "Starter"
                
            repo["complexity_score"] = repo_score
            repo["detected_stack"] = detected_stack_clean
            repo["features"] = features
            repo["testing"] = list(set(testing))
            repo["deployment"] = list(set(deployment))
            repo["strengths"] = list(set(strengths))[:3]
            repo["weaknesses"] = list(set(weaknesses))[:2]
            
            repo_scores.append(repo_score)
            
            if repo_score >= 40 and len(evidence) < 5:
                evidence.append(f"{repo['name']} ({repo['tier']}): {', '.join(features)}")
                
        # Overall Profile Complexity
        best_repos_score = sum(sorted(repo_scores, reverse=True)[:5]) # top 5 repos
        overall_score = min(100, int(best_repos_score / 4)) # Normalize
        
        if code_structure:
            overall_score = min(100, int((overall_score * 0.7) + (code_structure.get("architecture_score", 0) * 0.3)))
        
        level = "Starter"
        reasoning = "Projects demonstrate basic foundational skills."
        if overall_score >= 85:
            level = "Flagship"
            reasoning = "Projects demonstrate exceptional complexity, testing, and CI/CD pipelines."
        elif overall_score >= 70:
            level = "Professional"
            reasoning = "Projects show strong production readiness and feature complexity."
        elif overall_score >= 50:
            level = "Advanced"
            reasoning = "Projects feature complex patterns and standard APIs."
        elif overall_score >= 30:
            level = "Intermediate"
            reasoning = "Projects utilize standard frameworks but lack operational tooling."
            
        breakdown = {
            "Top Project Impact": f"{min(40, int(overall_score * 0.4))}/40",
            "Tech Stack Depth": f"{min(30, int(overall_score * 0.3))}/30",
            "Architectural Breadth": f"{min(30, int(overall_score * 0.3))}/30"
        }
        
        return {
            "tier": level,
            "complexity_score": overall_score,
            "breakdown": breakdown,
            "reasoning": reasoning,
            "evidence": evidence
        }

    @staticmethod
    def calculate_engineering_trust(repos: List[Dict[str, Any]], tech_verification: Dict[str, Any], code_structure: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Calculates an Engineering Trust Score based on verification evidence, documentation, and consistency.
        """
        score = 0
        breakdown = {}
        
        verified_skills = tech_verification.get("verified_skills", [])
        weak_evidence = tech_verification.get("weak_evidence", [])
        unverified_skills = tech_verification.get("unverified_skills", [])
        
        # 1. Technology Verification (30 pts)
        verified_count = len(verified_skills)
        weak_count = len(weak_evidence)
        unverified_count = len(unverified_skills)
        
        tech_score = 0
        if verified_count > 0:
            tech_score = min(30, (verified_count * 8) + (weak_count * 2))
            if unverified_count > verified_count * 2:
                tech_score -= 5
        
        tech_score = max(0, min(30, tech_score))
        breakdown["Technology Verification"] = f"{tech_score}/30"
        score += tech_score
        
        # 2. Documentation Quality (20 pts)
        desc_count = sum(1 for r in repos if r.get("description"))
        doc_score = min(20, int((desc_count / max(1, len(repos))) * 20))
        breakdown["Documentation Quality"] = f"{doc_score}/20"
        score += doc_score
        
        # 3. Deployment Evidence (15 pts)
        deploy_count = sum(1 for r in repos if r.get("has_pages") or "deploy" in (r.get("description") or "").lower() or "docker" in [t.lower() for t in r.get("topics", [])])
        deploy_score = min(15, deploy_count * 5)
        breakdown["Deployment Evidence"] = f"{deploy_score}/15"
        score += deploy_score
        
        # 4. Consistency (15 pts)
        recent_updates = sum(1 for r in repos if r.get("updated_at") and "202" in r.get("updated_at")) 
        consistency_score = min(15, recent_updates * 3)
        breakdown["Consistency"] = f"{consistency_score}/15"
        score += consistency_score
        
        # 5. Repository Quality (10 pts)
        quality_score = min(10, sum(1 for r in repos if r.get("topics") and r.get("description")) * 2)
        if code_structure and code_structure.get("architecture_score", 0) > 60: quality_score = 10
        breakdown["Repository Quality"] = f"{quality_score}/10"
        score += quality_score
        
        # 6. Maintenance (10 pts)
        maintenance_score = min(10, recent_updates * 2)
        breakdown["Maintenance"] = f"{maintenance_score}/10"
        score += maintenance_score
        
        reasoning = "High trust profile." if score >= 80 else "Moderate trust profile." if score >= 50 else "Low trust profile. Lacks verification evidence."
        
        return {
            "trust_score": score,
            "trust_breakdown": breakdown,
            "trust_reasoning": reasoning,
            "verified_skills": verified_skills,
            "weak_evidence": weak_evidence,
            "unverified_skills": unverified_skills
        }

    @staticmethod
    def analyze_engineering_evolution(repos: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Measures engineering growth over time based on complexity and tech diversity.
        """
        timeline_map = defaultdict(list)
        for repo in repos:
            if repo.get("created_at"):
                try:
                    year = repo["created_at"][:4]
                    timeline_map[year].append(repo)
                except:
                    pass
                    
        timeline = []
        growth_score = 0
        trend = "Stable"
        
        years = sorted(list(timeline_map.keys()))
        complexity_trend = []
        
        for year in years:
            year_repos = timeline_map[year]
            techs = set()
            has_tests = False
            has_deploy = False
            arch_level = "Basic"
            
            for repo in year_repos:
                techs.add(repo.get("language"))
                for t in repo.get("topics", []): techs.add(t)
                
                desc = (repo.get("name", "") + " " + (repo.get("description", ""))).lower()
                if "test" in desc or "pytest" in desc or "jest" in desc: has_tests = True
                if "vercel" in desc or "docker" in desc or repo.get("homepage"): has_deploy = True
                if "api" in desc or "microservice" in desc or "backend" in desc: arch_level = "Intermediate"
                
            techs = [t for t in techs if t]
            
            year_score = len(techs) * 5
            if has_tests: year_score += 15
            if has_deploy: year_score += 15
            if arch_level == "Intermediate": year_score += 20
            
            complexity_trend.append(year_score)
            
            timeline.append({
                "year": year,
                "technologies": list(techs)[:5],
                "architecture": arch_level if year_score < 40 else "Advanced",
                "testing": "Present" if has_tests else "None",
                "deployment": "Present" if has_deploy else "None"
            })
            
        if len(complexity_trend) >= 2:
            if complexity_trend[-1] > complexity_trend[0] + 20:
                trend = "Strong Upward"
                growth_score = min(100, 70 + (complexity_trend[-1] - complexity_trend[0]))
            elif complexity_trend[-1] > complexity_trend[0]:
                trend = "Upward"
                growth_score = min(100, 50 + (complexity_trend[-1] - complexity_trend[0]))
            else:
                trend = "Stable"
                growth_score = 50
        elif len(complexity_trend) == 1:
            growth_score = min(100, complexity_trend[0])
            trend = "Establishing"
            
        return {
            "growth_score": growth_score,
            "growth_trend": trend,
            "timeline": timeline
        }

    @staticmethod
    def generate_executive_summary(maturity: Dict[str, Any], trust: Dict[str, Any], complexity: Dict[str, Any], tech_verification: Dict[str, Any]) -> Dict[str, Any]:
        """
        Deterministically calculates the Executive Summary without relying on AI.
        """
        # Determine Engineering Level deterministically
        mat_score = maturity.get("score", 0)
        trust_score = trust.get("trust_score", 0)
        comp_score = complexity.get("complexity_score", 0)
        total_skills = len(tech_verification.get("verified_skills", []))
        
        overall = (mat_score + trust_score + comp_score) / 3
        
        level = "Student"
        roles = []
        if overall >= 85 and total_skills >= 5:
            level = "Staff Engineer Candidate"
            roles = ["Staff Engineer", "Platform Engineer", "Principal Software Engineer"]
        elif overall >= 70 and total_skills >= 4:
            level = "Senior Engineer Candidate"
            roles = ["Senior Backend Engineer", "Senior Full Stack Engineer", "Engineering Lead"]
        elif overall >= 50 and total_skills >= 3:
            level = "Mid-Level Engineer"
            roles = ["Backend Engineer", "Full Stack Engineer", "DevOps Engineer"]
        elif overall >= 30 and total_skills >= 1:
            level = "Associate Engineer"
            roles = ["Junior Developer", "Frontend Developer", "Backend Developer"]
        else:
            level = "Junior Developer"
            roles = ["Intern", "Junior Developer"]
            
        # Confidence
        confidence = "High" if trust_score >= 80 else "Medium" if trust_score >= 50 else "Low"
        
        # Aggregate Strengths
        strengths = []
        if mat_score >= 70: strengths.append("High engineering maturity and standards")
        if trust_score >= 70: strengths.append("Strong verifiable evidence of skills")
        if comp_score >= 70: strengths.append("Demonstrated ability to handle complex architecture")
        if total_skills >= 5: strengths.append("Diverse technology stack capability")
        for skill in tech_verification.get("verified_skills", [])[:2]:
            skill_name = skill.get("technology", str(skill)) if isinstance(skill, dict) else str(skill)
            strengths.append(f"Verified expertise in {skill_name}")
            
        # Aggregate Weaknesses
        weaknesses = []
        weaknesses.extend(maturity.get("weaknesses", []))
        if trust_score < 50: weaknesses.append("Lacking verifiable project evidence")
        if comp_score < 50: weaknesses.append("Limited project complexity or architecture depth")
        if total_skills < 3: weaknesses.append("Narrow verified technology stack")
        
        return {
            "engineering_level": level,
            "confidence": confidence,
            "top_strengths": list(set(strengths))[:4],
            "top_weaknesses": list(set(weaknesses))[:4],
            "recommended_roles": roles
        }

    @staticmethod
    def generate_recruiter_decision(maturity: Dict[str, Any], trust: Dict[str, Any], complexity: Dict[str, Any], structure: Dict[str, Any], evolution: Dict[str, Any], executive: Dict[str, Any]) -> Dict[str, Any]:
        """
        Creates a deterministic recruiter decision output.
        """
        mat_score = maturity.get("score", 0)
        trust_score = trust.get("trust_score", 0)
        comp_score = complexity.get("complexity_score", 0)
        arch_score = structure.get("architecture_score", 0)
        growth_score = evolution.get("growth_score", 0)
        
        overall = (mat_score + trust_score + comp_score + arch_score + growth_score) / 5
        
        recommendation = "Insufficient Evidence"
        if overall >= 85:
            recommendation = "Strong Hire"
        elif overall >= 70:
            recommendation = "Hire"
        elif overall >= 55:
            recommendation = "Strong Consideration"
        elif overall >= 35:
            recommendation = "Needs Development"
            
        confidence = min(100, trust_score + (len(evolution.get("timeline", [])) * 5))
        
        strengths = []
        risks = []
        focus = []
        
        if arch_score >= 80: strengths.append("Strong architectural foundation")
        if growth_score >= 70: strengths.append("Rapid technical growth trajectory")
        if trust_score >= 80: strengths.append("Highly verifiable skill set")
        
        if arch_score < 40: risks.append("Unproven architectural capability")
        if trust_score < 40: risks.append("Cannot verify claimed skills")
        if comp_score < 50: risks.append("Projects may lack real-world complexity")
        
        if not risks and not strengths:
            strengths.append("Standard engineering capabilities")
            
        if arch_score < 60: focus.append("System Design & Architecture")
        if maturity.get("breakdown", {}).get("Testing", 0) < 10: focus.append("Testing Practices")
        if trust_score < 60: focus.append("Technical Verification (Pair Programming)")
        if not focus: focus.append("Advanced Technical Deep Dive")
        
        return {
            "hiring_recommendation": recommendation,
            "confidence": confidence,
            "strength_areas": strengths,
            "risk_areas": risks,
            "interview_focus_areas": focus,
            "recruiter_summary": "" # to be populated by AI
        }
