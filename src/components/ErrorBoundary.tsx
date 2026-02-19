import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled render error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1B2B1B] flex items-center justify-center p-6">
          <div className="max-w-md rounded-2xl border-2 border-[#3a4a3a] bg-[#243824] p-6 text-center">
            <h1 className="font-display text-2xl text-[#F3EFE6] mb-2">Something went wrong</h1>
            <p className="text-[#B8C1B8] text-sm">
              Refresh the page to continue. If the problem persists, contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
