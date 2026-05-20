import Progress from "./_components/Progress";
import styles from "./layout.module.css";

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <Progress />
      <div className={styles.body}>{children}</div>
    </div>
  );
}
