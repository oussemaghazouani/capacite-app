import React from "react";

function Header() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #fda3d7 0%, #7fb3f5 100%)",
        padding: "20px 30px",
        borderRadius: 12,
        boxShadow: "0 6px 14px rgba(127, 179, 245, 0.4)",
        textAlign: "center",
        maxWidth: 900,
        margin: "0 auto 30px",
        cursor: "default",
      }}
    >
      <img
        src="logo.png"
        alt="Logo CRMN"
        style={{
          height: 180,
          marginBottom: 20,
          transition: "transform 0.3s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
      <h1
        style={{
          color: "#ffffff",
          margin: 0,
          fontWeight: "700",
          fontSize: 24,
          letterSpacing: "0.5px",
        }}
      >
        Plateforme d'acquisition des données à base de capteur interdigité IDT
      </h1>
    </div>
  );
}

export default Header;
