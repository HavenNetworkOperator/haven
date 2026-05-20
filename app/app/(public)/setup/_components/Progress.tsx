"use client";

import { usePathname } from "next/navigation";
import styles from "./Progress.module.css";

const STEPS: { label: string; path: string }[] = [
  { label: "Account", path: "/setup/account" },
  { label: "Your child", path: "/setup/child" },
  { label: "Plan", path: "/setup/plan" },
  { label: "Activate", path: "/setup/activate" },
];

export default function Progress() {
  const pathname = usePathname() ?? "";
  const current = Math.max(
    0,
    STEPS.findIndex((s) => pathname.startsWith(s.path)),
  );

  return (
    <div className={styles.wrap} aria-label="Onboarding progress">
      <p className={styles.eyebrow}>
        Step {current + 1} of {STEPS.length}
      </p>
      <ol className={styles.steps}>
        {STEPS.map((s, i) => {
          const active = i === current;
          const done = i < current;
          return (
            <li
              key={s.path}
              className={`${styles.step} ${active ? styles.stepActive : ""} ${done ? styles.stepDone : ""}`}
              aria-current={active ? "step" : undefined}
            >
              <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.stepLabel}>{s.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
