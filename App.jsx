import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const RED = "#CF2D36";
const BLACK = "#111111";
const LIGHT = "#F5F5F5";
const BORDER = "#E7E7E7";
const GREEN = "#2E9B4B";
const GREEN_BG = "rgba(46, 155, 75, 0.18)";

const booths = [
  {
    id: 1,
    name: "Gisada",
    qrValue: "GISADA",
    area: { left: 21.2, top: 2.0, width: 19.0, height: 7.3 },
  },
  {
    id: 2,
    name: "P&I Parfums",
    qrValue: "PI-PARFUMS",
    area: { left: 49.0, top: 2.1, width: 14.2, height: 7.2 },
  },
  {
    id: 3,
    name: "Karikaturist",
    qrValue: "KARIKATURIST",
    area: { left: 66.8, top: 2.0, width: 11.8, height: 6.0 },
  },
  {
    id: 4,
    name: "Jean-Pierre Rossellet",
    qrValue: "JEAN-PIERRE-ROSSELLET",
    area: { left: 43.8, top: 14.1, width: 4.8, height: 7.0 },
  },
  {
    id: 5,
    name: "Nobilis Group",
    qrValue: "NOBILIS-GROUP",
    area: { left: 49.5, top: 14.0, width: 13.5, height: 7.0 },
  },
  {
    id: 6,
    name: "Flariel",
    qrValue: "FLARIEL",
    area: { left: 43.9, top: 21.5, width: 4.6, height: 8.4 },
  },
  {
    id: 7,
    name: "Bode Studios",
    qrValue: "BODE-STUDIOS",
    area: { left: 49.4, top: 21.6, width: 13.5, height: 8.0 },
  },
  {
    id: 8,
    name: "L'Oréal Luxe",
    qrValue: "LOREAL-LUXE",
    area: { left: 40.7, top: 38.3, width: 25.8, height: 24.0 },
  },
  {
    id: 9,
    name: "Clarins",
    qrValue: "CLARINS",
    area: { left: 48.7, top: 69.1, width: 14.5, height: 7.2 },
  },
  {
    id: 10,
    name: "Bvlgari",
    qrValue: "BVLGARI",
    area: { left: 48.6, top: 77.1, width: 14.5, height: 7.1 },
  },
  {
    id: 11,
    name: "Shiseido",
    qrValue: "SHISEIDO",
    area: { left: 48.8, top: 90.0, width: 14.5, height: 7.2 },
  },
  {
    id: 12,
    name: "Eurocos Cosmetic / Give Back Beauty",
    qrValue: "EUROCOS",
    area: { left: 20.5, top: 67.5, width: 16.0, height: 15.0 },
    rotate: -45,
  },
  {
    id: 13,
    name: "Coty",
    qrValue: "COTY",
    area: { left: 13.5, top: 90.0, width: 25.4, height: 6.8 },
  },
  {
    id: 14,
    name: "Puig",
    qrValue: "PUIG",
    area: { left: 27.0, top: 14.0, width: 6.5, height: 23.0 },
  },
  {
    id: 15,
    name: "Estée Lauder",
    qrValue: "ESTEE-LAUDER",
    area: { left: 1.8, top: 17.0, width: 8.0, height: 66.5 },
  },
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [registered, setRegistered] = useState(false);
  const [visited, setVisited] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [message, setMessage] = useState("");

  const scannerRef = useRef(null);
  const qrRegionId = "qr-reader-region";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("impoJubiUser");
    const savedVisited = localStorage.getItem("impoJubiVisited");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setFirstname(user.firstname || "");
        setLastname(user.lastname || "");
        setRegistered(true);
      } catch {
        localStorage.removeItem("impoJubiUser");
      }
    }

    if (savedVisited) {
      try {
        setVisited(JSON.parse(savedVisited));
      } catch {
        localStorage.removeItem("impoJubiVisited");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "impoJubiVisited",
      JSON.stringify(visited)
    );
  }, [visited]);

  const register = () => {
    if (!firstname.trim() || !lastname.trim()) {
      alert("Please enter your first and last name.");
      return;
    }

    const user = {
      id: crypto.randomUUID(),
      firstname: firstname.trim(),
      lastname: lastname.trim(),
    };

    localStorage.setItem("impoJubiUser", JSON.stringify(user));

    setFirstname(user.firstname);
    setLastname(user.lastname);
    setRegistered(true);
  };

  const progress = Math.round(
    (visited.length / booths.length) * 100
  );

  const handleBoothClick = (booth) => {
    if (visited.includes(booth.id)) {
      setMessage(`${booth.name} already visited.`);
      return;
    }

    setSelectedBooth(booth);
    setMessage("");
    startScanner();
  };

  const markBoothVisited = (decodedText) => {
    if (!selectedBooth) {
      return false;
    }

    const cleanValue = decodedText.trim().toUpperCase();

    if (cleanValue !== selectedBooth.qrValue.toUpperCase()) {
      setMessage("Wrong QR code for this booth.");
      return false;
    }

    setVisited((prev) => {
      if (prev.includes(selectedBooth.id)) {
        return prev;
      }

      return [...prev, selectedBooth.id];
    });

    setMessage(`${selectedBooth.name} successfully collected.`);
    return true;
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
      } catch {
        // ignore cleanup errors
      }

      scannerRef.current = null;
    }

    setScannerOpen(false);
  };

  const startScanner = () => {
    if (scannerOpen || scannerRef.current) {
      return;
    }

    setScannerOpen(true);

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
    }, 100);
  };

  if (showSplash) {
    return (
      <div style={styles.splash}>
        <img
          src="/LogoJubi.png"
          alt="50 Years Import Parfumerie"
          style={styles.splashLogo}
        />
      </div>
    );
  }

  if (!registered) {
    return (
      <div style={styles.page}>
        <div style={styles.app}>
          <header style={styles.header}>
            <img
              src="/impo_logo.png"
              alt="Import Parfumerie"
              style={styles.logo}
            />
          </header>

          <main style={styles.content}>
            <div style={styles.jubiLogoWrapper}>
              <img
                src="/LogoJubi.png"
                alt="50 Years Import Parfumerie"
                style={styles.jubiLogo}
              />
            </div>

            <h1 style={styles.title}>Welcome!</h1>

            <p style={styles.intro}>
              Discover our anniversary event and collect your
              booth visits in your personal digital brand pass.
            </p>

            <label style={styles.label}>First name</label>

            <input
              style={styles.input}
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="First name"
              autoComplete="given-name"
            />

            <label style={styles.label}>Last name</label>

            <input
              style={styles.input}
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Last name"
              autoComplete="family-name"
            />

            <button
              style={styles.primaryButton}
              onClick={register}
            >
              START
            </button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.app}>
        <header style={styles.header}>
          <img
            src="/impo_logo.png"
            alt="Import Parfumerie"
            style={styles.logo}
          />
        </header>

        <main style={styles.content}>
          <p style={styles.eyebrow}>
            50 YEARS IMPORT PARFUMERIE
          </p>

          <h1 style={styles.passTitle}>
            Hi {firstname}!
          </h1>

          <p style={styles.intro}>
            Welcome to our anniversary event.
          </p>

          <div style={styles.progressCard}>
            <div style={styles.progressTop}>
              <div>
                <div style={styles.progressNumber}>
                  {visited.length} / {booths.length}
                </div>

                <div style={styles.progressLabel}>
                  Booths visited
                </div>
              </div>

              <div style={styles.percent}>
                {progress}%
              </div>
            </div>

            <div style={styles.progressBackground}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          <h2 style={styles.sectionTitle}>
            Your brand pass
          </h2>

          <p style={styles.mapIntro}>
            Tap on a booth to scan its QR code.
          </p>

          <div style={styles.mapCard}>
            <div style={styles.mapWrapper}>
              <img
                src="/brand-map.png"
                alt="Brand fair map"
                style={styles.mapImage}
              />

              {booths.map((booth) => {
                const isVisited = visited.includes(booth.id);

                return (
                  <button
                    key={booth.id}
                    onClick={() =>
                      handleBoothClick(booth)
                    }
                    aria-label={booth.name}
                    title={booth.name}
                    style={{
                      ...styles.boothOverlay,
                      left: `${booth.area.left}%`,
                      top: `${booth.area.top}%`,
                      width: `${booth.area.width}%`,
                      height: `${booth.area.height}%`,
                      transform: booth.rotate
                        ? `rotate(${booth.rotate}deg)`
                        : "none",
                      background: isVisited
                        ? GREEN_BG
                        : "rgba(255,255,255,0.001)",
                      border: isVisited
                        ? `2px solid rgba(46,155,75,0.6)`
                        : "2px solid transparent",
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div style={styles.legend}>
            <div style={styles.legendItem}>
              <span style={styles.greenBox} />
              Visited
            </div>

            <div style={styles.legendItem}>
              <span style={styles.grayBox} />
              Not visited
            </div>
          </div>

          {message && (
            <div style={styles.message}>
              {message}
            </div>
          )}

          {scannerOpen && selectedBooth && (
            <div style={styles.scannerCard}>
              <div style={styles.scannerTitle}>
                Scan QR code
              </div>

              <div style={styles.scannerSubtitle}>
                {selectedBooth.name}
              </div>

              <div
                id={qrRegionId}
                style={styles.scannerRegion}
              />

              <button
                style={styles.secondaryButton}
                onClick={stopScanner}
              >
                CLOSE
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: LIGHT,
    fontFamily:
      '"Helvetica Neue", Helvetica, Arial, sans-serif',
    color: BLACK,
  },

  app: {
    maxWidth: 430,
    minHeight: "100vh",
    margin: "0 auto",
    background: "#FFFFFF",
  },

  splash: {
    position: "fixed",
    inset: 0,
    background: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  splashLogo: {
    width: "72%",
    maxWidth: 350,
    objectFit: "contain",
  },

  header: {
    height: 70,
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: `1px solid ${BORDER}`,
    background: "#FFFFFF",
  },

  logo: {
    width: 82,
    display: "block",
  },

  content: {
    padding: "28px 20px 40px",
  },

  jubiLogoWrapper: {
    display: "flex",
    justifyContent: "center",
    margin: "10px 0 34px",
  },

  jubiLogo: {
    width: "70%",
    maxWidth: 280,
    objectFit: "contain",
  },

  title: {
    margin: 0,
    fontSize: 36,
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: "-1px",
  },

  passTitle: {
    margin: "6px 0 8px",
    fontSize: 34,
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: "-1px",
  },

  eyebrow: {
    margin: 0,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "1.2px",
    color: RED,
  },

  intro: {
    margin: "12px 0 26px",
    fontSize: 16,
    lineHeight: 1.5,
    color: "#666666",
  },

  label: {
    display: "block",
    marginBottom: 7,
    fontSize: 13,
    fontWeight: 700,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px",
    marginBottom: 18,
    borderRadius: 8,
    border: `1px solid ${BORDER}`,
    fontSize: 16,
    outline: "none",
    background: "#FFFFFF",
  },

  primaryButton: {
    width: "100%",
    marginTop: 6,
    padding: "16px",
    border: 0,
    borderRadius: 8,
    background: RED,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: "0.7px",
    cursor: "pointer",
  },

  progressCard: {
    background: RED,
    color: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    margin: "26px 0 28px",
  },

  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressNumber: {
    fontSize: 30,
    fontWeight: 800,
  },

  progressLabel: {
    marginTop: 2,
    fontSize: 13,
    opacity: 0.9,
  },

  percent: {
    fontSize: 22,
    fontWeight: 800,
  },

  progressBackground: {
    height: 7,
    background: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    marginTop: 18,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "#FFFFFF",
    borderRadius: 20,
    transition: "width 0.4s ease",
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 800,
    margin: "0 0 6px",
  },

  mapIntro: {
    fontSize: 13,
    color: "#777777",
    margin: "0 0 14px",
  },

  mapCard: {
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: 8,
    background: "#FFFFFF",
  },

  mapWrapper: {
    position: "relative",
    width: "100%",
  },

  mapImage: {
    width: "100%",
    display: "block",
    borderRadius: 8,
  },

  boothOverlay: {
    position: "absolute",
    padding: 0,
    margin: 0,
    cursor: "pointer",
    zIndex: 5,
    transition:
      "background 0.25s ease, border 0.25s ease",
  },

  legend: {
    display: "flex",
    gap: 20,
    marginTop: 12,
    fontSize: 12,
    color: "#666666",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 7,
  },

  greenBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    background: GREEN_BG,
    border: `1px solid ${GREEN}`,
  },

  grayBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    border: `1px solid #BBBBBB`,
    background: "#FFFFFF",
  },

  message: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    background: "#F7F7F7",
    border: `1px solid ${BORDER}`,
    fontSize: 13,
  },

  scannerCard: {
    marginTop: 18,
    padding: 16,
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    background: "#FFFFFF",
  },

  scannerTitle: {
    fontSize: 20,
    fontWeight: 800,
  },

  scannerSubtitle: {
    marginTop: 4,
    marginBottom: 14,
    fontSize: 14,
    color: "#666666",
  },

  scannerRegion: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 10,
  },

  secondaryButton: {
    width: "100%",
    marginTop: 14,
    padding: "14px",
    borderRadius: 8,
    border: `1px solid ${BLACK}`,
    background: "#FFFFFF",
    color: BLACK,
    fontWeight: 800,
    cursor: "pointer",
  },
};
