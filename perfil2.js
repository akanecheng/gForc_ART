
import { db, auth, storage } from "./firebase-config.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const ADMIN_EMAIL = "polyanadesn02@gmail.com";

const profileRef = doc(db, "siteData", "profile");

const $ = id => document.getElementById(id);

const fields = [
    "badgeText",
    "subtitle",
    "title",
    "description",
    "instagram",
    "secondaryLink",
    "artstation"
];

const DEFAULT_AVATAR =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop";

let currentAvatar = DEFAULT_AVATAR;
let selectedIcon = "palette";
let user = null;
let loading = false;
let removeCurrentPhoto = false;
let previewObjectURL = null;

function status(message, type = "") {
    $("statusMessage").textContent = message;
    $("statusMessage").className = "status " + type;
}

function setSaving(value) {
    loading = value;
    $("saveButton").disabled = value || !user;
    $("saveButton").innerHTML = value
        ? '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...'
        : '<i class="fa-solid fa-floppy-disk"></i> Salvar alterações';
}

function iconClass(icon) {
    return "fa-solid fa-" + icon;
}

// ==================================
// SELEÇÃO VISUAL DOS ÍCONES
// ==================================

document.querySelectorAll(".icon-option").forEach(button => {
    button.addEventListener("click", () => {
        selectedIcon = button.dataset.icon;

        document.querySelectorAll(".icon-option").forEach(item => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");
        updatePreview();
    });
});

// ==================================
// ATUALIZAR PRÉVIA
// ==================================

function updatePreview() {
    const badgeText = $("badgeText").value || "Artista";

    $("tagTextPreview").textContent = badgeText;
    $("previewBadgeText").textContent = badgeText;

    $("tagIconPreview").className = iconClass(selectedIcon);
    $("previewBadgeIcon").className = iconClass(selectedIcon);

    $("previewSubtitle").textContent = $("subtitle").value;
    $("previewTitle").textContent = $("title").value;
    $("previewDescription").textContent = $("description").value;

    $("previewAvatar").src = $("avatarPreview").src;
}

fields.forEach(id => {
    $(id).addEventListener("input", updatePreview);
});

// ==================================
// FOTO
// ==================================

$("avatarFile").addEventListener("change", () => {
    const file = $("avatarFile").files[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        status("Escolha uma imagem JPG, PNG ou WEBP.", "error");
        $("avatarFile").value = "";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        status("A imagem deve ter no máximo 5 MB.", "error");
        $("avatarFile").value = "";
        return;
    }

    if (previewObjectURL) {
        URL.revokeObjectURL(previewObjectURL);
    }

    previewObjectURL = URL.createObjectURL(file);

    $("avatarPreview").src = previewObjectURL;
    removeCurrentPhoto = false;

    updatePreview();
});

$("removePhoto").addEventListener("click", () => {
    $("avatarFile").value = "";
    removeCurrentPhoto = true;

    if (previewObjectURL) {
        URL.revokeObjectURL(previewObjectURL);
        previewObjectURL = null;
    }

    $("avatarPreview").src = DEFAULT_AVATAR;

    updatePreview();
});

// ==================================
// CARREGAR PERFIL
// ==================================

async function loadProfile() {
    try {
        const snapshot = await getDoc(profileRef);

        const data = snapshot.exists() ? snapshot.data() : {};

        $("badgeText").value = data.badgeText ?? "Artista";
        $("subtitle").value = data.subtitle ??
            "BEM-VINDO AO MEU UNIVERSO ARTÍSTICO";

        $("title").value = data.title ?? "gForc_ART";

        $("description").value = data.description ??
            "Ilustradora e criadora de universos conceituais.";

        $("instagram").value = data.instagram ?? "";
        $("secondaryLink").value = data.secondaryLink ?? "";
        $("artstation").value = data.artstation ?? "";

        selectedIcon = data.badgeIcon ?? "palette";

        const selectedButton = document.querySelector(
            `.icon-option[data-icon="${selectedIcon}"]`
        );

        document.querySelectorAll(".icon-option").forEach(item => {
            item.classList.remove("selected");
        });

        if (selectedButton) {
            selectedButton.classList.add("selected");
        } else {
            selectedIcon = "palette";
            document.querySelector(
                '.icon-option[data-icon="palette"]'
            ).classList.add("selected");
        }

        currentAvatar = data.avatarUrl || DEFAULT_AVATAR;
        $("avatarPreview").src = currentAvatar;

        removeCurrentPhoto = false;
        $("avatarFile").value = "";

        updatePreview();

        status("Perfil carregado. Você já pode editar!", "success");

    } catch (error) {
        console.error(error);
        status("Erro ao carregar perfil. Confira as regras do Firestore.", "error");
    }
}

// ==================================
// VALIDAR LINKS
// ==================================

function validLinks(data) {
    const links = [
        data.instagram,
        data.secondaryLink,
        data.artstation
    ];

    return links.every(value => {
        if (!value) return true;

        try {
            const url = new URL(value);
            return ["http:", "https:"].includes(url.protocol);
        } catch {
            return false;
        }
    });
}

// ==================================
// ENVIAR FOTO
// ==================================

// ==================================
// ENVIAR FOTO (Versão Blindada)
// ==================================

// ==================================
// CONVERTER FOTO PARA BASE64 (Sem usar Storage)
// ==================================

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// ==================================
// SALVAR (Versão Otimizada com Base64)
// ==================================

$("profileForm").addEventListener("submit", async event => {
    event.preventDefault();

    if (!user || loading) return;

    const data = {
        badgeText: $("badgeText").value.trim(),
        badgeIcon: selectedIcon,
        subtitle: $("subtitle").value.trim(),
        title: $("title").value.trim(),
        description: $("description").value.trim(),
        instagram: $("instagram").value.trim(),
        secondaryLink: $("secondaryLink").value.trim(),
        artstation: $("artstation").value.trim()
    };

    if (!data.badgeText || !data.title) {
        status("Preencha o texto da tag e o título principal.", "error");
        return;
    }

    if (!validLinks(data)) {
        status("Confira os links das redes sociais.", "error");
        return;
    }

    try {
        setSaving(true);
        status("Salvando suas alterações e foto...");

        const fileInput = $("avatarFile");
        
        if (fileInput.files && fileInput.files[0]) {
            // Converte a nova foto escolhida para Base64 diretamente
            data.avatarUrl = await convertFileToBase64(fileInput.files[0]);
        } else if (removeCurrentPhoto) {
            data.avatarUrl = DEFAULT_AVATAR;
        } else {
            data.avatarUrl = currentAvatar;
        }

        data.updatedAt = new Date().toISOString();

        await setDoc(profileRef, data, { merge: true });

        currentAvatar = data.avatarUrl;
        removeCurrentPhoto = false;
        $("avatarFile").value = "";

        if (previewObjectURL) {
            URL.revokeObjectURL(previewObjectURL);
            previewObjectURL = null;
        }

        $("avatarPreview").src = currentAvatar;
        updatePreview();

        status("Tudo salvo com sucesso!", "success");

    } catch (error) {
        console.error("Erro ao salvar:", error);
        status("Não foi possível salvar. Verifique o console.", "error");
    } finally {
        setSaving(false);
    }
});

// ==================================
// SALVAR
// ==================================

$("profileForm").addEventListener("submit", async event => {
    event.preventDefault();

    if (!user || loading) return;

    const data = {
        badgeText: $("badgeText").value.trim(),
        badgeIcon: selectedIcon,
        subtitle: $("subtitle").value.trim(),
        title: $("title").value.trim(),
        description: $("description").value.trim(),
        instagram: $("instagram").value.trim(),
        secondaryLink: $("secondaryLink").value.trim(),
        artstation: $("artstation").value.trim()
    };

    if (!data.badgeText || !data.title) {
        status("Preencha o texto da tag e o título principal.", "error");
        return;
    }

    if (!validLinks(data)) {
        status("Confira os links das redes sociais.", "error");
        return;
    }

    try {
        setSaving(true);
        status("Salvando suas alterações...");

        data.avatarUrl = await uploadPhoto();
        data.updatedAt = new Date().toISOString();

        await setDoc(profileRef, data, { merge: true });

        currentAvatar = data.avatarUrl;
        removeCurrentPhoto = false;

        $("avatarFile").value = "";

        if (previewObjectURL) {
            URL.revokeObjectURL(previewObjectURL);
            previewObjectURL = null;
        }

        $("avatarPreview").src = currentAvatar;

        updatePreview();

        status("Tudo salvo com sucesso!", "success");

    } catch (error) {
        console.error("Erro ao salvar:", error);
        status(
            "Não foi possível salvar. Confira as permissões do Firestore e Storage.",
            "error"
        );
    } finally {
        setSaving(false);
    }
});

// ==================================
// RECARREGAR DADOS
// ==================================

$("resetButton").addEventListener("click", () => {
    if (loading) return;

    if (previewObjectURL) {
        URL.revokeObjectURL(previewObjectURL);
        previewObjectURL = null;
    }

    loadProfile();
});

// ==================================
// AUTENTICAÇÃO
// ==================================

onAuthStateChanged(auth, async currentUser => {
    user = currentUser;

    if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
        $("profileForm").hidden = true;
        $("saveButton").disabled = true;

        status(
            "Acesso negado. Entre com a conta administradora.",
            "error"
        );

        return;
    }

    $("profileForm").hidden = false;
    $("saveButton").disabled = false;

    await loadProfile();
});


