import React from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import { buttonStyle } from "../styles/buttonStyles";

function Settings({ onClose }) {
  return (
    <div style={{
      padding: 80,
      maxWidth: 500,
      margin: "50px auto",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <h2 style={{ color: "#333", marginBottom: 20 }}>⚙️ Paramètres du compte</h2>
      <ChangePasswordForm onClose={onClose} buttonStyle={buttonStyle} />
    </div>
  );
}


export default Settings;