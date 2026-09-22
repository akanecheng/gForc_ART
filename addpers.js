import { db, storage } from './firebase-config.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  const characterForm = document.getElementById('characterForm');
  const formTitle = document.getElementById('formTitle');
  const charIdInput = document.getElementById('charId');
  const btnSave = document.getElementById('btnSave');
  const btnCancel = document.getElementById('btnCancel');
  const tableBody = document.getElementById('characterTableBody');
  const selectAllCheckbox = document.getElementById('selectAll');
  const btnDeleteSelected = document.getElementById('btnDeleteSelected');

  let charactersList = [];
  let selectedIds = new Set();

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  // Atualização em tempo real da lista via Firestore
  function listenToCharacters() {
    onSnapshot(collection(db, "personagens"), (snapshot) => {
      charactersList = [];
      snapshot.forEach((doc) => {
        charactersList.push({ id: doc.id, ...doc.data() });
      });
      renderTable(charactersList);
    }, (error) => {
      console.error("Erro ao ouvir alterações: ", error);
    });
  }

  // Exibir dados na tabela
  function renderTable(list) {
    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" class="loading-cell">Nenhum personagem cadastrado.</td></tr>`;
      return;
    }

    tableBody.innerHTML = list.map(char => {
      const imgUrl = char.foto || 'https://via.placeholder.com/40/3b0a1a/fcebf0?text=?';
      const isChecked = selectedIds.has(char.id) ? 'checked' : '';

      return `
        <tr>
          <td>
            <input type="checkbox" class="char-checkbox" data-id="${char.id}" ${isChecked}>
          </td>
          <td>
            <img src="${imgUrl}" class="thumb-img" alt="Thumb">
          </td>
          <td><strong>${char.nome || 'Sem Nome'}</strong></td>
          <td>
            <div class="table-actions">
              <button class="btn-icon btn-edit" data-id="${char.id}" title="Editar"><i class="fa-solid fa-pen"></i></button>
              <button class="btn-icon btn-delete" data-id="${char.id}" title="Excluir"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    attachTableEvents();
  }

  // Vincular eventos nas checkboxes e botões da tabela
  function attachTableEvents() {
    document.querySelectorAll('.char-checkbox').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          selectedIds.add(id);
        } else {
          selectedIds.delete(id);
        }
        updateDeleteButton();
      });
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        editCharacter(id);
      });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        deleteSingleCharacter(id);
      });
    });
  }

  // Selecionar todos os itens
  selectAllCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      charactersList.forEach(c => selectedIds.add(c.id));
    } else {
      selectedIds.clear();
    }
    renderTable(charactersList);
    updateDeleteButton();
  });

  function updateDeleteButton() {
    btnDeleteSelected.disabled = selectedIds.size === 0;
  }

  // Upload da imagem para o Firebase Storage
  async function uploadImage(file) {
    const storageRef = ref(storage, `personagens/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  // Submissão do Formulário (Criar / Editar)
  characterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = charIdInput.value;
    const fileInput = document.getElementById('foto');
    const file = fileInput.files[0];

    btnSave.disabled = true;
    btnSave.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Salvando...`;

    try {
      let photoUrl = null;

      if (file) {
        photoUrl = await uploadImage(file);
      }

      const characterData = {
        nome: document.getElementById('nome').value,
        idade: document.getElementById('idade').value,
        corCard: document.getElementById('corCard').value,
        resumo: document.getElementById('resumo').value,
        personalidade: document.getElementById('personalidade').value,
        aparencia: document.getElementById('aparencia').value,
        historia: document.getElementById('historia').value,
        relacoes: document.getElementById('relacoes').value,
        habilidades: document.getElementById('habilidades').value,
        curiosidades: document.getElementById('curiosidades').value,
        updatedAt: new Date()
      };

      if (id) {
        // Atualização
        if (photoUrl) characterData.foto = photoUrl;
        await updateDoc(doc(db, "personagens", id), characterData);
        alert("Personagem atualizado com sucesso!");
      } else {
        // Criação
        characterData.foto = photoUrl || '';
        characterData.createdAt = new Date();
        await addDoc(collection(db, "personagens"), characterData);
        alert("Personagem cadastrado com sucesso!");
      }

      resetForm();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar personagem. Tente novamente.");
    } finally {
      btnSave.disabled = false;
      btnSave.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Salvar Personagem`;
    }
  });

  // Preencher formulário para edição
  function editCharacter(id) {
    const char = charactersList.find(c => c.id === id);
    if (!char) return;

    charIdInput.value = char.id;
    document.getElementById('nome').value = char.nome || '';
    document.getElementById('idade').value = char.idade || '';
    document.getElementById('corCard').value = char.corCard || '#5a122a';
    document.getElementById('resumo').value = char.resumo || '';
    document.getElementById('personalidade').value = char.personalidade || '';
    document.getElementById('aparencia').value = char.aparencia || '';
    document.getElementById('historia').value = char.historia || '';
    document.getElementById('relacoes').value = char.relacoes || '';
    document.getElementById('habilidades').value = char.habilidades || '';
    document.getElementById('curiosidades').value = char.curiosidades || '';

    formTitle.textContent = "Editar Personagem";
    btnCancel.style.display = "inline-flex";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Cancelar Edição
  btnCancel.addEventListener('click', resetForm);

  function resetForm() {
    characterForm.reset();
    charIdInput.value = '';
    document.getElementById('corCard').value = '#5a122a';
    formTitle.textContent = "Novo Personagem";
    btnCancel.style.display = "none";
  }

  // Deleção individual
  async function deleteSingleCharacter(id) {
    if (confirm("Tem certeza que deseja excluir este personagem?")) {
      try {
        await deleteDoc(doc(db, "personagens", id));
        selectedIds.delete(id);
        updateDeleteButton();
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  }

  // Deleção em massa
  btnDeleteSelected.addEventListener('click', async () => {
    if (selectedIds.size === 0) return;

    if (confirm(`Excluir ${selectedIds.size} personagem(ns) selecionado(s)?`)) {
      btnDeleteSelected.disabled = true;
      try {
        const promises = Array.from(selectedIds).map(id => deleteDoc(doc(db, "personagens", id)));
        await Promise.all(promises);
        selectedIds.clear();
        selectAllCheckbox.checked = false;
        updateDeleteButton();
      } catch (error) {
        console.error("Erro na exclusão em massa:", error);
      }
    }
  });

  listenToCharacters();
});