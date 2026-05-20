import { notFound } from "next/navigation";
import PhoneSummary from "@/_components/PhoneSummary";
import { blockedCategories, findChild, week } from "@/_data/children";
import { getSubscription } from "@/lib/gigs";
import { formatMbAsGb, planDataCap } from "@/lib/format";
import styles from "./page.module.css";

export default async function Insights({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = findChild(childId);
  if (!child) notFound();

  const result = await getSubscription(child.gigsSubscriptionId);
  const sub = result.ok ? result.value : null;
  const cap = planDataCap(sub);
  const dataPct = cap.mb === 0 ? 0 : Math.min(100, Math.round((child.dataUsedMb / cap.mb) * 100));
  const capReached = dataPct >= 95;
  const totalScreenMinutes = child.apps.reduce((s, a) => s + a.minutes, 0);
  const totalScreenLabel =
    totalScreenMinutes >= 60
      ? `${Math.floor(totalScreenMinutes / 60)}h ${String(totalScreenMinutes % 60).padStart(2, "0")}m`
      : `${totalScreenMinutes}m`;

  return (
    <>
      <p className={styles.lead}>{child.weekLead}</p>

      <section className={styles.section} aria-labelledby="phone-section">
        <header className={styles.sectionHeader}>
          <span id="phone-section" className="section-label">
            The phone, this week
          </span>
        </header>
        <div className={styles.phoneWrap}>
          <PhoneSummary
            name={child.name}
            age={child.age}
            weekLabel={week.range}
            apps={child.apps}
            blockedAttempts={child.blockedAttempts}
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="data-section">
        <header className={styles.sectionHeader}>
          <span id="data-section" className="section-label">
            Data &amp; screen
          </span>
        </header>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Data used</span>
            <span className={styles.statValue}>
              {capReached ? (
                <em>{formatMbAsGb(child.dataUsedMb)}</em>
              ) : (
                formatMbAsGb(child.dataUsedMb)
              )}
            </span>
            <span className={styles.statSub}>of {cap.label} cap</span>
            <span className={styles.dataBar} aria-hidden="true">
              <span
                className={`${styles.dataBarFill} ${capReached ? styles.dataBarFillHigh : ""}`}
                style={{ width: `${dataPct}%` }}
              />
            </span>
          </div>

          <div className={styles.stat}>
            <span className={styles.statLabel}>Screen time</span>
            <span className={styles.statValue}>{totalScreenLabel}</span>
            <span className={styles.statSub}>across {child.apps.length} apps</span>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="comm-section">
        <header className={styles.sectionHeader}>
          <span id="comm-section" className="section-label">
            Communication
          </span>
        </header>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Calls</span>
            <span className={styles.statValue}>{child.callsCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Texts</span>
            <span className={styles.statValue}>{child.smsCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>People reached</span>
            <span className={styles.statValue}>{child.contacts.length}</span>
            <span className={styles.statSub}>only people on the whitelist</span>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="blocked-section">
        <header className={styles.sectionHeader}>
          <span id="blocked-section" className="section-label">
            What couldn&rsquo;t reach them
          </span>
        </header>
        <div className={styles.blocked}>
          <div className={styles.blockedCopy}>
            <h3>The line is holding.</h3>
            <p>
              Social apps are blocked at the network — there is nothing on {child.name}&rsquo;s
              phone for them to open, and no setting on the device that can change that.
            </p>
            <ul className={styles.blockedCats}>
              {blockedCategories.map((cat) => (
                <li key={cat}>{cat}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className={styles.blockedNumber}>{child.blockedAttempts}</div>
            <span className={styles.statLabel}>attempts</span>
          </div>
        </div>
      </section>

      <p className={styles.closing}>
        Next digest publishes Tuesday morning — usually 06:00, sometimes later if usage takes
        time to settle.
      </p>
    </>
  );
}
