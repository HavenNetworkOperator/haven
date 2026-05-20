import Header from "@/_components/Header";
import Footer from "@/_components/Footer";

// Dashboard layout — wraps the parent-facing routes (home, /family,
// /c/[id]/*, /council, /account, etc). The child PWA at /me/[token]
// lives outside this group and has its own minimal shell.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="container">{children}</main>
      <Footer />
    </>
  );
}
