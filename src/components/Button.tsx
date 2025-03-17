
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "transition-all duration-200 ease-out inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          
          // Variants
          variant === 'default' && "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
          variant === 'primary' && "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]",
          variant === 'secondary' && "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
          variant === 'outline' && "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
          variant === 'ghost' && "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
          variant === 'link' && "text-primary underline-offset-4 hover:underline",
          
          // Sizes
          size === 'default' && "h-10 px-4 py-2 text-sm",
          size === 'sm' && "h-9 px-3 text-xs rounded-md",
          size === 'lg' && "h-11 px-8 rounded-md",
          size === 'icon' && "h-10 w-10",
          
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
