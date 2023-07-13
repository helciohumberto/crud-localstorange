"use strict";

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
};

const getLocalStorange = () =>
  JSON.parse(localStorage.getItem("db_client")) ?? [];
const setLocalStorange = (dbClient) =>
  localStorage.setItem("db_client", JSON.stringify(dbClient));

// CRUD - CREATE READ UPDATE DELETE

// CREATE

const createClient = (client) => {
  const dbClient = getLocalStorange();
  dbClient.push(client);
  setLocalStorange(dbClient);
};

// READ

const readClient = () => getLocalStorange();

// UPDATE

const updateClient = (index, client) => {
  const dbCLient = readClient();
  dbCLient[index] = client;
  setLocalStorange(dbCLient);
};

// DELETE

const deleteClient = (index) => {
  const dbCLient = readClient();
  dbCLient.splice(index, 1);
  setLocalStorange(dbCLient);
};

// INTERAÇÃO COM LAYOUT
const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};

const saveClient = () => {
  if (isValidFields()) {
    const client = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      celular: document.getElementById("celular").value,
      cidade: document.getElementById("cidade").value,
    };
    const index = document.getElementById("nome").dataset.index;
    if (index == "new") {
      createClient(client);
      updadeTable();
      closeModal();
    } else {
      updateClient(index, client);
      updadeTable();
      closeModal();
    }
  }
};

const createRow = (client, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = ` 
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `;
  document.querySelector("#tableClient>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableClient>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};
const updadeTable = () => {
  const dbCLient = readClient();
  clearTable();
  dbCLient.forEach(createRow);
};

const fillFields = (client) => {
  document.getElementById("nome").value = client.nome;
  document.getElementById("email").value = client.email;
  document.getElementById("celular").value = client.celular;
  document.getElementById("cidade").value = client.cidade;
  document.getElementById("nome").dataset.index = client.index;
};

const editClient = (index) => {
  const client = readClient()[index];
  client.index = index;
  fillFields(client);
  openModal();
};
const editDelete = (event) => {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");

    if (action == "edit") {
      editClient(index);
    } else {
      const client = readClient()[index];
      const response = confirm(`Deseja excluir o cliente ${client.nome}`);
      if (response) {
        deleteClient(index);
        updadeTable();
      }
    }
  }
};

updadeTable();

// EVENTOS
document
  .getElementById("cadastrarCliente")
  .addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveClient);

document
  .querySelector("#tableClient>tbody")
  .addEventListener("click", editDelete);
