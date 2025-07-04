class MockSalesDataService {
  constructor() {
    // Mock sales representatives
    this.salesReps = [
      'John Smith',
      'Sarah Johnson', 
      'Mike Wilson',
      'Lisa Chen',
      'David Brown',
      'Emily Rodriguez',
      'Alex Thompson',
      'Maria Garcia'
    ];

    // Mock opportunities with comprehensive data
    this.opportunities = this.generateMockOpportunities();
  }

  generateMockOpportunities() {
    const companies = [
      'TechCorp', 'DataFlow Inc', 'GlobalTech', 'StartupX', 'MegaCorp',
      'DataCorp', 'SecureMax', 'InnovateInc', 'FutureTech', 'SecureNet',
      'DataSolutions', 'BusinessFlow', 'SalesFlow', 'CloudTech', 'SalesForce Ltd',
      'InsightCorp', 'ProcessPro', 'EduTech', 'ConnectedDevices', 'CodeFlow',
      'OldTech', 'ScaleCorp', 'BigData Inc', 'AppMakers', 'GiantCorp',
      'ConnectAPI', 'AIFlow', 'ModernArch', 'ServiceTech', 'LogisticsPro',
      'PeopleTech', 'FinanceFlow', 'RetailMax', 'CryptoTech', 'DataIntel',
      'NetSolutions', 'DocuFlow', 'AutoTech', 'ShopTech', 'SupportFlow',
      'IntegrateNow', 'SalesMax', 'CyberGuard', 'DataViz', 'CloudFirst',
      'SmartDevices', 'TalkTech'
    ];

    const stages = ['1st Demo', 'Discovery', 'Proposal', 'Negotiation'];
    const statuses = ['Open', 'Won', 'Lost'];
    const opportunities = [];

    // Generate opportunities for the last 12 months
    const now = new Date();
    for (let i = 0; i < 300; i++) {
      const createdDate = new Date(now.getFullYear(), now.getMonth() - Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const stage = status === 'Open' ? stages[Math.floor(Math.random() * stages.length)] : stages[Math.floor(Math.random() * stages.length)];
      
      let actualCloseDate = null;
      if (status === 'Won' || status === 'Lost') {
        actualCloseDate = new Date(createdDate.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000); // Random close within 90 days
      }

      const amount = Math.floor(Math.random() * 500000) + 25000; // $25K to $525K
      
      opportunities.push({
        id: i + 1,
        name: `${companies[Math.floor(Math.random() * companies.length)]} Deal ${i + 1}`,
        company: companies[Math.floor(Math.random() * companies.length)],
        assignedRep: this.salesReps[Math.floor(Math.random() * this.salesReps.length)],
        status,
        stage,
        amount,
        createdDate: createdDate.toISOString(),
        actualCloseDate: actualCloseDate ? actualCloseDate.toISOString() : null,
        projCloseDate: status === 'Open' ? new Date(createdDate.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString() : null
      });
    }

    return opportunities;
  }

  // Filter opportunities based on date range
  filterOpportunitiesByDateRange(dateRange) {
    const now = new Date();
    let startDate, endDate = now;

    switch (dateRange) {
      case 'this-quarter':
        const currentQuarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
        endDate = new Date(now.getFullYear(), currentQuarter * 3 + 3, 0);
        break;
      case 'last-quarter':
        const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
        const lastQuarterYear = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
        const adjustedLastQuarter = lastQuarter < 0 ? 3 : lastQuarter;
        startDate = new Date(lastQuarterYear, adjustedLastQuarter * 3, 1);
        endDate = new Date(lastQuarterYear, adjustedLastQuarter * 3 + 3, 0);
        break;
      case 'last-3-months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'last-6-months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case 'last-12-months':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      case 'ytd':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    }

    return this.opportunities.filter(opp => {
      let oppDate;
      if (opp.status === 'Won' || opp.status === 'Lost') {
        oppDate = new Date(opp.actualCloseDate || opp.createdDate);
      } else {
        oppDate = new Date(opp.createdDate);
      }
      return oppDate >= startDate && oppDate <= endDate;
    });
  }

  // Get filtered opportunities
  getFilteredOpportunities(dateRange = 'last-12-months', selectedRep = 'all', selectedStatus = 'all') {
    let filtered = this.filterOpportunitiesByDateRange(dateRange);

    if (selectedRep !== 'all') {
      filtered = filtered.filter(opp => opp.assignedRep === selectedRep);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(opp => opp.status === selectedStatus);
    }

    return filtered;
  }

  // Generate revenue trend data
  generateRevenueData(filteredOpportunities) {
    const monthlyData = {};
    const now = new Date();
    
    // Initialize last 10 months
    for (let i = 9; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = { month: monthKey, revenue: 0, deals: 0 };
    }

    // Aggregate won deals by month
    filteredOpportunities
      .filter(opp => opp.status === 'Won' && opp.actualCloseDate)
      .forEach(opp => {
        const closeDate = new Date(opp.actualCloseDate);
        const monthKey = closeDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].revenue += opp.amount;
          monthlyData[monthKey].deals += 1;
        }
      });

    return Object.values(monthlyData);
  }

  // Generate pipeline data by stage
  generatePipelineData(filteredOpportunities) {
    const stageData = {};
    const stages = ['Discovery', '1st Demo', 'Proposal', 'Negotiation'];
    
    // Initialize stages
    stages.forEach(stage => {
      stageData[stage] = { stage, count: 0, value: 0 };
    });

    // Aggregate open opportunities by stage
    filteredOpportunities
      .filter(opp => opp.status === 'Open')
      .forEach(opp => {
        if (stageData[opp.stage]) {
          stageData[opp.stage].count += 1;
          stageData[opp.stage].value += opp.amount;
        }
      });

    return Object.values(stageData);
  }

  // Generate rep performance data
  generateRepPerformanceData(filteredOpportunities, selectedRep = 'all') {
    const repData = {};
    const repsToShow = selectedRep === 'all' ? this.salesReps : [selectedRep];
    
    // Initialize rep data
    repsToShow.forEach(rep => {
      repData[rep] = {
        name: rep,
        total: 0,
        won: 0,
        revenue: 0,
        avgDealSize: 0
      };
    });

    // Aggregate data by rep
    filteredOpportunities.forEach(opp => {
      if (repData[opp.assignedRep]) {
        repData[opp.assignedRep].total += 1;
        
        if (opp.status === 'Won') {
          repData[opp.assignedRep].won += 1;
          repData[opp.assignedRep].revenue += opp.amount;
        }
      }
    });

    // Calculate derived metrics and ensure we have data
    const performanceData = Object.values(repData).map(rep => ({
      ...rep,
      winRate: rep.total > 0 ? ((rep.won / rep.total) * 100).toFixed(1) : '0.0',
      avgDealSize: rep.won > 0 ? Math.round(rep.revenue / rep.won) : 0
    }));

    // Filter out reps with no activity to show meaningful data
    return performanceData.filter(rep => rep.total > 0);
  }

  // Calculate KPIs
  calculateKPIs(filteredOpportunities) {
    const total = filteredOpportunities.length;
    const won = filteredOpportunities.filter(opp => opp.status === 'Won').length;
    const lost = filteredOpportunities.filter(opp => opp.status === 'Lost').length;
    const open = filteredOpportunities.filter(opp => opp.status === 'Open').length;
    
    const totalClosed = won + lost;
    const totalRevenue = filteredOpportunities
      .filter(opp => opp.status === 'Won')
      .reduce((sum, opp) => sum + opp.amount, 0);
    
    const avgDealSize = won > 0 ? totalRevenue / won : 0;
    const conversionRate = totalClosed > 0 ? (won / totalClosed) * 100 : 0;
    
    // Calculate average sales cycle for won deals
    const wonDealsWithDates = filteredOpportunities.filter(opp => 
      opp.status === 'Won' && opp.actualCloseDate && opp.createdDate
    );
    
    const avgSalesCycle = wonDealsWithDates.length > 0 ? wonDealsWithDates
      .reduce((sum, opp) => {
        const created = new Date(opp.createdDate);
        const closed = new Date(opp.actualCloseDate);
        return sum + Math.abs((closed - created) / (1000 * 60 * 60 * 24));
      }, 0) / wonDealsWithDates.length : 0;

    return {
      total,
      won,
      lost,
      open,
      totalRevenue,
      avgDealSize,
      conversionRate,
      avgSalesCycle: Math.round(avgSalesCycle)
    };
  }

  // Get all sales reps
  getSalesReps() {
    return this.salesReps;
  }

  // Get all opportunities
  getAllOpportunities() {
    return this.opportunities;
  }
}

const mockSalesDataService = new MockSalesDataService();
export default mockSalesDataService;
