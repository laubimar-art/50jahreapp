import React, { useMemo, useState } from "react";

const BRAND = {
  red: "#CF2D36",
  black: "#000000",
  white: "#FFFFFF",
  soft: "#F7F7F8",
  line: "#E7E7EA",
  textMuted: "#6B6B73",
  success: "#1F9D55",
  successBg: "#EAF8F0",
};

const initialBooths = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Stand ${i + 1}`,
  qrValue: `STAND-${i + 1}`,
}));

const pageStyle = {
  minHeight: "100vh",
  background: BRAND.soft,
  color: BRAND.black,
  fontFamily: '"Nunito Sans", Arial, sans-serif',
};

const shellStyle = {
  maxWidth: 430,
  margin: "0 auto",
  minHeight: "100vh",
  background: BRAND.white,
  position: "relative",
  boxShadow: "0 0 0 1px rgba(0,0,0,0.03)",
};

const contentStyle = {
  padding: "18px 18px 28px 18px",
};

const logoWrapStyle = {
  position: "fixed",
  top: 12,
  right: 12,
  zIndex: 50,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(0,0,0,0.06)",
  borderRadius: 12,
  padding: "6px 8px",
  backdropFilter: "blur(6px)",
};

const heroStyle = {
  background: `linear-gradient(135deg, ${BRAND.red} 0%, #b5232b 100%)`,
  color: BRAND.white,
  borderRadius: 24,
  padding: 20,
  marginBottom: 16,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: 14,
  border: `1px solid ${BRAND.line}`,
  background: BRAND.white,
  padding: "14px 14px",
  fontSize: 16,
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  border: "none",
  borderRadius: 14,
  background: BRAND.red,
  color: BRAND.white,
  padding: "14px 16px",
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  ...buttonStyle,
  background: BRAND.white,
  color: BRAND.red,
  border: `1px solid ${BRAND.red}`,
};

function Logo() {
  return (
    <div style={logoWrapStyle}>
      <img
        src="/import-parfumerie.svg"
        alt="Import Parfumerie"
        style={{ width: 72, display: "block" }}
      />
    </div>
  );
}

function BoothTile({ booth, visited }) {
  return (
    <div
      style={{
        aspectRatio: "1 / 1",
        borderRadius: 18,
        border: visited ? "1px solid #B8E7CA" : `1px solid ${BRAND.line}`,
        background: visited ? BRAND.successBg : BRAND.white,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 8,
        padding: 6,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 800,
          background: visited ? BRAND.success : "#F1F1F3",
          color: visited ? BRAND.white : BRAND.textMuted,
        }}
      >
        {visited ? "✓" : booth.id}
      </div>
      <div style={{ fontSize: 11, lineHeight: 1.15, fontWeight: 700, color: visited ? BRAND.success : BRAND.black }}>
        {booth.name}
      </div>
    </div>
  );
}

export default function App() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("login");
  const [generatedCode, setGeneratedCode] = useState("");
  const [visited, setVisited] = useState([]);
  const [scanInput, setScanInput] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const filteredBooths = useMemo(() => {
    return initialBooths.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const progress = Math.round((visited.length / initialBooths.length) * 100);

  const sendCode = () => {
    if (!email || !email.includes("@")) {
      alert("Bitte eine gültige E-Mail-Adresse eingeben.");
      return;
    }
    const c = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(c);
    alert("Demo-Code: " + c);
    setStep("verify");
  };

  const verifyCode = () => {
    if (code === generatedCode) {
      setStep("app");
    } else {
      alert("Falscher Code.");
    }
  };

  const handleScan = () => {
    const value = scanInput.trim().toUpperCase();
    const booth = initialBooths.find((b) => b.qrValue === value);

    if (!booth) {
      setMessage("Ungültiger QR-Code.");
      return;
    }

    if (visited.includes(booth.id)) {
      setMessage(`${booth.name} wurde bereits bestätigt.`);
      return;
    }

    setVisited([...visited, booth.id]);
    setMessage(`${booth.name} erfolgreich bestätigt.`);
    setScanInput("");
  };

  const topSpacing = <div style={{ height: 62 }} />;

  if (step === "login") {
    return (
      <div style={pageStyle}>
        <Logo />
        <div style={shellStyle}>
          {topSpacing}
          <div style={contentStyle}>
            <div style={heroStyle}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5, opacity: 0.92 }}>50 JAHRE IMPORT PARFUMERIE</div>
              <h1 style={{ margin: "10px 0 8px 0", fontSize: 30, lineHeight: 1.05 }}>Brandmesse Pass</h1>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, opacity: 0.92 }}>
                Besuche alle 20 Stände, sammle Punkte und sichere dir die Teilnahme am Jubiläums-Erlebnis.
              </p>
            </div>

            <div style={{ background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 22, padding: 18 }}>
              <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>Willkommen</div>
              <div style={{ fontSize: 15, color: BRAND.textMuted, lineHeight: 1.5, marginBottom: 18 }}>
                Melde dich mit deiner E-Mail-Adresse an. Danach bestätigst du den Code und kannst direkt loslegen.
              </div>

              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>E-Mail-Adresse</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@beispiel.ch"
                style={{ ...inputStyle, marginBottom: 14 }}
              />

              <button onClick={sendCode} style={buttonStyle}>Jetzt anmelden</button>

              <div style={{ marginTop: 16, fontSize: 12, lineHeight: 1.5, color: BRAND.textMuted }}>
                Mit der Anmeldung akzeptierst du die Teilnahmebedingungen und den Versand eines Bestätigungscodes.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 16 }}>
              {[
                ["20", "Stände entdecken"],
                ["QR", "Besuche bestätigen"],
                ["100%", "Pass vervollständigen"],
              ].map(([big, small]) => (
                <div key={big} style={{ border: `1px solid ${BRAND.line}`, borderRadius: 18, padding: 14, background: "#FCFCFD" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: BRAND.red }}>{big}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.3, color: BRAND.textMuted, marginTop: 4 }}>{small}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div style={pageStyle}>
        <Logo />
        <div style={shellStyle}>
          {topSpacing}
          <div style={contentStyle}>
            <div style={heroStyle}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5, opacity: 0.92 }}>DOUBLE OPT-IN</div>
              <h1 style={{ margin: "10px 0 8px 0", fontSize: 28, lineHeight: 1.08 }}>E-Mail bestätigen</h1>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, opacity: 0.92 }}>
                Gib den Bestätigungscode ein, um deinen Brandmesse Pass zu aktivieren.
              </p>
            </div>

            <div style={{ background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 22, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Bestätigungscode</div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="4-stelliger Code"
                style={{ ...inputStyle, marginBottom: 14, letterSpacing: 2, fontWeight: 800 }}
              />

              <button onClick={verifyCode} style={buttonStyle}>Anmeldung bestätigen</button>
              <button onClick={() => setStep("login")} style={{ ...secondaryButtonStyle, marginTop: 10 }}>Zurück</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Logo />
      <div style={shellStyle}>
        {topSpacing}
        <div style={contentStyle}>
          <div style={heroStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5, opacity: 0.92 }}>JUBILÄUMS-EVENT</div>
                <h1 style={{ margin: "8px 0 6px 0", fontSize: 28, lineHeight: 1.08 }}>Brandmesse Pass</h1>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, opacity: 0.92 }}>
                  Scan am Stand den QR-Code und fülle deinen digitalen Pass.
                </p>
              </div>
              <div style={{ minWidth: 82, textAlign: "right" }}>
                <div style={{ fontSize: 12, opacity: 0.9 }}>Fortschritt</div>
                <div style={{ fontSize: 24, fontWeight: 900 }}>{progress}%</div>
              </div>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.28)", marginTop: 14, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: BRAND.white, borderRadius: 999 }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 14 }}>
            <div style={{ border: `1px solid ${BRAND.line}`, borderRadius: 18, padding: 14, background: BRAND.white }}>
              <div style={{ fontSize: 12, color: BRAND.textMuted }}>Besucht</div>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{visited.length}/20</div>
            </div>
            <div style={{ border: `1px solid ${BRAND.line}`, borderRadius: 18, padding: 14, background: BRAND.white }}>
              <div style={{ fontSize: 12, color: BRAND.textMuted }}>Punkte</div>
              <div style={{ fontSize: 26, fontWeight: 900 }}>{visited.length * 10}</div>
            </div>
          </div>

          <div style={{ border: `1px solid ${BRAND.line}`, borderRadius: 22, padding: 16, background: BRAND.white, marginBottom: 14 }}>
            <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 6 }}>QR bestätigen</div>
            <div style={{ fontSize: 13, color: BRAND.textMuted, lineHeight: 1.45, marginBottom: 12 }}>
              Für den Prototyp gibst du den QR-Inhalt ein, z. B. <strong>STAND-1</strong>.
            </div>
            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="QR-Code eingeben"
              style={{ ...inputStyle, marginBottom: 12 }}
            />
            <button onClick={handleScan} style={buttonStyle}>Stand bestätigen</button>
            {message ? (
              <div style={{ marginTop: 12, borderRadius: 14, padding: 12, background: "#FAFAFB", border: `1px solid ${BRAND.line}`, fontSize: 13 }}>
                {message}
              </div>
            ) : null}
          </div>

          <div style={{ border: `1px solid ${BRAND.line}`, borderRadius: 22, padding: 16, background: BRAND.white }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900 }}>Stände</div>
                <div style={{ fontSize: 13, color: BRAND.textMuted }}>Kleine grafische Übersicht aller 20 Stände</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: BRAND.red }}>{visited.length} besucht</div>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Stand suchen"
              style={{ ...inputStyle, marginBottom: 12 }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {filteredBooths.map((booth) => (
                <BoothTile key={booth.id} booth={booth} visited={visited.includes(booth.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
