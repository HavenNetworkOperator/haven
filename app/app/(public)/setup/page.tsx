import { redirect } from "next/navigation";

// /setup with no step lands on the first step, carrying any /plans
// pre-selection through.
export default async function SetupRoot({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  redirect(plan ? `/setup/account?plan=${encodeURIComponent(plan)}` : "/setup/account");
}
