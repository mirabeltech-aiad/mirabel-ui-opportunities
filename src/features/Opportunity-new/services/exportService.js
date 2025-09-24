
class ExportService {
  exportSalesPerformance(kpis, revenueData, repPerformanceData) {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        summary: {
          totalRevenue: kpis.totalRevenue,
          totalDeals: kpis.total,
          wonDeals: kpis.won,
          conversionRate: kpis.conversionRate,
          avgDealSize: kpis.avgDealSize,
          avgSalesCycle: kpis.avgSalesCycle
        },
        monthlyRevenue: revenueData,
        repPerformance: repPerformanceData
      };

      // Create downloadable CSV content
      const csvContent = this.convertToCSV(exportData);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `sales-performance-${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      console.log('Sales performance data exported successfully');
      return true;
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error('Failed to export sales performance data');
    }
  }

  convertToCSV(data) {
    let csv = 'Sales Performance Report\n\n';
    
    // Summary section
    csv += 'Summary\n';
    csv += 'Metric,Value\n';
    csv += `Total Revenue,$${data.summary.totalRevenue.toLocaleString()}\n`;
    csv += `Total Deals,${data.summary.totalDeals}\n`;
    csv += `Won Deals,${data.summary.wonDeals}\n`;
    csv += `Conversion Rate,${data.summary.conversionRate.toFixed(1)}%\n`;
    csv += `Average Deal Size,$${data.summary.avgDealSize.toLocaleString()}\n`;
    csv += `Average Sales Cycle,${data.summary.avgSalesCycle} days\n\n`;
    
    // Monthly revenue section
    csv += 'Monthly Revenue\n';
    csv += 'Month,Revenue,Deals\n';
    data.monthlyRevenue.forEach(month => {
      csv += `${month.month},$${month.revenue.toLocaleString()},${month.deals}\n`;
    });
    csv += '\n';
    
    // Rep performance section
    csv += 'Rep Performance\n';
    csv += 'Sales Rep,Total Deals,Won Deals,Win Rate,Revenue,Avg Deal Size\n';
    data.repPerformance.forEach(rep => {
      csv += `${rep.name},${rep.total},${rep.won},${rep.winRate}%,$${rep.revenue.toLocaleString()},$${rep.avgDealSize.toLocaleString()}\n`;
    });
    
    return csv;
  }

  exportLostDealAnalysis(lostDealsData) {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        summary: {
          totalLost: lostDealsData.totalLost,
          lostValue: lostDealsData.lostValue
        },
        lossReasons: lostDealsData.lossReasons,
        competitorStats: lostDealsData.competitorStats || [],
        stageAnalysis: lostDealsData.stageAnalysis
      };

      const csvContent = this.convertLostDealsToCSV(exportData);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `lost-deals-analysis-${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      console.log('Lost deals analysis exported successfully');
      return true;
    } catch (error) {
      console.error('Lost deals export failed:', error);
      throw new Error('Failed to export lost deals analysis');
    }
  }

  convertLostDealsToCSV(data) {
    let csv = 'Lost Deals Analysis Report\n\n';
    
    csv += 'Summary\n';
    csv += 'Metric,Value\n';
    csv += `Total Lost Deals,${data.summary.totalLost}\n`;
    csv += `Lost Value,$${data.summary.lostValue.toLocaleString()}\n\n`;
    
    csv += 'Loss Reasons\n';
    csv += 'Reason,Count,Value\n';
    data.lossReasons.forEach(reason => {
      csv += `${reason.reason},${reason.count},$${reason.value.toLocaleString()}\n`;
    });
    csv += '\n';
    
    if (data.competitorStats.length > 0) {
      csv += 'Competitor Analysis\n';
      csv += 'Competitor,Losses,Total Value,Avg Deal Size,Percentage\n';
      data.competitorStats.forEach(comp => {
        csv += `${comp.competitor},${comp.losses},$${comp.totalValue.toLocaleString()},$${comp.avgDealSize.toLocaleString()},${comp.percentage}%\n`;
      });
      csv += '\n';
    }
    
    csv += 'Stage Analysis\n';
    csv += 'Stage,Count,Value\n';
    data.stageAnalysis.forEach(stage => {
      csv += `${stage.stage},${stage.count},$${stage.value.toLocaleString()}\n`;
    });
    
    return csv;
  }

  exportDealVelocity(velocityData) {
    try {
      const csvContent = this.convertVelocityToCSV(velocityData);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `deal-velocity-analysis-${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      console.log('Deal velocity analysis exported successfully');
      return true;
    } catch (error) {
      console.error('Deal velocity export failed:', error);
      throw new Error('Failed to export deal velocity analysis');
    }
  }

  convertVelocityToCSV(data) {
    let csv = 'Deal Velocity Analysis Report\n\n';
    
    csv += 'Stage Velocity\n';
    csv += 'Stage,Avg Days,Benchmark,Variance,Deal Count,Status\n';
    if (data.stageVelocity) {
      data.stageVelocity.forEach(stage => {
        csv += `${stage.stage},${stage.avgDays},${stage.benchmark},${stage.variance}%,${stage.dealCount},${stage.status}\n`;
      });
    }
    
    return csv;
  }
}

const exportService = new ExportService();
export default exportService;
