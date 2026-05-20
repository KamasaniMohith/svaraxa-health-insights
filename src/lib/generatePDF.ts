import jsPDF from "jspdf";
import { PredictionResult } from "./api";

const loadImage = (src: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = src;
  });
};

export async function generatePDF(result: PredictionResult, inputs: Record<string, any>) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const logoData = await loadImage('/svaraxa-logo.png');
  
  // ── Color helpers ──
  const riskColor = (level: string) => {
    if (level === "HIGH")   return [220, 38, 38];   // red
    if (level === "MEDIUM") return [234, 179, 8];   // yellow
    return [16, 185, 129];                           // green
  };

  // ── Header bar ──
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.addImage(logoData, 'PNG', 12, 6, 20, 20);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("SVARAXA", 36, 16);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("AI-Powered Early Health Risk Detection", 36, 24);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric"
  })}`, pageWidth - 14, 24, { align: "right" });

  // ── Title ──
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`${result.disease} Risk Report`, 14, 50);

  // ── Risk summary box ──
  const [r, g, b] = riskColor(result.risk_level);
  doc.setFillColor(r, g, b);
  doc.roundedRect(14, 58, pageWidth - 28, 28, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("RISK SCORE", 24, 68);
  doc.text("RISK LEVEL", 90, 68);
  doc.text("CONFIDENCE", 150, 68);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`${result.risk_score}%`, 24, 80);
  doc.text(result.risk_level, 90, 80);
  doc.text(`${result.confidence}%`, 150, 80);

  // ── Health Age (if available) ──
  let yPos = 102;
  if (result.health_age) {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, yPos, pageWidth - 28, 22, 3, 3, "F");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("HEALTH AGE", 24, yPos + 8);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(r, g, b);
    doc.text(`${result.health_age} years`, 24, yPos + 18);
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Your actual age: ${result.actual_age}`, 90, yPos + 13);
    yPos += 30;
  }

  // ── Key Risk Factors ──
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Key Risk Factors", 14, yPos + 8);
  yPos += 14;

  const maxScore = Math.max(...result.top_factors.map(f => f.score));
  result.top_factors.forEach((factor, i) => {
    const barWidth = ((factor.score / maxScore) * 100);
    const impactColors: Record<string, number[]> = {
      "Major Impact":    [220, 38, 38],
      "Moderate Impact": [234, 179, 8],
      "Minor Impact":    [16, 185, 129],
    };
    const [fr, fg, fb] = impactColors[factor.impact] || [100, 116, 139];

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, yPos, pageWidth - 28, 18, 2, 2, "F");

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(factor.factor, 20, yPos + 7);

    doc.setFillColor(fr, fg, fb);
    doc.roundedRect(20, yPos + 10, barWidth * 0.9, 3, 1, 1, "F");

    doc.setTextColor(fr, fg, fb);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(factor.impact, pageWidth - 20, yPos + 7, { align: "right" });

    yPos += 22;
  });

  // ── Recommendations ──
  yPos += 4;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Recommended Actions", 14, yPos);
  yPos += 10;

  result.recommendations.forEach((rec, i) => {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, yPos, pageWidth - 28, 12, 2, 2, "F");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`${i + 1}.  ${rec}`, 20, yPos + 8);
    yPos += 16;
  });

  // ── Disclaimer ──
  yPos += 6;
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(14, yPos, pageWidth - 28, 20, 2, 2, "F");
  doc.setTextColor(185, 28, 28);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("⚠  MEDICAL DISCLAIMER", 20, yPos + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "This report is generated by an AI model for educational awareness only. It is NOT a medical diagnosis.",
    20, yPos + 13
  );
  doc.text(
    "Always consult a licensed healthcare professional before making any health decisions.",
    20, yPos + 18
  );

  // ── Footer ──
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(15, 23, 42);
  doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text("SVARAXA Health AI  •  svaraxa.workers.dev  •  For awareness only", 
    pageWidth / 2, pageHeight - 5, { align: "center" });

  // ── Save ──
  doc.save(`SVARAXA_${result.disease.replace(/ /g, "_")}_Report.pdf`);
}