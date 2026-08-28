import React, { useEffect, useState } from "react";

const RED = "#CF2D36";
const BLACK = "#111111";
const LIGHT = "#F5F5F5";
const BORDER = "#E7E7E7";

const booths = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Booth ${i + 1}`,
}));

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [registered, setRegistered] = useState(false);
  const [visited, setVisited] = useState([]);

  // --------------------------------------------------
  // Splash screen
  // --------------------------------------------------

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, []);

  // --------------------------------------------------
  // Load participant from browser
  // --------------------------------------------------

  useEffect(() => {
    const savedUser = localStorage.getItem("impoJubiUser");

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

    const savedVisited = localStorage.getItem("impoJubiVisited");

    if (savedVisited) {
      try {
        setVisited(JSON.parse(savedVisited));
      } catch {
        localStorage.removeItem("impoJubiVisited");
      }
    }
  }, []);

  // --------------------------------------------------
  // Registration
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Progress
  // --------------------------------------------------

  const progress = Math.round(
    (visited.length / booths.length) * 100
  );

  // --------------------------------------------------
  // Splash screen
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Registration screen
  // --------------------------------------------------

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

            <h1 style={styles.title}>
              Welcome!
            </h1>

            <p style={styles.intro}>
              Discover our anniversary event and collect your
              booth visits in your personal digital brand pass.
            </p>

            <div style={styles.formCard}>
              <label style={styles.label}>
                First name
              </label>

              <input
                style={styles.input}
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
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
            </div>
          </main>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Brand pass
  // --------------------------------------------------

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

          <div style={styles.boothGrid}>
            {booths.map((booth) => {
              const isVisited = visited.includes(booth.id);

              return (
                <div
                  key={booth.id}
                  style={{
                    ...styles.booth,
                    ...(isVisited
                      ? styles.boothVisited
                      : {}),
                  }}
                >
                  <div
                    style={{
                      ...styles.boothNumber,
                      ...(isVisited
                        ? styles.boothNumberVisited
                        : {}),
                    }}
                  >
                    {isVisited ? "✓" : booth.id}
                  </div>

                  <div style={styles.boothName}>
                    {booth.name}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

// ==================================================
// DESIGN
// ==================================================

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

  formCard: {
    marginTop: 20,
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
    margin: "26px 0 32px",
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
    margin: "0 0 16px",
  },

  boothGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
  },

  booth: {
    aspectRatio: "1 / 1",
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFFFFF",
  },

  boothVisited: {
    background: "#F1F8F3",
    border: "1px solid #B8DFC2",
  },

  boothNumber: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#F1F1F1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
  },

  boothNumberVisited: {
    background: "#278A47",
    color: "#FFFFFF",
  },

  boothName: {
    marginTop: 7,
    fontSize: 10,
    fontWeight: 600,
  },
};
