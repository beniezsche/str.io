export default function createDialog(onSuccess, onCancel) {
    // Create modal container element
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');
    modalContainer.id = 'modalContainer';

    // Create modal content element
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Create textarea element
    const textarea = document.createElement('textarea');
    // textarea.type = 'text';
    textarea.classList.add('input-field');
    textarea.id = 'inputText';
    textarea.placeholder = 'Enter your text';

    // Create "Add" button
    const addButton = document.createElement('button');
    addButton.id = 'add-text-button';
    addButton.classList.add('submit-button');
    addButton.textContent = 'Add';

    addButton.addEventListener('click', (event) => {
        onSuccess(textarea.value);
    })

    // Create "Cancel" button
    const cancelButton = document.createElement('button');
    cancelButton.id = 'close-modal-button';
    cancelButton.classList.add('submit-button');
    cancelButton.textContent = 'Cancel';

    cancelButton.addEventListener('click', (event) => {
        onCancel();
    })

    // Append textarea and buttons to modal content
    modalContent.appendChild(textarea);
    modalContent.appendChild(addButton);
    modalContent.appendChild(cancelButton);

    // Append modal content to modal container
    modalContainer.appendChild(modalContent);

    return modalContainer;
}



