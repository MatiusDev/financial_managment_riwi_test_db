const Modal = ({ title, content, onSave, onClose, saveButtonText = 'Guardar', cancelButtonText = 'Cancelar' }) => {
  const modalElement = document.createElement('div');
  modalElement.className = 'modal';

  modalElement.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head has-text-centered">
        <p class="modal-card-title">${title}</p>
      </header>
      <section class="modal-card-body"></section>
      <footer class="modal-card-foot is-justify-content-center">
        <button class="button is-success save-button mr-6">${saveButtonText}</button>
        <button class="button cancel-button">${cancelButtonText}</button>
      </footer>
    </div>
  `;

  const modalBody = modalElement.querySelector('.modal-card-body');
  if (typeof content === 'string') {
    modalBody.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    modalBody.appendChild(content);
  }

  const open = () => modalElement.classList.add('is-active');
  const close = () => {
    modalElement.classList.remove('is-active');

    if (onClose) {
      onClose();
    }
    modalElement.remove();
  }

  const saveButton = modalElement.querySelector('.save-button');
  const background = modalElement.querySelector('.modal-background');
  const cancelButton = modalElement.querySelector('.cancel-button');

  saveButton.addEventListener('click', () => {
    if (onSave) {
      onSave();
    }

    close();
  });

  background.addEventListener('click', close);
  cancelButton.addEventListener('click', close);

  return {
    element: modalElement,
    open,
    close
  };
};

export default Modal;