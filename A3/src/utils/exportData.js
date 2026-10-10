import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

// Values containing commas, quotes or line breaks
// must be wrapped in quotes, and quotes doubled.
// Values starting with = + - @ are prefixed with '
// so spreadsheet apps do not run them as formulas
const toCsvValue = (value) => {
  let text =
    value === null || value === undefined
      ? ''
      : String(value)

  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`
  }

  if (/[",\n\r]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`
  }

  return text
}

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = fileName

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

const buildCsv = (columns, rows) => {
  const header = columns
    .map((column) => toCsvValue(column.label))
    .join(',')

  const lines = rows.map((row) =>
    columns
      .map((column) => toCsvValue(row[column.key]))
      .join(','),
  )

  return [header, ...lines].join('\r\n')
}

const exportToCsv = (columns, rows, fileName) => {
  // The BOM (﻿) makes Excel read UTF-8 correctly.
  const blob = new Blob(
    ['﻿' + buildCsv(columns, rows)],
    { type: 'text/csv;charset=utf-8' },
  )

  downloadBlob(blob, `${fileName}.csv`)
}

const buildPdf = (columns, rows, title) => {
  const doc = new jsPDF({ orientation: 'landscape' })

  doc.setFontSize(16)
  doc.text(title, 14, 16)

  doc.setFontSize(10)
  doc.text(
    `Pots & Plants Melbourne — exported ${new Date().toLocaleString('en-AU')}`,
    14,
    23,
  )

  autoTable(doc, {
    startY: 28,
    head: [columns.map((column) => column.label)],
    body: rows.map((row) =>
      columns.map((column) => String(row[column.key] ?? '')),
    ),
    headStyles: { fillColor: [53, 104, 45] },
    styles: { fontSize: 9 },
  })

  return doc
}

const exportToPdf = (columns, rows, fileName, title) => {
  const doc = buildPdf(columns, rows, title)

  doc.save(`${fileName}.pdf`)
}

export {
  buildCsv,
  buildPdf,
  exportToCsv,
  exportToPdf,
}
