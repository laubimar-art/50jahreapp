import React, { useEffect, useMemo, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

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

const boothLogos = {
  1: "/BRAND-yves-saint-laurent-logo.avif",
  2: "/BRAND-clarins-logo.avif",
  3: "/BRAND-lancome-logo.avif",
};

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
  left: 12,
  zIndex: 60,
  background: "rgba(255,255,255,0.94)",
  border: "1px solid rgba(0,0,0,0.06)",
  borderRadius: 12,
  padding: "6px 8px",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
};

const splashOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "radial-gradient(circle at center, #ffffff 0%, #fbfbfc 62%, #f3f3f5 100%)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "opacity 0.9s ease, transform 0.9s ease",
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
  background: BRAND.black,
  color: BRAND.white,
  padding: "14px 16px",
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  ...buttonStyle,
  background: BRAND.white,
  color: BRAND.black,
  border: `1px solid ${BRAND.black}`,
};

function Logo() {
  return (
    <div style={logoWrapStyle}>
      <img
        src="/impo_logo.png"
        alt="Import Parfumerie"
        style={{ width: 72, display: "block" }}
      />
    </div>
  );
}

function Splash({ visible, fading }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        ...splashOverlayStyle,
        opacity: fading ? 0 : 1,
        transform: fading ? "scale(1.035)" : "scale(1)",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: 24,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "min(78vw, 420px)",
            height: "min(78vw, 420px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(207,45,54,0.11) 0%, rgba(207,45,54,0.05) 38%, rgba(255,255,255,0) 72%)",
            transform: entered ? "scale(1)" : "scale(0.82)",
            opacity: fading ? 0 : entered ? 1 : 0,
            transition: "all 1.1s ease",
            filter: "blur(6px)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            transform: fading ? "scale(1.06)" : entered ? "scale(1)" : "scale(0.9)",
            opacity: fading ? 0 : entered ? 1 : 0,
            transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <img
            src="/LogoJubi.png"
            alt="Jubiläumslogo"
            style={{
              width: "min(72vw, 360px)",
              maxWidth: 360,
              display: "block",
              objectFit: "contain",
              filter: "drop-shadow(0 18px 42px rgba(0,0,0,0.10))",
            }}
          />

          
        </div>
      </div>
    </div>
  );
}

function BoothTile({ booth, visited }) {
  const logo = boothLogos[booth.id];

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
        padding: 8,
        position: "relative",
      }}
    >
      {logo ? (
        <img
          src={logo}
          alt={booth.name}
          style={{
            maxWidth: "72%",
            maxHeight: "42%",
            objectFit: "contain",
            marginBottom: 4,
            filter: visited ? "none" : "grayscale(100%) opacity(0.7)",
          }}
        />
      ) : (
        <div
          style={{
            width: 28,
            height: 28,
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
      )}

      <div
        style={{
          fontSize: 11,
          lineHeight: 1.15,
          fontWeight: 700,
          color: visited ? BRAND.success : BRAND.black,
        }}
      >
        {booth.name}
      </div>

      {visited && (
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 20,
            height: 20,
            borderRadius: 999,
            background: BRAND.success,
            color: BRAND.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          ✓
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("login");
  const [generatedCode, setGeneratedCode] = useState("");
  const [visited, setVisited] = useState([]);
  const [scanInput, setScanInput] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  const scannerRef = useRef(null);
  const qrRegionId = "qr-reader-region";

  const filteredBooths = useMemo(() => {
    return initialBooths.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const progress = Math.round((visited.length / initialBooths.length) * 100);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setFadeSplash(true);
    }, 2100);

    const hideTimer = window.setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

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

  const markBoothVisited = (qrText) => {
    const value = qrText.trim().toUpperCase();
    const booth = initialBooths.find((b) => b.qrValue === value);

    if (!booth) {
      setMessage("Ungültiger QR-Code.");
      return false;
    }

    if (visited.includes(booth.id)) {
      setMessage(`${booth.name} wurde bereits bestätigt.`);
      return true;
    }

    setVisited((prev) => [...prev, booth.id]);
    setMessage(`${booth.name} erfolgreich bestätigt.`);
    return true;
  };

  const handleManualSubmit = () => {
    if (!scanInput.trim()) {
      setMessage("Bitte einen QR-Code eingeben.");
      return;
    }
    markBoothVisited(scanInput);
    setScanInput("");
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
      } catch (e) {
        // ignore cleanup errors
      }
      scannerRef.current = null;
    }
    setScannerOpen(false);
  };

  const startScanner = () => {
    if (scannerRef.current || scannerOpen) return;

    setScannerOpen(true);
    setMessage("");

    window.setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        qrRegionId,
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          rememberLastUsedCamera: true,
        },
        false
      );

      scanner.render(
        async (decodedText) => {
          const success = markBoothVisited(decodedText);
          if (success) {
            await stopScanner();
          }
        },
        () => {}
      );

      scannerRef.current = scanner;
    }, 50);
  };

  const topSpacing = <div style={{ height: 62 }} />;

  if (step === "login") {
    return (
      <div style={pageStyle}>
        <Splash visible={showSplash} fading={fadeSplash} />
        <Logo />
        <div style={shellStyle}>
          {topSpacing}
          <div style={contentStyle}>
            <div style={heroStyle}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5, opacity: 0.92 }}>
                50 JAHRE IMPORT PARFUMERIE
              </div>
              <h1 style={{ margin: "10px 0 8px 0", fontSize: 30, lineHeight: 1.05 }}>
                Brandmesse Pass
              </h1>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, opacity: 0.92 }}>
                Besuche alle 20 Stände, sammle Punkte und sichere dir die Teilnahme am Jubiläums-Erlebnis.
              </p>
            </div>

            <div style={{ background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 22, padding: 18 }}>
              <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>
                Willkommen
              </div>
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
                ["QR", "Codes scannen"],
                ["100%", "Pass vervollständigen"],
              ].map(([big, small]) => (
                <div
                  key={big}
                  style={{ border: `1px solid ${BRAND.line}`, borderRadius: 18, padding: 14, background: "#FCFCFD" }}
                >
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
        <Splash visible={showSplash} fading={fadeSplash} />
        <Logo />
        <div style={shellStyle}>
          {topSpacing}
          <div style={contentStyle}>
            <div style={heroStyle}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5, opacity: 0.92 }}>
                DOUBLE OPT-IN
              </div>
              <h1 style={{ margin: "10px 0 8px 0", fontSize: 28, lineHeight: 1.08 }}>
                E-Mail bestätigen
              </h1>
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
              <button onClick={() => setStep("login")} style={{ ...secondaryButtonStyle, marginTop: 10 }}>
                Zurück
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Splash visible={showSplash} fading={fadeSplash} />
      <Logo />
      <div style={shellStyle}>
        {topSpacing}
        <div style={contentStyle}>
          <div style={heroStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5, opacity: 0.92 }}>
                  JUBILÄUMS-EVENT
                </div>
                <h1 style={{ margin: "8px 0 6px 0", fontSize: 28, lineHeight: 1.08 }}>
                  Brandmesse Pass
                </h1>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, opacity: 0.92 }}>
                  Scanne am Stand den QR Code und fülle deinen digitalen Pass.
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
            <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 6 }}>QR Code scannen</div>
            <div style={{ fontSize: 13, color: BRAND.textMuted, lineHeight: 1.45, marginBottom: 12 }}>
              Öffne die Kamera deines Smartphones und scanne den QR Code am Stand. Für Tests kannst du unten weiterhin einen Wert wie <strong>STAND-1</strong> eingeben.
            </div>

            {!scannerOpen ? (
              <button onClick={startScanner} style={{ ...buttonStyle, marginBottom: 12 }}>
                QR Code scannen
              </button>
            ) : (
              <>
                <div
                  id={qrRegionId}
                  style={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: 16,
                    border: `1px solid ${BRAND.line}`,
                    marginBottom: 12,
                  }}
                />
                <button onClick={stopScanner} style={{ ...secondaryButtonStyle, marginBottom: 12 }}>
                  Scanner schliessen
                </button>
              </>
            )}

            <input
              type="text"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="QR-Code manuell eingeben"
              style={{ ...inputStyle, marginBottom: 12 }}
            />
            <button onClick={handleManualSubmit} style={buttonStyle}>Stand bestätigen</button>

            {message ? (
              <div
                style={{
                  marginTop: 12,
                  borderRadius: 14,
                  padding: 12,
                  background: "#FAFAFB",
                  border: `1px solid ${BRAND.line}`,
                  fontSize: 13,
                }}
              >
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
                <BoothTile
                  key={booth.id}
                  booth={booth}
                  visited={visited.includes(booth.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
