class BenchmarksService {
  constructor() {
    // Industry benchmarks for sales stages (in days)
    this.stageBenchmarks = {
      '1st Demo': 7,
      'Discovery': 21,
      'Proposal': 14,
      'Negotiation': 10,
      'Qualification': 14,
      'Needs Analysis': 18,
      'Closed Won': 0,
      'Closed Lost': 0
    };

    // Default quota targets for new reps
    this.defaultRepQuotas = {
      'monthly-quota': 250000,    // Monthly target per rep
      'quarterly-quota': 750000,  // Quarterly target per rep
      'annual-quota': 3000000     // Annual target per rep
    };

    // Individual sales rep quota targets
    this.individualRepQuotas = {
      'John Smith': {
        'monthly-quota': 300000,
        'quarterly-quota': 900000,
        'annual-quota': 3600000
      },
      'Sarah Johnson': {
        'monthly-quota': 275000,
        'quarterly-quota': 825000,
        'annual-quota': 3300000
      },
      'Mike Davis': {
        'monthly-quota': 225000,
        'quarterly-quota': 675000,
        'annual-quota': 2700000
      }
    };

    // Performance thresholds for rep evaluation
    this.performanceThresholds = {
      'minimum': 80,     // % of quota for minimum acceptable performance
      'target': 100,     // % of quota for target performance
      'excellent': 120   // % of quota for excellent performance
    };

    // Activity benchmarks per rep per month
    this.activityBenchmarks = {
      'calls-per-month': 150,        // Outbound calls per month
      'meetings-per-month': 20,      // Meetings/demos per month
      'proposals-per-month': 8,      // Proposals submitted per month
      'pipeline-coverage': 3.5       // Pipeline value as multiple of quota
    };

    // Revenue benchmarks (deal size categories)
    this.revenueBenchmarks = {
      low: 25000,      // Small deal threshold
      medium: 100000,  // Medium deal threshold
      high: 500000     // Large deal threshold
    };

    // Pipeline benchmarks (company-wide targets)
    this.pipelineBenchmarks = {
      minimum: 5000000,   // Minimum pipeline value
      target: 8000000,    // Target pipeline value
      stretch: 12000000   // Stretch pipeline goal
    };

    // Win rate benchmarks
    this.winRateBenchmarks = {
      target: 25,
      industry: 22,
      excellent: 30
    };

    // Sales cycle benchmarks
    this.salesCycleBenchmarks = {
      target: 45,
      industry: 52,
      excellent: 35
    };
  }

  getBenchmarks() {
    return {
      stages: this.stageBenchmarks,
      metrics: {
        revenue: this.revenueBenchmarks,
        pipeline: this.pipelineBenchmarks,
        winRate: this.winRateBenchmarks,
        salesCycle: this.salesCycleBenchmarks
      },
      defaultQuotas: this.defaultRepQuotas,
      individualQuotas: this.individualRepQuotas,
      performance: this.performanceThresholds,
      activities: this.activityBenchmarks
    };
  }

  // Individual rep quota methods
  getRepQuota(repName, period) {
    if (this.individualRepQuotas[repName]) {
      return this.individualRepQuotas[repName][period] || this.defaultRepQuotas[period];
    }
    return this.defaultRepQuotas[period];
  }

  setRepQuota(repName, period, amount) {
    if (!this.individualRepQuotas[repName]) {
      this.individualRepQuotas[repName] = { ...this.defaultRepQuotas };
    }
    this.individualRepQuotas[repName][period] = parseFloat(amount) || 0;
  }

  addNewRep(repName) {
    if (!this.individualRepQuotas[repName]) {
      this.individualRepQuotas[repName] = { ...this.defaultRepQuotas };
    }
  }

  removeRep(repName) {
    delete this.individualRepQuotas[repName];
  }

  getAllReps() {
    return Object.keys(this.individualRepQuotas);
  }

  saveBenchmarks(benchmarks) {
    if (benchmarks.stages) {
      this.stageBenchmarks = { ...benchmarks.stages };
    }
    if (benchmarks.metrics) {
      if (benchmarks.metrics.revenue) {
        this.revenueBenchmarks = { ...benchmarks.metrics.revenue };
      }
      if (benchmarks.metrics.pipeline) {
        this.pipelineBenchmarks = { ...benchmarks.metrics.pipeline };
      }
      if (benchmarks.metrics.winRate) {
        this.winRateBenchmarks = { ...benchmarks.metrics.winRate };
      }
      if (benchmarks.metrics.salesCycle) {
        this.salesCycleBenchmarks = { ...benchmarks.metrics.salesCycle };
      }
    }
    if (benchmarks.defaultQuotas) {
      this.defaultRepQuotas = { ...benchmarks.defaultQuotas };
    }
    if (benchmarks.individualQuotas) {
      this.individualRepQuotas = { ...benchmarks.individualQuotas };
    }
    if (benchmarks.performance) {
      this.performanceThresholds = { ...benchmarks.performance };
    }
    if (benchmarks.activities) {
      this.activityBenchmarks = { ...benchmarks.activities };
    }
  }

  resetToDefaults() {
    this.stageBenchmarks = {
      '1st Demo': 7,
      'Discovery': 21,
      'Proposal': 14,
      'Negotiation': 10,
      'Qualification': 14,
      'Needs Analysis': 18,
      'Closed Won': 0,
      'Closed Lost': 0
    };

    this.defaultRepQuotas = {
      'monthly-quota': 250000,
      'quarterly-quota': 750000,
      'annual-quota': 3000000
    };

    this.individualRepQuotas = {
      'John Smith': {
        'monthly-quota': 300000,
        'quarterly-quota': 900000,
        'annual-quota': 3600000
      },
      'Sarah Johnson': {
        'monthly-quota': 275000,
        'quarterly-quota': 825000,
        'annual-quota': 3300000
      },
      'Mike Davis': {
        'monthly-quota': 225000,
        'quarterly-quota': 675000,
        'annual-quota': 2700000
      }
    };

    this.performanceThresholds = {
      'minimum': 80,
      'target': 100,
      'excellent': 120
    };

    this.activityBenchmarks = {
      'calls-per-month': 150,
      'meetings-per-month': 20,
      'proposals-per-month': 8,
      'pipeline-coverage': 3.5
    };

    this.revenueBenchmarks = {
      low: 25000,
      medium: 100000,
      high: 500000
    };

    this.pipelineBenchmarks = {
      minimum: 5000000,
      target: 8000000,
      stretch: 12000000
    };

    this.winRateBenchmarks = {
      target: 25,
      industry: 22,
      excellent: 30
    };

    this.salesCycleBenchmarks = {
      target: 45,
      industry: 52,
      excellent: 35
    };
  }

  // Legacy methods for backward compatibility
  getIndustryBenchmark(stage) {
    return this.stageBenchmarks[stage] || 15;
  }

  getAllBenchmarks() {
    return { ...this.stageBenchmarks };
  }

  updateBenchmark(stage, days) {
    if (typeof days === 'number' && days >= 0) {
      this.stageBenchmarks[stage] = days;
    }
  }

  getQuotaForPeriod(period) {
    return this.defaultRepQuotas[period] || 3000000;
  }

  getRevenueBenchmarks() {
    return { ...this.revenueBenchmarks };
  }

  getPipelineBenchmarks() {
    return { ...this.pipelineBenchmarks };
  }

  getWinRateBenchmarks() {
    return { ...this.winRateBenchmarks };
  }

  getSalesCycleBenchmarks() {
    return { ...this.salesCycleBenchmarks };
  }
}

const benchmarksService = new BenchmarksService();
export default benchmarksService;
