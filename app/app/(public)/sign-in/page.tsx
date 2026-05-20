import { submitSignIn } from "./actions";
import styles from "./page.module.css";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string }>;
}) {
  const { email, error } = await searchParams;

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <span className="section-label">Sign in</span>
        <h1 className={styles.title}>
          Your email is your <em>key</em>.
        </h1>
        <p className={styles.lede}>
          Pop your email in. We&rsquo;ll send a one-time link that signs you in. No passwords
          to remember, no app to install.
        </p>
      </header>

      <form action={submitSignIn} className={styles.form}>
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
            <p className={styles.error}>That doesn&rsquo;t look like a valid email.</p>
          )}
          {error && error !== "invalid_email" && (
            <p className={styles.error}>
              Something went wrong sending the link. Try again, or email{" "}
              <a href="mailto:hello@gethavenmobile.com">hello@gethavenmobile.com</a>.
            </p>
          )}
        </div>

        <button type="submit" className={styles.btn}>
          Send sign-in link →
        </button>
      </form>

      <p className={styles.note}>
        New to Haven? You&rsquo;ll be signed in to a fresh account on first click. Setup happens
        from inside.
      </p>
    </div>
  );
}
