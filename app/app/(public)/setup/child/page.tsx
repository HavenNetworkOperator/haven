import Link from "next/link";
import { submitChild } from "../actions";
import styles from "../setup.module.css";

export default async function ChildStep({
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

  return (
    <>
      <h1 className={styles.headline}>
        Who&rsquo;s the SIM <em>for</em>?
      </h1>
      <p className={styles.lede}>
        Just the basics. School, contacts, quiet hours — set them later, from the dashboard.
      </p>

      <form action={submitChild} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.fieldLabel}>
            First name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoFocus
            autoComplete="off"
            defaultValue={name}
            placeholder="Maya"
            className={styles.input}
            maxLength={50}
          />
          {error === "name" && (
            <p className={styles.fieldError}>We need a first name to address them.</p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="age" className={styles.fieldLabel}>
            Age
          </label>
          <select
            id="age"
            name="age"
            required
            defaultValue={age || ""}
            className={styles.input}
          >
            <option value="" disabled>
              Pick an age
            </option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
          </select>
          {error === "age" && (
            <p className={styles.fieldError}>
              Haven is for 14 and up — see help text below.
            </p>
          )}
          <p className={styles.fieldHelp}>
            Haven is built for ages 14 and up. If they&rsquo;re younger, the{" "}
            <a href="https://smartphonefreechildhood.co.uk">Smartphone Free Childhood</a>{" "}
            movement is who we&rsquo;d send you to first.
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor="school" className={`${styles.fieldLabel} ${styles.optional}`}>
            School
          </label>
          <input
            id="school"
            name="school"
            type="text"
            autoComplete="off"
            defaultValue={school}
            placeholder="St George's"
            className={styles.input}
            maxLength={120}
          />
          <p className={styles.fieldHelp}>
            We use this to suggest term-time quiet hours and school-holiday mode. Always optional,
            always editable.
          </p>
        </div>

        {email && <input type="hidden" name="email" value={email} />}
        {plan && <input type="hidden" name="plan" value={plan} />}

        <div className={styles.actions}>
          <Link href={`/setup/account${email ? `?email=${encodeURIComponent(email)}` : ""}`} className={styles.back}>
            ← Back
          </Link>
          <button type="submit" className={styles.continueBtn}>
            Continue →
          </button>
        </div>
      </form>
    </>
  );
}
