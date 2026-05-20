import styles from "./page.module.css";

export default async function CheckEmail({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <span className="section-label">Check your inbox</span>
        <h1 className={styles.title}>
          We&rsquo;ve sent you a <em>link</em>.
        </h1>
        {email && (
          <p className={styles.lede}>
            Look for an email from Haven at <strong>{email}</strong>. Click the button inside
            and you&rsquo;re in. The link works once and is good for fifteen minutes.
          </p>
        )}
      </header>

      <ol className={styles.tips}>
        <li>
          <span className={styles.tipNum}>01</span>
          <span>It usually arrives within thirty seconds. If not, it&rsquo;s probably in spam.</span>
        </li>
        <li>
          <span className={styles.tipNum}>02</span>
          <span>
            Open the link on whichever device you want to be signed in on — phone, laptop, both.
          </span>
        </li>
        <li>
          <span className={styles.tipNum}>03</span>
          <span>
            Nothing arrived after a few minutes? Email{" "}
            <a href="mailto:hello@gethavenmobile.com">hello@gethavenmobile.com</a> and someone real
            will sort it.
          </span>
        </li>
      </ol>

      <p className={styles.note}>
        Wrong email?{" "}
        <a href="/sign-in" className={styles.back}>
          Try a different one →
        </a>
      </p>
    </div>
  );
}
