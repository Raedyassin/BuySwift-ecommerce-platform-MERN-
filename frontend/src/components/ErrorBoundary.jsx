import { Component } from "react";
import ErrorBoundaryMessage from "./ErrorBoundaryMessage";

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Dream Market Error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryMessage handleRetry={this.handleRetry}/>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

// This is an error boundary in React. It catches JavaScript errors 
// in its child components and displays a fallback UI instead of crashing 
// the entire app.


// Key Notes
// Class Component Requirement: Error boundaries must be class components 
// (not functional components).

// Error Scope: Catches errors in:
  // Rendering logic.
  // Lifecycle methods (e.g., componentDidMount).
  // Constructors of child components.
  
// Does NOT Catch:
  // Event handlers (use try/catch).
  // Asynchronous code (e.g., setTimeout, fetch).
  // Errors in the error boundary itself.

