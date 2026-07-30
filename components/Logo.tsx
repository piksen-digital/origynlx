import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="OrigynLX" className={`flex items-baseline gap-1 z-50 ${className}`}>
      <span
        className="text-lg text-paper"
        style={{ fontFamily: "var(--font-serif)", fontWeight: 500, letterSpacing: "-0.015em" }}
      >
        Origyn
      </span>
      <span
        className="text-lg text-paper/60"
        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500, letterSpacing: "-0.015em" }}
      >
        LX
      </span>
    </Link>
  );
}
