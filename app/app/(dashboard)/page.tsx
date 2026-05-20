import Link from "next/link";
import PhoneSummary from "@/_components/PhoneSummary";
import { children, homeNotableItems, week } from "@/_data/children";
import styles from "./page.module.css";

const headline = ["This week,", "across your family."] as const;
const accentPhrase = "your family";
const note =
  "Two patterns stand out — evenings landed earlier than last week, " +
  "and data crept higher mid-week. The line itself held: nothing tried, nothing through.";
const items = homeNotableItems();
const alerts = 0;

function renderHeadline() {
  const [line1, line2] = headline;
  const idx = line2.indexOf(accentPhrase);
  if (idx === -1) return <>{headline.join(" ")}</>;
  const before = line2.slice(0, idx);
  const after = line2.slice(idx + accentPhrase.length);
  return (
    <>
      {line1}
      <br />
      {before}
      <em>{accentPhrase}</em>
      {after}
    </>
  );
}

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.masthead}>
        <span>Haven · {week.ofLabel}</span>
        <span className={styles["masthead-date"]}>{week.publishedLabel}</span>
      </div>

      <section className={styles.headline}>
        <h1>{renderHeadline()}</h1>
      </section>

      <p className={styles.editor}>{note}</p>

      <section className={styles.phones} aria-label="Phone summary by child">
        {children.map((c) => (
          <PhoneSummary
            key={c.id}
            name={c.name}
            age={c.age}
            weekLabel={week.range}
            apps={c.apps}
            blockedAttempts={c.blockedAttempts}
          />
        ))}
      </section>

      <section className={styles.section} aria-labelledby="notable">
        <header>
          <span id="notable" className="section-label">Three notable things</span>
        </header>
        <ol className={styles.items}>
          {items.map((it, i) => (
            <li key={i} className={styles.item}>
              <span className={styles["item-num"]}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className={styles["item-lead"]}>{it.lead}</p>
                <p className={styles["item-detail"]}>{it.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="family">
        <header>
          <span id="family" className="section-label">Family at a glance</span>
        </header>
        <div className={styles.family}>
          {children.map((c) => (
            <Link key={c.id} href={`/c/${c.id}`} className={styles["family-pill"]}>
              <span>{c.name}</span>
              <span className={styles["family-pill-age"]}>{c.age}</span>
            </Link>
          ))}
          <Link href="/family" className={styles["family-link"]}>
            All children →
          </Link>
        </div>
      </section>

      <div className={styles.alerts}>
        <span>{alerts === 0 ? "No alerts this week." : `${alerts} alerts this week.`}</span>
        <Link href="/alerts">Inbox →</Link>
      </div>
    </div>
  );
}
