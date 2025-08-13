import './Client.css';

import Modal from '../../layout/Modal.js';

import { getClients, createClient, updateClient, deleteClient, uploadClients } from '../../../api/clientService.js';

const Client = () => {
  const container = document.createElement('div');
  container.className = 'client-container p-4';
  // Estado de los clientes
  let clients = [];

  const handleCreate = () => {
    const onCreate = async () => {
      const dni = document.getElementById('clientIDInput').value;
      const name = document.getElementById('clientNameInput').value;
      const email = document.getElementById('clientEmailInput').value;
      const phone = document.getElementById('clientPhoneInput').value;
      const address = document.getElementById('clientAddressInput').value;
      const client = await createClient({ id: dni, name, email, phone, address });
      clients.push(client);
      render(clients);
    };

    const createComponent = `
      <form>
        <div class="field">
          <label class="label">Número de identificación</label>
          <div class="control">
            <input class="input client-input" type="text" id="clientIDInput" placeholder="Número de identificación">
          </div>
        </div>
        <div class="field">
          <label class="label">Nombre</label>
          <div class="control">
            <input class="input client-input" type="text" id="clientNameInput" placeholder="Nombre del cliente">
          </div>
        </div>
        <div class="field">
          <label class="label">Correo electrónico</label>
          <div class="control">
            <input class="input client-input" type="email" id="clientEmailInput" placeholder="email@ejemplo.com">
          </div>
        </div>
        <div class="field">
          <label class="label">Teléfono</label>
          <div class="control">
            <input class="input client-input" type="text" id="clientPhoneInput" placeholder="Número de teléfono">
          </div>
        </div>
        <div class="field">
          <label class="label">Dirección de residencia</label>
          <div class="control">
            <input class="input client-input" type="text" id="clientAddressInput" placeholder="Dirección de residencia">
          </div>
        </div>
      </form>
    `;

    const modal = Modal({
      title: 'Crear Nuevo Cliente',
      content: createComponent,
      saveButtonText: 'Crear',
      onSave: onCreate
    });

    document.body.appendChild(modal.element);
    modal.open();
  }

  const handleEdit = (id) => {
    const client = clients.filter(client => client.id === id)[0];
    const {
      id: clientId,
      name: clientName,
      email: clientEmail
    } = client;

    const onUpdate = async () => {
      const name = document.getElementById('clientNameInput').value;
      const email = document.getElementById('clientEmailInput').value;
      const phone = document.getElementById('clientPhoneInput').value;
      const address = document.getElementById('clientAddressInput').value;
      await updateClient(id, { name, email, phone, address });
      client.name = name;
      client.email = email;
      render(clients);
    };

    const updateComponent = `
      <form>
        <input type="hidden" id="clientId" value="${clientId}">
  
        <div class="field">
          <label class="label mr-5" for="clientNameInput">Nombre</label>
          <div class="control">
            <input
              class="input client-input"
              type="text"
              id="clientNameInput"
              placeholder="Nombre del cliente"
              value="${clientName}"
              required
            >
          </div>
        </div>
  
        <div class="field">
          <label class="label" for="clientEmailInput">Email</label>
          <div class="control">
            <input
              class="input client-input"
              type="email"
              id="clientEmailInput"
              placeholder="email@ejemplo.com"
              value="${clientEmail}"
              required
            >
          </div>
        </div>

        <div class="field">
          <label class="label" for="clientPhoneInput">Teléfono</label>
          <div class="control">
            <input
              class="input client-input"
              type="text"
              id="clientPhoneInput"
              placeholder="Número de teléfono"
              value="${clientEmail}"
              required
            >
          </div>
        </div>

        <div class="field">
          <label class="label" for="clientAddressInput">Dirección</label>
          <div class="control">
            <input
              class="input client-input"
              type="text"
              id="clientAddressInput"
              placeholder="Dirección de residencia"
              value="${clientEmail}"
              required
            >
          </div>
        </div>
      </form>
    `;

    const modal = Modal({
      title: 'Actualizando Cliente',
      content: updateComponent,
      saveButtonText: 'Actualizar',
      onSave: onUpdate
    });

    document.body.appendChild(modal.element);
    modal.open();
  }

  const handleDelete = async (id) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar al cliente con ID ${id}?`)) {
      return;
    }

    try {
      await deleteClient(id);
      clients = clients.filter(p => p.id !== id);

      render(clients);
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('No se pudo eliminar al cliente.');
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    try {
      await uploadClients(file);
      event.target.value = null;
      loadClients();
      alert('¡Archivo subido y clientes cargados exitosamente!');
    } catch (error) {
      alert('Falló la subida del archivo. Por favor revisa la consola para más detalles.');
      console.error('Error en la subida:', error);
    }
  };

  // --- Delegación de Eventos ---
  container.addEventListener('click', (event) => {
    const createButton = event.target.closest('#btnCreate');
    const editButton = event.target.closest('#btnEdit');
    const deleteButton = event.target.closest('#btnDelete');

    if (createButton) {
      handleCreate();
    }

    if (editButton) {
      const id = editButton.dataset.id;
      handleEdit(id);
      return;
    }

    if (deleteButton) {
      const id = deleteButton.dataset.id;
      handleDelete(id);
      return;
    }
  });

  container.addEventListener('change', (event) => {
    const uploadInput = event.target.closest('#file-upload');
    if (uploadInput) {
      handleUpload(event);
    }
  });

  const loadClients = async () => {
    try {
      container.innerHTML = '<p>Cargando clientes...</p>';
      clients = await getClients();
      render(clients);
    } catch (error) {
      console.error('Error loading clients:', error);
      container.innerHTML = '<p class="has-text-danger">Error al cargar los clientes.</p>';
    }
  };

  loadClients();

  const render = (clientList) => {
    const topSection = `
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <h1 class="title has-text-white">Clientes</h1>
          </div>
          <div class="level-item">
            <label for="file-upload" class="button is-primary is-rounded">
              <span class="icon is-small"><i class="fas fa-upload"></i></span>
            </label>
            <input id="file-upload" type="file" accept=".csv" style="display: none;">
          </div>
        </div>
        <div class="level-right">
          <button id="btnCreate" class="button is-primary">
            <span class="icon is-small"><i class="fas fa-plus"></i></span>
            <span>Crear Nuevo</span>
          </button>
        </div>
      </div>
    `;

    const tableHeader = `
      <div class="columns is-mobile has-background-grey-darker has-text-white p-2 is-hidden-mobile">
        <div class="column">Documento</div>  
        <div class="column">Nombre</div>
        <div class="column">Correo Electrónico</div>
        <div class="column">Teléfono</div>
        <div class="column">Dirección</div>
        <div class="column is-narrow has-text-centered">Acciones</div>
      </div>
    `;

    const clientRows = clientList.map((client, index) => {
      const rowClass = index % 2 === 0 ? 'has-background-white-ter' : '';
      return `
        <div class="columns is-mobile is-vcentered p-2 ${rowClass}">
          <div class="column" data-label="ID">${client.id}</div>
          <div class="column" data-label="Nombre">${client.name}</div>
          <div class="column" data-label="Email">${client.email}</div>
          <div class="column" data-label="Phone">${client.phone}</div>
          <div class="column" data-label="Address">${client.address}</div>
          <div class="column is-narrow">
            <div class="buttons are-small">
              <button id="btnEdit" class="button is-warning" data-id="${client.id}">
                <span class="icon"><i class="fas fa-edit"></i></span>
                <span>Editar</span>
              </button>
              <button id="btnDelete" class="button is-danger" data-id="${client.id}">
                <span class="icon"><i class="fas fa-trash-alt"></i></span>
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const content = clientRows ?
      `
        ${tableHeader}
        ${clientRows}
      ` :
      '<p>No hay clientes en el sistema.</p>';

    container.innerHTML = `
      ${topSection}
      <div class="box">
        ${content}
      </div>
    `;
  };

  return container;
};

export default Client;
