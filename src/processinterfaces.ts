
export interface ProcessDetailsShort {
  processId: string;
  name: string;
}

export interface ProcessStatistics {
  openTasksTotal: number;
  openTasksOnTime: number;
  openTasksWarning: number;
  openTasksAlert: number;
}