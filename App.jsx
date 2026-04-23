import React, { useMemo, useState } from "react";

const initialBooths = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Stand ${i + 1}`,
  points: 10,
  qrValue: `STAND-${i + 1}`,
}));

export default function App() {
  const [visited, setVisited] = useState([]);
  const [search, setSearch] = useState("");
  const [scanInput, setScanInput] = useState("");
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    return initialBooths.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const visitedCount = visited.length;
  const progress = Math.round((visitedCount / 20) * 100);

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

  return (
    <div style={{ fontFamily: "Arial", padding: 16, maxWidth: 400, margin: "auto" }}>
      <h2>Brandmesse Pass</h2>

      <p>
        Fortschritt: {visitedCount}/20 ({progress}%)
      </p>

      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="QR eingeben (z. B. STAND-1)"
          value={scanInput}
          onChange={(e) => setScanInput(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
        <button onClick={handleScan} style={{ width: "100%", marginTop: 8 }}>
          QR bestätigen
        </button>
        <p>{message}</p>
      </div>

      <input
        placeholder="Stand suchen"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {filtered.map((b) => {
          const isVisited = visited.includes(b.id);

          return (
            <div
              key={b.id}
              style={{
                padding: 10,
                borderRadius: 10,
                textAlign: "center",
                background: isVisited ? "#c8f7c5" : "#eee",
                fontSize: 12,
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
