const MONITORING_ENDPOINT = import.meta.env.VITE_MONITORING_ENDPOINT;
const APP_ENV = import.meta.env.VITE_APP_ENV ?? "development";
const APP_RELEASE = import.meta.env.VITE_APP_RELEASE ?? "unknown";

interface MonitoringPayload {
  type: string;
  timestamp: string;
  environment: string;
  release: string;
  route: string;
  metadata?: Record<string, unknown>;
}

const report = (payload: MonitoringPayload) => {
  if (!MONITORING_ENDPOINT) {
    return;
  }

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(MONITORING_ENDPOINT, body);
    return;
  }

  void fetch(MONITORING_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
};

const buildBasePayload = (type: string, metadata?: Record<string, unknown>): MonitoringPayload => ({
  type,
  timestamp: new Date().toISOString(),
  environment: APP_ENV,
  release: APP_RELEASE,
  route: window.location.pathname,
  metadata,
});

export const trackEvent = (type: string, metadata?: Record<string, unknown>) => {
  report(buildBasePayload(type, metadata));
};

export const initMonitoring = () => {
  window.addEventListener("error", (event) => {
    trackEvent("window_error", {
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason =
      event.reason instanceof Error
        ? event.reason.message
        : typeof event.reason === "string"
          ? event.reason
          : "Unknown rejection";

    trackEvent("unhandled_rejection", { reason });
  });
};
