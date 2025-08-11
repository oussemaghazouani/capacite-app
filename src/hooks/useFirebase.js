import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, database } from "../firebase/config";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return user;
};

export const useFirebaseData = () => {
  const [dataEntries, setDataEntries] = useState([]);

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
      } else {
        setDataEntries([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return dataEntries;
};
