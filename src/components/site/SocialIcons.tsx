// Brand glyphs as inline SVGs — lucide removed brand icons in v1.
type Props = { className?: string };

export function FacebookIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 9h2.5V6.5H14c-1.93 0-3.5 1.57-3.5 3.5v1.5H8.5V14h2V21H13v-7h2.2l.3-2.5H13V10c0-.55.45-1 1-1z" />
    </svg>
  );
}

export function InstagramIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.5 8.5A1.75 1.75 0 1 0 6.5 5a1.75 1.75 0 0 0 0 3.5zM5.25 10h2.5v9h-2.5v-9zM10 10h2.4v1.23h.03c.33-.6 1.15-1.23 2.37-1.23 2.53 0 3 1.6 3 3.68V19h-2.5v-3.8c0-.9-.02-2.06-1.3-2.06-1.3 0-1.5 1-1.5 2v3.86H10v-9z" />
    </svg>
  );
}

export function YoutubeIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.2 8.1c-.2-.9-.9-1.6-1.8-1.8C17.8 6 12 6 12 6s-5.8 0-7.4.3c-.9.2-1.6.9-1.8 1.8C2.5 9.7 2.5 12 2.5 12s0 2.3.3 3.9c.2.9.9 1.6 1.8 1.8C6.2 18 12 18 12 18s5.8 0 7.4-.3c.9-.2 1.6-.9 1.8-1.8.3-1.6.3-3.9.3-3.9s0-2.3-.3-3.9zM10.2 14.5v-5l4.3 2.5-4.3 2.5z" />
    </svg>
  );
}

export function XIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.5 3h3l-6.6 7.5L21.7 21h-5.9l-4.2-5.5L6.6 21H3.5l7-8L2.8 3h6l3.8 5 4.9-5zm-1 16h1.6L8 4.6H6.3L16.5 19z" />
    </svg>
  );
}
