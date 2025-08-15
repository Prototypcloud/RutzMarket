import { Link } from 'wouter';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className = "", size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <Link href="/" className={`inline-flex items-center space-x-1 hover:opacity-80 transition-opacity ${className}`} data-testid="logo-link">
      <span className={`font-bold text-forest ${sizeClasses[size]}`}>
        RÜTZ🌿
      </span>
      {showText && size === 'lg' && (
        <span className="text-sm text-sage ml-2 hidden sm:inline">
          Indigenous Botanical Wisdom
        </span>
      )}
    </Link>
  );
}