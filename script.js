
// Credenciais Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDS_SifU-K0PyO1RSX-FS2aUdCQyrgWWWk4",
    authDomain: "gforcart-41d76.firebaseapp.com",
    projectId: "gforcart-41d76",
    storageBucket: "gforcart-41d76.firebasestorage.app",
    messagingSenderId: "84829153990",
    appId: "1:84829153990:web:6a9a1e01745eae806905c7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

// Funcionalidade do Menu Drawer
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const navDrawer = document.getElementById("navDrawer");

    if (menuToggle && navDrawer) {
        menuToggle.addEventListener("click", () => {
            navDrawer.classList.toggle("open");
        });

        document.addEventListener("click", (e) => {
            if (!navDrawer.contains(e.target) && !menuToggle.contains(e.target)) {
                navDrawer.classList.remove("open");
            }
        });
    }

    loadProfileData();
});

// Busca no Firebase Firestore
async function loadProfileData() {
    try {
        const docRef = doc(db, "siteData", "profile");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            if (data.title) {
                document.getElementById("artist-title").innerHTML = data.title.replace("\n", "<br>");
            }
            if (data.subtitle) {
                document.getElementById("artist-subtitle").innerText = data.subtitle;
            }
            if (data.description) {
                document.getElementById("artist-description").innerText = data.description;
            }
            if (data.badgeText) {
                document.getElementById("badge-text").innerText = data.badgeText;
            }
            if (data.avatarUrl) {
                document.getElementById("artist-avatar").src = data.avatarUrl;
            }
            if (data.instagram) {
                document.getElementById("link-instagram").href = data.instagram;
            }
            if (data.secondaryLink) {
                document.getElementById("link-secondary").href = data.secondaryLink;
            }
            if (data.artstation) {
                document.getElementById("link-artstation").href = data.artstation;
            }
        }
    } catch (error) {
        console.error("Erro Firestore:", error);
    }
}