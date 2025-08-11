import React, { useState } from "react";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import Notes from "./components/Notes";
import Settings from "./components/Settings";
import { useAuth, useFirebaseData } from "./hooks/useFirebase";

function App() {
  const user = useAuth();
  const dataEntries = useFirebaseData();
  const [showNotes, setShowNotes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notesText, setNotesText] = useState("");

  const handleShowNotes = (dateString, email) => {
    setNotesText((prev) => 
      `${prev ? prev + "\n\n" : ""}🕒 ${dateString} | 📧 ${email}\n`
    );
    setShowNotes(true);
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  // Show authentication form if user is not logged in
  if (!user) {
    return <AuthForm />;
  }

  // Show Notes component
  if (showNotes) {
    return (
      <Notes
        notesText={notesText}
        setNotesText={setNotesText}
        onClose={() => setShowNotes(false)}
      />
    );
  }

  // Show Settings component
  if (showSettings) {
    return (
      <Settings onClose={() => setShowSettings(false)} />
    );
  }

  // Show main dashboard
  return (
    <Dashboard
      user={user}
      dataEntries={dataEntries}
      onShowSettings={handleShowSettings}
      onShowNotes={handleShowNotes}
    />
  );
}

export default App;
