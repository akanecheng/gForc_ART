document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DO MENU DROPDOWN ---
    const menuToggle = document.getElementById('menu-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');

    menuToggle.addEventListener('click', () => {
        const isOpen = dropdownMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // --- LÓGICA DOS CARDS DE PERSONAGENS (INSERÇÃO VIA JS) ---
    const galleryGrid = document.getElementById('gallery-grid');

    // Insira a lista de personagens aqui quando desejar
    const personagens = [];

    function renderCards(cards) {
        galleryGrid.innerHTML = '';

        cards.forEach(personagem => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');

            cardElement.innerHTML = `
                <img src="${personagem.imagem}" alt="${personagem.nome}">
                <div class="card-info">
                    <h3 class="card-title">${personagem.nome}</h3>
                    <p class="card-subtitle">${personagem.categoria}</p>
                </div>
            `;

            galleryGrid.appendChild(cardElement);
        });
    }

    if (personagens.length > 0) {
        renderCards(personagens);
    }
});