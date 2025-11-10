    // scripts/main.js
    import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
    import {
    getAuth,
    onAuthStateChanged,
    } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";

    // ✅ Tu configuración de Firebase
    const firebaseConfig = {
    apiKey: "AIzaSyDbUJlICVukU2TWOWTr69Tt_yZd-MV7Gr8",
    authDomain: "un-lugar-web.firebaseapp.com",
    projectId: "un-lugar-web",
    storageBucket: "un-lugar-web.firebasestorage.app",
    messagingSenderId: "687859092635",
    appId: "1:687859092635:web:e43d6525a52348fc6e0a3e",
    };

    // Inicializa Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    console.log("✅ main.js cargado correctamente.");

    // 🔄 Esperar a que el usuario esté autenticado antes de cargar datos
    onAuthStateChanged(auth, async (user) => {
    if (!user) {
        console.warn("⛔ No hay usuario autenticado. Redirigiendo...");
        window.location.href = "/";
        return;
    }

    console.log("👤 Usuario autenticado:", user.email);

    // Definir app global
    window.app = {
        // =============================
        // 🎨 Personalización de Colores
        // =============================
        handleThemeChange() {
        const bg = document.getElementById("bgColorInput").value;
        const accent = document.getElementById("accentColorInput").value;

        document.documentElement.style.setProperty("--bg-color", bg);
        document.documentElement.style.setProperty("--primary-accent", accent);

        localStorage.setItem("themeSettings", JSON.stringify({ bg, accent }));
        },

        // =============================
        // 📘 Notas Rápidas
        // =============================
        async saveNotes() {
        const notesText = document.getElementById("quickNotes").value;
        if (!notesText.trim()) return alert("Escribe algo antes de guardar.");

        await setDoc(doc(db, "notes", user.uid), { text: notesText });
        alert("📝 Notas guardadas correctamente.");
        },

        async loadNotes() {
        const docSnap = await getDoc(doc(db, "notes", user.uid));
        if (docSnap.exists()) {
            document.getElementById("quickNotes").value = docSnap.data().text || "";
        }
        },

        // =============================
        // ✅ Recordatorios
        // =============================
        async addReminder() {
        const input = document.getElementById("newReminderInput");
        const value = input.value.trim();
        if (!value) return;

        const ref = doc(db, "reminders", user.uid);
        const snap = await getDoc(ref);
        const current = snap.exists() ? snap.data().items || [] : [];
        current.push({ text: value, done: false });

        await setDoc(ref, { items: current });
        input.value = "";
        window.app.loadReminders();
        },

        async loadReminders() {
        const ref = doc(db, "reminders", user.uid);
        const snap = await getDoc(ref);
        const list = document.getElementById("reminderList");
        list.innerHTML = "";

        if (snap.exists()) {
            const reminders = snap.data().items || [];
            reminders.forEach((r, i) => {
            const li = document.createElement("li");
            li.className = `flex justify-between items-center p-2 rounded ${
                r.done ? "bg-green-200 line-through" : "bg-gray-100"
            }`;
            li.innerHTML = `
                <span>${r.text}</span>
                <button class="text-sm text-red-500 hover:text-red-700">✕</button>
            `;

            li.querySelector("button").addEventListener("click", async () => {
                reminders.splice(i, 1);
                await setDoc(ref, { items: reminders });
                window.app.loadReminders();
            });

            list.appendChild(li);
            });
        }
        },

        async clearCompleted() {
        await setDoc(doc(db, "reminders", user.uid), { items: [] });
        window.app.loadReminders();
        },

        // =============================
        // 🌐 RRSS
        // =============================
        openRrssModal() {
        document.getElementById("rrssModal").style.display = "block";
        const content = document.getElementById("rrssModalContent");
        const current =
            JSON.parse(localStorage.getItem("rrssLinks")) || {
            instagram: "",
            facebook: "",
            github: "",
            };

        content.innerHTML = `
            <label>Instagram:</label>
            <input id="rrssInstagram" type="text" class="w-full p-2 border rounded" value="${current.instagram || ""}">
            <label>Facebook:</label>
            <input id="rrssFacebook" type="text" class="w-full p-2 border rounded" value="${current.facebook || ""}">
            <label>GitHub:</label>
            <input id="rrssGithub" type="text" class="w-full p-2 border rounded" value="${current.github || ""}">
        `;
        },

        closeRrssModal() {
        document.getElementById("rrssModal").style.display = "none";
        },

        async saveRrssConfig() {
        const data = {
            instagram: document.getElementById("rrssInstagram").value,
            facebook: document.getElementById("rrssFacebook").value,
            github: document.getElementById("rrssGithub").value,
        };

        localStorage.setItem("rrssLinks", JSON.stringify(data));
        await setDoc(doc(db, "rrss", user.uid), data);
        window.app.closeRrssModal();
        window.app.renderRrssLinks();
        },

        async renderRrssLinks() {
        const container = document.getElementById("rrssLinksContainer");
        container.innerHTML = "";

        const docSnap = await getDoc(doc(db, "rrss", user.uid));
        const data = docSnap.exists() ? docSnap.data() : {};
        const links = { ...data, ...JSON.parse(localStorage.getItem("rrssLinks") || "{}") };

        const icons = {
            instagram: "📸",
            facebook: "📘",
            github: "💻",
        };

        Object.keys(links).forEach((key) => {
            if (links[key]) {
            const a = document.createElement("a");
            a.href = links[key];
            a.target = "_blank";
            a.textContent = icons[key];
            a.className = "text-2xl hover:opacity-80";
            container.appendChild(a);
            }
        });
        },

        // =============================
        // 💡 Dato Curioso
        // =============================
        async loadHistoricalFact(topic = "programacion") {
        const facts = {
            programacion: [
            "El primer bug informático fue un insecto real atrapado en un computador en 1947.",
            "Python fue lanzado por Guido van Rossum en 1991.",
            ],
            arte: [
            "Leonardo da Vinci tardó más de 16 años en completar la Mona Lisa.",
            "Van Gogh solo vendió una pintura en vida.",
            ],
            ciencia: [
            "La luz del sol tarda 8 minutos en llegar a la Tierra.",
            "El ADN humano es 60% idéntico al de una banana.",
            ],
        };

        const items = facts[topic];
        const random = items[Math.floor(Math.random() * items.length)];
        document.getElementById("factContent").textContent = random;
        },
    };

    // Cargar datos iniciales
    window.app.loadNotes();
    window.app.loadReminders();
    window.app.renderRrssLinks();
    window.app.loadHistoricalFact("programacion");

    // Cargar colores guardados
    const savedTheme = JSON.parse(localStorage.getItem("themeSettings"));
    if (savedTheme) {
        document.documentElement.style.setProperty("--bg-color", savedTheme.bg);
        document.documentElement.style.setProperty(
        "--primary-accent",
        savedTheme.accent
        );
    }

    console.log("🚀 Aplicación lista y todas las funciones activas.");
    });
