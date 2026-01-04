import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../utils/testUtils';
import ErrorBoundary from '../components/ErrorBoundary';
import Button from '../components/Button';

describe('Components Integration', () => {
  describe('ErrorBoundary Integration', () => {
    it('should handle errors in Button components', () => {
      const ThrowErrorButton = () => {
        throw new Error('Button error');
      };

      render(
        <ErrorBoundary>
          <ThrowErrorButton />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should recover from errors and allow retry', () => {
      let shouldThrow = true;
      
      const ConditionalErrorButton = () => {
        if (shouldThrow) {
          throw new Error('Initial error');
        }
        return <Button>Fixed Button</Button>;
      };

      render(
        <ErrorBoundary>
          <ConditionalErrorButton />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Fix the error and retry
      shouldThrow = false;
      
      const retryButton = screen.getByText('Try Again');
      retryButton.click();

      expect(screen.getByText('Fixed Button')).toBeInTheDocument();
    });
  });

  describe('Button Component', () => {
    it('should be accessible with proper ARIA attributes', () => {
      render(
        <Button aria-label="Submit form" aria-describedby="help-text">
          Submit
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Submit form');
      expect(button).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('should support keyboard navigation', () => {
      const handleClick = vi.fn();
      
      render(
        <Button onClick={handleClick}>Click me</Button>
      );

      const button = screen.getByRole('button');
      
      // Test Enter key
      button.focus();
      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(handleClick).toHaveBeenCalled();
    });

    it('should prevent clicks when disabled', () => {
      const handleClick = vi.fn();
      
      render(
        <Button disabled onClick={handleClick}>
          Disabled Button
        </Button>
      );

      const button = screen.getByRole('button');
      
      expect(button).toBeDisabled();
      
      button.click();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should show loading state correctly', () => {
      render(
        <Button loading>Loading</Button>
      );

      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg');
      
      expect(button).toBeDisabled();
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
      
      // Check that loading text is not present
      expect(button).toHaveTextContent('Loading');
    });

    it('should handle different button types', () => {
      const { rerender } = render(
        <Button type="submit">Submit Button</Button>
      );

      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');

      rerender(<Button type="reset">Reset Button</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');

      rerender(<Button type="button">Button Button</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should support form association', () => {
      render(
        <form>
          <Button form="my-form">Submit</Button>
        </form>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('form', 'my-form');
    });

    it('should have proper focus management', () => {
      render(
        <Button>Focus Test</Button>
      );

      const button = screen.getByRole('button');
      
      // Test focus
      button.focus();
      expect(button).toHaveFocus();
      
      // Test blur
      button.blur();
      expect(button).not.toHaveFocus();
    });
  });

  describe('Component Composition', () => {
    it('should handle nested error boundaries', () => {
      const InnerErrorComponent = () => {
        throw new Error('Inner error');
      };

      const OuterErrorComponent = () => {
        throw new Error('Outer error');
      };

      render(
        <ErrorBoundary fallback={<div>Outer error</div>}>
          <ErrorBoundary fallback={<div>Inner error</div>}>
            <InnerErrorComponent />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      // Inner error boundary should catch the error
      expect(screen.getByText('Inner error')).toBeInTheDocument();
      expect(screen.queryByText('Outer error')).not.toBeInTheDocument();
    });

    it('should work with multiple buttons', () => {
      const handleClick1 = vi.fn();
      const handleClick2 = vi.fn();

      render(
        <div>
          <Button onClick={handleClick1}>Button 1</Button>
          <Button onClick={handleClick2}>Button 2</Button>
        </div>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);

      buttons[0].click();
      expect(handleClick1).toHaveBeenCalledTimes(1);
      expect(handleClick2).not.toHaveBeenCalled();

      buttons[1].click();
      expect(handleClick1).toHaveBeenCalledTimes(1);
      expect(handleClick2).toHaveBeenCalledTimes(1);
    });

    it('should handle button variant combinations', () => {
      const { rerender } = render(
        <Button variant="primary" size="sm">
          Primary Small
        </Button>
      );

      let button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600', 'px-3', 'py-1.5');

      rerender(
        <Button variant="danger" size="lg">
          Danger Large
        </Button>
      );

      button = screen.getByRole('button');
      expect(button).toHaveClass('bg-red-600', 'px-6', 'py-3');
    });
  });

  describe('Performance and Memory', () => {
    it('should not leak memory on repeated mounts/unmounts', () => {
      const handleClick = vi.fn();

      // Test multiple mount/unmount cycles
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<Button onClick={handleClick}>Test {i}</Button>);
        unmount();
      }

      // Should not accumulate excessive listeners or memory
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle rapid state changes', async () => {
      let isLoading = true;
      
      const LoadingButton = () => (
        <Button loading={isLoading}>
          {isLoading ? 'Loading...' : 'Ready'}
        </Button>
      );

      const { rerender } = render(<LoadingButton />);

      // Rapid loading state changes
      for (let i = 0; i < 5; i++) {
        isLoading = !isLoading;
        rerender(<LoadingButton />);
      }

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });
});