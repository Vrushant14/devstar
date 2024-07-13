<div class="card gap-16 items-center mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 overflow-hidden rounded-lg">
    <div class="container">
        <div class="sidebar">
            <input type="text" id="presentation-name" placeholder="Presentation Name">
            <button class="add-slide" onclick="addSlide()">+ Add Slide</button>
            <div class="slides-list" id="slides-list">
                <div class="slide-item selected" onclick="selectSlide(1)" data-slide-id="1">
                    <input class="a" type="text"  value="Slide 1" onchange="changeSlideName(1)">
                </div>
            </div>
        </div>
        <div class="main">
            <div class="toolbar">
                <button onclick="addText()">Text</button>
                <select id="font-select" onchange="changeFont()">
                    <option value="Arial">Arial</option>
                    <option value="Calibri">Calibri</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                    <option value="Courier New">Courier New</option>
                </select>
                <input type="color" id="color-picker" onchange="changeColor()" value="#000000">
                <input type="number" id="font-size" min="10" max="72" step="2" value="16" onchange="changeFontSize()"> px
            </div>
            <div class="slide-editor" id="slide-editor">
                <div class="slide-content" contenteditable="true" id="slide-1">
                    <div class="slide-title">
                        <h1 contenteditable="true">Title</h1>
                        <p contenteditable="true">Subtitle</p>
                    </div>
                    <div class="slide-content-text" contenteditable="true">
                        <p contenteditable="true">Content goes here. Click to edit.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="side-tools">
            <button onclick="editSlide()">Edit</button>
            <button onclick="savePresentation()">Save</button>
            <button onclick="shareViaEmail()">Share</button>
            <button onclick="downloadPresentation()">Download</button>
        </div>
    </div>
</div>

<div id="design-section" class="design-section">
    <h3>Design Section</h3>
    <div>
        <label for="text-color">Text Color:</label>
        <input type="color" id="text-color" onchange="changeTextColor()" value="#000000">
    </div>
    <div>
        <label for="text-size">Text Size:</label>
        <input type="number" id="text-size" min="10" max="72" step="2" value="16" onchange="changeTextSize()"> px
    </div>
</div>

<script>
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
                <p contenteditable="true">Subtitle</p>
            </div>
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

    function changeFontSize() {
        const fontSize = document.getElementById('font-size').value;
        document.execCommand('fontSize', false, fontSize);
    }

    function editSlide() {
        const selectedText = window.getSelection().toString();
        if (selectedText !== '') {
            document.getElementById('design-section').style.display = 'block';
        } else {
            document.getElementById('design-section').style.display = 'none';
        }
    }

    function changeTextColor() {
        const textColor = document.getElementById('text-color').value;
        document.execCommand('foreColor', false, textColor);
    }

    function changeTextSize() {
        const textSize = document.getElementById('text-size').value;
        document.execCommand('fontSize', false, textSize);
    }

    function downloadPresentation() {
        const presentationName = document.getElementById('presentation-name').value || 'Untitled Presentation';
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${presentationName}</title>
            <style>
                /* Include your styles.css content here if needed */
            </style>
        </head>
        <body>
            <div class="container">
                <div class="sidebar">
                    <!-- Add any sidebar content you want to include -->
                </div>
                <div class="main">
                    <!-- Add the main presentation content here -->
                    ${document.getElementById('slide-editor').innerHTML}
                </div>
                <div class="side-tools">
                    <!-- Add any side tools content you want to include -->
                </div>
            </div>
        </body>
        </html>
        `;

        // Create a Blob containing the HTML content
        const blob = new Blob([htmlContent], { type: 'text/html' });

        // Create a temporary <a> element to trigger the download
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${presentationName}.html`;
        document.body.appendChild(a);
        a.click();

        // Remove the temporary <a> element
        document.body.removeChild(a);
    }

    function shareViaEmail() {
        const presentationName = document.getElementById('presentation-name').value || 'Untitled Presentation';
        const presentationLink = 'http://example.com'; // Replace with actual link to the presentation
        const subject = encodeURIComponent(`Check out "${presentationName}"`);
        const body = encodeURIComponent(`Hey there! I thought you might be interested in this presentation: ${presentationLink}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
</script>

<style>
    /* Your existing CSS styles */
    .card {
        background-color: #ffffff;
        padding: 20px;
    }

    .gap-16 {
        gap: 16px;
    }

    .items-center {
        align-items: center;
    }

    .mx-auto {
        margin-left: auto;
        margin-right: auto;
    }

    .max-w-screen-xl {
        max-width: 1280px;
    }

    .lg\:grid {
        display: grid;
    }

    .lg\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .overflow-hidden {
        overflow: hidden;
    }

    .rounded-lg {
        border-radius: 8px;
    }

    .design-section {
        display: none;
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    .design-section h3 {
        margin-bottom: 10px;
    }

    .design-section div {
        margin-bottom: 10px;
    }
</style>
