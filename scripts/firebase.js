    // scripts/firebase.js
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
    import {
    getAuth,
    onAuthStateChanged,
    signOut
    } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
    import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    onSnapshot
    } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

    const firebaseConfig = {
    apiKey: "AIzaSyDbUJlICVukU2TWOWTr69Tt_yZd-MV7Gr8",
    authDomain: "un-lugar-web.firebaseapp.com",
    projectId: "un-lugar-web",
    storageBucket: "un-lugar-web.firebasestorage.app",
    messagingSenderId: "687859092635",
    appId: "1:687859092635:web:e43d6525a52348fc6e0a3e"
    };

    // Inicialización
    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const db = getFirestore(app);

    // 🔐 Verificar sesión de usuario
    onAuthStateChanged(auth, (user) => {
    const status = document.getElementById("authStatus");
    if (!status) return;

    if (user) {
        status.textContent = `👤 ${user.displayName || "Usuario"}`;
        status.classList.remove("bg-gray-400");
        status.classList.add("bg-green-500");
    } else {
        window.location.href = "/";
    }
    });

    // 🚪 Cerrar sesión global
    window.logout = async () => {
    await signOut(auth);
    window.location.href = "/";
    };

    // ✅ Funciones globales
    window.firestore = {
    async save(collectionName, data) {
        const user = auth.currentUser;
        if (!user) return;
        const ref = doc(db, collectionName, user.uid);
        await setDoc(ref, data, { merge: true });
    },
    async load(collectionName) {
        const user = auth.currentUser;
        if (!user) return {};
        const ref = doc(db, collectionName, user.uid);
        const snap = await getDoc(ref);
        return snap.exists() ? snap.data() : {};
    },
    listen(collectionName, callback) {
        const user = auth.currentUser;
        if (!user) return;
        const ref = doc(db, collectionName, user.uid);
        onSnapshot(ref, (snap) => {
        if (snap.exists()) callback(snap.data());
        });
    },
    };
