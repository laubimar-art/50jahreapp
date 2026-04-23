import React, { useMemo, useState } from "react";

const initialBooths = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Stand ${i + 1}`,
  qrValue: `STAND-${i + 1}`,
}));
 
export default function App() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("login"); // login | verify | app
  const [generatedCode, setGeneratedCode] = useState("");

  const [visited, setVisited] = useState([]);
  const [scanInput, setScanInput] = useState("");
  const [message, setMessage] = useState("");

  // --- LOGIN FLOW ---
  const sendCode = () => {
    if (!email.includes("@")) {
      alert("Bitte gültige Email eingeben");
      return;
    }
    const c = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(c);
    alert("Demo-Code: " + c); // später via Mail
    setStep("verify");
  };

  const verifyCode = () => {
    if (code === generatedCode) {
      setStep("app");
    } else {
      alert("Falscher Code");
    }
  };

  // --- APP LOGIC ---
  const handleScan = () => {
    const value = scanInput.trim().toUpperCase();
    const booth = initialBooths.find((b) => b.qrValue === value);

    if (!booth) {
      setMessage("❌ Ungültiger QR-Code");
      return;
    }

    if (visited.includes(booth.id)) {
      setMessage(`⚠️ ${booth.name} bereits besucht`);
      return;
    }

    setVisited([...visited, booth.id]);
    setMessage(`✅ ${booth.name} bestätigt`);
    setScanInput("");
  };

  const progress = Math.round((visited.length / 20) * 100);

  // --- LOGIN SCREEN ---
  if (step === "login") {
    return (
      <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
        
        {/* LOGO */}
        <img 
          src="/logo.png" 
          style={{ position: "absolute", top: 10, right: 10, width: 60, opacity: 0.7 }} 
        />

        <h2>Jubiläum Import Parfumerie</h2>
        <p>Bitte anmelden</p>

        <input
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button onClick={sendCode} style={{ width: "100%" }}>
          Code senden
        </button>
      </div>
    );
  }

  // --- VERIFY ---
  if (step === "verify") {
    return (
      <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
        
        <img 
          src="/logo.png" 
          style={{ position: "absolute", top: 10, right: 10, width: 60, opacity: 0.7 }} 
        />

        <h2>Code eingeben</h2>

        <input
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button onClick={verifyCode} style={{ width: "100%" }}>
          Bestätigen
        </button>
      </div>
    );
  }

  // --- MAIN APP ---
  return (
    <div style={{ padding: 16, maxWidth: 400, margin: "auto" }}>
      
      {/* LOGO */}
      <img 
        src="/logo.png" 
        style={{ position: "absolute", top: 10, right: 10, width: 60, opacity: 0.7 }} 
      />

      <h2>Brandmesse Pass</h2>

      <p>Fortschritt: {visited.length}/20 ({progress}%)</p>

      <input
        placeholder="QR eingeben (STAND-1)"
        value={scanInput}
        onChange={(e) => setScanInput(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <button onClick={handleScan} style={{ width: "100%", marginTop: 8 }}>
        QR bestätigen
      </button>

      <p>{message}</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 8
      }}>
        {initialBooths.map((b) => {
          const isVisited = visited.includes(b.id);

          return (
            <div
              key={b.id}
              style={{
                padding: 10,
                borderRadius: 10,
                textAlign: "center",
                background: isVisited ? "#c8f7c5" : "#eee",
                fontSize: 12
              }}
            >
              {isVisited ? "✅" : "⬜"}
              <br />
              {b.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
