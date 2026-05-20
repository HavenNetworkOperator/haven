import styles from "./PhoneSummary.module.css";

type App = { name: string; minutes: number };

export type PhoneSummaryProps = {
  name: string;
  age: number;
  weekLabel: string;
  apps: App[];
  blockedAttempts: number;
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${String(m).padStart(2, "0")}m`;
}

export default function PhoneSummary({
  name,
  age,
  weekLabel,
  apps,
  blockedAttempts,
}: PhoneSummaryProps) {
  const sorted = [...apps].sort((a, b) => b.minutes - a.minutes);
  const max = sorted[0]?.minutes ?? 0;
  const total = sorted.reduce((sum, a) => sum + a.minutes, 0);

  return (
    <article className={styles.card} aria-label={`${name}'s phone this week`}>
      <div className={styles.notch} aria-hidden="true" />

      <header className={styles.header}>
        <h3 className={styles.name}>
          {name}
          <span className={styles.age}>{age}</span>
        </h3>
        <span className={styles.weekLabel}>{weekLabel}</span>
      </header>

      <ul className={styles.apps}>
        {sorted.map((a) => {
          const pct = max === 0 ? 0 : Math.round((a.minutes / max) * 100);
          return (
            <li key={a.name} className={styles.app}>
              <span className={styles.appName}>{a.name}</span>
              <span className={styles.appTime}>{formatDuration(a.minutes)}</span>
              <span className={styles.bar} aria-hidden="true">
                <span className={styles.barFill} style={{ width: `${pct}%` }} />
              </span>
            </li>
          );
        })}
      </ul>

      <footer className={styles.footer}>
        <div className={styles.footStat}>
          <span className={styles.footLabel}>Total</span>
          <span className={styles.footValue}>{formatDuration(total)}</span>
        </div>
        <div className={styles.footStat}>
          <span className={styles.footLabel}>Blocked attempts</span>
          <span
            className={`${styles.footValue} ${blockedAttempts === 0 ? styles.footValueZero : ""}`}
          >
            {blockedAttempts}
          </span>
        </div>
      </footer>

      <div className={styles.home} aria-hidden="true" />
    </article>
  );
}
