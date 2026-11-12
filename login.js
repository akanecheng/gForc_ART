import {
    auth,
    provider
} from "./firebase-config.js";

import {
    signInWithRedirect,
    getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

console.log("LOGIN.JS CARREGOU");

// Assim que a página carrega, verifica se o usuário acabou de voltar do login do Google
getRedirectResult(auth)
    .then((resultado) => {
        if (resultado && resultado.user) {
            const email = resultado.user.email;
            console.log("EMAIL:", email);

            if (email === "polyanadesn02@gmail.com") {
                window.location = "configuracoes.html";
            } else {
                alert("Você não tem permissão.");
            }
        }
    })
    .catch((erro) => {
        console.log(erro);
        alert(erro.code + "\n" + erro.message);
    });

const btn = document.getElementById("googleLogin");

console.log("BOTÃO:", btn);

if (btn) {
    btn.addEventListener("click", async () => {
        console.log("BOTÃO CLICADO - Redirecionando para o Google");
        try {
            // Usa redirecionamento em vez de pop-up (ideal para celulares)
            await signInWithRedirect(auth, provider);
        } catch (erro) {
            console.log(erro);
            alert(erro.code + "\n" + erro.message);
        }
    });
}