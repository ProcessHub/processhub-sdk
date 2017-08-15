export const ComponentTypes = {
  ProcessView: "process-view",
  ProcessTab: "process-tab",
  ProcessEdit: "process-edit",

  UserTask: "user-task",
  ServiceTask: "service-task",
  Gateway: "gateway"
};
export type ComponentTypes = keyof typeof ComponentTypes;

export const ServiceTaskState = {
  Completed: "completed",
  Running: "running",
  Failed: "failed"
};
export type ServiceTaskState = keyof typeof ServiceTaskState;