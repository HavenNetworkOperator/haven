import Link from "next/link";
import { getSession } from "@/lib/auth";
import { findAccountById } from "@/lib/db";
import { formatDateLong } from "@/lib/format";
import styles from "./page.module.css";

export const dynamic = "force-dynamic"; // session lookup is per-request

export default async function Account() {
  const session = await getSession();
  const account = session ? await findAccountById(session.accountId) : null;

  if (!account) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <span className="section-label">Account</span>
          <h1 className={styles.title}>
            Sign in to <em>see your account</em>.
          </h1>
        </header>
        <p className={styles.signedOutLede}>
          Haven uses sign-in links instead of passwords. Pop in your email, click the link
          we send, and you&rsquo;re in.
        </p>
        <div className={styles.actions}>
          <Link href="/sign-in" className={styles.signInBtn}>
            Sign in →
          </Link>
        </div>
      </div>
    );
  }

  // Notification prefs are still hard-coded until we add the
  // `account_preferences` table in a follow-up migration.
  const notifications = { weeklyDigest: true, pushAlerts: true, councilUpdates: true };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className="section-label">Account</span>
        <h1 className={styles.title}>
          The bits you <em>set once</em>.
        </h1>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile</h2>
        <ul className="deflist">
          <li>
            <span className="label">Email</span>
            <span className="value">{account.email}</span>
            <span className="aside">Verified · sign-in link</span>
          </li>
          <li>
            <span className="label">Last signed in</span>
            <span className="value">{formatDateLong(account.last_signed_in_at)}</span>
          </li>
          <li>
            <span className="label">Founding member</span>
            <span className="value">
              {account.founding_member ? (
                <span className="pill on">Founding</span>
              ) : (
                <span className="pill">Standard</span>
              )}
            </span>
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Notifications</h2>
        <p className={styles.sectionLead}>
          What lands in your inbox or on your phone. Nothing here is on by default that
          we wouldn&rsquo;t want from a service we used ourselves.
        </p>
        <ul className={styles.toggles}>
          <Toggle
            on={notifications.weeklyDigest}
            title="Weekly digest"
            sub="Tuesday morning email — the broadsheet, one per child, one shared. The thing /digest links from."
          />
          <Toggle
            on={notifications.pushAlerts}
            title="Safety alerts"
            sub="A push notification when an alert lands — never with details, only a prompt to open the dashboard."
          />
          <Toggle
            on={notifications.councilUpdates}
            title="Council updates"
            sub="Founding-member only — the build roadmap, vote tallies, and pre-launch updates from the team."
          />
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sign-in</h2>
        <p className={styles.sectionLead}>
          Haven uses sign-in links sent to your email instead of passwords. If you lose
          access to your inbox, ring us — we&rsquo;ll verify another way.
        </p>
        <div className={styles.actions}>
          <form action="/api/auth/sign-out" method="POST">
            <button type="submit" className="btn-ghost btn-danger">
              Sign out
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function Toggle({ on, title, sub }: { on: boolean; title: string; sub: string }) {
  return (
    <li className={styles.toggle}>
      <div className={styles.toggleText}>
        <span className={styles.toggleTitle}>{title}</span>
        <span className={styles.toggleSub}>{sub}</span>
      </div>
      <span
        className={`${styles.switch} ${on ? styles.switchOn : ""}`}
        role="switch"
        aria-checked={on}
        aria-disabled="true"
        aria-label={title}
      >
        <span className={styles.switchKnob} />
      </span>
    </li>
  );
}
