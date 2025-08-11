import React, { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { auth } from "../firebase/config";
import { fadeInStyle, keyframes } from "../styles/buttonStyles";

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [success, setSuccess] = useState("");
  const [identificateur, setIdentificateur] = useState("");

  // Gestion connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Email ou mot de passe incorrect");
    }
    setLoading(false);
  };

  // Gestion inscription
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      setSuccess("Inscription réussie ! Un email de vérification a été envoyé.");
      
      // Bascule automatique vers la connexion
      setTimeout(() => {
        setIsLogin(true);
        setSuccess("");
      }, 2000);

    } catch (err) {
      setError("Erreur lors de l'inscription : " + err.message);
    }
    setLoading(false);
  };

  // Mot de passe oublié
  const handleForgotPassword = () => {
    if (!email) {
      setError("Veuillez entrer votre email avant de réinitialiser le mot de passe.");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Un lien de réinitialisation a été envoyé à votre adresse e-mail.");
      })
      .catch((err) => {
        setError("Erreur lors de l'envoi de l'e-mail : " + err.message);
      });
  };

  return (
    <>
      <style>{keyframes}</style>
      <div
        style={{
          ...fadeInStyle,
          padding: 30,
          maxWidth: 500,
          margin: "50px auto",
          textAlign: "center",
          background: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
          borderRadius: 20,
          boxShadow: "0 12px 30px rgba(100, 100, 150, 0.2)",
          color: "#2d2d2d",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <img
          src="logo.png"
          alt="Logo CRMN"
          style={{
            height: 90,
            marginBottom: 20,
            filter: "drop-shadow(0 0 5px rgba(0,0,0,0.5))",
            cursor: "pointer",
            transition: "transform 0.3s",
          }}
          onClick={() => window.location.reload()}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        <h1 style={{ fontWeight: 700, marginBottom: 15, fontSize: "1.8rem", color: "#2c2c2c" }}>
          Plateforme d'acquisition des données à base de capteur interdigité IDT
        </h1>

        <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: 30, color: "#fff" }}>
          {isLogin ? "Connexion" : "Inscription"}
        </h2>

        <form onSubmit={isLogin ? handleLogin : handleRegister} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {/* Email */}
          <div style={{ position: "relative" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "70%",
                padding: "12px 40px 12px 12px",
                borderRadius: 8,
                border: "none",
                fontSize: 16,
                outline: "none",
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "black",
                boxShadow: "inset 0 0 5px rgba(255,255,255,0.3)",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 8px 2px #00aaff")}
              onBlur={(e) => (e.target.style.boxShadow = "inset 0 0 5px rgba(255,255,255,0.3)")}
            />
            <span style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 20,
              color: "rgba(255,255,255,0.9)",
            }}>📧</span>
          </div>

          {/* Password */}
          <div style={{ position: "relative" }}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "70%",
                padding: "12px 40px 12px 12px",
                borderRadius: 8,
                border: "none",
                fontSize: 16,
                outline: "none",
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "black",
                boxShadow: "inset 0 0 5px rgba(255,255,255,0.3)",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 8px 2px #00aaff")}
              onBlur={(e) => (e.target.style.boxShadow = "inset 0 0 5px rgba(255,255,255,0.3)")}
            />
            <span style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 20,
              color: "rgba(255,255,255,0.9)",
            }}>🔒</span>
          </div>

          {/* Identificateur secret (seulement inscription) */}
          {!isLogin && (
            <div style={{ position: "relative" }}>
              <input
                type="password"
                placeholder="Identificateur secret"
                value={identificateur}
                onChange={(e) => setIdentificateur(e.target.value)}
                required
                style={{
                  width: "70%",
                  padding: "12px",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 16,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "black",
                  boxShadow: "inset 0 0 5px rgba(255,255,255,0.3)",
                }}
                onFocus={(e) => (e.target.style.boxShadow = "0 0 8px 2px #00aaff")}
                onBlur={(e) => (e.target.style.boxShadow = "inset 0 0 5px rgba(255,255,255,0.3)")}
              />
            </div>
          )}

          {/* Lien mot de passe oublié */}
          {isLogin && (
            <p style={{ marginTop: 5 }}>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "#0033cc",
                  fontWeight: 500,
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "inherit"
                }}
              >
                Mot de passe oublié ?
              </button>
            </p>
          )}

          {/* Bouton Connexion / Inscription */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "15px 20px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #fda3d7 0%, #7fb3f5 100%)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 18,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 14px rgba(127, 179, 245, 0.4)",
              transition: "background 0.3s, transform 0.2s",
              margin: "0 auto",
              maxWidth: 200,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 8px 18px rgba(127, 179, 245, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 6px 14px rgba(127, 179, 245, 0.4)";
              }
            }}
          >
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
          </button>

          {/* Messages */}
          {error && (
            <p style={{ marginTop: 10, color: "#ff6b6b", fontWeight: 700 }}>
              {error}
            </p>
          )}
          {success && (
            <p style={{ marginTop: 10, color: "#3cb371", fontWeight: 700 }}>
              {success}
            </p>
          )}
        </form>

        {/* Basculer entre login/signup */}
        <p style={{ marginTop: 20, fontSize: "0.95rem", color: "#222" }}>
          {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
          <span
            style={{
              color: "#0033cc",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: 600,
            }}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
          >
            {isLogin ? "Créer un compte" : "Se connecter"}
          </span>
        </p>

        <p
          style={{
            marginTop: 30,
            fontStyle: "italic",
            fontSize: "1rem",
            color: "#2c2c2c",
            opacity: 0.9,
            letterSpacing: "0.3px",
          }}
        >
          Bienvenue sur la plateforme IDT — {isLogin ? "Connectez-vous" : "Inscrivez-vous"} pour commencer !
        </p>
      </div>
    </>
  );
}

export default AuthForm;
