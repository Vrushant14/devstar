let currentSlideId = 1;

function addSlide() {
    const slidesList = document.getElementById('slides-list');
    const newSlideId = slidesList.children.length + 1;
    const slideItem = document.createElement('div');
    slideItem.className = 'slide-item';
    slideItem.setAttribute('data-slide-id', newSlideId);
    slideItem.setAttribute('onclick', `selectSlide(${newSlideId})`);
    slideItem.innerHTML = `
        <input class="a" type="text" value="Slide ${newSlideId}" onchange="changeSlideName(${newSlideId})">
    `;
    slidesList.appendChild(slideItem);

    const slideEditor = document.getElementById('slide-editor');
    const slideContent = document.createElement('div');
    slideContent.className = 'slide-content';
    slideContent.id = `slide-${newSlideId}`;
    slideContent.setAttribute('contenteditable', 'true');
    slideContent.innerHTML = `
        <div class="slide-title">
            <h1 contenteditable="true">Title</h1>
        </div>
        <p contenteditable="true">Subtitle</p>
        <div class="slide-content-text" contenteditable="true">
            <p contenteditable="true">Content goes here. Click to edit.</p>
        </div>
    `;
    slideEditor.appendChild(slideContent);

    selectSlide(newSlideId);
}

function selectSlide(slideId) {
    currentSlideId = slideId;
    document.querySelectorAll('.slide-item').forEach(item => item.classList.remove('selected'));
    document.querySelector(`.slide-item[data-slide-id="${slideId}"]`).classList.add('selected');

    document.querySelectorAll('.slide-content').forEach(content => content.style.display = 'none');
    document.getElementById(`slide-${slideId}`).style.display = 'block';
}

function addText() {
    const slideContent = document.getElementById(`slide-${currentSlideId}`);
    const textElement = document.createElement('div');
    textElement.className = 'draggable';
    textElement.setAttribute('draggable', 'true');
    textElement.innerHTML = '<p contenteditable="true">New Text</p>';
    slideContent.appendChild(textElement);
    enableDrag(textElement);
}

function enableDrag(element) {
    element.addEventListener('dragstart', dragStart);
    element.addEventListener('dragend', dragEnd);
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    setTimeout(() => {
        event.target.style.visibility = 'hidden';
    }, 50);
}

function dragEnd(event) {
    event.target.style.visibility = 'visible';
    event.preventDefault();
    const slideContent = document.getElementById(`slide-${currentSlideId}`);
    const rect = slideContent.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    event.target.style.left = `${x}px`;
    event.target.style.top = `${y}px`;
}

function changeFont() {
    const fontSelect = document.getElementById('font-select');
    const font = fontSelect.value;
    document.execCommand('fontName', false, font);
}

function changeColor() {
    const colorPicker = document.getElementById('color-picker');
    const color = colorPicker.value;
    document.execCommand('foreColor', false, color);
}


function editSlide() {

}

function savePresentation() {

}

function sharePresentation() {

}

function downloadPresentation() {

}

document.querySelectorAll('.draggable').forEach(enableDrag);
