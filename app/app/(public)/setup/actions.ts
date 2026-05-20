"use server";

import { redirect } from "next/navigation";

// Server actions for each wizard step. State flows through URL params
// because there's no DB or session yet — refresh-safe, shareable,
// trivially debuggable. Once auth + Postgres land, replace these with
// real persistence + a session-scoped wizard ID.

function build(path: string, params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) search.set(k, v);
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

export async function submitAccount(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email || !/.+@.+\..+/.test(email)) {
    redirect(build("/setup/account", { error: "invalid_email" }));
  }
  // TODO (live): call findUserByEmail(email). If exists → re-route into
  // sign-in flow with a magic link. If not → continue, will be created
  // when we POST the subscription on activate.
  redirect(build("/setup/child", { email }));
}

export async function submitChild(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const age = String(formData.get("age") ?? "").trim();
  const school = String(formData.get("school") ?? "").trim();

  if (!name) redirect(build("/setup/child", { email, error: "name" }));
  const ageNum = Number(age);
  if (!Number.isFinite(ageNum) || ageNum < 14 || ageNum > 17) {
    redirect(build("/setup/child", { email, name, school, error: "age" }));
  }

  // Carry through the previously-selected plan if /plans linked us here.
  const planFromForm = String(formData.get("plan") ?? "");

  redirect(
    build("/setup/plan", {
      email,
      name,
      age,
      school: school || undefined,
      plan: planFromForm || undefined,
    }),
  );
}

export async function submitPlan(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const name = String(formData.get("name") ?? "");
  const age = String(formData.get("age") ?? "");
  const school = String(formData.get("school") ?? "");
  const plan = String(formData.get("plan") ?? "");

  if (!plan) {
    redirect(
      build("/setup/plan", { email, name, age, school, error: "plan" }),
    );
  }

  // TODO (live): create a Connect Session with intent
  // `checkoutNewSubscription`, pre-fill the user details + selected plan,
  // and redirect to the hosted Gigs URL. The callback returns to
  // /setup/activate with the new subscription ID.

  redirect(
    build("/setup/activate", { email, name, age, school, plan }),
  );
}

export async function submitActivate() {
  // TODO (live): mark the subscription activated in Postgres once Gigs
  // confirms the eSIM install via webhook. For the demo, just drop the
  // parent into the dashboard.
  redirect("/");
}
