const BASE_PATH = "output";
const MANIFEST_FILE = "plots.json";

let plots = {};

const galleryEl = document.getElementById("gallery");
const emptyStateEl = document.getElementById("empty-state");
const sectionTitleEl = document.getElementById("section-title");
const sectionSubtitleEl = document.getElementById("section-subtitle");
const typeFilterEl = document.getElementById("type-filter");
const folderButtons = document.querySelectorAll("button.filter-btn");

function updateBadges () {
    Object.keys(plots).forEach((folder) => {
        const config = plots[ folder ];
        const badge = document.getElementById(`badge-${ folder }`);
        if (badge && config && Array.isArray(config.items)) {
            badge.textContent = config.items.length;
        }
    });
}

function buildSrc (folder, file) {
    return `${ BASE_PATH }/${ folder }/${ file }`;
}

function renderGallery (folder, typeFilter = "all") {
    const config = plots[ folder ];

    galleryEl.innerHTML = "";

    if (!config) {
        sectionTitleEl.textContent = "Sin datos para esta carpeta";
        sectionSubtitleEl.textContent = `No se encontraron elementos para '${ folder }' en el archivo JSON.`;
        emptyStateEl.style.display = "block";
        return;
    }

    sectionTitleEl.textContent = config.title || `Carpeta: ${ folder }`;
    sectionSubtitleEl.textContent = config.subtitle || "";

    const items = (config.items || []).filter((item) => {
        if (typeFilter === "all") return true;
        return item.type === typeFilter;
    });

    if (items.length === 0) {
        emptyStateEl.style.display = "block";
        return;
    } else {
        emptyStateEl.style.display = "none";
    }

    items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "card";

        const header = document.createElement("div");
        header.className = "card-header";

        const title = document.createElement("div");
        title.className = "card-title";
        title.textContent = item.label ?? item.file;

        const tag = document.createElement("div");
        tag.className =
            "card-tag " + (item.type === "image" ? "badge-type-image" : "badge-type-html");
        tag.textContent = item.type === "image" ? "Imagen" : "HTML";

        header.appendChild(title);
        header.appendChild(tag);

        const body = document.createElement("div");
        body.className = "card-body";

        const src = buildSrc(folder, item.file);

        if (item.type === "image") {
            const img = document.createElement("img");
            img.src = src;
            img.alt = item.label ?? item.file;

            img.addEventListener("click", (e) => {
                e.stopPropagation();
                window.open(src, "_blank", "noopener,noreferrer");
            });

            body.appendChild(img);
        } else {
            const wrapper = document.createElement("div");
            wrapper.className = "iframe-wrapper";

            wrapper.addEventListener("click", (e) => {
                e.stopPropagation();
                window.open(src, "_blank", "noopener,noreferrer");
            });

            const iframe = document.createElement("iframe");
            iframe.src = src;
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("loading", "lazy");

            wrapper.appendChild(iframe);
            body.appendChild(wrapper);
        }

        card.appendChild(header);
        card.appendChild(body);
        galleryEl.appendChild(card);
    });
}

function setActiveFolderButton (folder) {
    folderButtons.forEach((btn) => {
        const isActive = btn.dataset.folder === folder;
        btn.classList.toggle("active", isActive);
    });
}

async function loadManifestAndInit () {
    try {
        const response = await fetch(`${ BASE_PATH }/${ MANIFEST_FILE }`);
        if (!response.ok) {
            throw new Error(`No se pudo cargar ${ MANIFEST_FILE } (${ response.status })`);
        }

        const data = await response.json();
        plots = data;

        updateBadges();
        setActiveFolderButton("scatter");
        renderGallery("scatter", "all");
    } catch (error) {
        console.error("Error cargando el manifiesto:", error);
        sectionTitleEl.textContent = "Error al cargar la configuración";
        sectionSubtitleEl.textContent = "";
        galleryEl.innerHTML = "";
        emptyStateEl.style.display = "block";
        emptyStateEl.innerHTML =
            "<strong>Error al cargar la configuración.</strong><br>" +
            "Verifica que el archivo <code>output/" + MANIFEST_FILE + "</code> exista " +
            "y que estés usando un servidor local (no abrir el archivo directamente con file://).";
    }
}


folderButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const folder = btn.dataset.folder;
        const filter = typeFilterEl.value;
        setActiveFolderButton(folder);
        renderGallery(folder, filter);
    });
});

typeFilterEl.addEventListener("change", () => {
    const activeBtn = document.querySelector("button.filter-btn.active");
    const folder = activeBtn ? activeBtn.dataset.folder : "scatter";
    renderGallery(folder, typeFilterEl.value);
});

document.addEventListener("DOMContentLoaded", loadManifestAndInit);