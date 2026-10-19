export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bh-container flex min-h-[60vh] flex-col items-center justify-center py-20"
    >
      <svg viewBox="0 0 120 120" className="h-16 w-16" fill="none" aria-hidden="true">
        <circle cx="60" cy="60" r="54" stroke="#e8d3ba" strokeWidth="3" />
        <g className="bh-preloader-rotate">
          <path
            d="M78 26c-15-7-31-2-39 10-9 13-5 31 9 38 13 7 29 2 35-11 2-5 3-10 2-15-6 9-19 12-28 5-9-7-10-20-3-28 5-6 14-8 21-4l3-5Z"
            fill="#ed0121"
          />
          <path d="M84 22l4 8 8 3-7 5 1 9-7-4-8 4 2-9-6-6 9-2 4-8Z" fill="#f0a830" />
        </g>
      </svg>
      <p className="mt-4 text-xs uppercase tracking-[0.22em] text-bethel-clay-soft">
        Preparing the counter
      </p>
    </div>
  );
}
