type BrandLogoProps = {
  compact?: boolean;
  light?: boolean;
  className?: string;
};

export default function BrandLogo({
  compact = false,
  light = false,
  className = "",
}: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-9 w-9 shrink-0"
      >
        <rect width="40" height="40" rx="12" fill="currentColor" />
        <path
          d="M11.5 26.6V15.3c0-1.13.92-2.05 2.05-2.05h5.02c1.13 0 2.05.92 2.05 2.05v11.3M9 27.5h22M16.2 19.1h.1M23.7 19.1h.1M16.2 23.2h.1M23.7 23.2h.1"
          stroke="white"
          strokeWidth="2.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {!compact && (
        <span className={`font-brand text-[1.35rem] tracking-[-0.045em] ${light ? "text-white" : "text-primary"}`}>
          CompanyI
        </span>
      )}
    </div>
  );
}
