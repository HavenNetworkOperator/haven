export default function Footer() {
  return (
    <footer className="container">
      <div className="foot">
        <div>
          The Good Phone Company Ltd · Trading as Haven
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="https://gethavenmobile.com/privacy">Privacy</a>
          <a href="https://gethavenmobile.com/compliance">Compliance</a>
          <a href="/help">Help</a>
        </div>
      </div>
    </footer>
  );
}
