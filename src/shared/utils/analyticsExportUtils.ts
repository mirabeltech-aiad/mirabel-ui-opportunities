// Analytics-specific export utilities
export const exportAnalyticsToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    // console.warn('No data to export')
    return
  }

  // Convert data to CSV format
// logger import removed to avoid top-level import errors in utility helpers

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const exportAnalyticsToPDF = (data: any[], filename: string, title?: string) => {
  // Simple PDF export using HTML and print
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title || filename}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #075985; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .export-date { color: #666; font-size: 12px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <h1>${title || filename}</h1>
      <div class="export-date">Generated on: ${new Date().toLocaleString()}</div>
      <table>
        <thead>
          <tr>
            ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `

  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

export const exportAnalyticsOverview = (overview: any) => {
  const data = [
    { Metric: 'Total Subscribers', Value: overview.totalSubscribers },
    { Metric: 'Average LTV', Value: `$${overview.averageLTV}` },
    { Metric: 'Engagement Score', Value: `${overview.overallEngagementScore}%` },
    { Metric: 'Low Risk Subscribers', Value: overview.churnRisk.low },
    { Metric: 'Medium Risk Subscribers', Value: overview.churnRisk.medium },
    { Metric: 'High Risk Subscribers', Value: overview.churnRisk.high },
    { Metric: 'Critical Risk Subscribers', Value: overview.churnRisk.critical },
  ]

  return data
}

export const exportDemographicsData = (demographics: any) => {
  const data = [
    ...demographics.ageGroups?.map((group: any) => ({
      Category: 'Age Group',
      Segment: group.range,
      Count: group.count,
      Percentage: `${group.percentage}%`,
      'Average LTV': `$${group.averageLTV}`,
      'Churn Rate': `${group.churnRate}%`
    })) || [],
    ...demographics.genderDistribution?.map((gender: any) => ({
      Category: 'Gender',
      Segment: gender.gender,
      Count: gender.count,
      Percentage: `${gender.percentage}%`,
      'Average LTV': `$${gender.averageLTV}`,
      'Churn Rate': 'N/A'
    })) || []
  ]

  return data
}

export const exportCostAnalysisData = (costs: any) => {
  const data = [
    { Category: 'Customer Acquisition', Amount: '$125,000', Percentage: '35%', Trend: '+8%' },
    { Category: 'Content Production', Amount: '$89,000', Percentage: '25%', Trend: '+2%' },
    { Category: 'Platform & Technology', Amount: '$67,000', Percentage: '19%', Trend: '-5%' },
    { Category: 'Customer Support', Amount: '$45,000', Percentage: '13%', Trend: '+12%' },
    { Category: 'Marketing & Advertising', Amount: '$28,000', Percentage: '8%', Trend: '+15%' }
  ]

  return data
}