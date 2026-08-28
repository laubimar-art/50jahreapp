import React, { useEffect, useRef, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

const RED = "#CF2D36";
const BLACK = "#111111";
const LIGHT = "#F5F5F5";
const BORDER = "#E7E7E7";

const GREEN = "#209447";
const GREEN_BG = "rgba(32, 148, 71, 0.18)";

const USER_STORAGE_KEY = "impoJubiUserV2";
const VISITED_STORAGE_KEY = "impoJubiVisitedV2";

// TEST MODE:
// - all booths are displayed green
// - the GISADA QR works for every booth
const TEST_MODE = true;
const TEST_QR_VALUE = "GISADA";

const booths = [
  {
    id: 1,
    name: "Gisada",
    qrValue: "GISADA",
    area: {
      left: 15.0,
      top: 4.6,
      width: 25.5,
      height: 5.9,
    },
  },
  {
    id: 2,
    name: "P&I Parfums",
    qrValue: "PI-PARFUMS",
    area: {
      left: 48.6,
      top: 3.1,
      width: 15.4,
      height: 9.0,
    },
  },
  {
    id: 3,
    name: "Karikaturist",
    qrValue: "KARIKATURIST",
    area: {
      left: 66.8,
      top: 3.2,
      width: 12.5,
      height: 8.0,
    },
  },
  {
    id: 4,
    name: "Jean-Pierre Rossellet",
    qrValue: "JEAN-PIERRE-ROSSELLET",
    area: {
      left: 43.9,
      top: 12.2,
      width: 5.1,
      height: 10.2,
    },
  },
  {
    id: 5,
    name: "Nobilis Group",
    qrValue: "NOBILIS-GROUP",
    area: {
      left: 48.6,
      top: 12.0,
      width: 15.4,
      height: 8.9,
    },
  },
  {
    id: 6,
    name: "Flariel",
    qrValue: "FLARIEL",
    area: {
      left: 43.9,
      top: 22.4,
      width: 5.1,
      height: 10.4,
    },
  },
  {
    id: 7,
    name: "Bode Studios",
    qrValue: "BODE-STUDIOS",
    area: {
      left: 48.6,
      top: 20.8,
      width: 15.4,
      height: 11.8,
    },
  },
  {
    id: 8,
    name: "L'Oréal Luxe",
    qrValue: "LOREAL-LUXE",
    shape: "circle",
    area: {
      left: 40.3,
      top: 37.0,
      width: 26.4,
      height: 24.8,
    },
  },
  {
    id: 9,
    name: "Clarins",
    qrValue: "CLARINS",
    area: {
      left: 48.0,
      top: 68.2,
      width: 15.3,
      height: 7.8,
    },
  },
  {
    id: 10,
    name: "Bvlgari",
    qrValue: "BVLGARI",
    area: {
      left: 48.0,
      top: 76.3,
      width: 15.3,
      height: 7.5,
    },
  },
  {
    id: 11,
    name: "Shiseido",
    qrValue: "SHISEIDO",
    area: {
      left: 48.0,
      top: 89.0,
      width: 15.3,
      height: 8.3,
    },
  },
  {
    id: 12,
    name: "Deurocos Cosmetic",
    qrValue: "DEUROCOS-COSMETIC",
    rotate: -45,
    area: {
      left: 20.8,
      top: 68.0,
      width: 15.5,
      height: 8.0,
    },
  },
  {
    id: 13,
    name: "Give Back Beauty",
    qrValue: "GIVE-BACK-BEAUTY",
    rotate: -45,
    area: {
      left: 25.1,
      top: 75.0,
      width: 12.0,
      height: 5.3,
    },
  },
  {
    id: 14,
    name: "Coty",
    qrValue: "COTY",
    area: {
      left: 13.6,
      top: 87.7,
      width: 25.3,
      height: 8.5,
    },
  },
  {
    id: 15,
    name: "Puig",
    qrValue: "PUIG",
    area: {
      left: 27.2,
      top: 14.4,
      width: 7.2,
      height: 23.2,
    },
  },
  {
    id: 16,
    name: "Estée Lauder",
    qrValue: "ESTEE-LAUDER",
    area: {
      left: 3.3,
      top: 18.7,
      width: 10.0,
      height: 68.3,
    },
  },
];

function loadJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function createUserId() {
  return (
    window.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random()}`
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [user, setUser] = useState(() =>
    loadJSON(USER_STORAGE_KEY, null)
  );

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
  });

  const [visited, setVisited] = useState(() =>
    loadJSON(VISITED_STORAGE_KEY, [])
  );

  const [selectedBooth, setSelectedBooth] = useState(null);
  const [scannerStatus, setScannerStatus] = useState("");
  const [message, setMessage] = useState("");
  const [mapError, setMapError] = useState(false);

  const scannerRef = useRef(null);
  const scannerSectionRef = useRef(null);
  const scanLockedRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setShowSplash(false),
      2200
    );

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    saveJSON(VISITED_STORAGE_KEY, visited);
  }, [visited]);

  const progress = Math.round(
    (visited.length / booths.length) * 100
  );

  const register = () => {
    const firstname = form.firstname.trim();
    const lastname = form.lastname.trim();

    if (!firstname || !lastname) {
      alert("Please enter your first and last name.");
      return;
    }

    const newUser = {
      id: createUserId(),
      firstname,
      lastname,
    };

    saveJSON(USER_STORAGE_KEY, newUser);
    setUser(newUser);
  };

  const stopScanner = async () => {
    const scanner = scannerRef.current;

    if (!scanner) return;

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch (error) {
      console.log("Scanner stop:", error);
    }

    try {
      scanner.clear();
    } catch (error) {
      console.log("Scanner clear:", error);
    }

    scannerRef.current = null;
  };

  const closeScanner = async () => {
    scanLockedRef.current = true;

    await stopScanner();

    setSelectedBooth(null);
    setScannerStatus("");

    scanLockedRef.current = false;
  };

  const openScanner = async (booth) => {
    if (!TEST_MODE && visited.includes(booth.id)) {
      setMessage(`✓ ${booth.name} already visited.`);
      return;
    }

    await stopScanner();

    setMessage("");
    setScannerStatus("");
    setSelectedBooth(booth);
  };

  useEffect(() => {
    if (!selectedBooth) return;

    const timer = window.setTimeout(() => {
      scannerSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [selectedBooth]);

  useEffect(() => {
    if (!selectedBooth) return;

    let cancelled = false;

    const startScanner = async () => {
      scanLockedRef.current = false;
      setScannerStatus("Starting camera...");

      await new Promise((resolve) =>
        window.setTimeout(resolve, 350)
      );

      if (cancelled) return;

      const scannerElement =
        document.getElementById("qr-reader-region");

      if (!scannerElement) {
        setScannerStatus("Scanner could not be loaded.");
        return;
      }

      try {
        const scanner = new Html5Qrcode(
          "qr-reader-region",
          {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
            ],
            verbose: false,
          }
        );

        scannerRef.current = scanner;

        const handleSuccess = async (decodedText) => {
          if (scanLockedRef.current) return;

          scanLockedRef.current = true;

          const scannedValue = String(decodedText)
            .trim()
            .toUpperCase();

          const expectedValue = (
            TEST_MODE
              ? TEST_QR_VALUE
              : selectedBooth.qrValue
          ).toUpperCase();

          if (scannedValue !== expectedValue) {
            setMessage(
              TEST_MODE
                ? "For testing, please scan the GISADA QR code."
                : `Wrong QR code. Please scan the QR code for ${selectedBooth.name}.`
            );

            scanLockedRef.current = false;
            return;
          }

          setVisited((current) =>
            current.includes(selectedBooth.id)
              ? current
              : [...current, selectedBooth.id]
          );

          setMessage(
            `✓ ${selectedBooth.name} successfully collected.`
          );

          await stopScanner();

          setSelectedBooth(null);
          setScannerStatus("");

          scanLockedRef.current = false;
        };

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 15,

            qrbox: (width, height) => {
              const size = Math.floor(
                Math.min(width, height) * 0.85
              );

              return {
                width: size,
                height: size,
              };
            },

            disableFlip: false,
          },
          handleSuccess,
          () => {}
        );

        if (!cancelled) {
          setScannerStatus(
            TEST_MODE
              ? "TEST MODE – scan the GISADA QR code."
              : "Camera ready – point it at the QR code."
          );
        }
      } catch (error) {
        console.error("QR scanner error:", error);

        scannerRef.current = null;

        setScannerStatus(
          "Camera could not be started."
        );

        setMessage(
          "Please allow camera access and try again."
        );
      }
    };

    startScanner();

    return () => {
      cancelled = true;
    };
  }, [selectedBooth]);

  if (showSplash) {
    return (
      <Splash />
    );
  }

  if (!user) {
    return (
      <Page>
        <Header />

        <main style={styles.registrationContent}>
          <div style={styles.jubiLogoWrapper}>
            <img
              src="/LogoJubi.png"
              alt="50 Years Import Parfumerie"
              style={styles.jubiLogo}
            />
          </div>

          <h1 style={styles.registrationTitle}>
            Welcome!
          </h1>

          <p style={styles.registrationIntro}>
            Discover our anniversary event and collect
            the brands you visit in your personal
            digital brand pass.
          </p>

          <label style={styles.label}>
            First name
          </label>

          <input
            style={styles.input}
            value={form.firstname}
            placeholder="First name"
            autoComplete="given-name"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                firstname: event.target.value,
              }))
            }
          />

          <label style={styles.label}>
            Last name
          </label>

          <input
            style={styles.input}
            value={form.lastname}
            placeholder="Last name"
            autoComplete="family-name"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                lastname: event.target.value,
              }))
            }
          />

          <button
            type="button"
            style={styles.primaryButton}
            onClick={register}
          >
            START
          </button>
        </main>
      </Page>
    );
  }

  return (
    <Page>
      <Header />

      <main style={styles.content}>
        <p style={styles.eyebrow}>
          50 YEARS IMPORT PARFUMERIE
        </p>

        <h1 style={styles.passTitle}>
          Hi {user.firstname}!
        </h1>

        <p style={styles.intro}>
          Welcome to our anniversary event.
        </p>

        <Progress
          visited={visited.length}
          total={booths.length}
          progress={progress}
        />

        <h2 style={styles.sectionTitle}>
          Your brand pass
        </h2>

        <p style={styles.mapIntro}>
          Tap on a booth to scan its QR code.
        </p>

        <div style={styles.mapCard}>
          {!mapError ? (
            <div style={styles.mapWrapper}>
              <img
                src="/brand-map.png"
                alt="Brand fair map"
                style={styles.mapImage}
                onError={() => setMapError(true)}
              />

              {booths.map((booth) => {
                const isVisited =
                  TEST_MODE ||
                  visited.includes(booth.id);

                return (
                  <button
                    key={booth.id}
                    type="button"
                    aria-label={booth.name}
                    title={booth.name}
                    onClick={() =>
                      openScanner(booth)
                    }
                    style={{
                      ...styles.boothOverlay,

                      left: `${booth.area.left}%`,
                      top: `${booth.area.top}%`,
                      width: `${booth.area.width}%`,
                      height: `${booth.area.height}%`,

                      transform: booth.rotate
                        ? `rotate(${booth.rotate}deg)`
                        : undefined,

                      borderRadius:
                        booth.shape === "circle"
                          ? "50%"
                          : 2,

                      background: isVisited
                        ? GREEN_BG
                        : "transparent",

                      border: isVisited
                        ? `1.5px solid ${GREEN}`
                        : "1.5px solid transparent",
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div style={styles.mapError}>
              <strong>Map image not found.</strong>

              <div style={{ marginTop: 8 }}>
                Upload the original image to the{" "}
                <strong>public</strong> folder as:
              </div>

              <code style={styles.code}>
                brand-map.png
              </code>
            </div>
          )}
        </div>

        <div style={styles.legend}>
          <Legend
            color={GREEN_BG}
            border={GREEN}
            label="Visited"
          />

          <Legend
            color="#FFFFFF"
            border="#BBBBBB"
            label="Not visited"
          />
        </div>

        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}

        {selectedBooth && (
          <Scanner
            booth={selectedBooth}
            status={scannerStatus}
            scannerSectionRef={scannerSectionRef}
            onClose={closeScanner}
          />
        )}
      </main>
    </Page>
  );
}

// ==================================================
// SMALL UI COMPONENTS
// ==================================================

function Page({ children }) {
  return (
    <div style={styles.page}>
      <div style={styles.app}>
        {children}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header style={styles.header}>
      <img
        src="/impo_logo.png"
        alt="Import Parfumerie"
        style={styles.logo}
      />
    </header>
  );
}

function Splash() {
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

function Progress({
  visited,
  total,
  progress,
}) {
  return (
    <div style={styles.progressCard}>
      <div style={styles.progressTop}>
        <div>
          <div style={styles.progressNumber}>
            {visited} / {total}
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
  );
}

function Legend({
  color,
  border,
  label,
}) {
  return (
    <div style={styles.legendItem}>
      <span
        style={{
          ...styles.legendBox,
          background: color,
          border: `1px solid ${border}`,
        }}
      />

      <span>{label}</span>
    </div>
  );
}

function Scanner({
  booth,
  status,
  scannerSectionRef,
  onClose,
}) {
  return (
    <div
      ref={scannerSectionRef}
      style={styles.scannerCard}
    >
      <div style={styles.scannerHeader}>
        <div>
          <div style={styles.scannerTitle}>
            Scan QR code
          </div>

          <div style={styles.scannerSubtitle}>
            {booth.name}
          </div>
        </div>

        <div style={styles.scannerBadge}>
          QR
        </div>
      </div>

      <div style={styles.scannerStatus}>
        {status}
      </div>

      <div
        id="qr-reader-region"
        style={styles.scannerRegion}
      />

      <button
        type="button"
        style={styles.secondaryButton}
        onClick={onClose}
      >
        CLOSE
      </button>
    </div>
  );
}

// ==================================================
// STYLES
// ==================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: LIGHT,
    color: BLACK,
    fontFamily:
      '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },

  app: {
    maxWidth: 430,
    minHeight: "100vh",
    margin: "0 auto",
    background: "#FFFFFF",
  },

  header: {
    height: 70,
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: `1px solid ${BORDER}`,
  },

  logo: {
    width: 82,
    display: "block",
  },

  splash: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFFFFF",
  },

  splashLogo: {
    width: "72%",
    maxWidth: 350,
    objectFit: "contain",
  },

  registrationContent: {
    padding: "30px 20px 50px",
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

  registrationTitle: {
    margin: 0,
    fontSize: 36,
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: "-1px",
  },

  registrationIntro: {
    margin: "12px 0 30px",
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
    padding: 15,
    marginBottom: 18,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    background: "#FFFFFF",
    fontSize: 16,
    outline: "none",
  },

  primaryButton: {
    width: "100%",
    padding: 16,
    marginTop: 5,
    border: 0,
    borderRadius: 8,
    background: RED,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: "0.7px",
    cursor: "pointer",
  },

  content: {
    padding: "28px 20px 60px",
  },

  eyebrow: {
    margin: 0,
    color: RED,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "1.2px",
  },

  passTitle: {
    margin: "6px 0 8px",
    fontSize: 34,
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: "-1px",
  },

  intro: {
    margin: "12px 0 26px",
    color: "#666666",
    fontSize: 16,
    lineHeight: 1.5,
  },

  progressCard: {
    padding: 20,
    margin: "26px 0 28px",
    borderRadius: 14,
    background: RED,
    color: "#FFFFFF",
  },

  progressTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
    marginTop: 18,
    overflow: "hidden",
    borderRadius: 999,
    background:
      "rgba(255,255,255,0.30)",
  },

  progressBar: {
    height: "100%",
    borderRadius: 999,
    background: "#FFFFFF",
    transition: "width 0.4s ease",
  },

  sectionTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
  },

  mapIntro: {
    margin: "6px 0 14px",
    color: "#777777",
    fontSize: 13,
    lineHeight: 1.4,
  },

  mapCard: {
    padding: 6,
    overflow: "hidden",
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    background: "#FFFFFF",
  },

  mapWrapper: {
    position: "relative",
    width: "100%",
    lineHeight: 0,
  },

  mapImage: {
    width: "100%",
    height: "auto",
    display: "block",
    userSelect: "none",
    WebkitUserDrag: "none",
  },

  boothOverlay: {
    position: "absolute",
    zIndex: 5,
    boxSizing: "border-box",
    padding: 0,
    margin: 0,
    outline: "none",
    cursor: "pointer",
    WebkitTapHighlightColor:
      "transparent",
    transition:
      "background 0.2s ease, border 0.2s ease",
  },

  mapError: {
    padding: 30,
    background: "#FAFAFA",
    color: "#555555",
    fontSize: 14,
    lineHeight: 1.5,
    textAlign: "center",
  },

  code: {
    display: "inline-block",
    padding: "6px 10px",
    marginTop: 12,
    borderRadius: 6,
    background: "#EEEEEE",
  },

  legend: {
    display: "flex",
    gap: 22,
    marginTop: 13,
    color: "#666666",
    fontSize: 12,
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 7,
  },

  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },

  message: {
    padding: 13,
    marginTop: 16,
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    background: "#F7F7F7",
    fontSize: 13,
    lineHeight: 1.4,
  },

  scannerCard: {
    padding: 16,
    marginTop: 20,
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    background: "#FFFFFF",
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.08)",
    scrollMarginTop: 16,
  },

  scannerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  scannerTitle: {
    fontSize: 20,
    fontWeight: 800,
  },

  scannerSubtitle: {
    marginTop: 4,
    color: "#666666",
    fontSize: 14,
  },

  scannerBadge: {
    minWidth: 38,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 8px",
    borderRadius: 8,
    background: RED,
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: 800,
  },

  scannerStatus: {
    margin: "10px 0 14px",
    color: "#777777",
    fontSize: 12,
    lineHeight: 1.4,
  },

  scannerRegion: {
    width: "100%",
    minHeight: 300,
    overflow: "hidden",
    borderRadius: 10,
    background: "#111111",
  },

  secondaryButton: {
    width: "100%",
    padding: 14,
    marginTop: 14,
    border: `1px solid ${BLACK}`,
    borderRadius: 8,
    background: "#FFFFFF",
    color: BLACK,
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },
};
