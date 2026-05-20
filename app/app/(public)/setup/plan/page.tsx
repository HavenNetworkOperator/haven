import Link from "next/link";
import { listPlans } from "@/lib/gigs";
import { formatBytesAsGb } from "@/lib/format";
import { submitPlan } from "../actions";
import shared from "../setup.module.css";
import styles from "./page.module.css";

const PLAN_TAGLINES: Record<string, string> = {
  plan_havenLite: "First phone. Lighter use.",
  plan_havenStandard: "The default. What we'd pick for our own.",
  plan_havenPlus: "More data. Travel-ready.",
};

const ORDER = ["plan_havenLite", "plan_havenStandard", "plan_havenPlus"];

export default async function PlanStep({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
    name?: string;
    age?: string;
    school?: string;
    plan?: string;
    error?: string;
  }>;
}) {
  const { email, name, age, school, plan, error } = await searchParams;
  const result = await listPlans({ status: "available" });
  const plans = result.ok
    ? [...result.value].sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id))
    : [];

  // Default selection: explicit ?plan or fall back to Standard (recommended).
  const selectedPlan = plan || "plan_havenStandard";

  return (
    <>
      <h1 className={shared.headline}>
        How much <em>data</em>?
      </h1>
      <p className={shared.lede}>
        Pick a size for {name || "your child"}. Same line, same safety,
        however much data they need.
      </p>

      <form action={submitPlan} className={shared.form}>
        <fieldset className={styles.options}>
          <legend className="sr-only">Choose a plan</legend>
          {plans.map((p) => {
            const isStandard = p.id === "plan_havenStandard";
            return (
              <label
                key={p.id}
                className={`${styles.option} ${isStandard ? styles.optionFeatured : ""}`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={p.id}
                  defaultChecked={p.id === selectedPlan}
                  className={styles.radio}
                />
                <div className={styles.optionBody}>
                  <div className={styles.optionTop}>
                    <span className={styles.optionTier}>{p.name.replace(/^Haven\s/, "")}</span>
                    {isStandard && <span className={styles.optionBadge}>Recommended</span>}
                  </div>
                  <div className={styles.optionData}>
                    <span className={styles.optionDataNum}>
                      {formatBytesAsGb(p.allowances.data)}
                    </span>
                    <span className={styles.optionDataUnit}>a month</span>
                  </div>
                  <p className={styles.optionTagline}>{PLAN_TAGLINES[p.id] ?? ""}</p>
                  <div className={styles.optionPrice}>
                    £<em>{(p.price.amount / 100).toFixed(0)}</em>
                    <span className={styles.optionPriceUnit}> / month</span>
                  </div>
                </div>
              </label>
            );
          })}
        </fieldset>

        {error === "plan" && (
          <p className={shared.fieldError}>Choose a plan to continue.</p>
        )}

        {/* Pass everything else along */}
        {email && <input type="hidden" name="email" value={email} />}
        {name && <input type="hidden" name="name" value={name} />}
        {age && <input type="hidden" name="age" value={age} />}
        {school && <input type="hidden" name="school" value={school} />}

        <div className={shared.actions}>
          <Link
            href={`/setup/child?email=${encodeURIComponent(email ?? "")}&name=${encodeURIComponent(
              name ?? "",
            )}&age=${encodeURIComponent(age ?? "")}&school=${encodeURIComponent(school ?? "")}`}
            className={shared.back}
          >
            ← Back
          </Link>
          <button type="submit" className={shared.continueBtn}>
            Continue →
          </button>
        </div>
      </form>

      <p className={shared.note}>
        Founding-member pricing — locked for life. Switch tiers later from your dashboard;
        the lock follows you.
      </p>
    </>
  );
}
