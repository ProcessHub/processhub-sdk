interface INotification {
  close(): void;
}

interface IHtml5DesktopNotifications {
  PERMISSION_DEFAULT: string;
  PERMISSION_GRANTED: string;
  PERMISSION_DENIED: string;
  isSupported: boolean;
  permissionLevel(): string;
  requestPermission(callback?: () => void): void;
  createNotification(title: string, options?: {
    body: string;
    icon: string;
    tag?: string;
  }): INotification;
}

let notify: IHtml5DesktopNotifications;

if (typeof window !== "undefined") {
  // tslint:disable-next-line:no-var-requires
  /*const notifyPackage: {} = */ require("html5-desktop-notifications");
  // tslint:disable-next-line:no-any
  notify = (window as any).notify as IHtml5DesktopNotifications;
}

export function requestPermission(): void {
  if (notify.isSupported) {
    const permissionLevel: string = notify.permissionLevel();
    if (permissionLevel === notify.PERMISSION_DEFAULT) {
      notify.requestPermission();
    }
  }
}

let lastNotificationSentAt: number = new Date().getTime();
const notificationInterval: number = 15000;

export function sendNotification(title: string, body: string): void {
  if (notify.isSupported
    && notify.permissionLevel() === notify.PERMISSION_GRANTED) {
    const timeNow: number = new Date().getTime();
    if (timeNow - lastNotificationSentAt >= notificationInterval) {
      lastNotificationSentAt = timeNow;
      notify.createNotification(title, {
        body,
        icon: "/favicon.ico",
      });
    }
  }
}
