import Link from "next/link";

// Minimal header for sales / public pages (the /plans page today, the
// future /setup wizard tomorrow). No Family/Council/Account nav — those
// belong to a signed-in parent. Sign-in link stubbed until magic-link
// auth lands.
export default function PublicHeader() {
  return (
    <header className="container">
      <nav className="nav" aria-label="Primary">
        <Link href="/plans" className="logo" aria-label="Haven plans">
          <span className="logo-mark" aria-hidden="true" />
          <span>Haven</span>
        </Link>
        <div className="nav-right">
          <a className="nav-link" href="https://gethavenmobile.com" aria-label="Back to gethavenmobile.com">
            Home
          </a>
          <Link href="/account" className="nav-link" aria-disabled="true">
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}
