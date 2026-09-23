import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const searchInput = document.getElementById('searchInput');
const cardsGrid = document.getElementById('cardsGrid');

let allCharacters = [];


async function carregarPersonagens() {

    try {

        const snapshot = await getDocs(
            collection(db, "personagens")
        );

        allCharacters = [];

        snapshot.forEach(doc => {

            console.log(
                doc.id,
                doc.data()
            );

            allCharacters.push({
                id: doc.id,
                ...doc.data()
            });

        });

        renderCards(allCharacters);

    } catch (erro) {

        console.error(
            "Erro ao carregar personagens:",
            erro
        );

    }

}
function renderCards(list) {
    if (!cardsGrid) return;

    if (list.length === 0) {
        cardsGrid.innerHTML = `
            <div class="empty-state">
                <p>Nenhum personagem encontrado.</p>
            </div>
        `;
        return;
    }

    cardsGrid.innerHTML = list.map(char => `
        <article class="card">
            <div class="card-img-wrapper">
                <img
                    src="${char.imagemBase64}"
                    alt="${char.nome}"
                    loading="lazy"
                >
            </div>

            <h2 class="card-title">${char.nome}</h2>

        <a href="ficha.html?id=${char.id}" class="btn-readmore">
    Ler mais
</a>
        </article>
    `).join('');
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();

      const filtered = allCharacters.filter(char =>
    (char.nome || "")
        .toLowerCase()
        .includes(term)
);

        renderCards(filtered);
    });
}

carregarPersonagens();