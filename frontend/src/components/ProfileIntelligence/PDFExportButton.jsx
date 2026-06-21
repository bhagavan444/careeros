import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function PDFExportButton({ targetId }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById(targetId);
      if (!element) throw new Error("Target element not found");

      // Temporarily adjust styles for better PDF rendering
      const originalBackground = element.style.background;
      element.style.background = 'transparent'; // Ensure dark background for the PDF

      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: 'transparent'
      });

      element.style.background = originalBackground; // Restore

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save('CareerOS_Profile_Intelligence_Report.pdf');
    } catch (error) {
      console.error("PDF Export failed:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        borderRadius: '8px',
        background: 'rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        fontWeight: 600,
        fontSize: '0.9rem',
        cursor: isExporting ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        if (!isExporting) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
      }}
      onMouseOut={(e) => {
        if (!isExporting) e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
      }}
    >
      {isExporting ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
      {isExporting ? 'Generating PDF...' : 'Export Enterprise Report'}
    </button>
  );
}
