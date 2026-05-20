import styles from "./page.module.css";

// Placeholder account. Pulled from Postgres `accounts` once magic-link
// auth lands. See plan §MVP phase.
const account = {
  email: "alex.bowdler@example.com",
  signedInAt: "Mon 19 May, 06:42",
  foundingMember: true,
  foundingTier: "Full Family",
  notifications: {
    weeklyDigest: true,
    pushAlerts: true,
    councilUpdates: true,
  },
};

export default function Account() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className="section-label">Account</span>
        <h1 className={styles.title}>
          The bits you <em>set once</em>.
        </h1>
      </header>

      {/* PROFILE */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile</h2>
        <ul className="deflist">
          <li>
            <span className="label">Email</span>
            <span className="value">{account.email}</span>
            <button type="button" className="btn-ghost" disabled aria-disabled="true">
              Change
            </button>
          </li>
          <li>
            <span className="label">Last signed in</span>
            <span className="value">{account.signedInAt}</span>
            <span className="aside">From this browser</span>
          </li>
          <li>
            <span className="label">Founding member</span>
            <span className="value">
              {account.foundingMember ? (
                <span className="pill on">{account.foundingTier}</span>
              ) : (
                <span className="pill">Standard</span>
              )}
            </span>
          </li>
        </ul>
      </section>

      {/* NOTIFICATIONS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Notifications</h2>
        <p className={styles.sectionLead}>
          What lands in your inbox or on your phone. Nothing here is on by default that
          we wouldn&rsquo;t want from a service we used ourselves.
        </p>
        <ul className={styles.toggles}>
          <Toggle
            on={account.notifications.weeklyDigest}
            title="Weekly digest"
            sub="Tuesday morning email — the broadsheet, one per child, one shared. The thing /digest links from."
          />
          <Toggle
            on={account.notifications.pushAlerts}
            title="Safety alerts"
            sub="A push notification when an alert lands — never with details, only a prompt to open the dashboard."
          />
          <Toggle
            on={account.notifications.councilUpdates}
            title="Council updates"
            sub="Founding-member only — the build roadmap, vote tallies, and pre-launch updates from the team."
          />
        </ul>
      </section>

      {/* MAGIC LINK + SIGN OUT */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sign-in</h2>
        <p className={styles.sectionLead}>
          Haven uses sign-in links sent to your email instead of passwords. If you lose
          access to your inbox, ring us — we&rsquo;ll verify another way.
        </p>
        <div className={styles.actions}>
          <button type="button" className="btn-ghost" disabled aria-disabled="true">
            Send sign-in link
          </button>
          <button type="button" className="btn-ghost btn-danger" disabled aria-disabled="true">
            Sign out
          </button>
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
