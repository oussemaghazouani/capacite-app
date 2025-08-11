  import React, { useEffect, useState, useRef } from "react";
  import { initializeApp } from "firebase/app";
  import { getDatabase, ref, onValue } from "firebase/database";
  import Chart from "chart.js/auto";
  import * as XLSX from "xlsx";
  import { FiLogOut } from "react-icons/fi";
  import { FiDownload } from "react-icons/fi";
  import { FiSettings } from "react-icons/fi";
  import { FiEdit3 } from "react-icons/fi";
  import jsPDF from "jspdf";
  import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

  import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail, // ✅ Ajoute cette ligne
   createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

  const firebaseConfig = {
    apiKey: "AIzaSyCDzE2xkBPCPKHhemDyhZW6nYuxc4kvtAQ",
    authDomain: "idtsensor.firebaseapp.com",
    databaseURL: "https://idtsensor-default-rtdb.firebaseio.com/",
    projectId: "idtsensor",
    storageBucket: "idtsensor.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456",
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
// Removed unused buttonStyle declaration
const toolbarButtonStyle = {
  padding: "10px 20px",
  height: "45px",
  minWidth: "150px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #fda3d7 0%, #7fb3f5 100%)",
  color: "#fff",
  fontWeight: "600",
  fontSize: "15px",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(127, 179, 245, 0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.3s",
};
///////////////////////////////////////////////////////


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
///////////////////////////////////////////////////
const inputStyle = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 16,
};


  function App() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [dataEntries, setDataEntries] = useState([]);
    const lineChartRef = useRef(null);
    const lineChartInstance = useRef(null);
    const blinkInterval = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

const [showNotes, setShowNotes] = useState(false);
const [notesText, setNotesText] = useState("");
const [showSettings, setShowSettings] = useState(false);
const [identificateur, setIdentificateur] = useState("");
// Pour gérer login/signup et message succès
const [isLogin, setIsLogin] = useState(true);
const [success, setSuccess] = useState("");
    // Animations CSS pour fadeIn
    const fadeInStyle = {
      animation: "fadeIn 1s ease forwards",
      opacity: 0,
    };
    const keyframes = `
      @keyframes fadeIn {
        to { opacity: 1; }
      }
    `;




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
    
    // ✅ Bascule automatique vers la connexion
    setTimeout(() => {
      setIsLogin(true);  // Redirige vers la page de connexion
      setSuccess("");     // Réinitialise le message
    }, 2000); // petit délai pour laisser le message de succès s'afficher

  } catch (err) {
    setError("Erreur lors de l'inscription : " + err.message);
  }
    setLoading(false);
  };


  // 📧 Mot de passe oublié
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






    const handleLogout = () => {
      signOut(auth);
    };



    
    // Chargement des données Firebase
 useEffect(() => {
  const db = getDatabase(app);
  const dataRef = ref(db, `capacites/ZxaG5HK301NdOCuIOiiMaqeYVpY2`); // 👈 Utilise l'UID fixe

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
}, []); // 👈 on enlève `[user]` car plus besoin d’attendre la connexion








////////////////////////////chartline//////////////////////////
    useEffect(() => {
  if (!lineChartRef.current) return;

  const durations = dataEntries.map((d) => d.duree_us);
  const capacities = dataEntries.map((d) => d.valeur_pF);

  // Ligne
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
/////////////end chartline////////////////////
//////////// Clignotement du point sélectionné ///////////////
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

//////////////////interface login //////////////////////
if (!user) {
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

///////////////////////endconnexion/////////////////////////

///////////////////////notes ///////////////////////////

if (showNotes) {
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
          onClick={() => setShowNotes(false)}
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
///////////////////////////////endnotes//////////////////////////////////////
//////////////////////////////settings//////////////////////////////////////
if (showSettings) {
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

      <ChangePasswordForm onClose={() => setShowSettings(false)} buttonStyle={buttonStyle} />
    </div>
  );
}

///////////////////////////endsettings////////////////////////////
////////////////////////////DownloadExcel///////////////////////
  const handleDownloadExcel = () => {
    const now = new Date();
    const formattedDate = now.toLocaleString(); // Exemple : "28/06/2025, 17:22:16"

    const worksheetData = dataEntries.map((entry, index) => ({
      Num: index + 1,
      "Durée (µs)": entry.duree_us,
      "Capacité (pF)": entry.valeur_pF,
    }));

    const worksheet = XLSX.utils.json_to_sheet([], { skipHeader: true });

    // ➕ Ligne 1 : Date
    XLSX.utils.sheet_add_aoa(worksheet, [[`Date et heure de téléchargement : ${formattedDate}`]], { origin: "A1" });

    // ➕ Fusionner A1 à C1 (si 3 colonnes, sinon ajuste)
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }]; // ligne 0, colonnes A à C

    // ➕ Ligne 2 : En-têtes
    XLSX.utils.sheet_add_aoa(worksheet, [["Num", "Durée (µs)", "Capacité (pF)"]], { origin: "A2" });

    // ➕ Données à partir de la ligne 3
    XLSX.utils.sheet_add_json(worksheet, worksheetData, { origin: "A3", skipHeader: true });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mesures");

    XLSX.writeFile(workbook, "donnees_capteur_IDT.xlsx");
  };
  ////////////////////////////endDownloadExcel///////////////////////
  ////////////////// Télécharger un graphique au format PNG////////////////////////////
  const downloadChartAsPNG = (chartRef, fileName) => {
    if (!chartRef.current) return;

    const now = new Date().toLocaleString();
    const originalCanvas = chartRef.current;
    const width = originalCanvas.width;
    const height = originalCanvas.height;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height + 40; // espace pour la date

    const ctx = tempCanvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    ctx.drawImage(originalCanvas, 0, 0);

    // ➕ Ajoute date/heure
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(`Téléchargé le : ${now}`, 10, height + 25);

    const link = document.createElement("a");
    link.download = fileName;
    link.href = tempCanvas.toDataURL("image/png", 1.0);
    link.click();
  };
  ////////////////// Télécharger un graphique au format PNG////////////////////////////

  ///////////////////// Télécharger le graphique au format PDF (1 par page)////////////////////
  const downloadChartsAsPDF = () => {
    const now = new Date().toLocaleString();
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [lineChartRef.current.width, lineChartRef.current.height + 60],
    });

    if (lineChartRef.current) {
      const canvas = lineChartRef.current;
      const imgData = canvas.toDataURL("image/png", 1.0);

      const imgWidth = canvas.width * 0.8;
      const imgHeight = canvas.height * 0.8;
      const pageWidth = pdf.internal.pageSize.getWidth();

      const xCentered = (pageWidth - imgWidth) / 2;

      pdf.text(`Téléchargé le : ${now}`, 10, 20); // Texte en haut à gauche
      pdf.addImage(imgData, "PNG", xCentered, 30, imgWidth, imgHeight);
    }
    pdf.save("graphique_IDT.pdf");
  };

  ///////////////////// end Télécharger le graphique au format PDF (1 par page)////////////////////

  /////// Interface principale (avec logout, graphiques, tableau)
    return (
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          padding: 20,
          backgroundColor: "#f4f7fa",
          color: "#333",
        }}
      >
   
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
  {/* Bouton Déconnexion (icône seule) */}
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

  {/* Bouton Paramètres (icône seule) */}
  <button
onClick={() => setShowSettings(true)}
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

<button
  onClick={() => {
    const now = new Date();
    const dateString = now.toLocaleString(); // format : "29/06/2025, 18:10:12"
    setNotesText((prev) => `${prev ? prev + "\n\n" : ""}🕒 ${dateString} | 📧 ${user?.email || "inconnu"}\n`);
    setShowNotes(true);
  }}
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
        color: "#ffffff",    // texte blanc pour contraster
        margin: 0,
        fontWeight: "700",
        fontSize: 24,
        letterSpacing: "0.5px",
      }}
    >
      Plateforme d'acquisition des données à base de capteur interdigité IDT
    </h1>
  </div>
{/* Graphique Ligne */}
<div
  style={{
    marginBottom: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 4px 10px rgba(127, 192, 245, 0.83)",
  }}
>
  <h2
    style={{
      background: "linear-gradient(135deg, #fda3d7 0%, #7fb3f5 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: "700",
    }}
  >
    Graphique Capacité en fonction du temps (Ligne)
  </h2>

  <canvas
    id="lineChart"
    ref={lineChartRef}
    style={{ maxWidth: "100%", height: 350 }}
  />
</div>
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
  {/* Bouton Excel */}
  <button
    onClick={handleDownloadExcel}
    style={toolbarButtonStyle}
    onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
  >
    <FiDownload size={18} style={{ marginRight: 8 }} />
    Excel
  </button>

  {/* Bouton PNG Ligne */}
  <button
    onClick={() => downloadChartAsPNG(lineChartRef, "graphique_ligne_IDT.png")}
    style={toolbarButtonStyle}
    onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
  >
    📈 PNG Ligne
  </button>

  {/* Bouton PDF */}
  <button
    onClick={downloadChartsAsPDF}
    style={toolbarButtonStyle}
    onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
  >
    📝 PDF
  </button>
</div>
        <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      marginTop: 10,
      textAlign: "center",
      color: "#2d2d2d",
      backgroundColor: "rgba(255,255,255,0.3)",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 4px 10px rgba(127, 192, 245, 0.83)",
    }}
  >
    <thead>
      <tr
        style={{
          background: "linear-gradient(135deg, #fda3d7 0%, #7fb3f5 100%)",
          color: "#ffffff",
        }}
      >
        <th style={{ padding: "12px" }}>Numéro</th>
        <th style={{ padding: "12px" }}>Durée (µs)</th>
        <th style={{ padding: "12px" }}>Capacité (pF)</th>
      </tr>
    </thead>
    <tbody>
      {dataEntries.map((entry, index) => (
        <tr
          key={entry.id}
          style={{
            backgroundColor:
              selectedIndex === index ? "#ffdede" : "transparent",
            cursor: "pointer",
          }}
          onClick={() => setSelectedIndex(index)}
        >
          <td style={{ padding: "10px", border: "1px solid #ccc" }}>{index}</td>
          <td style={{ padding: "10px", border: "1px solid #ccc" }}>
            {entry.duree_us}
          </td>
          <td style={{ padding: "10px", border: "1px solid #ccc" }}>
            {entry.valeur_pF}
          </td>
        </tr>
      ))}
    </tbody>
  </table>

      </div>
    );
  }

  export default App;
