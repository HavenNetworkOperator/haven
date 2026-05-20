import Link from "next/link";
import styles from "./layout.module.css";

// Minimal child-facing layout. No parent nav, no admin chrome. The child
// reached this via a bookmark or QR on their device; possession of the
// token is the only credential.
export default function MeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.head}>
        <Link href="#" className={styles.brand} aria-label="Haven">
          <span className={styles.mark} aria-hidden="true" />
          <span className={styles.wordmark}>Haven</span>
        </Link>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.foot}>
        <p>
          This page is yours. Your parents see a short summary every Tuesday — not your messages,
          not what you searched.
        </p>
      </footer>
    </div>
  );
}
