import Link from "next/link";

export default function Header() {
  return (
    <header className="container">
      <nav className="nav" aria-label="Primary">
        <Link href="/" className="logo" aria-label="Haven home">
          <span className="logo-mark" aria-hidden="true" />
          <span>Haven</span>
        </Link>
        <div className="nav-right">
          <Link href="/family" className="nav-link">
            Family
          </Link>
          <Link href="/council" className="nav-link">
            Council
          </Link>
          <Link href="/account" className="nav-link">
            Account
          </Link>
        </div>
      </nav>
    </header>
  );
}
