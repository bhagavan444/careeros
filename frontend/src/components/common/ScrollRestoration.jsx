import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();

  // Save scroll position when navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem(`scroll-${location.pathname}`, window.scrollY.toString());
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save scroll position specifically for this path before unmounting/changing route
      sessionStorage.setItem(`scroll-${location.pathname}`, window.scrollY.toString());
    };
  }, [location.pathname]);

  // Restore scroll position when navigating to a route
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(`scroll-${location.pathname}`);

    if (navigationType === 'PUSH') {
      // New navigation (e.g. clicking a link) should always start at the top
      window.scrollTo(0, 0);
    } else if (savedPosition) {
      // POP navigation (back/forward button) or initial load (refresh)
      // Use setTimeout to allow React to paint the DOM first, especially important for lazy-loaded routes
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }, 50);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, navigationType]);

  return null;
}
