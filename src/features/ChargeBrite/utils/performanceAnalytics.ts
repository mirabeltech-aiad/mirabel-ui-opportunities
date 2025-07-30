
export class PerformanceAnalytics {
  private static measurements: Map<string, number> = new Map();
  private static startTimes: Map<string, number> = new Map();
  private static apiCalls: Map<string, { start: number; end?: number }> = new Map();

  static startMeasurement(name: string) {
    const startTime = performance.now();
    this.startTimes.set(name, startTime);
    // Performance tracking - console logs removed for production
  }

  static endMeasurement(name: string) {
    const startTime = this.startTimes.get(name);
    if (!startTime) {
      return;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    this.measurements.set(name, duration);
    
    // Performance tracking - console logs removed for production
    // Keep warnings for slow operations
    if (duration > 1000) {
      console.warn(`Performance warning: ${name} took ${duration.toFixed(2)}ms (>1s)`);
    } else if (duration > 500) {
      console.warn(`Performance warning: ${name} took ${duration.toFixed(2)}ms (>500ms)`);
    }
  }

  static markStep(stepName: string) {
    const currentTime = performance.now();
    // Performance tracking - console logs removed for production
  }

  static trackApiCall(queryKey: string, isStarting: boolean = true) {
    const currentTime = performance.now();
    if (isStarting) {
      this.apiCalls.set(queryKey, { start: currentTime });
      // API tracking - console logs removed for production
    } else {
      const call = this.apiCalls.get(queryKey);
      if (call) {
        call.end = currentTime;
        const duration = currentTime - call.start;
        // API tracking - console logs removed for production
      }
    }
  }

  static logSummary() {
    console.group('📊 [PERF] Performance Summary');
    
    const totalTime = performance.now();
    console.log(`Total page load time: ${totalTime.toFixed(2)}ms`);
    
    const sortedMeasurements = Array.from(this.measurements.entries())
      .sort(([,a], [,b]) => b - a);
    
    console.log('\n🔧 Component Loading:');
    sortedMeasurements.forEach(([name, duration]) => {
      const percentage = ((duration / totalTime) * 100).toFixed(1);
      const status = duration > 1000 ? '🔴' : duration > 500 ? '🟡' : '🟢';
      console.log(`${status} ${name}: ${duration.toFixed(2)}ms (${percentage}%)`);
    });

    console.log('\n🌐 API Calls:');
    Array.from(this.apiCalls.entries()).forEach(([key, call]) => {
      if (call.end) {
        const duration = call.end - call.start;
        const status = duration > 2000 ? '🔴' : duration > 1000 ? '🟡' : '🟢';
        console.log(`${status} ${key}: ${duration.toFixed(2)}ms`);
      } else {
        console.log(`⏳ ${key}: Still loading...`);
      }
    });
    
    console.groupEnd();
  }

  static measureComponentRender<T extends (...args: any[]) => any>(
    componentName: string,
    component: T
  ): T {
    return ((...args: any[]) => {
      this.startMeasurement(`Component:${componentName}`);
      const result = component(...args);
      this.endMeasurement(`Component:${componentName}`);
      return result;
    }) as T;
  }

  static measureAsync<T>(name: string, asyncFn: () => Promise<T>): Promise<T> {
    this.startMeasurement(name);
    return asyncFn().finally(() => {
      this.endMeasurement(name);
    });
  }
}

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).PerfAnalytics = PerformanceAnalytics;
}
