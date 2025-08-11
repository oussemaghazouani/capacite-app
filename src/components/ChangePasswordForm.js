import React, { useState } from "react";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, getAuth } from "firebase/auth";

function ChangePasswordForm({ onClose }) {
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
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
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
    <form onSubmit={handlePasswordChange} className="flex flex-col gap-5">
      <input
        type="password"
        placeholder="Mot de passe actuel"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
        className="p-3 rounded border border-gray-300 text-lg"
      />
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="p-3 rounded border border-gray-300 text-lg"
      />
      <input
        type="password"
        placeholder="Confirmez le nouveau mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="p-3 rounded border border-gray-300 text-lg"
      />

      {error && <p className="text-red-500 font-bold">{error}</p>}
      {message && <p className="text-green-600 font-bold">{message}</p>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded bg-gray-300 text-gray-800 font-semibold"
        >
          Retour
        </button>
        <button type="submit" disabled={loading} className="px-5 py-2 rounded bg-gradient-to-r from-pink-400 to-blue-400 text-white font-semibold">
          {loading ? "En cours..." : "Modifier"}
        </button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;