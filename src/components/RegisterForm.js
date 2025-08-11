import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

function RegisterForm({ onSuccess, onError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [identificateur, setIdentificateur] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Exemple de vérification de l'identificateur secret
    if (identificateur !== "idt-secret") {
      onError("Identificateur secret incorrect.");
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      onSuccess("Inscription réussie ! Un email de vérification a été envoyé.");
    } catch (err) {
      onError("Erreur lors de l'inscription : " + err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-5">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="p-3 rounded border border-gray-300 text-lg"
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="p-3 rounded border border-gray-300 text-lg"
      />
      <input
        type="password"
        placeholder="Identificateur secret"
        value={identificateur}
        onChange={(e) => setIdentificateur(e.target.value)}
        required
        className="p-3 rounded border border-gray-300 text-lg"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 rounded bg-gradient-to-r from-pink-400 to-blue-400 text-white font-semibold"
      >
        {loading ? "En cours..." : "S'inscrire"}
      </button>
    </form>
  );
}

export default RegisterForm;

// Remove redundant block. The RegisterForm component should only export itself.