import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


onAuthStateChanged(
    auth,
    usuario => {

        if(!usuario){

            window.location =
            "login.html";

            return;
        }

        if(
            usuario.email !==
            "polyanadesn02@gmail.co"
        ){

            window.location =
            "index.html";
        }

    }
);

const menuToggle =
    document.getElementById("menuToggle");

const navDrawer =
    document.getElementById("navDrawer");


if (menuToggle && navDrawer) {

    menuToggle.addEventListener("click", () => {

        navDrawer.classList.toggle("open");

    });


    document.addEventListener("click", event => {

        if (
            !navDrawer.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {

            navDrawer.classList.remove("open");

        }

    });

}

console.log("CONFIGURAÇÕES CARREGOU");

onAuthStateChanged(
    auth,
    usuario => {

        console.log("USUÁRIO:", usuario);

        if(!usuario){

            console.log("NÃO LOGADO");

            window.location =
            "login.html";

            return;
        }

        console.log("EMAIL:", usuario.email);

        if(
            usuario.email !==
            "polyanadesn02@gmail.com"
        ){

            console.log("SEM PERMISSÃO");

            window.location =
            "index.html";
        }

    }
);