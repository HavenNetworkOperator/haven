import { notFound } from "next/navigation";
import { blockedCategories, findChild } from "@/_data/children";
import { getSubscription } from "@/lib/gigs";
import { formatMbAsGb, planDataCap } from "@/lib/format";
import styles from "./page.module.css";

export default async function Limits({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = findChild(childId);
  if (!child) notFound();

  // Data cap comes from the Gigs plan; used is Haven-side cache (will
  // eventually derive from Gigs usage records).
  const result = await getSubscription(child.gigsSubscriptionId);
  const sub = result.ok ? result.value : null;
  const cap = planDataCap(sub);
  const dataPct = cap.mb === 0 ? 0 : Math.min(100, Math.round((child.dataUsedMb / cap.mb) * 100));

  return (
    <>
      <p className={styles.intro}>
        Two soft levers — data and evening hours — and one hard line. The hard line is what
        Haven is for; it is not configurable on purpose.
      </p>

      {/* DATA CAP */}
      <section className={styles.row}>
        <header className={styles.rowHead}>
          <h3 className={styles.rowTitle}>Monthly data cap</h3>
          <span className={styles.rowValue}>{cap.label}</span>
        </header>
        <p className={styles.rowDetail}>
          When the cap is reached, mobile data pauses until the start of the next billing month.
          Calls and texts continue.
        </p>
        <div className={styles.bar} aria-hidden="true">
          <span className={styles.barFill} style={{ width: `${dataPct}%` }} />
        </div>
        <p className={styles.rowAside}>
          {dataPct}% used this month · {formatMbAsGb(child.dataUsedMb)} of {cap.label}
        </p>
      </section>

      {/* QUIET HOURS */}
      <section className={styles.row}>
        <header className={styles.rowHead}>
          <h3 className={styles.rowTitle}>Quiet hours</h3>
          <span className={styles.rowValue}>
            {child.quietHoursStart} – {child.quietHoursEnd}
          </span>
        </header>
        <p className={styles.rowDetail}>
          During quiet hours, only emergency contacts can reach {child.name}. The phone receives
          no calls, no messages, no data — the network simply holds them until morning.
        </p>
      </section>

      {/* LOCKED — social media at network */}
      <section className={`${styles.row} ${styles.rowLocked}`}>
        <header className={styles.rowHead}>
          <h3 className={styles.rowTitle}>
            Social media
            <span className={styles.lock} aria-label="Locked">
              ✦
            </span>
          </h3>
          <span className={`${styles.rowValue} ${styles.rowValueLocked}`}>
            <em>Blocked at the network</em>
          </span>
        </header>
        <p className={styles.rowDetail}>
          Haven blocks the major social platforms at the SIM level — there is nothing on{" "}
          {child.name}&rsquo;s phone for them to open, and no setting on this dashboard that can
          turn it off. This is the line Haven holds.
        </p>
        <ul className={styles.cats}>
          {blockedCategories.map((cat) => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
