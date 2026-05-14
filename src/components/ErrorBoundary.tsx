import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full space-y-6">
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-text-primary text-2xl font-bold">System Failure Detected</h1>
              <p className="text-text-secondary text-sm">
                An unexpected error occurred within the application core. 
                Our monitoring systems have been notified.
              </p>
            </div>
            <div className="p-4 bg-brand-surface border border-brand-border rounded-xl text-left overflow-hidden">
              <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-2">Error Context</p>
              <code className="text-xs text-red-400 break-all">{this.state.error?.message}</code>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/40"
            >
              <RefreshCcw size={18} />
              Reboot Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
