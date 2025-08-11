import React, { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import Chart from "chart.js/auto";

// Imports locaux
import { auth, database } from "./firebase/config";
import "./styles/styles.css";

export default function App() {
  // États de l'application
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  
  // États des données
  const [dataEntries, setDataEntries] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  
  // États des interfaces
  // const [showNotes, setShowNotes] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [identificateur, setIdentificateur] = useState("");

  // Références pour les graphiques
  const lineChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const blinkInterval = useRef(null);

  // Styles
  const buttonStyle = {
    padding: "12px 20px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #fda3d7 0%, #7fb3f5 100%)",
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(127, 179, 245, 0.4)",
    transition: "transform 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  };


  const fadeInStyle = {
    animation: "fadeIn 1s ease forwards",
    opacity: 0,
  };

  // Surveillance de l'état de connexion
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

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


  // Chargement des données Firebase
  useEffect(() => {
    const dataRef = ref(database, `capacites/ZxaG5HK301NdOCuIOiiMaqeYVpY2`);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.entries(data)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([key, value]) => ({
            id: key,
            valeur_pF: Number(value.valeur_pF) || 0,
            duree_us: Number(value.duree_us) || 0,
          }));
        setDataEntries(entries);
        setSelectedIndex(null);
      } else {
        setDataEntries([]);
        setSelectedIndex(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Effet pour le graphique ligne
  useEffect(() => {
    if (!lineChartRef.current) return;

    const durations = dataEntries.map((d) => d.duree_us);
    const capacities = dataEntries.map((d) => d.valeur_pF);

    if (!lineChartInstance.current) {
      lineChartInstance.current = new Chart(lineChartRef.current, {
        type: "line",
        data: {
          labels: durations,
          datasets: [
            {
              label: "Capacité (pF)",
              data: capacities,
              fill: true,
              tension: 0.3,
              pointRadius: 4,
              pointHoverRadius: 6,
              borderColor: "#ffa500",
              backgroundColor: "rgba(255, 165, 0, 0.1)",
              pointBackgroundColor: capacities.map(() => "#ffa500"),
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: "#000" } } },
          scales: {
            x: {
              title: { display: true, text: "Durée (µs)", color: "#000" },
              ticks: { color: "#000" },
            },
            y: {
              title: { display: true, text: "Capacité (pF)", color: "#000" },
              ticks: { color: "#000" },
            },
          },
          onClick: (evt, elements) => {
            if (elements.length > 0) {
              setSelectedIndex(elements[0].index);
            }
          },
          hover: {
            mode: "nearest",
            intersect: true,
          },
        },
      });
    } else {
      lineChartInstance.current.data.labels = durations;
      lineChartInstance.current.data.datasets[0].data = capacities;
      lineChartInstance.current.data.datasets[0].pointBackgroundColor = capacities.map(
        (_, i) => (selectedIndex === i ? "rgba(255, 0, 0, 0.8)" : "#ffa500")
      );
      lineChartInstance.current.data.datasets[0].pointRadius = capacities.map(
        (_, i) => (selectedIndex === i ? 8 : 4)
      );
      lineChartInstance.current.update();
    }
  }, [dataEntries, selectedIndex]);

  // Effet pour le clignotement du point sélectionné
  useEffect(() => {
    if (blinkInterval.current) clearInterval(blinkInterval.current);
    if (selectedIndex === null) return;

    let visible = true;
    blinkInterval.current = setInterval(() => {
      if (!lineChartInstance.current) return;
      const capacities = dataEntries.map((d) => d.valeur_pF);
      const lineColors = capacities.map(() => "rgba(214, 137, 21, 0.8)");
      const lineRadii = capacities.map(() => 4);

      if (visible) {
        lineColors[selectedIndex] = "rgba(255, 0, 0, 0.8)";
        lineRadii[selectedIndex] = 8;
      }

      lineChartInstance.current.data.datasets[0].pointBackgroundColor = lineColors;
      lineChartInstance.current.data.datasets[0].pointRadius = lineRadii;

      lineChartInstance.current.update();
      visible = !visible;
    }, 500);

    return () => clearInterval(blinkInterval.current);
  }, [selectedIndex, dataEntries]);

  // Interface de connexion
  if (!user) {
    return (
      <>
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
                  </div>
                )}
                        {/* Submit button */}
                        <button
                          type="submit"
                          style={{
                            ...buttonStyle,
                            marginTop: "10px",
                            width: "70%",
                            alignSelf: "center",
                            opacity: loading ? 0.7 : 1,
                            pointerEvents: loading ? "none" : "auto",
                          }}
                          disabled={loading}
                        >
                          {loading
                            ? "Chargement..."
                            : isLogin
                            ? "Se connecter"
                            : "S'inscrire"}
                        </button>
                      </form>
                      {/* Error message */}
                      {error && (
                        <div style={{ color: "red", marginTop: 10, fontWeight: 600 }}>
                          {error}
                        </div>
                      )}
                      {/* Success message */}
                      {success && (
                        <div style={{ color: "green", marginTop: 10, fontWeight: 600 }}>
                          {success}
                        </div>
                      )}
                      {/* Forgot password link */}
                      {isLogin && (
                        <button
                          type="button"
                          style={{
                            background: "none",
                            border: "none",
                            color: "#007bff",
                            textDecoration: "underline",
                            cursor: "pointer",
                            marginTop: 10,
                            fontSize: 15,
                          }}
                          onClick={handleForgotPassword}
                        >
                          Mot de passe oublié ?
                        </button>
                      )}
                      {/* Switch between login/register */}
                      <button
                        type="button"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#007bff",
                          textDecoration: "underline",
                          cursor: "pointer",
                          marginTop: 15,
                          fontSize: 15,
                        }}
                        onClick={() => {
                          setIsLogin(!isLogin);
                          setError("");
                          setSuccess("");
                        }}
                      >
                        {isLogin
                          ? "Créer un compte"
                          : "Déjà inscrit ? Se connecter"}
                      </button>
                      </div>
                    </>
                  );
                }
                
                // You can continue with the rest of your App component logic here
                
              }