import React from "react";
import { FiLogOut, FiDownload, FiSettings, FiEdit3 } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { toolbarButtonStyle } from "../styles/buttonStyles";

function FloatingToolbar({ onShowSettings, onShowNotes, user }) {
  const handleLogout = () => {
    signOut(auth);
  };

  const handleNotesClick = () => {
    const now = new Date();
    const dateString = now.toLocaleString();
    onShowNotes(dateString, user?.email || "inconnu");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 1000,
      }}
    >
      {/* Bouton Déconnexion */}
      <button
        onClick={handleLogout}
        title="Déconnexion"
        style={{
          padding: 10,
          borderRadius: 10,
          border: "none",
          background: "linear-gradient(135deg, #fda3d7 0%, #7fb3f5 100%)",
          color: "#ffffff",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(127, 179, 245, 0.4)",
          transition: "background 0.3s, transform 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 45,
          height: 45,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 14px rgba(127, 179, 245, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(127, 179, 245, 0.4)";
        }}
      >
        <FiLogOut size={24} />
      </button>

      {/* Bouton Paramètres */}
      <button
        onClick={onShowSettings}
        title="Paramètres"
        style={{
          padding: 10,
          borderRadius: 10,
          border: "none",
          background: "linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%)",
          color: "#ffffff",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(150, 100, 200, 0.4)",
          transition: "background 0.3s, transform 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 45,
          height: 45,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 14px rgba(150, 100, 200, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(150, 100, 200, 0.4)";
        }}
      >
        <FiSettings size={24} />
      </button>

      {/* Bouton Notes */}
      <button
        onClick={handleNotesClick}
        title="Notes"
        style={{
          padding: 10,
          borderRadius: 10,
          border: "none",
          background: "linear-gradient(135deg, #fda3d7 0%, #7fb3f5 100%)",
          color: "#ffffff",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(127, 179, 245, 0.4)",
          transition: "background 0.3s, transform 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 45,
          height: 45,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 14px rgba(127, 179, 245, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(127, 179, 245, 0.4)";
        }}
      >
        <FiEdit3 size={24} />
      </button>
    </div>
  );
}

function DownloadToolbar({ onDownloadExcel, onDownloadPNG, onDownloadPDF }) {
  return (
    <div
      style={{
        backgroundColor: "#f2f8ff",
        padding: "15px 25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        margin: "30px auto",
        maxWidth: "fit-content",
      }}
    >
      <button
        onClick={onDownloadExcel}
        style={toolbarButtonStyle}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        <FiDownload size={18} style={{ marginRight: 8 }} />
        Excel
      </button>

      <button
        onClick={onDownloadPNG}
        style={toolbarButtonStyle}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        📈 PNG Ligne
      </button>

      <button
        onClick={onDownloadPDF}
        style={toolbarButtonStyle}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        📝 PDF
      </button>
    </div>
  );
}

export { FloatingToolbar, DownloadToolbar };
