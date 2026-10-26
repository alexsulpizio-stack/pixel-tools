/** Original, fictional demo content. No visitor files or remote requests are used. */
export async function createReceiptSamples(): Promise<File[]> {
  const examples = [
    { title: "Office supplies", lines: ["Notebook     $4.00", "Pens         $3.00", "Total        $7.00"] },
    { title: "Travel expense", lines: ["Bus ticket   $2.50", "Return trip  $2.50", "Total        $5.00"] },
    { title: "Team lunch", lines: ["Sandwich     $8.00", "Water        $2.00", "Total       $10.00"] },
  ];
  return Promise.all(examples.map(async (example, index) => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 800;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, 600, 800);
    context.fillStyle = "#172554";
    context.font = "bold 30px sans-serif";
    context.fillText("PIXELTOOLS SAMPLE", 45, 75);
    context.font = "22px sans-serif";
    context.fillText("Fictional receipt — not a real purchase", 45, 120);
    context.fillText(`Receipt ${index + 1}: ${example.title}`, 45, 200);
    context.font = "26px monospace";
    example.lines.forEach((line, row) => context.fillText(line, 45, 290 + row * 65));
    context.font = "20px sans-serif";
    context.fillText("Demo image: 600 × 800 pixels", 45, 710);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("PNG encoding failed")), "image/png"));
    return new File([blob], `sample-receipt-${index + 1}.png`, { type: "image/png" });
  }));
}
