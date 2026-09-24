import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

onAuthStateChanged(auth, usuario => {

    const adminLink =
        document.getElementById("adminLink");

    if (!adminLink) return;

    if (
        usuario &&
        usuario.email === "polyanadesn02@gmail.com"
    ) {
        adminLink.style.display = "block";
    } else {
        adminLink.style.display = "none";
    }

});