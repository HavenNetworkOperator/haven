import Link from "next/link";
import { notFound } from "next/navigation";
import { findChild, week } from "@/_data/children";
import styles from "./page.module.css";

export default async function History({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = findChild(childId);
  if (!child) notFound();

  const current = {
    ofLabel: week.ofLabel,
    range: week.range,
    summary:
      "Two patterns stood out — evenings landed earlier than last week, and data crept " +
      "higher mid-week. The line itself held.",
    current: true,
  };
  const archive = [current, ...child.history.map((h) => ({ ...h, current: false }))];

  return (
    <>
      <p className={styles.intro}>
        Each Tuesday morning, the previous week&rsquo;s digest is filed here. We keep the full
        archive — not the raw data underneath it.
      </p>

      <ol className={styles.list}>
        {archive.map((w, i) => (
          <li key={i} className={styles.entry}>
            <div className={styles.entryHead}>
              <h3 className={styles.entryTitle}>{w.ofLabel}</h3>
              <span className={styles.entryMeta}>
                {w.range}
                {w.current && <span className={`pill on ${styles.pill}`}>This week</span>}
              </span>
            </div>
            <p className={styles.entrySummary}>{w.summary}</p>
            <Link href={`/c/${child.id}`} className={styles.entryLink}>
              Read full digest →
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
