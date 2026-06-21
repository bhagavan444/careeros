/**
 * ResumeDocumentStore.js
 * 
 * Manages the global state for the Document Engine, handling debounced recalculations,
 * view modes (Normal, Recruiter, ATS), and section anchoring.
 */

class DocumentStore {
  constructor() {
    this.state = {
      resumeData: null,
      template: 'professional',
      pages: [], // Array of page objects containing sections
      viewMode: 'normal', // normal, recruiter, ats
      zoomMode: 'fit-width', // 50, 75, 100, 125, 150, fit-width, fit-page, fit-all
      activeSection: null, // For scroll anchoring
      isDebug: false,
    };
    
    this.listeners = [];
    this.debounceTimer = null;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  updateData(newData) {
    this.state.resumeData = newData;
    this.notify();
    this.triggerPageRecalculation();
  }

  updateTemplate(newTemplate) {
    this.state.template = newTemplate;
    this.notify();
    this.triggerPageRecalculation();
  }

  setViewMode(mode) {
    this.state.viewMode = mode;
    this.notify();
  }

  setZoomMode(mode) {
    this.state.zoomMode = mode;
    this.notify();
  }

  scrollToSection(sectionId) {
    this.state.activeSection = sectionId;
    this.notify();
    // Reset active section after event is consumed
    setTimeout(() => {
      this.state.activeSection = null;
      this.notify();
    }, 100);
  }

  toggleDebug() {
    this.state.isDebug = !this.state.isDebug;
    this.notify();
  }

  setPages(pages) {
    this.state.pages = pages;
    this.notify();
  }

  triggerPageRecalculation() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      // Dispatch an event that PageBreakEngine listens to
      window.dispatchEvent(new CustomEvent('recalculate-pages'));
    }, 250);
  }
}

export const resumeDocumentStore = new DocumentStore();
