import Link from "next/link";
import { notFound } from "next/navigation";
import PhoneSummary from "@/_components/PhoneSummary";
import { blockedCategories, children, homeNotableItems, week } from "@/_data/children";
import { getSubscription } from "@/lib/gigs";
import { formatMbAsGb, planDataCap } from "@/lib/format";
import styles from "./page.module.css";

// In production, weekId would key into a `weekly_insights` row. For
// the placeholder build we accept either the canonical Monday-of-week
// (e.g. "2026-05-11") or the marketing-friendly slug "current" /
// "this-week" and return the same fixture.
const VALID_IDS = new Set(["current", "this-week", "2026-05-11"]);

export default async function Digest({
  params,
}: {
  params: Promise<{ weekId: string }>;
}) {
  const { weekId } = await params;
  if (!VALID_IDS.has(weekId)) notFound();

  const notable = homeNotableItems();

  // Pre-fetch each child's subscription so the per-child cards can
  // read the Gigs-owned values (plan data cap, sim type, etc).
  const subs = await Promise.all(
    children.map(async (c) => {
      const r = await getSubscription(c.gigsSubscriptionId);
      return r.ok ? r.value : null;
    }),
  );

  return (
    <article className={styles.page}>
      {/* ──── MASTHEAD ──── */}
      <header className={styles.masthead}>
        <span className={styles.mastheadLeft}>Haven · {week.ofLabel}</span>
        <span className={styles.mastheadCenter}>The Weekly Digest</span>
        <span className={styles.mastheadRight}>{week.publishedLabel}</span>
      </header>

      {/* ──── LEAD ──── */}
      <section className={styles.lead}>
        <h1 className={styles.headline}>
          This week,
          <br />
          across <em>your family</em>.
        </h1>
        <p className={styles.editorsNote}>
          Two patterns stood out — evenings landed earlier than last week, and data crept higher
          mid-week. The line itself held: nothing tried, nothing through. Below, the full picture
          for each of the children, in the order their phones came online.
        </p>
      </section>

      {/* ──── IN THIS ISSUE ──── */}
      <section className={styles.section} aria-labelledby="in-this-issue">
        <header className={styles.sectionHeader}>
          <span id="in-this-issue" className="section-label">
            In this issue
          </span>
        </header>
        <ol className={styles.notable}>
          {notable.map((n, i) => (
            <li key={i} className={styles.notableItem}>
              <span className={styles.notableNum}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className={styles.notableLead}>{n.lead}</p>
                <p className={styles.notableDetail}>{n.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ──── PER-CHILD SECTIONS ──── */}
      {children.map((c, idx) => {
        const sub = subs[idx];
        const cap = planDataCap(sub);
        const dataPct = cap.mb === 0 ? 0 : Math.min(100, Math.round((c.dataUsedMb / cap.mb) * 100));
        const capReached = dataPct >= 95;
        const totalMin = c.apps.reduce((s, a) => s + a.minutes, 0);
        const screenTime =
          totalMin >= 60
            ? `${Math.floor(totalMin / 60)}h ${String(totalMin % 60).padStart(2, "0")}m`
            : `${totalMin}m`;

        return (
          <section key={c.id} className={styles.childSection} aria-labelledby={`child-${c.id}`}>
            <header className={styles.childHeader}>
              <h2 id={`child-${c.id}`} className={styles.childName}>
                {c.name}
                <span className={styles.childAge}>{c.age}</span>
              </h2>
              <span className={styles.childWeek}>{week.range}</span>
            </header>

            <p className={styles.childLead}>{c.weekLead}</p>

            <div className={styles.phoneWrap}>
              <PhoneSummary
                name={c.name}
                age={c.age}
                weekLabel={week.range}
                apps={c.apps}
                blockedAttempts={c.blockedAttempts}
              />
            </div>

            <div className={styles.statBlock}>
              <header className={styles.statHeader}>
                <span className="section-label">Data &amp; screen</span>
              </header>
              <dl className={styles.stats}>
                <div className={styles.stat}>
                  <dt>Data used</dt>
                  <dd className={styles.statValue}>
                    {capReached ? <em>{formatMbAsGb(c.dataUsedMb)}</em> : formatMbAsGb(c.dataUsedMb)}
                  </dd>
                  <dd className={styles.statSub}>of {cap.label} cap</dd>
                </div>
                <div className={styles.stat}>
                  <dt>Screen time</dt>
                  <dd className={styles.statValue}>{screenTime}</dd>
                  <dd className={styles.statSub}>across {c.apps.length} apps</dd>
                </div>
              </dl>
            </div>

            <div className={styles.statBlock}>
              <header className={styles.statHeader}>
                <span className="section-label">Communication</span>
              </header>
              <dl className={styles.stats}>
                <div className={styles.stat}>
                  <dt>Calls</dt>
                  <dd className={styles.statValue}>{c.callsCount}</dd>
                </div>
                <div className={styles.stat}>
                  <dt>Texts</dt>
                  <dd className={styles.statValue}>{c.smsCount}</dd>
                </div>
                <div className={styles.stat}>
                  <dt>People reached</dt>
                  <dd className={styles.statValue}>{c.contacts.length}</dd>
                  <dd className={styles.statSub}>all on the whitelist</dd>
                </div>
              </dl>
            </div>

            <div className={styles.blocked}>
              <div className={styles.blockedCopy}>
                <h3 className={styles.blockedTitle}>The line is holding.</h3>
                <p>
                  Social apps refused at the network for the {idx === 0 ? "fourteenth" : "fourteenth"}{" "}
                  week running. Nothing on {c.name}&rsquo;s phone for them to open, and no setting on
                  the device that can change that.
                </p>
                <ul className={styles.blockedCats}>
                  {blockedCategories.map((cat) => (
                    <li key={cat}>{cat}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.blockedTally}>
                <div className={styles.blockedNumber}>{c.blockedAttempts}</div>
                <span className={styles.blockedLabel}>attempts</span>
              </div>
            </div>

            <Link href={`/c/${c.id}`} className={styles.deeperLink}>
              Go deeper into {c.name}&rsquo;s week →
            </Link>
          </section>
        );
      })}

      {/* ──── CLOSING NOTE ──── */}
      <section className={styles.closing}>
        <span className="section-label">Editor&rsquo;s note</span>
        <p className={styles.closingNote}>
          A quiet week is its own kind of news. The dashboard&rsquo;s job is to notice quiet
          weeks and say so — not to manufacture concern when there isn&rsquo;t any. We&rsquo;ll see
          you next Tuesday.
        </p>
        <p className={styles.closingSign}>— The Haven team</p>
      </section>

      {/* ──── FOOT ──── */}
      <footer className={styles.foot}>
        <span>Haven · The Weekly Digest</span>
        <span>{week.publishedLabel} · No. 14</span>
      </footer>
    </article>
  );
}
