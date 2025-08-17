import { Link } from 'wouter';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  href?: string;
  clickable?: boolean;
}

export function Logo({ className = "", size = 'md', showText = true, href = "/", clickable = true }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const content = (
    <>
      <span className={`font-bold text-forest ${sizeClasses[size]}`}>
        RÜTZ🌿
      </span>
      {showText && size === 'lg' && (
        <span className="text-sm text-sage ml-2 hidden sm:inline">
          Indigenous Botanical Wisdom
        </span>
      )}
    </>
  );

  if (clickable) {
    return (
      <Link href={href} className={`inline-flex items-center space-x-1 hover:opacity-80 transition-opacity ${className}`} data-testid="logo-link">
        {content}
      </Link>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      {content}
    </div>
  );
}