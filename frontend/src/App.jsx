import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Core components - keep eager loaded for instant FCP (First Contentful Paint)
import Navbar from "./components/Navbar.jsx";
import BackgroundVideoLayer from "./components/BackgroundVideoLayer.jsx";
import Home from "./Pages/Home.jsx";

// Performance tools
import PageWrapper from "./components/PageWrapper.jsx";
import InfrastructureLoader from "./components/InfrastructureLoader.jsx";
import { auth } from "./firebase.js";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// ==============================================================
// LAZY LOADED ROUTES
// Drastically reduces initial JS payload parsing for 144Hz FCP
// ==============================================================
const ResumeIntelligence = lazy(() => import("./Pages/ResumeIntelligence.jsx"));
const ProfileIntelligence = lazy(() => import("./Pages/ProfileIntelligence.jsx"));
const InterviewIntelligence = lazy(() => import("./Pages/InterviewIntelligence.jsx"));
const RecruiterIntelligence = lazy(() => import("./Pages/RecruiterIntelligence.jsx"));
const TalentRanking = lazy(() => import("./Pages/TalentRanking.jsx"));

const Chat = lazy(() => import("./Pages/Chat.jsx"));
const ResumeStudio = lazy(() => import("./Pages/ResumeStudio.jsx"));
const CareerCommandCenter = lazy(() => import("./Pages/CareerCommandCenter.jsx"));
const About = lazy(() => import("./Pages/About.jsx"));
const Contact = lazy(() => import("./Pages/Contact.jsx"));
const Login = lazy(() => import("./Pages/Login.jsx"));
const Plans = lazy(() => import("./Pages/Plans.jsx"));
const Admin = lazy(() => import("./Pages/Admin.jsx"));
const Dashboard = lazy(() => import("./Pages/Dashboard.jsx"));
const Settings = lazy(() => import("./Pages/Settings.jsx"));
const Checkout = lazy(() => import("./Pages/Checkout.jsx"));
const Subscription = lazy(() => import("./Pages/Subscription.jsx"));
const Billing = lazy(() => import("./Pages/Billing.jsx"));
const Console = lazy(() => import("./Pages/Console.jsx"));
const GithubIntelligence = lazy(() => import("./Pages/GithubIntelligence.jsx"));
const IdentitySnapshot = lazy(() => import("./Pages/IdentitySnapshot.jsx"));
const QuizIntelligence = lazy(() => import("./Pages/QuizIntelligence.jsx"));

// Footer Routes
const Assessments = lazy(() => import("./Pages/Assessments.jsx"));
const Assistant = lazy(() => import("./Pages/Assistant.jsx"));
const Resources = lazy(() => import("./Pages/Resources.jsx"));
const Docs = lazy(() => import("./Pages/Docs.jsx"));
const Research = lazy(() => import("./Pages/Research.jsx"));
const Platform = lazy(() => import("./Pages/Platform.jsx"));
const Careers = lazy(() => import("./Pages/Careers.jsx"));
const Privacy = lazy(() => import("./Pages/Privacy.jsx"));
const Terms = lazy(() => import("./Pages/Terms.jsx"));

import ScrollRestoration from "./components/common/ScrollRestoration.jsx";

// Higher Order Component to wrap lazy routes cleanly
const LazyRoute = ({ Component }) => (
  <Suspense fallback={<InfrastructureLoader />}>
    <PageWrapper>
      <Component />
    </PageWrapper>
  </Suspense>
);

function AppRoutes() {
  const location = useLocation();
  const hideFooterRoutes = ["/chat"];
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);
  
  return (
    <>
      <ScrollRestoration />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        {/* Eagerly loaded home page */}
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        
        {/* Lazy loaded core features - Protected */}
        <Route path="/resume-intelligence" element={<ProtectedRoute><LazyRoute Component={ResumeIntelligence} /></ProtectedRoute>} />
        <Route path="/profile-intelligence" element={<ProtectedRoute><LazyRoute Component={ProfileIntelligence} /></ProtectedRoute>} />
        <Route path="/interview-intelligence" element={<ProtectedRoute><LazyRoute Component={InterviewIntelligence} /></ProtectedRoute>} />
        <Route path="/recruiter-intelligence" element={<ProtectedRoute><LazyRoute Component={RecruiterIntelligence} /></ProtectedRoute>} />
        <Route path="/talent-ranking" element={<ProtectedRoute><LazyRoute Component={TalentRanking} /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><LazyRoute Component={Chat} /></ProtectedRoute>} />
        <Route path="/resume-studio" element={<ProtectedRoute><LazyRoute Component={ResumeStudio} /></ProtectedRoute>} />
        <Route path="/career-command-center" element={<ProtectedRoute><LazyRoute Component={CareerCommandCenter} /></ProtectedRoute>} />
        
        {/* Public info pages */}
        <Route path="/about" element={<LazyRoute Component={About} />} />
        <Route path="/contact" element={<LazyRoute Component={Contact} />} />
        <Route path="/login" element={<LazyRoute Component={Login} />} />
        <Route path="/plans" element={<LazyRoute Component={Plans} />} />
        
        {/* Admin and settings - Protected */}
        <Route path="/admin" element={<ProtectedRoute><LazyRoute Component={Admin} /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><LazyRoute Component={Dashboard} /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><LazyRoute Component={Settings} /></ProtectedRoute>} />
        <Route path="/github-intelligence" element={<ProtectedRoute><LazyRoute Component={GithubIntelligence} /></ProtectedRoute>} />
        <Route path="/identity-snapshot" element={<ProtectedRoute><LazyRoute Component={IdentitySnapshot} /></ProtectedRoute>} />
        <Route path="/predict" element={<ProtectedRoute><LazyRoute Component={QuizIntelligence} /></ProtectedRoute>} />
        
        {/* Infrastructure SaaS Routes - Protected */}
        <Route path="/checkout" element={<ProtectedRoute><LazyRoute Component={Checkout} /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><LazyRoute Component={Subscription} /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><LazyRoute Component={Billing} /></ProtectedRoute>} />
        <Route path="/console" element={<ProtectedRoute><LazyRoute Component={Console} /></ProtectedRoute>} />
        
        {/* Footer Routes - Mixed */}
        <Route path="/assessments" element={<ProtectedRoute><LazyRoute Component={Assessments} /></ProtectedRoute>} />
        <Route path="/assistant" element={<ProtectedRoute><LazyRoute Component={Assistant} /></ProtectedRoute>} />
        <Route path="/resources" element={<LazyRoute Component={Resources} />} />
        <Route path="/docs" element={<LazyRoute Component={Docs} />} />
        <Route path="/research" element={<ProtectedRoute><LazyRoute Component={Research} /></ProtectedRoute>} />
        <Route path="/platform" element={<LazyRoute Component={Platform} />} />
        <Route path="/careers" element={<LazyRoute Component={Careers} />} />
        <Route path="/privacy" element={<LazyRoute Component={Privacy} />} />
        <Route path="/terms" element={<LazyRoute Component={Terms} />} />
      </Routes>
      </AnimatePresence>
      {shouldShowFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <BackgroundVideoLayer />
      <Navbar />
      
      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          background: "transparent",
        }}
      >
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;