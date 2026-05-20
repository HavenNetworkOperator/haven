import PublicHeader from "@/_components/PublicHeader";
import Footer from "@/_components/Footer";

// Public/sales pages — /plans now, /setup later. Separate from the
// (dashboard) group so the header doesn't carry signed-in nav.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main className="container">{children}</main>
      <Footer />
    </>
  );
}
