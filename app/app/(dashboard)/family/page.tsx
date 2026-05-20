import Link from "next/link";
import PhoneSummary from "@/_components/PhoneSummary";
import { children, week } from "@/_data/children";
import styles from "./page.module.css";

export default function Family() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className="section-label">Family</span>
        <h1 className={styles.title}>
          Everyone <em>on the line</em>.
        </h1>
        <p className={styles.intro}>
          One column per child. Each is the front page of their own week —
          phone summary, editor&rsquo;s lead, link to the full digest.
        </p>
      </header>

      <section className={styles.cols}>
        {children.map((c) => (
          <article key={c.id} className={styles.col}>
            <div className={styles.colHead}>
              <h2 className={styles.colName}>
                {c.name}
                <span className={styles.colAge}>{c.age}</span>
              </h2>
              <span className={styles.colMeta}>{week.range}</span>
            </div>

            <PhoneSummary
              name={c.name}
              age={c.age}
              weekLabel={week.range}
              apps={c.apps}
              blockedAttempts={c.blockedAttempts}
            />

            <p className={styles.colLead}>{c.weekLead}</p>

            <Link href={`/c/${c.id}`} className={styles.colLink}>
              Read {c.name}&rsquo;s full digest →
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
