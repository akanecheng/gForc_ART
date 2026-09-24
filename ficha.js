import { db } from "./firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


const container = document.getElementById("characterContainer");


// Pega o ID que veio na URL
const params = new URLSearchParams(window.location.search);
const characterId = params.get("id");


async function carregarFicha() {

    if (!characterId) {

        container.innerHTML = `
            <div class="error-state">
                <i class="fa-solid fa-circle-exclamation"></i>
                <h2>Personagem não encontrado</h2>
                <p>Nenhum ID foi informado na URL.</p>
            </div>
        `;

        return;
    }


    try {

        console.log("Buscando personagem:", characterId);


        const personagemRef = doc(
            db,
            "personagens",
            characterId
        );


        const personagemSnap = await getDoc(personagemRef);


        if (!personagemSnap.exists()) {

            container.innerHTML = `
                <div class="error-state">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <h2>Personagem não encontrado</h2>
                    <p>Esse personagem não existe no Firestore.</p>
                </div>
            `;

            return;
        }


        const personagem = personagemSnap.data();


        console.log("Personagem encontrado:", personagem);


        renderizarFicha(personagem);


    } catch (erro) {

        console.error(
            "Erro ao carregar ficha:",
            erro
        );


        container.innerHTML = `
            <div class="error-state">
                <i class="fa-solid fa-circle-exclamation"></i>
                <h2>Erro ao carregar personagem</h2>
                <p>Verifique o console para mais detalhes.</p>
            </div>
        `;

    }

}


function renderizarFicha(personagem) {

    const relacoes = Array.isArray(personagem.relacoes)
        ? personagem.relacoes
        : [];


    container.innerHTML = `

        <article class="character-sheet">

            <header class="profile-header">

                <div class="avatar-wrapper">

                    ${
                        personagem.imagemBase64
                        ?
                        `
                        <img
                            src="${personagem.imagemBase64}"
                            alt="${personagem.nome || "Personagem"}"
                        >
                        `
                        :
                        `
                        <div class="no-image">
                            <i class="fa-solid fa-user"></i>
                        </div>
                        `
                    }

                </div>


                <div class="profile-meta">

                    <h1 class="char-title">
                        ${personagem.nome || "Sem nome"}
                    </h1>


                    <div class="stats-grid">

                        ${
                            personagem.idade
                            ?
                            `
                            <div class="stat-box">
                                <i class="fa-solid fa-cake-candles"></i>
                                <span>Idade</span>
                                <strong>${personagem.idade}</strong>
                            </div>
                            `
                            :
                            ""
                        }


                        ${
                            personagem.genero
                            ?
                            `
                            <div class="stat-box">
                                <i class="fa-solid fa-user"></i>
                                <span>Gênero</span>
                                <strong>${personagem.genero}</strong>
                            </div>
                            `
                            :
                            ""
                        }


                        ${
                            personagem.ocupacao
                            ?
                            `
                            <div class="stat-box">
                                <i class="fa-solid fa-briefcase"></i>
                                <span>Ocupação</span>
                                <strong>${personagem.ocupacao}</strong>
                            </div>
                            `
                            :
                            ""
                        }

                    </div>

                </div>

            </header>


            ${
                personagem.resumo
                ?
                `
                <section class="info-section">

                    <h2 class="section-title">
                        <i class="fa-solid fa-book-open"></i>
                        Resumo
                    </h2>

                    <div class="section-content">
                        <p>${personagem.resumo}</p>
                    </div>

                </section>
                `
                :
                ""
            }


            ${
                personagem.personalidade
                ?
                `
                <section class="info-section">

                    <h2 class="section-title">
                        <i class="fa-solid fa-heart"></i>
                        Personalidade
                    </h2>

                    <div class="section-content">
                        <p>${personagem.personalidade}</p>
                    </div>

                </section>
                `
                :
                ""
            }


            ${
                personagem.historia
                ?
                `
                <section class="info-section">

                    <h2 class="section-title">
                        <i class="fa-solid fa-scroll"></i>
                        História
                    </h2>

                    <div class="section-content">
                        <p>${personagem.historia}</p>
                    </div>

                </section>
                `
                :
                ""
            }


            ${
                personagem.curiosidades
                ?
                `
                <section class="info-section">

                    <h2 class="section-title">
                        <i class="fa-solid fa-star"></i>
                        Curiosidades
                    </h2>

                    <div class="section-content">
                        <p>${personagem.curiosidades}</p>
                    </div>

                </section>
                `
                :
                ""
            }


            ${
    relacoes.length > 0
    ?
    `
    <section class="info-section">

        <h2 class="section-title">
            <i class="fa-solid fa-users"></i>
            Relações
        </h2>

    <div class="relations-list">

          ${relacoes.map(relacao => `

  <div class="relation-item">

    <div class="relation-avatar">
        <i class="fa-solid fa-user"></i>
    </div>

    <div class="relation-info">

        <strong>
            ${relacao.alvo || "Personagem"}
        </strong>

        ${
            relacao.tipo
            ? `<span>${relacao.tipo}</span>`
            : ""
        }

    </div>

</div>

`).join("")}

        </div>

    </section>
    `
    :
    ""
}

        </article>

    `;

}


carregarFicha();