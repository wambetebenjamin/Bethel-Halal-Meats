type Props = {
  className?: string;
  title?: string;
};

/**
 * Bethel Halal Meats mark. A geometric seal holding a cleaver and a crescent,
 * drawn from simple arcs and straight cuts, in the template red.
 */
export function BrandMark({ className = "h-11 w-11", title = "Bethel Halal Meats" }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22.5" stroke="#ed0121" strokeWidth="2.2" fill="#fff8ee" />
      <path
        d="M30.5 10.5c-4.7-2.1-9.9-.9-12.7 2.6-3 3.7-2.6 9.2.9 12.3 3.4 3 8.8 2.8 11.9-.5.8-.9 1.4-1.9 1.8-3-2.7 1.9-6.4 1.6-8.6-.9-2.2-2.5-2.1-6.2.2-8.6 1.9-2 4.9-2.6 6.5-1.9Z"
        fill="#212d39"
      />
      <rect x="18" y="27.2" width="12.4" height="9.6" rx="2.2" transform="rotate(-12 18 27.2)" fill="#ed0121" />
      <rect x="28.4" y="25.6" width="3.4" height="12.6" rx="1.7" transform="rotate(-12 28.4 25.6)" fill="#5b3a28" />
    </svg>
  );
}

export function CleaverIcon({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 15h20a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H14a6 6 0 0 1-6-6v-8Z"
        stroke="#ed0121"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M8 24h24" stroke="#ed0121" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="15" cy="19" r="1.8" fill="#ed0121" />
      <path
        d="M32 21h4.5a2.5 2.5 0 0 1 2.5 2.5V30a3 3 0 0 1-3 3H32"
        stroke="#212d39"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
