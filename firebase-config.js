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