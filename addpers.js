

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

console.log("🔥 ADDPERS.JS COMEÇOU A RODAR");

let base64ImageComprimida = "";
let personagensExistentes = [];
let personagemEditandoId = null;
let personagensCompletos = [];

document.addEventListener("DOMContentLoaded", async () => {

    /* =========================
       MENU
    ========================= */

    const menuToggle = document.getElementById("menuToggle");
    const navDrawer = document.getElementById("navDrawer");

    if (menuToggle && navDrawer) {

        menuToggle.addEventListener("click", () => {
            navDrawer.classList.toggle("open");
        });

    }


    /* =========================
       CAMPOS
    ========================= */

    const inputName =
        document.getElementById("char-name");

    const inputAge =
        document.getElementById("char-age");

    const inputGender =
        document.getElementById("char-gender");

    const inputOccupation =
        document.getElementById("char-occupation");

    const inputSummary =
        document.getElementById("char-summary");

    const inputPersonality =
        document.getElementById("char-personality");

    const inputBio =
        document.getElementById("char-bio");

    const inputCuriosities =
        document.getElementById("char-curiosities");

    const inputFile =
        document.getElementById("char-image-file");

    const inputColor =
        document.getElementById("char-card-color");


    /* =========================
       PREVIEW CARD
    ========================= */

    const pvGalleryImg =
        document.getElementById("pv-gallery-img");

    const pvGalleryName =
        document.getElementById("pv-gallery-name");

    const pvNoImage =
        document.getElementById("pv-no-image");


    /* =========================
       PREVIEW FICHA
    ========================= */

    const pvSheetImg =
        document.getElementById("pv-sheet-img");

    const pvSheetName =
        document.getElementById("pv-sheet-name");

    const pvSheetNoImage =
        document.getElementById("pv-sheet-no-image");

    const pvSheetStats =
        document.getElementById("pv-sheet-stats");

    const pvSummary =
        document.getElementById("pv-summary");

    const pvPersonality =
        document.getElementById("pv-personality");

    const pvBio =
        document.getElementById("pv-bio");

    const pvCuriosities =
        document.getElementById("pv-curiosities");


    const summarySection =
        document.getElementById("preview-summary-section");

    const personalitySection =
        document.getElementById("preview-personality-section");

    const historySection =
        document.getElementById("preview-history-section");

    const curiositiesSection =
        document.getElementById("preview-curiosities-section");

    const relationsSection =
        document.getElementById("preview-relations-section");

    const pvRelationsList =
        document.getElementById("pv-relations-list");


    /* =========================
       RELAÇÕES
    ========================= */

    const relationsContainer =
        document.getElementById("relations-container");

    const btnAddRelation =
        document.getElementById("btn-add-relation");


    /* =========================
       CARREGAR PERSONAGENS
    ========================= */

    async function carregarPersonagens() {

    try {

        const snapshot = await getDocs(
            collection(db, "personagens")
        );

        personagensExistentes = [];

        snapshot.forEach(documento => {

            const personagem = documento.data();

            if (personagem.nome) {

                personagensExistentes.push(
                    personagem.nome
                );

            }

        });

        personagensExistentes.sort((a, b) =>
            a.localeCompare(b, "pt-BR")
        );

        console.log(
            "Personagens encontrados:",
            personagensExistentes
        );

    } catch (erro) {

        console.error(
            "ERRO COMPLETO:"
        );

        console.error(erro);
        console.error(erro.message);
        console.error(erro.stack);

    }

}

    /* =========================
       CRIAR LINHA DE VÍNCULO
    ========================= */

    function criarLinhaVinculo() {

        const row =
            document.createElement("div");

        row.className =
            "relation-row";


        let options = `
            <option value="">
                Personagem
            </option>
        `;


        personagensExistentes.forEach(nome => {

            options += `
                <option value="${escaparHTML(nome)}">
                    ${escaparHTML(nome)}
                </option>
            `;

        });


        row.innerHTML = `

            <select class="rel-target">

                ${options}

            </select>


            <input
                type="text"
                class="rel-type"
                placeholder="Tipo de vínculo"
            >


            <button
                type="button"
                class="btn-remove-relation"
                title="Remover"
            >

                <i class="fa-solid fa-xmark"></i>

            </button>

        `;


        row.querySelector(".rel-target")
            .addEventListener(
                "change",
                atualizarPreview
            );


        row.querySelector(".rel-type")
            .addEventListener(
                "input",
                atualizarPreview
            );


        row.querySelector(".btn-remove-relation")
            .addEventListener(
                "click",
                () => {

                    row.remove();

                    atualizarPreview();

                }
            );


        relationsContainer.appendChild(row);

    }


    if (btnAddRelation) {

        btnAddRelation.addEventListener(
            "click",
            criarLinhaVinculo
        );

    }


    /* =========================
       PREVIEW
    ========================= */

    function atualizarPreview() {

        const nome =
            inputName.value.trim();

        const idade =
            inputAge.value.trim();

        const genero =
            inputGender.value.trim();

        const ocupacao =
            inputOccupation.value.trim();

        const resumo =
            inputSummary.value.trim();

        const personalidade =
            inputPersonality.value.trim();

        const historia =
            inputBio.value.trim();

        const curiosidades =
            inputCuriosities.value.trim();


        pvGalleryName.textContent =
            nome || "Nome";


        pvSheetName.textContent =
            nome || "Nome";


        pvSheetStats.innerHTML = "";


        if (idade) {

            pvSheetStats.innerHTML += `
                <span class="sheet-stat">
                    Idade: ${escaparHTML(idade)}
                </span>
            `;

        }


        if (genero) {

            pvSheetStats.innerHTML += `
                <span class="sheet-stat">
                    ${escaparHTML(genero)}
                </span>
            `;

        }


        if (ocupacao) {

            pvSheetStats.innerHTML += `
                <span class="sheet-stat">
                    ${escaparHTML(ocupacao)}
                </span>
            `;

        }


        atualizarSecao(
            summarySection,
            pvSummary,
            resumo
        );


        atualizarSecao(
            personalitySection,
            pvPersonality,
            personalidade
        );


        atualizarSecao(
            historySection,
            pvBio,
            historia
        );


        atualizarSecao(
            curiositiesSection,
            pvCuriosities,
            curiosidades
        );


        const cor =
            inputColor.value || "#3A0B17";


        const galleryPreview =
            document.querySelector(".gallery-preview");


        if (galleryPreview) {

            galleryPreview.style.backgroundColor =
                cor;

        }


        atualizarRelacoes();

    }


    function atualizarSecao(
        section,
        elemento,
        valor
    ) {

        if (!section || !elemento) return;


        if (valor) {

            section.style.display = "block";

            elemento.textContent = valor;

        } else {

            section.style.display = "none";

        }

    }


    /* =========================
       PREVIEW RELAÇÕES
    ========================= */

    function atualizarRelacoes() {

        const rows =
            document.querySelectorAll(
                ".relation-row"
            );


        const relacoes = [];


        rows.forEach(row => {

            const alvo =
                row.querySelector(
                    ".rel-target"
                ).value;

            const tipo =
                row.querySelector(
                    ".rel-type"
                ).value.trim();


            if (alvo) {

                relacoes.push({
                    alvo,
                    tipo: tipo || "Vínculo"
                });

            }

        });


        if (relacoes.length === 0) {

            relationsSection.style.display =
                "none";

            pvRelationsList.innerHTML =
                "";

            return;

        }


        relationsSection.style.display =
            "block";


        pvRelationsList.innerHTML =
            relacoes.map(relacao => `

                <div class="preview-relation">

                    <strong>
                        ${escaparHTML(relacao.tipo)}
                    </strong>

                    — ${escaparHTML(relacao.alvo)}

                </div>

            `).join("");

    }


    /* =========================
       IMAGEM
    ========================= */

    inputFile.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];


            if (!file) return;


            const reader =
                new FileReader();


            reader.readAsDataURL(file);


            reader.onload = event => {

                const img =
                    new Image();


                img.src =
                    event.target.result;


                img.onload = () => {

                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    const MAX_WIDTH = 500;


                    let width =
                        img.width;

                    let height =
                        img.height;


                    if (width > MAX_WIDTH) {

                        const escala =
                            MAX_WIDTH / width;


                        width =
                            MAX_WIDTH;


                        height =
                            height * escala;

                    }


                    canvas.width =
                        width;

                    canvas.height =
                        height;


                    const ctx =
                        canvas.getContext("2d");


                    ctx.drawImage(
                        img,
                        0,
                        0,
                        width,
                        height
                    );


                    base64ImageComprimida =
                        canvas.toDataURL(
                            "image/jpeg",
                            0.70
                        );


                    pvGalleryImg.src =
                        base64ImageComprimida;

                    pvGalleryImg.style.display =
                        "block";

                    pvNoImage.style.display =
                        "none";


                    pvSheetImg.src =
                        base64ImageComprimida;

                    pvSheetImg.style.display =
                        "block";

                    pvSheetNoImage.style.display =
                        "none";


                    const sizeKB =
                        Math.round(
                            (
                                base64ImageComprimida.length *
                                0.75
                            ) / 1024
                        );


                    document.getElementById(
                        "file-size-info"
                    ).textContent =
                        `Imagem compactada: aproximadamente ${sizeKB} KB`;

                };

            };

        }
    );


    /* =========================
       CAMPOS → PREVIEW
    ========================= */

    [

        inputName,
        inputAge,
        inputGender,
        inputOccupation,
        inputSummary,
        inputPersonality,
        inputBio,
        inputCuriosities,
        inputColor

    ].forEach(campo => {

        campo.addEventListener(
            "input",
            atualizarPreview
        );

    });


    /* =========================
       COR
    ========================= */

    inputColor.addEventListener(
        "input",
        () => {

            document.getElementById(
                "color-value"
            ).textContent =
                inputColor.value.toUpperCase();

        }
    );
    
        /* =========================
       SALVAR
    ========================= */

    const form =
        document.getElementById(
            "char-form"
        );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const relacoes = [];


            document
                .querySelectorAll(".relation-row")
                .forEach(row => {

                    const alvo =
                        row.querySelector(
                            ".rel-target"
                        ).value;


                    const tipo =
                        row.querySelector(
                            ".rel-type"
                        ).value.trim();


                    if (alvo) {

                        relacoes.push({
                            alvo,
                            tipo: tipo || "Vínculo"
                        });

                    }

                });


            const personagem = {

                nome:
                    inputName.value.trim(),

                idade:
                    inputAge.value.trim(),

                genero:
                    inputGender.value.trim(),

                ocupacao:
                    inputOccupation.value.trim(),

                resumo:
                    inputSummary.value.trim(),

                personalidade:
                    inputPersonality.value.trim(),

                historia:
                    inputBio.value.trim(),

                curiosidades:
                    inputCuriosities.value.trim(),

                imagemBase64:
                    base64ImageComprimida,

                corCard:
                    inputColor.value,

                relacoes,

                criadoEm:
                    new Date().toISOString()

            };


            try {

                console.log(
                    "Tentando salvar...",
                    personagem
                );


                if (personagemEditandoId) {
                    
                    console.log("ID EDITANDO:");
console.log(personagemEditandoId);

console.log("PERSONAGEM:");
console.log(personagem);

    await updateDoc(
        doc(
            db,
            "personagens",
            personagemEditandoId
        
        ),
        personagem
    );

    console.log("Personagem atualizado!");

} else {

    const docRef = await addDoc(
        collection(db, "personagens"),
        personagem
    );

    console.log(
        "Salvo com ID:",
        docRef.id
    );

}
                alert(
                    `Personagem "${personagem.nome}" salvo com sucesso!`
                );


                /*
                   Recarrega os nomes dos
                   personagens para os vínculos.
                */

                await carregarPersonagens();


                /*
                   Recarrega a lista de
                   personagens cadastrados.
                */

                await carregarListaPersonagens();


            } catch (erro) {

                console.error(
                    "Erro ao salvar:",
                    erro
                );


                alert(
                    "Erro ao salvar personagem."
                );


                return;

            }


            /* =========================
               LIMPAR FORMULÁRIO
            ========================= */

            form.reset();


            base64ImageComprimida =
                "";


            relationsContainer.innerHTML =
                "";


            criarLinhaVinculo();


            pvGalleryImg.src =
                "";

            pvGalleryImg.style.display =
                "none";


            pvNoImage.style.display =
                "flex";


            pvSheetImg.src =
                "";

            pvSheetImg.style.display =
                "none";


            pvSheetNoImage.style.display =
                "flex";


            document.getElementById(
                "file-size-info"
            ).textContent =
                "";


            document.getElementById(
                "color-value"
            ).textContent =
                "#3A0B17";


            atualizarPreview();

        }
    );


    /* =========================
       LISTA DE CADASTRADOS
    ========================= */

 async function carregarListaPersonagens() {

    const lista =
        document.getElementById("characters-list");

    if (!lista) return;


    try {

        const snapshot =
            await getDocs(
                collection(db, "personagens")
            );


        if (snapshot.empty) {

            lista.innerHTML = `
                <div class="lista-vazia">
                    <i class="fa-regular fa-face-smile"></i>

                    <p>
                        Nenhum personagem cadastrado ainda.
                    </p>
                </div>
            `;

            return;
        }


        const personagens = [];


        snapshot.forEach(documento => {

            personagens.push({
                id: documento.id,
                ...documento.data()
            });

        });


        personagens.sort((a, b) =>
            (a.nome || "").localeCompare(
                b.nome || "",
                "pt-BR"
            )
        );
        
        personagensCompletos = personagens;


        lista.innerHTML =
            personagens.map(personagem => {

                const imagem =
                    personagem.imagemBase64
                        ? `
                            <img
                                src="${personagem.imagemBase64}"
                                alt="${escaparHTML(
                                    personagem.nome || "Personagem"
                                )}"
                                class="personagem-lista-img"
                            >
                        `
                        : `
                            <div class="personagem-lista-sem-img">
                                <i class="fa-regular fa-image"></i>
                            </div>
                        `;


                const detalhes = [
                    personagem.idade,
                    personagem.ocupacao
                ]
                .filter(Boolean)
                .join(" • ");


                return `

                    <div class="item">

                        <div class="item-imagem">
                            ${imagem}
                        </div>


                        <div class="item-info">

                            <strong>
                                ${escaparHTML(
                                    personagem.nome ||
                                    "Sem nome"
                                )}
                            </strong>


                            <span>
                                ${
                                    detalhes
                                    ? escaparHTML(detalhes)
                                    : "Sem informações adicionais"
                                }
                            </span>

                        </div>


                        <div class="item-botoes">

                            <a
                                href="ficha.html?id=${personagem.id}"
                                class="btn-acao btn-ver"
                                title="Ver personagem"
                            >
                                <i class="fa-solid fa-eye"></i>
                            </a>
                            
                            
                            <button
    class="btn-acao btn-editar"
    data-id="${personagem.id}"
>
    <i class="fa-solid fa-pen"></i>
</button>
                            


                            <button
                                type="button"
                                class="btn-acao btn-excluir"
                                data-id="${personagem.id}"
                                title="Excluir personagem"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>

                        </div>

                    </div>

                `;

            }).join("");
            
            
               document
    .querySelectorAll(".btn-editar")
    .forEach(botao => {

        botao.addEventListener("click", () => {

            const id =
                botao.dataset.id;

            editarPersonagem(id);

        });

    });



        /* =========================
           BOTÕES DE EXCLUIR
        ========================= */

        document
            .querySelectorAll(".btn-excluir")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    async () => {

                        const id =
                            botao.dataset.id;


                        const item =
                            botao.closest(".item");


                        const nome =
                            item?.querySelector(
                                ".item-info strong"
                            )?.textContent ||
                            "este personagem";


                        const confirmar =
                            confirm(
                                `Tem certeza que deseja excluir "${nome}"?`
                            );


                        if (!confirmar) return;


                        try {

                            await deleteDoc(
                                doc(
                                    db,
                                    "personagens",
                                    id
                                )
                            );


                            alert(
                                "Personagem excluído com sucesso!"
                            );
                            
                            
                         

                            /*
                             * Atualiza os nomes
                             * disponíveis nos vínculos.
                             */

                            await carregarPersonagens();


                            /*
                             * Atualiza a lista
                             * de cadastrados.
                             */

                            await carregarListaPersonagens();


                        } catch (erro) {

                            console.error(
                                "Erro ao excluir:",
                                erro
                            );


                            alert(
                                "Não foi possível excluir o personagem."
                            );

                        }

                    }
                );

            });


    } catch (erro) {

        console.error(
            "Erro ao carregar personagens cadastrados:",
            erro
        );


        lista.innerHTML = `
            <div class="lista-vazia">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <p>
                    Não foi possível carregar os personagens.
                </p>

            </div>
        `;

    }

}


/* =========================
   ESCAPAR HTML
========================= */

function escaparHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================
   INICIALIZAÇÃO
========================= */

await carregarPersonagens();

criarLinhaVinculo();

await carregarListaPersonagens();

atualizarPreview();


    /* =========================
       SEGURANÇA
    ========================= */

    function escaparHTML(texto) {

        return String(texto || "")

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }
    
    
    /*Função editar personagem*/
    
    function editarPersonagem(id) {
        
    personagemEditandoId = id;
    


console.log("FUNÇÃO EDITAR CHAMADA");

    const personagem =
        personagensCompletos.find(
            p => p.id === id
        );

    if (!personagem) return;

    personagemEditandoId = id;

    inputName.value =
        personagem.nome || "";

    inputAge.value =
        personagem.idade || "";

    inputGender.value =
        personagem.genero || "";

    inputOccupation.value =
        personagem.ocupacao || "";

    inputSummary.value =
        personagem.resumo || "";

    inputPersonality.value =
        personagem.personalidade || "";

    inputBio.value =
        personagem.historia || "";

    inputCuriosities.value =
        personagem.curiosidades || "";

    inputColor.value =
        personagem.corCard || "#3A0B17";

    base64ImageComprimida =
        personagem.imagemBase64 || "";
        
        if (personagem.imagemBase64) {

        pvGalleryImg.src =
            personagem.imagemBase64;

        pvGalleryImg.style.display =
            "block";

        pvNoImage.style.display =
            "none";

        pvSheetImg.src =
            personagem.imagemBase64;

        pvSheetImg.style.display =
            "block";

        pvSheetNoImage.style.display =
            "none";

    }
        relationsContainer.innerHTML = "";
        
            if (
        personagem.relacoes &&
        personagem.relacoes.length
    ) {

        personagem.relacoes.forEach(relacao => {

            criarLinhaVinculo();

            const ultimaLinha =
                relationsContainer.lastElementChild;

            ultimaLinha.querySelector(
                ".rel-target"
            ).value = relacao.alvo;

            ultimaLinha.querySelector(
                ".rel-type"
            ).value = relacao.tipo;

        });

    } else {

        criarLinhaVinculo();

    }
    
        atualizarPreview();

    form.scrollIntoView({
        behavior: "smooth"
    });

    document.querySelector(".btn-save")
        .textContent =
        "Atualizar Personagem";
}


    


    /* =========================
       INICIAR
    ========================= */

    await carregarPersonagens();

    criarLinhaVinculo();

    await carregarListaPersonagens();

    atualizarPreview();

});