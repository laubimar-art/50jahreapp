import React, { useEffect, useRef, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";

// ==================================================
// COLORS
// ==================================================

const RED = "#CF2D36";
const BLACK = "#111111";
const LIGHT = "#F5F5F5";
const BORDER = "#E7E7E7";

const GREEN = "#209447";
const GREEN_BG = "rgba(32, 148, 71, 0.18)";

// ==================================================
// LOCAL STORAGE
// ==================================================

const USER_STORAGE_KEY = "impoJubiUserV2";
const VISITED_STORAGE_KEY = "impoJubiVisitedV2";

// ==================================================
// TEST MODE
// ==================================================
//
// true:
// - All booth areas are shown green
// - GISADA QR validates every selected booth
// - Every booth can be clicked repeatedly
//
// false:
// - Only successfully visited booths are green
// - Every booth requires its own QR code
//
const TEST_MODE = true;

const TEST_QR_VALUE = "GISADA";

// ==================================================
// BOOTHS
// ==================================================

const booths = [
  {
    id: 1,
    name: "Gisada",
    qrValue: "GISADA",

    area: {
      left: 12.8,
      top: 1.7,
      width: 26.8,
      height: 7.2,
    },
  },

  {
    id: 2,
    name: "P&I Parfums",
    qrValue: "PI-PARFUMS",

    area: {
      left: 48.6,
      top: 1.5,
      width: 15.4,
      height: 7.5,
    },
  },

  {
    id: 3,
    name: "Karikaturist",
    qrValue: "KARIKATURIST",

    area: {
      left: 66.8,
      top: 1.0,
      width: 12.5,
      height: 7.0,
    },
  },

  {
    id: 4,
    name: "Jean-Pierre Rossellet",
    qrValue: "JEAN-PIERRE-ROSSELLET",

    area: {
      left: 42.9,
      top: 12.0,
      width: 5.6,
      height: 8.0,
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
      height: 8.0,
    },
  },

  {
    id: 6,
    name: "Flariel",
    qrValue: "FLARIEL",

    area: {
      left: 42.9,
      top: 20.0,
      width: 5.6,
      height: 8.5,
    },
  },

  {
    id: 7,
    name: "Bode Studios",
    qrValue: "BODE-STUDIOS",

    area: {
      left: 48.6,
      top: 20.0,
      width: 15.4,
      height: 8.5,
    },
  },

  {
    id: 8,
    name: "L'Oréal Luxe",
    qrValue: "LOREAL-LUXE",

    shape: "circle",

    area: {
      left: 40.0,
      top: 36.2,
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
      height: 8.0,
    },
  },

  {
    id: 12,
    name: "Deurocos Cosmetic",
    qrValue: "DEUROCOS-COSMETIC",

    area: {
      left: 20.8,
      top: 68.0,
      width: 15.5,
      height: 8.0,
    },

    rotate: -45,
  },

  {
    id: 13,
    name: "Give Back Beauty",
    qrValue: "GIVE-BACK-BEAUTY",

    area: {
      left: 23.8,
      top: 76.1,
      width: 13.0,
      height: 5.2,
    },

    rotate: -45,
  },

  {
    id: 14,
    name: "Coty",
    qrValue: "COTY",

    area: {
      left: 11.4,
      top: 89.0,
      width: 26.9,
      height: 8.0,
    },
  },

  {
    id: 15,
    name: "Puig",
    qrValue: "PUIG",

    area: {
      left: 25.9,
      top: 13.2,
      width: 7.2,
      height: 23.2,
    },
  },

  {
    id: 16,
    name: "Estée Lauder",
    qrValue: "ESTEE-LAUDER",

    area: {
      left: 1.4,
      top: 16.0,
      width: 8.8,
      height: 67.8,
    },
  },
];

// ==================================================
// APP
// ==================================================

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [registered, setRegistered] = useState(false);

  const [visited, setVisited] = useState([]);

  const [selectedBooth, setSelectedBooth] = useState(null);

  const [scannerOpen, setScannerOpen] = useState(false);

  const [scannerStatus, setScannerStatus] = useState("");

  const [message, setMessage] = useState("");

  const [mapError, setMapError] = useState(false);

  const scannerRef = useRef(null);

  const scanLockedRef = useRef(false);

  const scannerSectionRef = useRef(null);

  const qrRegionId = "qr-reader-region";

  // ==================================================
  // SPLASH
  // ==================================================

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  // ==================================================
  // LOAD SAVED DATA
  // ==================================================

  useEffect(() => {
    const savedUser = localStorage.getItem(
      USER_STORAGE_KEY
    );

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        setFirstname(user.firstname || "");
        setLastname(user.lastname || "");

        if (user.firstname && user.lastname) {
          setRegistered(true);
        }
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    const savedVisited = localStorage.getItem(
      VISITED_STORAGE_KEY
    );

    if (savedVisited) {
      try {
        const data = JSON.parse(savedVisited);

        if (Array.isArray(data)) {
          setVisited(data);
        }
      } catch {
        localStorage.removeItem(
          VISITED_STORAGE_KEY
        );
      }
    }
  }, []);

  // ==================================================
  // SAVE VISITED
  // ==================================================

  useEffect(() => {
    if (!registered) {
      return;
    }

    localStorage.setItem(
      VISITED_STORAGE_KEY,
      JSON.stringify(visited)
    );
  }, [visited, registered]);

  // ==================================================
  // REGISTER
  // ==================================================

  const register = () => {
    const cleanFirstname = firstname.trim();
    const cleanLastname = lastname.trim();

    if (!cleanFirstname || !cleanLastname) {
      alert(
        "Please enter your first and last name."
      );

      return;
    }

    const user = {
      id:
        window.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random()}`,

      firstname: cleanFirstname,
      lastname: cleanLastname,
    };

    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(user)
    );

    setFirstname(cleanFirstname);
    setLastname(cleanLastname);

    setRegistered(true);
  };

  // ==================================================
  // PROGRESS
  // ==================================================

  const progress = Math.round(
    (visited.length / booths.length) * 100
  );

  // ==================================================
  // STOP SCANNER
  // ==================================================

  const stopScanner = async () => {
    const scanner = scannerRef.current;

    if (!scanner) {
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch (error) {
      console.log(
        "Scanner stop:",
        error
      );
    }

    try {
      scanner.clear();
    } catch (error) {
      console.log(
        "Scanner clear:",
        error
      );
    }

    scannerRef.current = null;
  };

  // ==================================================
  // CLOSE SCANNER
  // ==================================================

  const closeScanner = async () => {
    scanLockedRef.current = true;

    await stopScanner();

    setScannerOpen(false);
    setSelectedBooth(null);
    setScannerStatus("");

    scanLockedRef.current = false;
  };

  // ==================================================
  // BOOTH CLICK
  // ==================================================

  const handleBoothClick = async (booth) => {
    // In normal mode a visited booth
    // does not need to be scanned again.

    if (
      !TEST_MODE &&
      visited.includes(booth.id)
    ) {
      setMessage(
        `✓ ${booth.name} already visited.`
      );

      return;
    }

    // Stop any previous scanner first.

    await stopScanner();

    setMessage("");
    setScannerStatus("");

    setSelectedBooth(booth);
    setScannerOpen(true);
  };

  // ==================================================
  // AUTO SCROLL TO QR SCANNER
  // ==================================================

  useEffect(() => {
    if (!scannerOpen || !selectedBooth) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (scannerSectionRef.current) {
        scannerSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [scannerOpen, selectedBooth]);

  // ==================================================
  // QR SCANNER
  // ==================================================

  useEffect(() => {
    if (!scannerOpen || !selectedBooth) {
      return;
    }

    let disposed = false;

    const startScanner = async () => {
      scanLockedRef.current = false;

      setScannerStatus(
        "Starting camera..."
      );

      // Wait until React has rendered
      // the QR reader element.

      await new Promise((resolve) => {
        window.setTimeout(resolve, 450);
      });

      if (disposed) {
        return;
      }

      const readerElement =
        document.getElementById(qrRegionId);

      if (!readerElement) {
        setScannerStatus(
          "Scanner could not be loaded."
        );

        return;
      }

      try {
        const scanner = new Html5Qrcode(
          qrRegionId,
          {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
            ],

            verbose: false,
          }
        );

        scannerRef.current = scanner;

        // ============================================
        // SUCCESSFUL QR SCAN
        // ============================================

        const onScanSuccess = async (
          decodedText
        ) => {
          if (scanLockedRef.current) {
            return;
          }

          scanLockedRef.current = true;

          const scannedValue = String(
            decodedText
          )
            .trim()
            .toUpperCase();

          setScannerStatus(
            `QR detected: ${decodedText}`
          );

          // ==========================================
          // TEST MODE
          // ==========================================

          if (TEST_MODE) {
            if (
              scannedValue !== TEST_QR_VALUE
            ) {
              setMessage(
                "For testing, please scan the GISADA QR code."
              );

              scanLockedRef.current = false;

              return;
            }

            const boothToCollect =
              selectedBooth;

            setVisited(
              (currentVisited) => {
                if (
                  currentVisited.includes(
                    boothToCollect.id
                  )
                ) {
                  return currentVisited;
                }

                return [
                  ...currentVisited,
                  boothToCollect.id,
                ];
              }
            );

            setMessage(
              `✓ ${boothToCollect.name} successfully collected.`
            );

            try {
              if (scanner.isScanning) {
                await scanner.stop();
              }
            } catch (error) {
              console.log(
                "Scanner stop:",
                error
              );
            }

            try {
              scanner.clear();
            } catch (error) {
              console.log(
                "Scanner clear:",
                error
              );
            }

            scannerRef.current = null;

            setScannerOpen(false);
            setSelectedBooth(null);
            setScannerStatus("");

            scanLockedRef.current = false;

            return;
          }

          // ==========================================
          // NORMAL MODE
          // ==========================================

          const expectedValue =
            selectedBooth.qrValue
              .trim()
              .toUpperCase();

          if (
            scannedValue !== expectedValue
          ) {
            setMessage(
              `Wrong QR code. Please scan the QR code for ${selectedBooth.name}.`
            );

            scanLockedRef.current = false;

            return;
          }

          setVisited(
            (currentVisited) => {
              if (
                currentVisited.includes(
                  selectedBooth.id
                )
              ) {
                return currentVisited;
              }

              return [
                ...currentVisited,
                selectedBooth.id,
              ];
            }
          );

          setMessage(
            `✓ ${selectedBooth.name} successfully collected.`
          );

          try {
            if (scanner.isScanning) {
              await scanner.stop();
            }
          } catch (error) {
            console.log(
              "Scanner stop:",
              error
            );
          }

          try {
            scanner.clear();
          } catch (error) {
            console.log(
              "Scanner clear:",
              error
            );
          }

          scannerRef.current = null;

          setScannerOpen(false);
          setSelectedBooth(null);
          setScannerStatus("");

          scanLockedRef.current = false;
        };

        // ============================================
        // SCAN FAILURE
        // ============================================

        const onScanFailure = () => {
          // Normal while no QR code
          // is visible.
        };

        // ============================================
        // START CAMERA
        // ============================================

        await scanner.start(
          {
            facingMode: "environment",
          },

          {
            fps: 15,

            qrbox: (
              viewfinderWidth,
              viewfinderHeight
            ) => {
              const minEdge = Math.min(
                viewfinderWidth,
                viewfinderHeight
              );

              const size = Math.floor(
                minEdge * 0.85
              );

              return {
                width: size,
                height: size,
              };
            },

            disableFlip: false,
          },

          onScanSuccess,

          onScanFailure
        );

        if (!disposed) {
          setScannerStatus(
            TEST_MODE
              ? "TEST MODE – scan the GISADA QR code."
              : "Camera ready – point it at the QR code."
          );
        }
      } catch (error) {
        console.error(
          "QR scanner error:",
          error
        );

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
      disposed = true;
    };
  }, [scannerOpen, selectedBooth]);

  // ==================================================
  // SPLASH SCREEN
  // ==================================================

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

  // ==================================================
  // REGISTRATION
  // ==================================================

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
              Discover our anniversary event and
              collect the brands you visit in your
              personal digital brand pass.
            </p>

            <div style={styles.form}>

              <label style={styles.label}>
                First name
              </label>

              <input
                style={styles.input}
                type="text"
                value={firstname}
                onChange={(event) =>
                  setFirstname(
                    event.target.value
                  )
                }
                placeholder="First name"
                autoComplete="given-name"
              />

              <label style={styles.label}>
                Last name
              </label>

              <input
                style={styles.input}
                type="text"
                value={lastname}
                onChange={(event) =>
                  setLastname(
                    event.target.value
                  )
                }
                placeholder="Last name"
                autoComplete="family-name"
              />

              <button
                type="button"
                style={styles.primaryButton}
                onClick={register}
              >
                START
              </button>

            </div>

          </main>

        </div>
      </div>
    );
  }

  // ==================================================
  // BRAND PASS
  // ==================================================

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

          {/* ======================================= */}
          {/* PROGRESS */}
          {/* ======================================= */}

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

          {/* ======================================= */}
          {/* BRAND MAP */}
          {/* ======================================= */}

          <h2 style={styles.sectionTitle}>
            Your brand pass
          </h2>

          <p style={styles.mapIntro}>
            Tap on a booth to scan its QR code.
          </p>

          <div style={styles.mapCard}>

            {!mapError ? (

              <div style={styles.mapWrapper}>

                {/* ORIGINAL MAP IMAGE */}

                <img
                  src="/brand-map.png"
                  alt="Brand fair map"
                  style={styles.mapImage}
                  onError={() =>
                    setMapError(true)
                  }
                />

                {/* INTERACTIVE BOOTH AREAS */}

                {booths.map((booth) => {

                  const isVisited =
                    TEST_MODE ||
                    visited.includes(booth.id);

                  const isCircle =
                    booth.shape === "circle";

                  return (
                    <button
                      key={booth.id}
                      type="button"

                      onClick={() =>
                        handleBoothClick(booth)
                      }

                      aria-label={booth.name}
                      title={booth.name}

                      style={{
                        ...styles.boothOverlay,

                        left:
                          `${booth.area.left}%`,

                        top:
                          `${booth.area.top}%`,

                        width:
                          `${booth.area.width}%`,

                        height:
                          `${booth.area.height}%`,

                        transform:
                          booth.rotate
                            ? `rotate(${booth.rotate}deg)`
                            : "none",

                        borderRadius:
                          isCircle
                            ? "50%"
                            : "2px",

                        background:
                          isVisited
                            ? GREEN_BG
                            : "rgba(255,255,255,0.001)",

                        border:
                          isVisited
                            ? `1.5px solid ${GREEN}`
                            : "1.5px solid transparent",
                      }}
                    />
                  );
                })}

              </div>

            ) : (

              <div style={styles.mapError}>

                <strong>
                  Map image not found.
                </strong>

                <div style={{ marginTop: 8 }}>
                  Upload the original image to the{" "}
                  <strong>public</strong> folder and
                  name it:
                </div>

                <code style={styles.code}>
                  brand-map.png
                </code>

              </div>

            )}

          </div>

          {/* ======================================= */}
          {/* LEGEND */}
          {/* ======================================= */}

          <div style={styles.legend}>

            <div style={styles.legendItem}>

              <span style={styles.greenBox} />

              <span>
                Visited
              </span>

            </div>

            <div style={styles.legendItem}>

              <span style={styles.grayBox} />

              <span>
                Not visited
              </span>

            </div>

          </div>

          {/* ======================================= */}
          {/* MESSAGE */}
          {/* ======================================= */}

          {message && (

            <div style={styles.message}>
              {message}
            </div>

          )}

          {/* ======================================= */}
          {/* QR SCANNER */}
          {/* ======================================= */}

          {scannerOpen && selectedBooth && (

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
                    {selectedBooth.name}
                  </div>

                </div>

                <div style={styles.scannerBadge}>
                  QR
                </div>

              </div>

              <div style={styles.scannerStatus}>
                {scannerStatus}
              </div>

              <div
                id={qrRegionId}
                style={styles.scannerRegion}
              />

              <button
                type="button"
                style={styles.secondaryButton}
                onClick={closeScanner}
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

// ==================================================
// DESIGN
// ==================================================

const styles = {

  // ==================================================
  // PAGE
  // ==================================================

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

  // ==================================================
  // SPLASH
  // ==================================================

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

  // ==================================================
  // HEADER
  // ==================================================

  header: {
    height: 70,

    display: "flex",

    alignItems: "center",

    padding: "0 20px",

    borderBottom:
      `1px solid ${BORDER}`,

    background: "#FFFFFF",
  },

  logo: {
    width: 82,

    display: "block",
  },

  // ==================================================
  // REGISTRATION
  // ==================================================

  registrationContent: {
    padding:
      "30px 20px 50px",
  },

  jubiLogoWrapper: {
    display: "flex",

    justifyContent: "center",

    margin:
      "10px 0 34px",
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
    margin:
      "12px 0 30px",

    fontSize: 16,

    lineHeight: 1.5,

    color: "#666666",
  },

  form: {
    width: "100%",
  },

  label: {
    display: "block",

    marginBottom: 7,

    fontSize: 13,

    fontWeight: 700,
  },

  input: {
    width: "100%",

    boxSizing:
      "border-box",

    padding: 15,

    marginBottom: 18,

    borderRadius: 8,

    border:
      `1px solid ${BORDER}`,

    fontSize: 16,

    outline: "none",

    background: "#FFFFFF",
  },

  primaryButton: {
    width: "100%",

    marginTop: 5,

    padding: 16,

    border: "none",

    borderRadius: 8,

    background: RED,

    color: "#FFFFFF",

    fontSize: 14,

    fontWeight: 800,

    letterSpacing: "0.7px",

    cursor: "pointer",
  },

  // ==================================================
  // MAIN
  // ==================================================

  content: {
    padding:
      "28px 20px 60px",
  },

  eyebrow: {
    margin: 0,

    fontSize: 11,

    fontWeight: 800,

    letterSpacing: "1.2px",

    color: RED,
  },

  passTitle: {
    margin:
      "6px 0 8px",

    fontSize: 34,

    lineHeight: 1.05,

    fontWeight: 800,

    letterSpacing: "-1px",
  },

  intro: {
    margin:
      "12px 0 26px",

    fontSize: 16,

    lineHeight: 1.5,

    color: "#666666",
  },

  // ==================================================
  // PROGRESS
  // ==================================================

  progressCard: {
    background: RED,

    color: "#FFFFFF",

    borderRadius: 14,

    padding: 20,

    margin:
      "26px 0 28px",
  },

  progressTop: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",
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

    background:
      "rgba(255,255,255,0.30)",

    borderRadius: 999,

    marginTop: 18,

    overflow: "hidden",
  },

  progressBar: {
    height: "100%",

    background:
      "#FFFFFF",

    borderRadius: 999,

    transition:
      "width 0.4s ease",
  },

  // ==================================================
  // MAP
  // ==================================================

  sectionTitle: {
    margin: 0,

    fontSize: 22,

    fontWeight: 800,
  },

  mapIntro: {
    margin:
      "6px 0 14px",

    fontSize: 13,

    lineHeight: 1.4,

    color: "#777777",
  },

  mapCard: {
    border:
      `1px solid ${BORDER}`,

    borderRadius: 14,

    padding: 6,

    overflow: "hidden",

    background:
      "#FFFFFF",
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

    padding: 0,

    margin: 0,

    boxSizing:
      "border-box",

    cursor: "pointer",

    zIndex: 5,

    outline: "none",

    WebkitTapHighlightColor:
      "transparent",

    transition:
      "background 0.2s ease, border 0.2s ease",
  },

  mapError: {
    padding: 30,

    fontSize: 14,

    lineHeight: 1.5,

    color: "#555555",

    textAlign:
      "center",

    background:
      "#FAFAFA",
  },

  code: {
    display:
      "inline-block",

    marginTop: 12,

    padding:
      "6px 10px",

    borderRadius: 6,

    background:
      "#EEEEEE",

    color:
      "#222222",
  },

  // ==================================================
  // LEGEND
  // ==================================================

  legend: {
    display: "flex",

    gap: 22,

    marginTop: 13,

    fontSize: 12,

    color: "#666666",
  },

  legendItem: {
    display: "flex",

    alignItems:
      "center",

    gap: 7,
  },

  greenBox: {
    width: 16,

    height: 16,

    borderRadius: 3,

    background:
      GREEN_BG,

    border:
      `1px solid ${GREEN}`,
  },

  grayBox: {
    width: 16,

    height: 16,

    borderRadius: 3,

    background:
      "#FFFFFF",

    border:
      "1px solid #BBBBBB",
  },

  // ==================================================
  // MESSAGE
  // ==================================================

  message: {
    marginTop: 16,

    padding: 13,

    borderRadius: 10,

    background:
      "#F7F7F7",

    border:
      `1px solid ${BORDER}`,

    fontSize: 13,

    lineHeight: 1.4,
  },

  // ==================================================
  // QR SCANNER
  // ==================================================

  scannerCard: {
    marginTop: 20,

    padding: 16,

    border:
      `1px solid ${BORDER}`,

    borderRadius: 14,

    background:
      "#FFFFFF",

    scrollMarginTop: 16,

    boxShadow:
      "0 8px 30px rgba(0,0,0,0.08)",
  },

  scannerHeader: {
    display: "flex",

    alignItems:
      "center",

    justifyContent:
      "space-between",

    gap: 12,
  },

  scannerTitle: {
    fontSize: 20,

    fontWeight: 800,
  },

  scannerSubtitle: {
    marginTop: 4,

    fontSize: 14,

    color:
      "#666666",
  },

  scannerBadge: {
    minWidth: 38,

    height: 38,

    padding:
      "0 8px",

    borderRadius: 8,

    display: "flex",

    alignItems:
      "center",

    justifyContent:
      "center",

    background:
      RED,

    color:
      "#FFFFFF",

    fontSize: 11,

    fontWeight: 800,
  },

  scannerStatus: {
    marginTop: 10,

    marginBottom: 14,

    fontSize: 12,

    lineHeight: 1.4,

    color:
      "#777777",
  },

  scannerRegion: {
    width: "100%",

    minHeight: 300,

    overflow:
      "hidden",

    borderRadius: 10,

    background:
      "#111111",
  },

  secondaryButton: {
    width: "100%",

    marginTop: 14,

    padding: 14,

    borderRadius: 8,

    border:
      `1px solid ${BLACK}`,

    background:
      "#FFFFFF",

    color:
      BLACK,

    fontSize: 13,

    fontWeight: 800,

    cursor:
      "pointer",
  },
};
