import {
    auth,
    provider
} from "./firebase-config.js";

import {
    signInWithPopup
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


const btn =
document.getElementById("googleLogin");


btn.addEventListener(
    "click",
    async () => {

        try{

            const resultado =
            await signInWithPopup(
                auth,
                provider
            );

            const email =
            resultado.user.email;


            if(
                email ===
                "SEUEMAIL@gmail.com"
            ){

                window.location =
                "configuracoes.html";

            }else{

                alert(
                    "Você não tem permissão."
                );

                await auth.signOut();

            }

        }catch(erro){

            console.error(erro);

        }

    }
);