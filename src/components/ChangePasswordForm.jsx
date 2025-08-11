import React, { useState } from "react";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { inputStyle } from "../styles/buttonStyles";

function ChangePasswordForm({ onClose, buttonStyle }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = getAuth().currentUser;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!user || !user.email) {
      setError("Utilisateur non connecté.");
      return;
    }

    setLoading(true);

    try {
      // Ré-authentification
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Mise à jour du mot de passe
      await updatePassword(user, newPassword);

      setMessage("✅ Mot de passe mis à jour avec succès !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("❌ " + err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <input
        type="password"
        placeholder="Mot de passe actuel"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Confirmez le nouveau mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        style={inputStyle}
      />

      {error && <p style={{ color: "#ff4d4d", fontWeight: "bold" }}>{error}</p>}
      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={onClose}
          style={{ ...buttonStyle, background: "#ccc", color: "#333" }}
        >
          Retour
        </button>
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "En cours..." : "Modifier"}
        </button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;