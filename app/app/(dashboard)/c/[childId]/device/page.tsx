import { notFound } from "next/navigation";
import { findChild } from "@/_data/children";
import { getSubscription } from "@/lib/gigs";
import {
  formatDateLong,
  formatProvider,
  formatSubscriptionStatus,
  formatUkPhone,
} from "@/lib/format";
import styles from "./page.module.css";

export default async function Device({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const child = findChild(childId);
  if (!child) notFound();

  // All SIM/line state comes from Gigs. In dev (no GIGS_API_KEY) this
  // resolves via the mock layer; in production it hits api.gigs.com.
  const result = await getSubscription(child.gigsSubscriptionId);
  const sub = result.ok ? result.value : null;
  const status = sub?.status ?? null;

  return (
    <>
      <p className={styles.intro}>
        Practical details about {child.name}&rsquo;s SIM. If something needs replacing or moving,
        this is the page.
      </p>

      <ul className="deflist">
        <li>
          <span className="label">Phone number</span>
          <span className="value mono">{formatUkPhone(sub?.phoneNumber)}</span>
        </li>
        <li>
          <span className="label">SIM</span>
          <span className="value">{sub?.sim?.type ?? "—"}</span>
          <span className="aside">{formatProvider(sub?.sim?.provider) + " · via Gigs"}</span>
        </li>
        <li>
          <span className="label">ICCID</span>
          <span className="value mono">{sub?.sim?.iccid ?? "—"}</span>
        </li>
        <li>
          <span className="label">Activated</span>
          <span className="value">{formatDateLong(sub?.activatedAt)}</span>
        </li>
        <li>
          <span className="label">Status</span>
          <span className="value">
            <span className={`pill ${status === "active" ? "on" : ""}`}>
              {formatSubscriptionStatus(status)}
            </span>
          </span>
        </li>
        <li>
          <span className="label">Plan</span>
          <span className="value">{sub?.plan.name ?? "—"}</span>
          <span className="aside">{sub ? `£${(sub.plan.price.amount / 100).toFixed(0)} / month · Locked for life` : ""}</span>
        </li>
      </ul>

      {!result.ok && (
        <p className={styles.footnote}>
          We couldn&rsquo;t reach Gigs just now — these details may be out of date. (
          {result.error})
        </p>
      )}

      <div className={styles.actions}>
        <button type="button" className="btn-ghost" disabled aria-disabled="true">
          Replace SIM
        </button>
        <button type="button" className="btn-ghost btn-danger" disabled aria-disabled="true">
          Port number out
        </button>
      </div>

      <p className={styles.footnote}>
        Porting out cancels the founding price lock. We recommend speaking with us first —
        most numbers can move and stay.
      </p>
    </>
  );
}
