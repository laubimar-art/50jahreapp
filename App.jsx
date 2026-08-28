import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

// ==================================================
// CONFIG
// ==================================================

const RED = "#CF2D36";
const BLACK = "#111111";
const LIGHT = "#F5F5F5";
const BORDER = "#E7E7E7";

const GREEN = "#209447";
const GREEN_BG = "rgba(32, 148, 71, 0.18)";

const USER_STORAGE_KEY = "impoJubiUserV2";
const VISITED_STORAGE_KEY = "impoJubiVisitedV2";
const GOODIE_STORAGE_KEY = "impoJubiGoodieV1";
const SESSIONS_STORAGE_KEY = "impoJubiSessionsV1";

// ==================================================
// TEST MODE
// ==================================================
//
// true:
// - all booth overlays are green
// - GISADA QR works for every booth
// - GISADA QR works for the Goodie Bag
// - COLLECT GOODIE BAG is always enabled
//
// false:
// - only visited booths are green
// - every booth requires its own QR
// - Goodie Bag unlocks at 14 / 16
//
const TEST_MODE = true;

const TEST_QR_VALUE = "GISADA";

const GOODIE_UNLOCK_AT = 14;
const GOODIE_QR_VALUE = "GOODIE-BAG-2026";

// ==================================================
// BOOTHS
// ==================================================

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

// ==================================================
// HELPERS
// ==================================================

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

function createRecoveryCode() {
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const randomCharacter = () => {
    const randomArray = new Uint32Array(1);

    window.crypto.getRandomValues(randomArray);

    return characters[
      randomArray[0] % characters.length
    ];
  };

  const firstPart = Array.from(
    { length: 4 },
    randomCharacter
  ).join("");

  const secondPart = Array.from(
    { length: 4 },
    randomCharacter
  ).join("");

  return `${firstPart}-${secondPart}`;
}

function normalizeRecoveryCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function normalizeQR(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function getSessionKey(code) {
  return normalizeRecoveryCode(code);
}

// ==================================================
// APP
// ==================================================

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

  const [goodieData, setGoodieData] = useState(() =>
    loadJSON(GOODIE_STORAGE_KEY, {
      collectedAt: null,
    })
  );

  const [scanTarget, setScanTarget] = useState(null);

  const [scannerStatus, setScannerStatus] =
    useState("");

  const [message, setMessage] = useState("");

  const [mapError, setMapError] = useState(false);

  const [goodieApproved, setGoodieApproved] =
    useState(false);

  const [showGoodieSuccess, setShowGoodieSuccess] =
    useState(false);

  const [recoveryOpen, setRecoveryOpen] =
    useState(false);

  const [recoveryInput, setRecoveryInput] =
    useState("");

  const [recoveryMessage, setRecoveryMessage] =
    useState("");

  const scannerRef = useRef(null);
  const scanLockedRef = useRef(false);

  const scannerSectionRef = useRef(null);
  const mapSectionRef = useRef(null);

  const scannerId = "qr-reader-region";

  // ==================================================
  // GOODIE STATUS
  // ==================================================

  const goodieEligible =
    visited.length >= GOODIE_UNLOCK_AT;

  // TEST MODE:
  // The button is always enabled.
  const goodieCanCollect =
    TEST_MODE || goodieEligible;

  const goodieCollected =
    Boolean(goodieData.collectedAt);

  const progress = Math.round(
    (visited.length / booths.length) * 100
  );

  // ==================================================
  // SPLASH
  // ==================================================

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, []);

  // ==================================================
  // ADD RECOVERY CODE TO OLD USERS
  // ==================================================

  useEffect(() => {
    if (!user || user.recoveryCode) {
      return;
    }

    const updatedUser = {
      ...user,
      recoveryCode: createRecoveryCode(),
    };

    saveJSON(USER_STORAGE_KEY, updatedUser);

    setUser(updatedUser);
  }, [user]);

  // ==================================================
  // SAVE LOCAL RECOVERY SESSION
  // ==================================================

  useEffect(() => {
    if (!user?.recoveryCode) {
      return;
    }

    const sessions = loadJSON(
      SESSIONS_STORAGE_KEY,
      {}
    );

    const key = getSessionKey(
      user.recoveryCode
    );

    sessions[key] = {
      user,
      visited,
      goodieData,
      savedAt: new Date().toISOString(),
    };

    saveJSON(
      SESSIONS_STORAGE_KEY,
      sessions
    );
  }, [user, visited, goodieData]);

  // ==================================================
  // SAVE ACTIVE DATA
  // ==================================================

  useEffect(() => {
    saveJSON(
      VISITED_STORAGE_KEY,
      visited
    );
  }, [visited]);

  useEffect(() => {
    saveJSON(
      GOODIE_STORAGE_KEY,
      goodieData
    );
  }, [goodieData]);

  // ==================================================
  // REGISTER
  // ==================================================

  const register = () => {
    const firstname = form.firstname.trim();
    const lastname = form.lastname.trim();

    if (!firstname || !lastname) {
      alert(
        "Please enter your first and last name."
      );

      return;
    }

    const newUser = {
      id: createUserId(),
      firstname,
      lastname,
      recoveryCode: createRecoveryCode(),
    };

    const emptyGoodieData = {
      collectedAt: null,
    };

    saveJSON(
      USER_STORAGE_KEY,
      newUser
    );

    saveJSON(
      VISITED_STORAGE_KEY,
      []
    );

    saveJSON(
      GOODIE_STORAGE_KEY,
      emptyGoodieData
    );

    setVisited([]);
    setGoodieData(emptyGoodieData);

    setUser(newUser);
  };

  // ==================================================
  // RESTORE SESSION
  // ==================================================

  const restoreSession = () => {
    const key = getSessionKey(
      recoveryInput
    );

    if (!key) {
      setRecoveryMessage(
        "Please enter your recovery code."
      );

      return;
    }

    const sessions = loadJSON(
      SESSIONS_STORAGE_KEY,
      {}
    );

    const session = sessions[key];

    if (!session) {
      setRecoveryMessage(
        "Session not found in this test browser."
      );

      return;
    }

    if (!session.user) {
      setRecoveryMessage(
        "The saved session is invalid."
      );

      return;
    }

    const restoredVisited =
      Array.isArray(session.visited)
        ? session.visited
        : [];

    const restoredGoodie =
      session.goodieData || {
        collectedAt: null,
      };

    saveJSON(
      USER_STORAGE_KEY,
      session.user
    );

    saveJSON(
      VISITED_STORAGE_KEY,
      restoredVisited
    );

    saveJSON(
      GOODIE_STORAGE_KEY,
      restoredGoodie
    );

    setVisited(restoredVisited);
    setGoodieData(restoredGoodie);

    setUser(session.user);

    setRecoveryMessage("");
    setRecoveryInput("");
    setRecoveryOpen(false);
  };

  // ==================================================
  // SCROLL
  // ==================================================

  const scrollToScanner = () => {
    window.setTimeout(() => {
      scannerSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
  };

  const scrollToMap = () => {
    window.setTimeout(() => {
      mapSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
  };

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

    setScanTarget(null);
    setScannerStatus("");

    scanLockedRef.current = false;

    scrollToMap();
  };

  // ==================================================
  // OPEN BOOTH SCANNER
  // ==================================================

  const openBoothScanner = async (booth) => {
    if (
      !TEST_MODE &&
      visited.includes(booth.id)
    ) {
      setMessage(
        `✓ ${booth.name} already visited.`
      );

      return;
    }

    await stopScanner();

    setMessage("");
    setScannerStatus("");

    setScanTarget({
      type: "booth",
      booth,
    });
  };

  // ==================================================
  // OPEN GOODIE SCANNER
  // ==================================================

  const openGoodieScanner = async () => {
    // LIVE:
    // only possible after 14 booths.
    //
    // TEST:
    // always possible.

    if (
      (!TEST_MODE && !goodieEligible) ||
      goodieCollected
    ) {
      return;
    }

    await stopScanner();

    setMessage("");
    setScannerStatus("");

    setScanTarget({
      type: "goodie",
    });
  };

  // ==================================================
  // AUTO SCROLL TO SCANNER
  // ==================================================

  useEffect(() => {
    if (!scanTarget) {
      return;
    }

    scrollToScanner();
  }, [scanTarget]);

  // ==================================================
  // QR SCANNER
  // ==================================================

  useEffect(() => {
    if (!scanTarget) {
      return;
    }

    let cancelled = false;

    const startScanner = async () => {
      scanLockedRef.current = false;

      setScannerStatus(
        "Starting camera..."
      );

      await new Promise((resolve) =>
        window.setTimeout(
          resolve,
          400
        )
      );

      if (cancelled) {
        return;
      }

      const scannerElement =
        document.getElementById(
          scannerId
        );

      if (!scannerElement) {
        setScannerStatus(
          "Scanner could not be loaded."
        );

        return;
      }

      try {
        const scanner =
          new Html5Qrcode(
            scannerId
          );

        scannerRef.current =
          scanner;

        const handleSuccess =
          async (decodedText) => {
            if (
              scanLockedRef.current
            ) {
              return;
            }

            scanLockedRef.current =
              true;

            const scannedValue =
              normalizeQR(
                decodedText
              );

            let isCorrectQR =
              false;

            // ======================================
            // TEST MODE
            // ======================================

            if (TEST_MODE) {
              isCorrectQR =
                scannedValue.includes(
                  normalizeQR(
                    TEST_QR_VALUE
                  )
                );
            } else if (
              scanTarget.type ===
              "goodie"
            ) {
              isCorrectQR =
                scannedValue ===
                normalizeQR(
                  GOODIE_QR_VALUE
                );
            } else {
              isCorrectQR =
                scannedValue ===
                normalizeQR(
                  scanTarget.booth
                    .qrValue
                );
            }

            setScannerStatus(
              `QR detected: ${decodedText}`
            );

            if (!isCorrectQR) {
              setMessage(
                TEST_MODE
                  ? `Wrong test QR. Detected: ${decodedText}`
                  : scanTarget.type ===
                      "goodie"
                    ? "Wrong Goodie Bag QR code."
                    : `Wrong QR code. Please scan the QR code for ${scanTarget.booth.name}.`
              );

              scanLockedRef.current =
                false;

              return;
            }

            // ======================================
            // GOODIE BAG
            // ======================================

            if (
              scanTarget.type ===
              "goodie"
            ) {
              await stopScanner();

              setScanTarget(null);
              setScannerStatus("");

              setGoodieApproved(
                true
              );

              scanLockedRef.current =
                false;

              return;
            }

            // ======================================
            // BOOTH
            // ======================================

            const booth =
              scanTarget.booth;

            setVisited(
              (current) =>
                current.includes(
                  booth.id
                )
                  ? current
                  : [
                      ...current,
                      booth.id,
                    ]
            );

            setMessage(
              `✓ ${booth.name} successfully collected.`
            );

            await stopScanner();

            setScanTarget(null);

            setScannerStatus("");

            scanLockedRef.current =
              false;

            scrollToMap();
          };

        await scanner.start(
          {
            facingMode:
              "environment",
          },

          {
            fps: 10,

            qrbox: (
              width,
              height
            ) => {
              const size =
                Math.floor(
                  Math.min(
                    width,
                    height
                  ) * 0.9
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
          if (TEST_MODE) {
            setScannerStatus(
              scanTarget.type ===
                "goodie"
                ? "TEST MODE – scan the GISADA QR code to approve the Goodie Bag."
                : "TEST MODE – scan the GISADA QR code."
            );
          } else {
            setScannerStatus(
              "Camera ready – point it at the QR code."
            );
          }
        }
      } catch (error) {
        console.error(
          "QR scanner error:",
          error
        );

        scannerRef.current =
          null;

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
  }, [scanTarget]);

  // ==================================================
  // GOODIE BAG RECEIVED
  // ==================================================

  const confirmGoodieReceived = () => {
    const newData = {
      collectedAt:
        new Date().toISOString(),
    };

    setGoodieData(newData);

    setGoodieApproved(false);

    setShowGoodieSuccess(true);
  };

  // ==================================================
  // SPLASH
  // ==================================================

  if (showSplash) {
    return <Splash />;
  }

  // ==================================================
  // REGISTRATION
  // ==================================================

  if (!user) {
    return (
      <Page>
        <Header />

        <main
          style={
            styles.registrationContent
          }
        >
          <div
            style={
              styles.jubiLogoWrapper
            }
          >
            <img
              src="/LogoJubi.png"
              alt="50 Years Import Parfumerie"
              style={styles.jubiLogo}
            />
          </div>

          <h1
            style={
              styles.registrationTitle
            }
          >
            Welcome!
          </h1>

          <p
            style={
              styles.registrationIntro
            }
          >
            Discover our anniversary event
            and collect the brands you visit
            in your personal digital brand
            pass.
          </p>

          <label
            style={styles.label}
          >
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

                firstname:
                  event.target.value,
              }))
            }
          />

          <label
            style={styles.label}
          >
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

                lastname:
                  event.target.value,
              }))
            }
          />

          <button
            type="button"
            style={
              styles.primaryButton
            }
            onClick={register}
          >
            START
          </button>

          <RecoveryPanel
            open={recoveryOpen}
            setOpen={setRecoveryOpen}
            value={recoveryInput}
            setValue={setRecoveryInput}
            message={recoveryMessage}
            onRestore={restoreSession}
          />
        </main>
      </Page>
    );
  }

  // ==================================================
  // BRAND PASS
  // ==================================================

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
          Welcome to our anniversary
          event.
        </p>

        <Progress
          visited={visited.length}
          total={booths.length}
          progress={progress}
        />

        {/* ======================================= */}
        {/* MAP */}
        {/* ======================================= */}

        <section
          ref={mapSectionRef}
          style={styles.mapSection}
        >
          <h2
            style={styles.sectionTitle}
          >
            Your brand pass
          </h2>

          <p style={styles.mapIntro}>
            Tap on a booth to scan its QR
            code.
          </p>

          <div style={styles.mapCard}>
            {!mapError ? (
              <div
                style={styles.mapWrapper}
              >
                <img
                  src="/brand-map.png"
                  alt="Brand fair map"
                  style={styles.mapImage}
                  onError={() =>
                    setMapError(true)
                  }
                />

                {booths.map((booth) => {
                  const isVisited =
                    TEST_MODE ||
                    visited.includes(
                      booth.id
                    );

                  return (
                    <button
                      key={booth.id}
                      type="button"
                      aria-label={booth.name}
                      title={booth.name}
                      onClick={() =>
                        openBoothScanner(
                          booth
                        )
                      }
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
                            : undefined,

                        borderRadius:
                          booth.shape ===
                          "circle"
                            ? "50%"
                            : 2,

                        background:
                          isVisited
                            ? GREEN_BG
                            : "transparent",

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
              <div
                style={styles.mapError}
              >
                <strong>
                  Map image not found.
                </strong>

                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload the original image
                  to the{" "}
                  <strong>public</strong>{" "}
                  folder as:
                </div>

                <code
                  style={styles.code}
                >
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
        </section>

        {/* ======================================= */}
        {/* GOODIE BAG */}
        {/* ======================================= */}

        <GoodieBag
          visited={visited.length}
          required={
            GOODIE_UNLOCK_AT
          }
          eligible={
            goodieEligible
          }
          canCollect={
            goodieCanCollect
          }
          collected={
            goodieCollected
          }
          onCollect={
            openGoodieScanner
          }
        />

        {/* ======================================= */}
        {/* SCANNER */}
        {/* ======================================= */}

        {scanTarget && (
          <Scanner
            scanTarget={scanTarget}
            status={scannerStatus}
            scannerSectionRef={
              scannerSectionRef
            }
            onClose={closeScanner}
          />
        )}

        {/* ======================================= */}
        {/* RECOVERY */}
        {/* ======================================= */}

        <section
          style={styles.recoveryInfo}
        >
          <div
            style={
              styles.recoveryInfoLabel
            }
          >
            Your recovery code
          </div>

          <div
            style={styles.recoveryCode}
          >
            {user.recoveryCode}
          </div>

          <div
            style={
              styles.recoveryInfoText
            }
          >
            Keep this code in case you need
            to restore your session.
          </div>
        </section>
      </main>

      {/* ======================================= */}
      {/* GOODIE APPROVED */}
      {/* ======================================= */}

      {goodieApproved && (
        <GoodieApprovedScreen
          user={user}
          visited={visited.length}
          total={booths.length}
          onReceived={
            confirmGoodieReceived
          }
        />
      )}

      {/* ======================================= */}
      {/* FINAL THANK YOU */}
      {/* ======================================= */}

      {showGoodieSuccess && (
        <GoodieSuccessScreen
          onDone={() =>
            setShowGoodieSuccess(false)
          }
        />
      )}
    </Page>
  );
}

// ==================================================
// COMPONENTS
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
          <div
            style={styles.progressNumber}
          >
            {visited} / {total}
          </div>

          <div
            style={styles.progressLabel}
          >
            Booths visited
          </div>
        </div>

        <div style={styles.percent}>
          {progress}%
        </div>
      </div>

      <div
        style={styles.progressBackground}
      >
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

// ==================================================
// RECOVERY
// ==================================================

function RecoveryPanel({
  open,
  setOpen,
  value,
  setValue,
  message,
  onRestore,
}) {
  return (
    <section
      style={styles.recoveryPanel}
    >
      <button
        type="button"
        style={styles.recoveryToggle}
        onClick={() =>
          setOpen(!open)
        }
      >
        Lost your session?
      </button>

      {open && (
        <div
          style={styles.recoveryBody}
        >
          <div
            style={styles.recoveryTitle}
          >
            Restore your session
          </div>

          <p
            style={styles.recoveryText}
          >
            Enter your personal recovery
            code.
          </p>

          <input
            type="text"
            value={value}
            placeholder="ABCD-1234"
            autoCapitalize="characters"
            autoComplete="off"
            style={styles.recoveryInput}
            onChange={(event) =>
              setValue(
                event.target.value.toUpperCase()
              )
            }
          />

          {message && (
            <div
              style={
                styles.recoveryMessage
              }
            >
              {message}
            </div>
          )}

          <button
            type="button"
            style={
              styles.recoveryButton
            }
            onClick={onRestore}
          >
            RESTORE SESSION
          </button>

          {TEST_MODE && (
            <div
              style={
                styles.testRecoveryNote
              }
            >
              Test version: recovery
              currently works only with
              sessions saved in this browser.
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ==================================================
// GOODIE BAG
// ==================================================

function GoodieBag({
  visited,
  required,
  eligible,
  canCollect,
  collected,
  onCollect,
}) {
  const remaining = Math.max(
    required - visited,
    0
  );

  const goodieProgress =
    Math.min(
      visited / required,
      1
    ) * 100;

  return (
    <section style={styles.goodieCard}>
      <div style={styles.goodieIcon}>
        🎁
      </div>

      <div style={styles.goodieTitle}>
        Goodie Bag
      </div>

      {collected ? (
        <div
          style={styles.goodieCollected}
        >
          ✓ Goodie Bag collected
        </div>
      ) : eligible ? (
        <>
          <div
            style={styles.goodieUnlocked}
          >
            You're ready!
          </div>

          <div style={styles.goodieText}>
            {visited} / 16 booths visited
          </div>
        </>
      ) : (
        <>
          <div style={styles.goodieText}>
            Visit at least{" "}
            <strong>
              {required} of 16
            </strong>{" "}
            booths to unlock your Goodie
            Bag.
          </div>

          <div style={styles.goodieCount}>
            {visited} / {required}
          </div>

          <div
            style={
              styles.goodieProgressBackground
            }
          >
            <div
              style={{
                ...styles.goodieProgressBar,
                width:
                  `${goodieProgress}%`,
              }}
            />
          </div>

          <div
            style={styles.goodieRemaining}
          >
            {remaining === 1
              ? "1 more booth to go"
              : `${remaining} more booths to go`}
          </div>
        </>
      )}

      {!collected && (
        <button
          type="button"
          disabled={!canCollect}
          onClick={onCollect}
          style={{
            ...styles.goodieButton,

            ...(canCollect
              ? styles.goodieButtonActive
              : styles.goodieButtonDisabled),
          }}
        >
          COLLECT GOODIE BAG
        </button>
      )}

      {TEST_MODE &&
        !eligible &&
        !collected && (
          <div
            style={
              styles.goodieTestNote
            }
          >
            TEST MODE – button enabled
            before 14 booth visits.
          </div>
        )}
    </section>
  );
}

// ==================================================
// SCANNER
// ==================================================

function Scanner({
  scanTarget,
  status,
  scannerSectionRef,
  onClose,
}) {
  const label =
    scanTarget.type === "goodie"
      ? "Goodie Bag"
      : scanTarget.booth.name;

  return (
    <div
      ref={scannerSectionRef}
      style={styles.scannerCard}
    >
      <div style={styles.scannerHeader}>
        <div>
          <div
            style={styles.scannerTitle}
          >
            Scan QR code
          </div>

          <div
            style={styles.scannerSubtitle}
          >
            {label}
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
// GOODIE APPROVED
// ==================================================

function GoodieApprovedScreen({
  user,
  visited,
  total,
  onReceived,
}) {
  return (
    <div
      style={
        styles.goodieApprovedScreen
      }
    >
      <div
        style={
          styles.goodieApprovedContent
        }
      >
        <div
          style={
            styles.goodieApprovedCheck
          }
        >
          ✓
        </div>

        <div
          style={
            styles.goodieApprovedEyebrow
          }
        >
          GOODIE BAG
        </div>

        <h1
          style={
            styles.goodieApprovedTitle
          }
        >
          APPROVED
        </h1>

        <div
          style={
            styles.goodieApprovedName
          }
        >
          {user.firstname}{" "}
          {user.lastname}
        </div>

        <div
          style={
            styles.goodieApprovedProgress
          }
        >
          {visited} / {total} booths
          visited
        </div>

        <div
          style={
            styles.goodieApprovedInstruction
          }
        >
          You may hand over the Goodie
          Bag.
        </div>

        <button
          type="button"
          style={
            styles.goodieReceivedButton
          }
          onClick={onReceived}
        >
          GOODIE BAG RECEIVED
        </button>
      </div>
    </div>
  );
}

// ==================================================
// FINAL THANK-YOU SCREEN
// ==================================================

function GoodieSuccessScreen({
  onDone,
}) {
  return (
    <div
      style={
        styles.goodieSuccessScreen
      }
    >
      <style>
        {`
          @keyframes goodiePan {
            0% {
              background-position: left center;
            }

            100% {
              background-position: right center;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .goodie-panorama {
              animation: none !important;
              background-position: center center !important;
            }
          }
        `}
      </style>

      <div
        style={
          styles.goodieSuccessContent
        }
      >
        <img
          src="/impo_logo.png"
          alt="Import Parfumerie"
          style={styles.goodieFinalLogo}
        />

        <h1
          style={styles.goodieThankYou}
        >
          Thank you for celebrating our
          50th anniversary with us today.
          Have a safe trip home!
        </h1>

        <div
          className="goodie-panorama"
          style={styles.goodiePanorama}
          role="img"
          aria-label="Import Parfumerie anniversary team illustration"
        />

        <button
          type="button"
          style={styles.goodieDoneButton}
          onClick={onDone}
        >
          DONE
        </button>
      </div>
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
    borderBottom:
      `1px solid ${BORDER}`,
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
    color: "#666666",
    fontSize: 16,
    lineHeight: 1.5,
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
    border:
      `1px solid ${BORDER}`,
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
    justifyContent:
      "space-between",
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
    transition:
      "width 0.4s ease",
  },

  mapSection: {
    scrollMarginTop: 16,
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
    border:
      `1px solid ${BORDER}`,
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
    border:
      `1px solid ${BORDER}`,
    borderRadius: 10,
    background: "#F7F7F7",
    fontSize: 13,
    lineHeight: 1.4,
  },

  recoveryPanel: {
    marginTop: 38,
    paddingTop: 22,
    borderTop:
      `1px solid ${BORDER}`,
    textAlign: "center",
  },

  recoveryToggle: {
    padding: 8,
    border: 0,
    background: "transparent",
    color: "#999999",
    fontSize: 12,
    textDecoration: "underline",
    cursor: "pointer",
  },

  recoveryBody: {
    marginTop: 14,
    padding: 16,
    borderRadius: 12,
    background: "#F7F7F7",
    textAlign: "left",
  },

  recoveryTitle: {
    fontSize: 17,
    fontWeight: 800,
  },

  recoveryText: {
    margin: "6px 0 12px",
    color: "#777777",
    fontSize: 13,
    lineHeight: 1.4,
  },

  recoveryInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: 14,
    border:
      `1px solid ${BORDER}`,
    borderRadius: 8,
    background: "#FFFFFF",
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "2px",
    textAlign: "center",
    textTransform: "uppercase",
    outline: "none",
  },

  recoveryButton: {
    width: "100%",
    padding: 14,
    marginTop: 12,
    border: 0,
    borderRadius: 8,
    background: BLACK,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },

  recoveryMessage: {
    marginTop: 10,
    color: RED,
    fontSize: 12,
    lineHeight: 1.4,
  },

  testRecoveryNote: {
    marginTop: 12,
    color: "#999999",
    fontSize: 10,
    lineHeight: 1.4,
  },

  recoveryInfo: {
    marginTop: 34,
    paddingTop: 22,
    borderTop:
      `1px solid ${BORDER}`,
    textAlign: "center",
  },

  recoveryInfoLabel: {
    color: "#999999",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },

  recoveryCode: {
    marginTop: 7,
    color: BLACK,
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: "2px",
  },

  recoveryInfoText: {
    maxWidth: 280,
    margin: "7px auto 0",
    color: "#AAAAAA",
    fontSize: 10,
    lineHeight: 1.4,
  },

  // ==================================================
  // GOODIE BAG
  // ==================================================

  goodieCard: {
    marginTop: 30,
    padding: 18,
    border:
      `1px solid ${BORDER}`,
    borderRadius: 16,
    background: "#FFFFFF",
  },

  goodieIcon: {
    marginBottom: 10,
    fontSize: 26,
  },

  goodieTitle: {
    fontSize: 22,
    fontWeight: 800,
  },

  goodieText: {
    marginTop: 8,
    color: "#666666",
    fontSize: 14,
    lineHeight: 1.45,
  },

  goodieCount: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: 800,
  },

  goodieProgressBackground: {
    height: 7,
    marginTop: 8,
    overflow: "hidden",
    borderRadius: 999,
    background: "#EEEEEE",
  },

  goodieProgressBar: {
    height: "100%",
    borderRadius: 999,
    background: RED,
    transition:
      "width 0.3s ease",
  },

  goodieRemaining: {
    marginTop: 8,
    color: "#888888",
    fontSize: 12,
  },

  goodieUnlocked: {
    marginTop: 8,
    color: GREEN,
    fontSize: 17,
    fontWeight: 800,
  },

  goodieCollected: {
    marginTop: 8,
    color: GREEN,
    fontSize: 15,
    fontWeight: 800,
  },

  goodieButton: {
    width: "100%",
    padding: 15,
    marginTop: 18,
    border: 0,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.5px",
  },

  goodieButtonActive: {
    background: RED,
    color: "#FFFFFF",
    cursor: "pointer",
  },

  goodieButtonDisabled: {
    background: "#E8E8E8",
    color: "#999999",
    cursor: "default",
  },

  goodieTestNote: {
    marginTop: 9,
    color: "#AAAAAA",
    fontSize: 10,
    lineHeight: 1.4,
    textAlign: "center",
  },

  // ==================================================
  // SCANNER
  // ==================================================

  scannerCard: {
    padding: 16,
    marginTop: 20,
    border:
      `1px solid ${BORDER}`,
    borderRadius: 14,
    background: "#FFFFFF",
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.08)",
    scrollMarginTop: 16,
  },

  scannerHeader: {
    display: "flex",
    alignItems: "center",
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
    border:
      `1px solid ${BLACK}`,
    borderRadius: 8,
    background: "#FFFFFF",
    color: BLACK,
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },

  // ==================================================
  // GOODIE APPROVAL
  // ==================================================

  goodieApprovedScreen: {
    position: "fixed",
    inset: 0,
    zIndex: 10000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background: GREEN,
  },

  goodieApprovedContent: {
    width: "100%",
    maxWidth: 390,
    color: "#FFFFFF",
    textAlign: "center",
  },

  goodieApprovedCheck: {
    width: 82,
    height: 82,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 26px",
    border:
      "3px solid rgba(255,255,255,0.9)",
    borderRadius: "50%",
    fontSize: 46,
    fontWeight: 900,
  },

  goodieApprovedEyebrow: {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "2px",
  },

  goodieApprovedTitle: {
    margin: "6px 0 30px",
    fontSize: 48,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-1px",
  },

  goodieApprovedName: {
    fontSize: 25,
    fontWeight: 800,
  },

  goodieApprovedProgress: {
    marginTop: 7,
    fontSize: 16,
    opacity: 0.9,
  },

  goodieApprovedInstruction: {
    margin: "34px 0 28px",
    fontSize: 19,
    lineHeight: 1.4,
    fontWeight: 700,
  },

  goodieReceivedButton: {
    width: "100%",
    padding: 18,
    border: 0,
    borderRadius: 10,
    background: "#FFFFFF",
    color: GREEN,
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: "0.5px",
    cursor: "pointer",
  },

  // ==================================================
  // FINAL THANK-YOU
  // ==================================================

  goodieSuccessScreen: {
    position: "fixed",
    inset: 0,
    zIndex: 10001,
    overflowY: "auto",
    background: "#FFFFFF",
  },

  goodieSuccessContent: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxSizing: "border-box",
    padding: "34px 0",
    textAlign: "center",
  },

  goodieFinalLogo: {
    width: 90,
    display: "block",
    margin: "0 auto 30px",
  },

  goodieThankYou: {
    maxWidth: 360,
    margin: "0 auto 36px",
    padding: "0 24px",
    color: BLACK,
    fontSize: 27,
    lineHeight: 1.2,
    fontWeight: 800,
    letterSpacing: "-0.5px",
  },

  goodiePanorama: {
    width: "100%",
    height: 245,
    backgroundImage:
      'url("/goodie-bag-success.png")',
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 100%",
    backgroundPosition: "left center",
    animation:
      "goodiePan 14s linear infinite alternate",
  },

  goodieDoneButton: {
    width: "calc(100% - 40px)",
    maxWidth: 390,
    padding: 16,
    margin: "34px auto 0",
    border: 0,
    borderRadius: 8,
    background: RED,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
};
