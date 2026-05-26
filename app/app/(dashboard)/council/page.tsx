import { councilFeatures } from "@/_data/council";
import styles from "./page.module.css";

// Placeholder: parent's tier-based vote allocation. Real value pulled
// from accounts/households once auth lands. See plan §Council route.
const remainingVotes = 3;
const tierLabel = "Full Family"; // £75 founding tier — 3 SIMs, 3 votes
const totalCouncilMembers = 412;

export default function Council() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className="section-label">Founding council</span>
        <h1 className={styles.title}>
          Three safety features.
          <br />
          <em>You pick the order.</em>
        </h1>
        <p className={styles.intro}>
          Each founding household gets a vote per SIM on the first safety features Haven ships
          after launch. Three features are on the table — vote for the ones you most want
          shipped first. Results close the day before launch and become public commitments
          in the build roadmap.
        </p>
        <div className={styles.meta}>
          <span className={styles.metaLabel}>Your votes</span>
          <span className={styles.metaValue}>
            {remainingVotes} <span className={styles.metaSub}>· {tierLabel}</span>
          </span>
          <span className={styles.metaDivider} />
          <span className={styles.metaLabel}>Council size</span>
          <span className={styles.metaValue}>
            {totalCouncilMembers}{" "}
            <span className={styles.metaSub}>founding members so far</span>
          </span>
        </div>
      </header>

      <ol className={styles.list}>
        {councilFeatures.map((f, i) => {
          const totalVotes = councilFeatures.reduce((s, x) => s + x.voteCount, 0);
          const pct = totalVotes === 0 ? 0 : Math.round((f.voteCount / totalVotes) * 100);
          return (
            <li key={f.id} className={styles.feature}>
              <div className={styles.featureHead}>
                <span className={styles.featureNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className={styles.featureTitle}>{f.title}</h2>
              </div>

              <p className={styles.featureLine}>{f.oneLiner}</p>
              <p className={styles.featureDetail}>{f.detail}</p>

              <div className={styles.tally}>
                <div className={styles.tallyBar} aria-hidden="true">
                  <span className={styles.tallyFill} style={{ width: `${pct}%` }} />
                </div>
                <div className={styles.tallyText}>
                  <span className={styles.tallyCount}>{f.voteCount}</span>
                  <span className={styles.tallyLabel}>votes · {pct}%</span>
                </div>
              </div>

              <form>
                <button type="submit" className={styles.voteBtn} disabled aria-disabled="true">
                  Add your vote
                </button>
              </form>
            </li>
          );
        })}
      </ol>

      <p className={styles.footnote}>
        Votes are tied to the SIMs in your household. When voting opens, you&rsquo;ll be able
        to allocate up to {remainingVotes} votes across the three features — all on one, or
        spread evenly. You can change your votes until the day before launch.
      </p>
    </div>
  );
}
