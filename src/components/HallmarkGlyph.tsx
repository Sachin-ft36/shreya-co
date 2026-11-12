/** Geometric four-point architectural atelier hallmark seal. */
export function HallmarkGlyph({
  className = 'w-3 h-3 text-[#BC8379]'
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 1L9.6 6.4L15 8L9.6 9.6L8 15L6.4 9.6L1 8L6.4 6.4L8 1Z"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <circle cx="8" cy="8" r="1.4" fill="currentColor" />
    </svg>
  );
}

