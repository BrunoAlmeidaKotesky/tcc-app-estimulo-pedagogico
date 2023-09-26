"use client";
import React, { Component } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: React.ErrorInfo | null;
  error: Error | null;
}

class ErrorBoundary extends Component<{}, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorInfo: null,
    error: null,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Atualiza o estado para que a próxima renderização mostre a UI alternativa
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Você também pode registrar o erro em um serviço de relatório de erros
    console.error("Caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI alternativa
      return (
        <div>
          <h1>Algo deu errado.</h1>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </details>
        </div>
      );
    }
    //@ts-ignore
    return this.props.children;
  }
}

export default ErrorBoundary;
