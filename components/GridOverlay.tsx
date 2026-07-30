export default function GridOverlay({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 z-[1] pointer-events-none grid-overlay opacity-40 ${className}`}
    />
  );
}
