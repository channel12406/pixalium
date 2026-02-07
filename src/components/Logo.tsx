import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <Link to="/" className="flex items-center gap-2">
      <img 
        src="https://image.noelshack.com/fichiers/2026/06/5/1770415745-logo.png" 
        alt="PixaliumDigital Logo"
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          // Fallback to text logo if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          target.nextElementSibling?.classList.remove("hidden");
        }}
      />
      {/* Fallback text logo */}
      <div className={`${sizeClasses[size]} rounded-lg bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground text-sm hidden`}>
        P
      </div>
      {showText && (
        <span className="font-display font-bold text-lg text-foreground">
          Pixalium<span className="text-gradient">Digital</span>
        </span>
      )}
    </Link>
  );
}