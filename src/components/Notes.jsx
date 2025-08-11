import React from "react";

function Notes({ notesText, setNotesText, onClose }) {
  return (
    <div style={{
      padding: 80,
      maxWidth: 800,
      margin: "50px auto",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <h2 style={{ color: "#333", marginBottom: 20 }}>📝 Espace Notes / Remarques</h2>
      <textarea
        value={notesText}
        onChange={(e) => setNotesText(e.target.value)}
        rows={15}
        style={{
          width: "100%",
          padding: 20,
          fontSize: 16,
          borderRadius: 10,
          border: "1px solid #ccc",
          resize: "vertical",
        }}
        placeholder="Écris ici tes notes, idées ou remarques..."
      ></textarea>
      <div style={{ marginTop: 20, textAlign: "right" }}>
        <button
          onClick={onClose}
          style={{
            padding: "10px 25px",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #fda3d7 0%, #7fb3f5 100%)",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          ⬅ Retour
        </button>
      </div>
    </div>
  );
}

export default Notes;