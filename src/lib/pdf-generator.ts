import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportCaseSheetPDF(elementId: string, filename: string = 'ClinAssist_CaseSheet.pdf'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF export:', elementId);
    window.print();
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (err) {
    console.error('PDF Generation error, falling back to window print', err);
    window.print();
  }
}
