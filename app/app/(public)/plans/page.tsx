import Link from "next/link";
import { blockedCategories } from "@/_data/children";
import { listPlans } from "@/lib/gigs";
import { formatBytesAsGb } from "@/lib/format";
import styles from "./page.module.css";

// Editorial metadata that sits alongside each Gigs plan. Once Gigs
// supports custom `metadata` per plan we can move these fields there;
// for now they're keyed by plan ID.
const PLAN_META: Record<
  string,
  { tagline: string; recommended?: boolean; retailGbp?: number }
> = {
  plan_havenLite: {
    tagline: "First phone. Lighter use.",
    retailGbp: 12,
  },
  plan_havenStandard: {
    tagline: "The default. What we'd pick for our own.",
    recommended: true,
    retailGbp: 15,
  },
  plan_havenPlus: {
    tagline: "More data. Travel-ready.",
    retailGbp: 20,
  },
};

const COMMON_FEATURES = [
  "Unlimited UK calls and texts",
  "5 days free EU roaming every trip",
  "5G as standard, via our UK carrier partner",
  "Unlimited hotspot",
  "Keep your number — free port-in",
  "No contract — pause or cancel any time",
  "eSIM, ready in five minutes",
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is the founding price really for life?",
    a:
      "Yes. While you stay on Haven, your founding-member rate doesn't change. " +
      "It's written into our terms of service for founding subscribers and we will " +
      "not change it retroactively — that's the whole point.",
  },
  {
    q: "Why eSIM only right now?",
    a:
      "Because it activates in five minutes from a QR code, with no plastic in the post. " +
      "Most phones from 2018 onwards support eSIM. Physical SIM is coming after launch " +
      "for older handsets and hand-me-downs.",
  },
  {
    q: "Can I switch between Lite, Standard and Plus later?",
    a:
      "Yes — instantly, from your Haven dashboard. The change applies from your next " +
      "billing month, and you'll keep your founding-member discount on whichever tier " +
      "you land on.",
  },
  {
    q: "What about more than one child?",
    a:
      "Every additional SIM in your household is priced the same as the first — pick " +
      "the right tier per child. One dashboard, one bill, one set of weekly insights.",
  },
  {
    q: "Which UK network is behind Haven?",
    a:
      "We're finalising the carrier partnership during the pre-launch build. The plan " +
      "is whichever UK carrier can offer the kid-safe APN profile that makes network-level " +
      "social-app blocking workable — we'll publish the partner before we ship the first SIM.",
  },
];

export default async function PlansPage() {
  // Plans come from Gigs. In mock mode, we get the three local fixtures
  // (Lite/Standard/Plus). In live mode, the project's real plans.
  const result = await listPlans({ status: "available" });
  const plans = result.ok ? result.value : [];
  const ordered = ["plan_havenLite", "plan_havenStandard", "plan_havenPlus"];
  const sorted = [...plans].sort(
    (a, b) => ordered.indexOf(a.id) - ordered.indexOf(b.id),
  );

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <span className="section-label">Plans</span>
        <h1 className={styles.title}>
          One line. <em>Three sizes.</em>
        </h1>
        <p className={styles.lede}>
          Every Haven plan blocks the same set of apps at the network. What changes is how
          much data your child gets a month. Pick the right size — switch later if you got
          it wrong.
        </p>
      </header>

      <section className={styles.tiers} aria-label="Available plans">
        {sorted.map((plan) => {
          const meta = PLAN_META[plan.id] ?? { tagline: "" };
          const founding = (plan.price.amount / 100).toFixed(0);
          return (
            <article
              key={plan.id}
              className={`${styles.card} ${meta.recommended ? styles.cardFeatured : ""}`}
            >
              {meta.recommended && <span className={styles.badge}>Recommended</span>}

              <header className={styles.cardHead}>
                <p className={styles.tier}>{plan.name.replace(/^Haven\s/, "")}</p>
                <p className={styles.tagline}>{meta.tagline}</p>
              </header>

              <div className={styles.dataAmount}>
                <span className={styles.dataNum}>{formatBytesAsGb(plan.allowances.data)}</span>
                <span className={styles.dataUnit}>a month</span>
              </div>

              <div className={styles.price}>
                <span className={styles.priceNum}>
                  £<em>{founding}</em>
                </span>
                <span className={styles.priceUnit}>/ month</span>
                {meta.retailGbp && (
                  <span className={styles.priceRetail}>
                    Founding member price · locked for life
                    <br />
                    Retail when we launch: £{meta.retailGbp}/mo
                  </span>
                )}
              </div>

              <ul className={styles.features}>
                <li>
                  <span className={styles.featNum}>
                    {formatBytesAsGb(plan.allowances.data)}
                  </span>
                  <span>Mobile data, with no surprise overages</span>
                </li>
                <li>Unlimited UK calls and texts</li>
                <li>5 days free EU roaming every trip</li>
                <li>5G as standard</li>
                <li>eSIM, activates in five minutes</li>
              </ul>

              <Link
                href={`/setup?plan=${encodeURIComponent(plan.id)}`}
                className={`${styles.cta} ${meta.recommended ? styles.ctaFeatured : ""}`}
              >
                Start with {plan.name.replace(/^Haven\s/, "")}
              </Link>

              <p className={styles.cardFoot}>
                eSIM only at launch · physical SIM after
              </p>
            </article>
          );
        })}
      </section>

      <section className={styles.common} aria-labelledby="common-features">
        <header className={styles.commonHead}>
          <span id="common-features" className="section-label">
            Every plan. Same line.
          </span>
          <h2 className={styles.commonTitle}>
            What every Haven SIM <em>does</em> &mdash; and what it <em>doesn&rsquo;t</em>.
          </h2>
        </header>

        <div className={styles.commonGrid}>
          <div className={styles.commonCol}>
            <h3 className={styles.commonColTitle}>What you get on every plan</h3>
            <ul className={styles.commonList}>
              {COMMON_FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div className={styles.commonCol}>
            <h3 className={styles.commonColTitle}>What&rsquo;s blocked, on every plan</h3>
            <p className={styles.commonLede}>
              The network itself refuses these apps. Not a setting on the phone — there is no
              setting that can change it. This is the line Haven holds.
            </p>
            <ul className={styles.blockedChips}>
              {blockedCategories.map((cat) => (
                <li key={cat}>{cat}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.faq} aria-labelledby="faq">
        <header className={styles.faqHead}>
          <span id="faq" className="section-label">
            Common questions
          </span>
        </header>
        <div className={styles.faqList}>
          {FAQS.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary className={styles.faqQ}>{item.q}</summary>
              <p className={styles.faqA}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className={styles.closing}>
        Founding-member pricing closes when we reach 1,000 subscribers. After that, retail prices
        apply to new customers — your founding rate stays locked.
      </p>
    </div>
  );
}
