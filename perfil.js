import {
    auth,
    db,
    storage
} from "./firebase-config.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";



/* ================================= */
/* ELEMENTOS */
/* ================================= */

const menuToggle =
    document.getElementById("menuToggle");

const navDrawer =
    document.getElementById("navDrawer");


const avatarInput =
    document.getElementById("avatarInput");

const photoPreview =
    document.getElementById("photoPreview");

const previewAvatar =
    document.getElementById("previewAvatar");

const fileName =
    document.getElementById("fileName");


const avatarScale =
    document.getElementById("avatarScale");

const avatarPosX =
    document.getElementById("avatarPosX");

const avatarPosY =
    document.getElementById("avatarPosY");


const scaleValue =
    document.getElementById("scaleValue");

const posXValue =
    document.getElementById("posXValue");

const posYValue =
    document.getElementById("posYValue");


const resetPhoto =
    document.getElementById("resetPhoto");


const titleInput =
    document.getElementById("titleInput");

const subtitleInput =
    document.getElementById("subtitleInput");

const badgeInput =
    document.getElementById("badgeInput");

const descriptionInput =
    document.getElementById("descriptionInput");


const descriptionCount =
    document.getElementById("descriptionCount");


const instagramInput =
    document.getElementById("instagramInput");

const secondaryInput =
    document.getElementById("secondaryInput");

const artstationInput =
    document.getElementById("artstationInput");


const saveButton =
    document.getElementById("saveButton");

const statusMessage =
    document.getElementById("statusMessage");



/* ================================= */
/* PREVIEW */
/* ================================= */

const previewTitle =
    document.getElementById("previewTitle");

const previewSubtitle =
    document.getElementById("previewSubtitle");

const previewBadge =
    document.getElementById("previewBadge");

const previewDescription =
    document.getElementById("previewDescription");


const previewInstagram =
    document.getElementById("previewInstagram");

const previewSecondary =
    document.getElementById("previewSecondary");

const previewArtstation =
    document.getElementById("previewArtstation");



/* ================================= */
/* MENU */
/* ================================= */

if (menuToggle && navDrawer) {

    menuToggle.addEventListener(
        "click",
        () => {

            navDrawer.classList.toggle("open");

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !navDrawer.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                navDrawer.classList.remove("open");

            }

        }
    );

}



/* ================================= */
/* ESTADO */
/* ================================= */

let currentAvatarUrl = "";

let currentScale = 1;

let currentPosX = 0;

let currentPosY = 0;

let selectedImage = null;



/* ================================= */
/* AUTENTICAÇÃO */
/* ================================= */

onAuthStateChanged(
    auth,
    async usuario => {

        if (!usuario) {

            window.location.href =
                "login.html";

            return;

        }


        if (
            usuario.email !==
            "polyanadesn02@gmail.com"
        ) {

            window.location.href =
                "index.html";

            return;

        }


        await loadProfile();

    }
);



/* ================================= */
/* CARREGAR PERFIL */
/* ================================= */

async function loadProfile() {

    try {

        const profileRef =
            doc(
                db,
                "siteData",
                "profile"
            );


        const profileSnap =
            await getDoc(profileRef);


        if (!profileSnap.exists()) {

            updatePreview();

            return;

        }


        const data =
            profileSnap.data();



        /* ========================= */
        /* TEXTOS */
        /* ========================= */

        titleInput.value =
            data.title || "";

        subtitleInput.value =
            data.subtitle || "";

        badgeInput.value =
            data.badgeText || "";

        descriptionInput.value =
            data.description || "";



        /* ========================= */
        /* REDES */
        /* ========================= */

        instagramInput.value =
            data.instagram || "";

        secondaryInput.value =
            data.secondaryLink || "";

        artstationInput.value =
            data.artstation || "";



        /* ========================= */
        /* FOTO */
        /* ========================= */

        currentAvatarUrl =
            data.avatarUrl || "";


        currentScale =
            Number(data.avatarScale) || 1;


        currentPosX =
            Number(data.avatarPosX) || 0;


        currentPosY =
            Number(data.avatarPosY) || 0;



        avatarScale.value =
            currentScale;

        avatarPosX.value =
            currentPosX;

        avatarPosY.value =
            currentPosY;



        if (currentAvatarUrl) {

            photoPreview.src =
                currentAvatarUrl;

            previewAvatar.src =
                currentAvatarUrl;

        }


        updatePhotoTransform();

        updatePreview();

        updateDescriptionCount();

    }

    catch (error) {

        console.error(
            "Erro ao carregar perfil:",
            error
        );


        showStatus(
            "Não foi possível carregar os dados.",
            "error"
        );

    }

}



/* ================================= */
/* FOTO — SELECIONAR */
/* ================================= */

avatarInput.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        selectedImage =
            file;


        fileName.textContent =
            file.name;


        const reader =
            new FileReader();


        reader.onload =
            event => {

                const imageUrl =
                    event.target.result;


                photoPreview.src =
                    imageUrl;

                previewAvatar.src =
                    imageUrl;


                currentScale =
                    1;

                currentPosX =
                    0;

                currentPosY =
                    0;


                avatarScale.value =
                    1;

                avatarPosX.value =
                    0;

                avatarPosY.value =
                    0;


                updatePhotoTransform();

            };


        reader.readAsDataURL(file);

    }
);



/* ================================= */
/* CONTROLES DA FOTO */
/* ================================= */

avatarScale.addEventListener(
    "input",
    () => {

        currentScale =
            Number(avatarScale.value);

        updatePhotoTransform();

    }
);


avatarPosX.addEventListener(
    "input",
    () => {

        currentPosX =
            Number(avatarPosX.value);

        updatePhotoTransform();

    }
);


avatarPosY.addEventListener(
    "input",
    () => {

        currentPosY =
            Number(avatarPosY.value);

        updatePhotoTransform();

    }
);



/* ================================= */
/* APLICAR TRANSFORMAÇÃO */
/* ================================= */

function updatePhotoTransform() {

    scaleValue.textContent =
        `${currentScale.toFixed(1)}x`;


    posXValue.textContent =
        currentPosX;


    posYValue.textContent =
        currentPosY;


    const transform =
        `
        translate(
            calc(-50% + ${currentPosX}px),
            calc(-50% + ${currentPosY}px)
        )
        scale(${currentScale})
        `;


    photoPreview.style.transform =
        transform;


    previewAvatar.style.transform =
        transform;

}



/* ================================= */
/* RESTAURAR FOTO */
/* ================================= */

resetPhoto.addEventListener(
    "click",
    () => {

        currentScale =
            1;

        currentPosX =
            0;

        currentPosY =
            0;


        avatarScale.value =
            1;

        avatarPosX.value =
            0;

        avatarPosY.value =
            0;


        updatePhotoTransform();

    }
);



/* ================================= */
/* CAMPOS DE TEXTO */
/* ================================= */

titleInput.addEventListener(
    "input",
    updatePreview
);


subtitleInput.addEventListener(
    "input",
    updatePreview
);


badgeInput.addEventListener(
    "input",
    updatePreview
);


descriptionInput.addEventListener(
    "input",
    () => {

        updatePreview();

        updateDescriptionCount();

    }
);


instagramInput.addEventListener(
    "input",
    updatePreview
);


secondaryInput.addEventListener(
    "input",
    updatePreview
);


artstationInput.addEventListener(
    "input",
    updatePreview
);



/* ================================= */
/* CONTADOR */
/* ================================= */

function updateDescriptionCount() {

    descriptionCount.textContent =
        descriptionInput.value.length;

}



/* ================================= */
/* ATUALIZAR PREVIEW */
/* ================================= */

function updatePreview() {

    previewTitle.textContent =
        titleInput.value ||
        "gForc_ART";


    previewSubtitle.textContent =
        subtitleInput.value ||
        "BEM-VINDO AO MEU UNIVERSO ARTÍSTICO";


    previewBadge.textContent =
        badgeInput.value ||
        "Artista";


    previewDescription.textContent =
        descriptionInput.value ||
        "Ilustradora e criadora de universos conceituais.";


    updateSocialPreview(
        previewInstagram,
        instagramInput.value
    );


    updateSocialPreview(
        previewSecondary,
        secondaryInput.value
    );


    updateSocialPreview(
        previewArtstation,
        artstationInput.value
    );

}



/* ================================= */
/* LINKS DO PREVIEW */
/* ================================= */

function updateSocialPreview(
    element,
    url
) {

    if (url.trim() !== "") {

        element.href =
            url;

        element.classList.remove(
            "inactive"
        );

    }

    else {

        element.href =
            "#";

        element.classList.add(
            "inactive"
        );

    }

}



/* ================================= */
/* SALVAR */
/* ================================= */

saveButton.addEventListener(
    "click",
    saveProfile
);



async function saveProfile() {

    try {

        saveButton.disabled =
            true;


        saveButton.innerHTML =
            `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Salvando...
            `;


        showStatus(
            "",
            ""
        );


        let avatarUrl =
            currentAvatarUrl;



        /* ========================= */
        /* UPLOAD */
        /* ========================= */

        if (selectedImage) {

            const extension =
                selectedImage.name
                    .split(".")
                    .pop();


            const imageRef =
                ref(
                    storage,
                    `site/profile/avatar.${extension}`
                );


            await uploadBytes(
                imageRef,
                selectedImage
            );


            avatarUrl =
                await getDownloadURL(
                    imageRef
                );

        }



        /* ========================= */
        /* DADOS */
        /* ========================= */

        const profileData = {

            title:
                titleInput.value.trim(),

            subtitle:
                subtitleInput.value.trim(),

            badgeText:
                badgeInput.value.trim(),

            description:
                descriptionInput.value.trim(),

            avatarUrl:
                avatarUrl,

            avatarScale:
                currentScale,

            avatarPosX:
                currentPosX,

            avatarPosY:
                currentPosY,

            instagram:
                instagramInput.value.trim(),

            secondaryLink:
                secondaryInput.value.trim(),

            artstation:
                artstationInput.value.trim()

        };



        /* ========================= */
        /* FIRESTORE */
        /* ========================= */

        await setDoc(
            doc(
                db,
                "siteData",
                "profile"
            ),
            profileData,
            {
                merge: true
            }
        );


        currentAvatarUrl =
            avatarUrl;


        selectedImage =
            null;


        fileName.textContent =
            "Alterações salvas.";


        showStatus(
            "Alterações salvas com sucesso!",
            "success"
        );



    }

    catch (error) {

        console.error(
            "Erro ao salvar:",
            error
        );


        showStatus(
            "Erro ao salvar as alterações.",
            "error"
        );

    }

    finally {

        saveButton.disabled =
            false;


        saveButton.innerHTML =
            `
            <i class="fa-solid fa-floppy-disk"></i>
            Salvar alterações
            `;

    }

}



/* ================================= */
/* STATUS */
/* ================================= */

function showStatus(
    message,
    type
) {

    statusMessage.textContent =
        message;


    statusMessage.className =
        "status-message";


    if (type) {

        statusMessage.classList.add(
            type
        );

    }

}