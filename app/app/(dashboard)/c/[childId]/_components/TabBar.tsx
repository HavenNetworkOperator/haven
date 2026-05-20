"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./TabBar.module.css";

type Tab = { label: string; href: string; match: (path: string) => boolean };

export default function TabBar({ basePath }: { basePath: string }) {
  const pathname = usePathname() ?? basePath;

  const tabs: Tab[] = [
    { label: "Insights", href: basePath, match: (p) => p === basePath },
    {
      label: "History",
      href: `${basePath}/history`,
      match: (p) => p.startsWith(`${basePath}/history`),
    },
    {
      label: "Contacts",
      href: `${basePath}/contacts`,
      match: (p) => p.startsWith(`${basePath}/contacts`),
    },
    {
      label: "Limits",
      href: `${basePath}/limits`,
      match: (p) => p.startsWith(`${basePath}/limits`),
    },
    {
      label: "Device",
      href: `${basePath}/device`,
      match: (p) => p.startsWith(`${basePath}/device`),
    },
  ];

  return (
    <nav className={styles.tabs} aria-label="Child sections">
      <ul>
        {tabs.map((t) => {
          const active = t.match(pathname);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={`${styles.tab} ${active ? styles.active : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
