import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/**
 * pdfExporter.js
 * 
 * Production-grade utility to capture React DOM nodes and generate
 * a multi-page PDF using html2canvas and jspdf.
 * 
 * @param {Array<React.RefObject>} pageRefs - Array of refs pointing to each page's DOM node.
 * @param {string} filename - The output PDF filename.
 * @param {Function} setStepCallback - Callback to update UI loading state.
 */
export const exportToPDF = async (pageRefs, filename, setStepCallback) => {
  try {
    setStepCallback("Preparing Report Environment...");
    
    // Ensure all pages are actually rendered in the DOM before capturing.
    // Give charts a moment to animate if necessary.
    await new Promise((resolve) => setTimeout(resolve, 800));

    // A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pageRefs.length; i++) {
      const pageRef = pageRefs[i];
      if (!pageRef || !pageRef.current) continue;
      
      setStepCallback(`Rendering Page ${i + 1} of ${pageRefs.length}...`);

      const canvas = await html2canvas(pageRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200, // Force a specific window width for consistent CSS rendering
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      // Calculate dimensions to maintain aspect ratio, but strictly bound to A4
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      
      let finalWidth = pdfWidth;
      let finalHeight = finalWidth / ratio;
      
      if (finalHeight > pdfHeight) {
        finalHeight = pdfHeight;
        finalWidth = finalHeight * ratio;
      }

      if (i > 0) {
        pdf.addPage();
      }

      // Add image centered
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = 0; // Top aligned for reports usually looks best

      pdf.addImage(imgData, "JPEG", xOffset, yOffset, finalWidth, finalHeight);
    }

    setStepCallback("Generating Final PDF...");
    pdf.save(filename);
    
    setStepCallback("Download Complete");
    setTimeout(() => {
      setStepCallback(null);
    }, 2000);
    
  } catch (error) {
    console.error("PDF Export failed:", error);
    setStepCallback("Export Failed!");
    setTimeout(() => {
      setStepCallback(null);
    }, 3000);
    throw error;
  }
};
