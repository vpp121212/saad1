import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPdf(
  element: HTMLElement,
  filename: string,
  title: string,
) {
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: bg || '#0a0b0f',
    logging: false,
  })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width
  let heightLeft = pdfHeight
  let position = 0
  const pageHeight = pdf.internal.pageSize.getHeight()

  pdf.setFontSize(16)
  pdf.setTextColor(245, 158, 11)
  pdf.text(title, 14, 15)
  pdf.setFontSize(8)
  pdf.setTextColor(156, 163, 175)
  pdf.text(`Generated: ${new Date().toLocaleString('en-US')}`, 14, 22)

  pdf.addImage(imgData, 'PNG', 0, 28, pdfWidth, pdfHeight)
  heightLeft -= pageHeight - 28

  while (heightLeft > 0) {
    position = heightLeft - pdfHeight + 28
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
    heightLeft -= pageHeight
  }

  pdf.save(`${filename}.pdf`)
}
