import {
    auth,
    provider
} from "./firebase-config.js";

import {
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

console.log("LOGIN.JS CARREGOU");

const btn =
document.getElementById("googleLogin");

console.log("BOTÃO:", btn);

btn.addEventListener(
    "click",
    async () => {

        console.log("BOTÃO CLICADO");

        try {

            console.log("VOU ABRIR LOGIN GOOGLE");

            const resultado =
                await signInWithPopup(
                    auth,
                    provider
                );

            const email =
                resultado.user.email;

            console.log("EMAIL:", email);

            if (
                email ===
                "polyanadesn02@gmail.com"
            ) {

                window.location =
                    "configuracoes.html";

            } else {

                alert(
                    "Você não tem permissão."
                );

            }

        } catch(erro){

    console.log(erro);

    alert(
        erro.code + "\n" +
        erro.message
    );

}

    }
);