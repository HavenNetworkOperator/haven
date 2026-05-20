import { submitAccount } from "../actions";
import styles from "../setup.module.css";

export default async function AccountStep({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; email?: string; error?: string }>;
}) {
  const { plan, email, error } = await searchParams;

  return (
    <>
      <h1 className={styles.headline}>
        Your email. The one for the <em>digests</em>.
      </h1>
      <p className={styles.lede}>
        Haven sends a short weekly summary every Tuesday morning. This is where it goes.
      </p>

      <form action={submitAccount} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.fieldLabel}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            inputMode="email"
            defaultValue={email}
            placeholder="alex.bowdler@example.com"
            className={styles.input}
          />
          {error === "invalid_email" && (
            <p className={styles.fieldError}>That doesn&rsquo;t look like a valid email.</p>
          )}
          <p className={styles.fieldHelp}>
            Haven uses sign-in links sent to your inbox — no passwords. This is also the address
            we use to reach you for anything urgent.
          </p>
        </div>

        {plan && <input type="hidden" name="plan" value={plan} />}

        <div className={styles.actions}>
          <span aria-hidden="true" />
          <button type="submit" className={styles.continueBtn}>
            Continue →
          </button>
        </div>
      </form>

      <p className={styles.note}>
        We only use your email for sign-in links and your weekly digest. No marketing emails,
        no shared lists — see the privacy page on{" "}
        <a href="https://gethavenmobile.com/privacy">gethavenmobile.com</a> for the full detail.
      </p>
    </>
  );
}
