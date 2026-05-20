import Link from "next/link";
import { submitActivate } from "../actions";
import shared from "../setup.module.css";
import styles from "./page.module.css";

// Deterministic but visually random "QR-ish" grid. Placeholder until
// Gigs returns a real eSIM activation QR via the Connect Session flow.
function placeholderQrCells(seed: string, size = 21): boolean[][] {
  // 21×21 is a Version-1 QR code size. We don't generate a real one —
  // we just paint a recognisable mask + finder patterns so the user
  // sees the right *shape* in the activate step.
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  const rand = () => {
    h = (h * 1664525 + 1013904223) | 0;
    return (h >>> 0) / 0xffffffff;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      grid[y][x] = rand() > 0.55;
    }
  }
  // Stamp the three finder patterns (top-left, top-right, bottom-left)
  // as solid 7×7 squares so it reads as a QR.
  const stamp = (cx: number, cy: number) => {
    for (let dy = 0; dy < 7; dy++) {
      for (let dx = 0; dx < 7; dx++) {
        const onBorder = dx === 0 || dy === 0 || dx === 6 || dy === 6;
        const onCenter = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        grid[cy + dy][cx + dx] = onBorder || onCenter;
      }
    }
  };
  stamp(0, 0);
  stamp(size - 7, 0);
  stamp(0, size - 7);
  // Quiet zone around finders
  return grid;
}

function QrPlaceholder({ seed }: { seed: string }) {
  const size = 21;
  const cell = 12;
  const padding = 12;
  const total = size * cell + padding * 2;
  const cells = placeholderQrCells(seed, size);
  return (
    <svg
      role="img"
      aria-label="eSIM install QR — illustrative placeholder"
      viewBox={`0 0 ${total} ${total}`}
      width={total}
      height={total}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={total} height={total} fill="#f4efe6" rx="16" />
      {cells.flatMap((row, y) =>
        row.map((on, x) =>
          on ? (
            <rect
              key={`${x}-${y}`}
              x={padding + x * cell}
              y={padding + y * cell}
              width={cell}
              height={cell}
              fill="#0f1b2d"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

export default async function ActivateStep({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
    name?: string;
    age?: string;
    school?: string;
    plan?: string;
  }>;
}) {
  const { name, email, plan } = await searchParams;
  const childName = name || "your child";
  const seed = `${email ?? "demo"}-${plan ?? "default"}-${name ?? ""}`;

  return (
    <>
      <h1 className={shared.headline}>
        One scan and you&rsquo;re <em>on</em>.
      </h1>
      <p className={shared.lede}>
        {childName}&rsquo;s SIM is ready. Scan the code with their phone — iOS and Android both
        install eSIMs straight from the camera.
      </p>

      <div className={styles.activate}>
        <div className={styles.qrWrap}>
          <QrPlaceholder seed={seed} />
          <p className={styles.qrCaption}>
            Illustrative QR — the real activation code comes from Gigs when this is wired up.
          </p>
        </div>

        <ol className={styles.steps}>
          <li>
            <span className={styles.stepNum}>01</span>
            <span>
              Open the camera app on <strong>{childName}&rsquo;s</strong> phone and point it
              at the code.
            </span>
          </li>
          <li>
            <span className={styles.stepNum}>02</span>
            <span>Tap the prompt to add Haven to Cellular Plans.</span>
          </li>
          <li>
            <span className={styles.stepNum}>03</span>
            <span>
              Label the line <strong>Haven</strong>, and set it as the default. Existing plans
              can stay as backup.
            </span>
          </li>
          <li>
            <span className={styles.stepNum}>04</span>
            <span>
              Wait a minute for the network to come up. The first call or text proves it works.
            </span>
          </li>
        </ol>
      </div>

      <form action={submitActivate} className={styles.cta}>
        <div className={shared.actions}>
          <Link
            href={`/setup/plan?email=${encodeURIComponent(email ?? "")}&plan=${encodeURIComponent(plan ?? "")}`}
            className={shared.back}
          >
            ← Back
          </Link>
          <button type="submit" className={shared.continueBtn}>
            I&rsquo;ve installed it →
          </button>
        </div>
      </form>

      <p className={shared.note}>
        Stuck? Email{" "}
        <a href="mailto:hello@gethavenmobile.com">hello@gethavenmobile.com</a> and someone real
        will reply within the hour during UK working hours.
      </p>
    </>
  );
}
