import Link from "next/link";
import { notFound } from "next/navigation";
import { findChild, week } from "@/_data/children";
import TabBar from "./_components/TabBar";
import styles from "./layout.module.css";

export default async function ChildLayout({
  children: page,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = findChild(childId);
  if (!child) notFound();

  const basePath = `/c/${child.id}`;

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.crumb}>
        ← Family
      </Link>

      <header className={styles.header}>
        <h1 className={styles.name}>
          {child.name}
          <span className={styles.age}>{child.age}</span>
        </h1>
        <span className={styles.meta}>{week.range}</span>
      </header>

      <TabBar basePath={basePath} />

      <div className={styles.body}>{page}</div>
    </div>
  );
}
