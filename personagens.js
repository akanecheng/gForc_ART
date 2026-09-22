import { db } from './firebase-config.js';
import { collection, getDocs, query } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const searchInput = document.getElementById('searchInput');
const cardsGrid = document.getElementById('cardsGrid');

let allCharacters = [];

// Carregar dados do Firestore
async function loadCharacters() {
  try {
    const q = query(collection(db, "personagens"));
    const querySnapshot = await getDocs(q);
    
    allCharacters = [];
    querySnapshot.forEach((doc) => {
      allCharacters.push({ id: doc.id, ...doc.data() });
    });

    renderCards(allCharacters);
  } catch (error) {
    console.error("Erro ao buscar personagens: ", error);
    if (cardsGrid) {
      cardsGrid.innerHTML = `
        <div class="empty-state">
          <p>Erro ao carregar dados. Verifique a sua ligação.</p>
        </div>
      `;
    }
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

  cardsGrid.innerHTML = list.map(char => {
    const cardColor = char.corCard || 'var(--card-bg-default)';
    const imgUrl = char.foto || 'https://via.placeholder.com/300x300/4B0F1E/F7D6DC?text=Sem+Foto';

    return `
      <article class="card" style="--card-bg-custom: ${cardColor};">
        <div class="card-img-wrapper">
          <img src="${imgUrl}" alt="${char.nome || 'Personagem'}" loading="lazy">
        </div>
        <h2 class="card-title">${char.nome || 'Sem Nome'}</h2>
        <p class="card-summary">${char.resumo || 'Sem resumo cadastrado.'}</p>
        <a href="personagem.html?id=${char.id}" class="btn-readmore">Ler mais ::</a>
      </article>
    `;
  }).join('');
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = allCharacters.filter(char => {
      const nameMatch = char.nome && char.nome.toLowerCase().includes(term);
      const summaryMatch = char.resumo && char.resumo.toLowerCase().includes(term);
      return nameMatch || summaryMatch;
    });
    renderCards(filtered);
  });
}

loadCharacters();