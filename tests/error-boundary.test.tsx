import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../utils/testUtils';
import ErrorBoundary, { useErrorHandler, withErrorBoundary } from '../components/ErrorBoundary';

// Test component that throws an error
const ThrowErrorComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Test component with error handling
const ComponentWithErrorHandler = ({ shouldError = false }: { shouldError?: boolean }) => {
  const { captureError } = useErrorHandler();
  
  if (shouldError) {
    captureError(new Error('Handled error'));
  }
  
  return <div>Component with error handler</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as any).mockRestore();
  });

  it('should render children when there is no error', () => {
    const onError = vi.fn();
    
    render(
      <ErrorBoundary onError={onError}>
        <div>Test children</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test children')).toBeInTheDocument();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should catch and display error when child component throws', () => {
    const onError = vi.fn();
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We\'re sorry, but something unexpected happened. Our team has been notified.')).toBeInTheDocument();
    expect(onError).toHaveBeenCalled();
  });

  it('should display error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const details = screen.getByText('Error Details (Development Only)');
    expect(details).toBeInTheDocument();
    
    expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should hide error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Error Details (Development Only)')).not.toBeInTheDocument();
    expect(screen.getByText(/Error ID:/)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle retry functionality', () => {
    let shouldThrow = true;
    
    const TestComponent = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>Success after retry</div>;
    };

    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Stop throwing and retry
    shouldThrow = false;
    fireEvent.click(screen.getByText('Try Again'));

    expect(screen.getByText('Success after retry')).toBeInTheDocument();
  });

  it('should handle reload functionality', () => {
    const reloadSpy = vi.fn();
    Object.defineProperty(window.location, 'reload', {
      value: reloadSpy,
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Reload Page'));
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should use custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });
});

describe('useErrorHandler', () => {
  it('should capture and throw errors', () => {
    expect(() => {
      render(<ComponentWithErrorHandler shouldError={true} />);
    }).toThrow('Handled error');
  });

  it('should work normally when no error is captured', () => {
    render(<ComponentWithErrorHandler shouldError={false} />);
    
    expect(screen.getByText('Component with error handler')).toBeInTheDocument();
  });
});

describe('withErrorBoundary', () => {
  it('should wrap component with ErrorBoundary', () => {
    const WrappedComponent = withErrorBoundary(ThrowErrorComponent);
    
    render(<WrappedComponent shouldThrow={false} />);
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should catch errors in wrapped component', () => {
    const WrappedComponent = withErrorBoundary(ThrowErrorComponent);
    
    render(<WrappedComponent shouldThrow={true} />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should use custom fallback in HOC', () => {
    const customFallback = <div>HOC Custom error</div>;
    const WrappedComponent = withErrorBoundary(ThrowErrorComponent, customFallback);
    
    render(<WrappedComponent shouldThrow={true} />);
    
    expect(screen.getByText('HOC Custom error')).toBeInTheDocument();
  });

  it('should call custom onError in HOC', () => {
    const onError = vi.fn();
    const WrappedComponent = withErrorBoundary(ThrowErrorComponent, undefined, onError);
    
    render(<WrappedComponent shouldThrow={true} />);
    
    expect(onError).toHaveBeenCalled();
  });
});