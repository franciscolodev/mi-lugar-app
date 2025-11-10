    // scripts/youtube.js
    console.log("🎬 YouTube module loaded");

    const API_KEY = window.__YT_API_KEY || "AIzaSyBsTIVR6RmqsIbZny-mkmp9ZWm3ROCR6xc";

    const searchInput = document.getElementById("searchQuery");
    const resultsDiv = document.getElementById("results");

    // Si no existen los elementos (p. ej. en el login), no hacer nada
    if (!searchInput || !resultsDiv) {
    console.warn("🟡 YouTube search UI not found — skipping initialization.");
    } else {
    // Evento: Buscar al hacer clic o Enter
    const searchBtn = document.querySelector("button[onclick='searchYouTube()']");
    if (searchBtn) {
        searchBtn.addEventListener("click", searchYouTube);
    }
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") searchYouTube();
    });
    }

    /**
     * Busca videos en YouTube usando la API oficial
     */
    export async function searchYouTube() {
    const query = searchInput.value.trim();
    resultsDiv.innerHTML = "";

    if (!query) {
        resultsDiv.innerHTML = "<p class='text-gray-400'>📝 Escribí algo para buscar.</p>";
        return;
    }

    resultsDiv.innerHTML = "<p class='text-gray-400'>Buscando...</p>";

    try {
        const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(
            query
        )}&key=${API_KEY}`
        );
        const data = await res.json();

        if (!data.items || data.items.length === 0) {
        resultsDiv.innerHTML = "<p class='text-gray-400'>😕 No se encontraron resultados.</p>";
        return;
        }

        resultsDiv.innerHTML = data.items
        .map(
            (item) => `
            <div class="bg-[#1a1a1a] rounded-xl p-3 shadow-md hover:scale-[1.01] transition-transform duration-200">
            <iframe
                src="https://www.youtube.com/embed/${item.id.videoId}"
                class="w-full rounded-lg mb-2 aspect-video"
                allowfullscreen
            ></iframe>
            <p class="text-sm font-semibold">${item.snippet.title}</p>
            <p class="text-xs text-gray-400">🎤 ${item.snippet.channelTitle}</p>
            </div>
        `
        )
        .join("");
    } catch (error) {
        console.error("❌ Error al buscar videos:", error);
        resultsDiv.innerHTML =
        "<p class='text-red-500'>⚠️ Error al conectar con YouTube. Verificá tu API Key.</p>";
    }
    }
