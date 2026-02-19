const MONITORING_ENDPOINT = import.meta.env.VITE_MONITORING_ENDPOINT;

const reportError = (payload: Record<string, unknown>) => {
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

export const initMonitoring = () => {
  window.addEventListener("error", (event) => {
    reportError({
      type: "window_error",
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

    reportError({
      type: "unhandled_rejection",
      reason,
    });
  });
};
