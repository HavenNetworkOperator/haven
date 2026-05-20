import { notFound } from "next/navigation";
import { findChild } from "@/_data/children";
import styles from "./page.module.css";

export default async function Contacts({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = findChild(childId);
  if (!child) notFound();

  return (
    <>
      <p className={styles.intro}>
        These are the only people who can reach {child.name} by call or text. Anyone outside the
        list is silently held — they never see {child.name}&rsquo;s number ring.
      </p>

      <div className={styles.actions}>
        <span className={styles.count}>
          {child.contacts.length} {child.contacts.length === 1 ? "person" : "people"}
        </span>
        <button type="button" className="btn-ghost" disabled aria-disabled="true">
          Add contact
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Call</th>
            <th>Text</th>
          </tr>
        </thead>
        <tbody>
          {child.contacts.map((c) => (
            <tr key={c.phone}>
              <td className={styles.cellName}>{c.name}</td>
              <td className={styles.cellPhone}>{c.phone}</td>
              <td className={styles.cellMark}>
                <Mark on={c.allowCall} />
              </td>
              <td className={styles.cellMark}>
                <Mark on={c.allowSms} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className={styles.footnote}>
        Emergency services (999, 112, 111) are always reachable — they bypass the whitelist.
      </p>
    </>
  );
}

function Mark({ on }: { on: boolean }) {
  return (
    <span className={`${styles.mark} ${on ? styles.markOn : styles.markOff}`} aria-hidden="true">
      {on ? "✓" : "—"}
    </span>
  );
}
