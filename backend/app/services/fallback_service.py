class FallbackService:
    """
    Provides graceful, branded failure responses when all primary intelligence
    engines and LLMs are unavailable.
    """
    
    @staticmethod
    def get_graceful_response() -> str:
        return (
            "CareerOS AI Assistant is temporarily experiencing high traffic and is "
            "currently unavailable for generative questions.\n\n"
            "However, **Core CareerOS Intelligence systems remain operational**! "
            "You can still use the platform to:\n"
            "- Analyze your resume\n"
            "- Scan your GitHub profile\n"
            "- Generate career roadmaps\n"
            "- Get recruiter insights\n\n"
            "Please try your generative question again in a few moments."
        )
