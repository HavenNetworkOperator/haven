import { notFound } from "next/navigation";
import { blockedCategories, findChildByToken } from "@/_data/children";
import { getSubscription } from "@/lib/gigs";
import { formatMbAsGb, planDataCap } from "@/lib/format";
import styles from "./page.module.css";

export default async function Me({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const child = findChildByToken(token);
  if (!child) notFound();

  const result = await getSubscription(child.gigsSubscriptionId);
  const sub = result.ok ? result.value : null;
  const cap = planDataCap(sub);
  const dataLeft = Math.max(0, cap.mb - child.dataUsedMb);

  return (
    <>
      <section className={styles.hello}>
        <p className={styles.eyebrow}>Hi,</p>
        <h1 className={styles.name}>{child.name}.</h1>
        <p className={styles.lede}>This is your Haven page.</p>
      </section>

      {/* TODAY */}
      <section aria-labelledby="today">
        <h2 id="today" className={styles.sectionLabel}>
          Today
        </h2>
        <ul className={styles.facts}>
          <li className={styles.fact}>
            <span className={styles.factLabel}>Network</span>
            <span className={styles.factValue}>
              <span className={styles.dot} aria-hidden="true" />
              On
            </span>
          </li>
          <li className={styles.fact}>
            <span className={styles.factLabel}>Quiet hours start</span>
            <span className={styles.factValue}>{child.quietHoursStart}</span>
          </li>
          <li className={styles.fact}>
            <span className={styles.factLabel}>Data left this month</span>
            <span className={styles.factValue}>{formatMbAsGb(dataLeft)}</span>
          </li>
        </ul>
      </section>

      {/* YOUR PEOPLE */}
      <section aria-labelledby="people">
        <h2 id="people" className={styles.sectionLabel}>
          Your people
        </h2>
        <p className={styles.intro}>
          The people who can reach you. If someone&rsquo;s missing, ask{" "}
          {child.parentSmsName} to add them.
        </p>
        <ul className={styles.people}>
          {child.contacts.map((c) => (
            <li key={c.phone}>{c.name}</li>
          ))}
        </ul>
      </section>

      {/* WHAT CAN'T REACH YOU */}
      <section aria-labelledby="blocked">
        <h2 id="blocked" className={styles.sectionLabel}>
          What can&rsquo;t reach you
        </h2>
        <p className={styles.intro}>
          These apps are blocked on the Haven network. It&rsquo;s not your phone&rsquo;s settings —
          there&rsquo;s no toggle for it, here or anywhere. This is the line Haven holds.
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
