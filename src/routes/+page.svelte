<script>
    import { onMount } from "svelte";
    import { createEventDispatcher } from 'svelte';

    let presentationName = "";
    let slides = [{
        id: 1,
        name: "Slide 1",
        content: {
            title: { text: 'Title', fontSize: '36px', left: '50px', top: '50px', fontFamily: 'Arial', color: '#000' },
            subtitle: { text: 'Subtitle', fontSize: '24px', left: '50px', top: '150px', fontFamily: 'Arial', color: '#000' },
            content: '<p contenteditable="true">Content goes here. Click to edit.</p>'
        }
    }];
    let currentSlideId = 1;
    let activeElement = null;

    const dispatch = createEventDispatcher();

    function addSlide() {
        const newSlideId = slides.length + 1;
        slides = [...slides, {
            id: newSlideId,
            name: `Slide ${newSlideId}`,
            content: {
                title: { text: 'Title', fontSize: '36px', left: '50px', top: '50px', fontFamily: 'Arial', color: '#000' },
                subtitle: { text: 'Subtitle', fontSize: '24px', left: '50px', top: '150px', fontFamily: 'Arial', color: '#000' },
                content: '<p contenteditable="true">Content goes here. Click to edit.</p>'
            }
        }];
        selectSlide(newSlideId);
    }

    function selectSlide(id) {
        currentSlideId = id;
    }

    function addText() {
        const slideIndex = slides.findIndex(slide => slide.id === currentSlideId);
        slides[slideIndex].content.content += '<p contenteditable="true">New Text</p>';
    }

    function changeSlideName(id, event) {
        const slideIndex = slides.findIndex(slide => slide.id === id);
        slides[slideIndex].name = event.target.value;
    }

    function changeFont(event) {
        if (activeElement) {
            const fontFamily = event.target.value;
            activeElement.style.fontFamily = fontFamily;
            
            const slideIndex = slides.findIndex(slide => slide.id === currentSlideId);
            if (activeElement.classList.contains('slide-content')) {
                slides[slideIndex].content.fontFamily = fontFamily;
            }
        }
    }

    function changeColor(event) {
        if (activeElement) {
            const color = event.target.value;
            activeElement.style.color = color;
            
            const slideIndex = slides.findIndex(slide => slide.id === currentSlideId);
            if (activeElement.classList.contains('slide-content')) {
                slides[slideIndex].content.color = color;
            }
        }
    }

    function changeFontSize(event) {
        if (activeElement) {
            const fontSize = event.target.value + 'px';
            activeElement.style.fontSize = fontSize;
            
            const slideIndex = slides.findIndex(slide => slide.id === currentSlideId);
            if (activeElement.classList.contains('slide-content')) {
                slides[slideIndex].content.fontSize = fontSize;
            }
        }
    }

    function savePresentation() {
        alert(`Saving presentation "${presentationName}"`);
        // Implement actual saving logic here
    }

    function shareViaEmail() {
        const subject = encodeURIComponent(`Check out "${presentationName}"`);
        const body = encodeURIComponent(`Hey there! I thought you might be interested in this presentation.`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }

    function downloadPresentation() {
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
                ${slides.map(slide => `<div>${slide.content.title.text}</div><div>${slide.content.subtitle.text}</div><div>${slide.content.content}</div>`).join('')}
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

    // Variables to handle drag-and-drop functionality
    let initialX = 0;
    let initialY = 0;
    let offsetX = 0;
    let offsetY = 0;

    function handleDragStart(event) {
        const { left, top } = event.target.getBoundingClientRect();
        initialX = event.clientX - left;
        initialY = event.clientY - top;
        offsetX = event.target.style.left ? parseInt(event.target.style.left, 10) : 0;
        offsetY = event.target.style.top ? parseInt(event.target.style.top, 10) : 0;

        activeElement = event.target;
        event.dataTransfer.setDragImage(new Image(), 0, 0); // Hide default drag image
    }

    function handleDrag(event) {
        if (activeElement) {
            const newX = event.clientX - initialX;
            const newY = event.clientY - initialY;

            const slideEditor = document.querySelector('.slide-editor');
            const editorRect = slideEditor.getBoundingClientRect();

            // Ensure the element stays within the bounds of the white screen
            if (newX >= 0 && newX + activeElement.offsetWidth <= slideEditor.clientWidth) {
                activeElement.style.left = `${newX}px`;
            }
            if (newY >= 0 && newY + activeElement.offsetHeight <= slideEditor.clientHeight) {
                activeElement.style.top = `${newY}px`;
            }
        }
    }

    

    function handleDragEnd() {
        activeElement = null;
    }
</script>

<style>
    /* Global styles for the entire component */
    .container {
        display: flex;
        height: 100vh;
        background-color: #f4f4f4;
    }

    .sidebar {
        width: 200px;
        background-color: #333;
        color: #fff;
        padding: 10px;
        box-sizing: border-box;
    }

    .main {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .toolbar {
        display: flex;
        align-items: center;
        padding: 10px;
        background-color: #fff;
        border-bottom: 1px solid #ccc;
    }

    .toolbar select,
    .toolbar input[type="color"],
    .toolbar input[type="number"] {
        margin-left: 10px;
    }

    .slide-editor {
        flex: 1;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background-color: #fff;
        overflow: hidden; /* Ensures content does not overflow */
    }

    .slide-content {
        position: absolute;
        border: 1px solid #ccc;
        padding: 10px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        cursor: move; /* Set cursor to indicate draggable */
    }

    .side-tools {
        display: flex;
        flex-direction: column;
        padding: 10px;
        background-color: #fff;
        border-left: 1px solid #ccc;
    }

    .side-tools button {
        margin-bottom: 10px;
    }

    .slide-item input {
        color: #000; /* Ensure the text color is black for visibility */
        background-color: #fff; /* Ensure background is white for contrast */
        border: none;
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
    }

    .slide-item input:focus {
        outline: none;
    }

    /* Ensure presentation name input is visible */
    .presentation-name {
        color: #000; /* Black text */
        background-color: #fff; /* White background */
        border: none;
        padding: 5px;
        margin-bottom: 10px;
        width: calc(100% - 20px); /* Adjust width as needed */
        box-sizing: border-box;
    }
</style>

<div class="container">
    <div class="sidebar">
        <input type="text" class="presentation-name" bind:value={presentationName} placeholder="Presentation Name">
        <button class="add-slide" on:click={addSlide}>+ Add Slide</button>
        <div class="slides-list">
            {#each slides as slide (slide.id)}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="slide-item" on:click={() => selectSlide(slide.id)} data-slide-id={slide.id}>
                    <input type="text" bind:value={slide.name} on:change={(event) => changeSlideName(slide.id, event)}>
                </div>
            {/each}
        </div>
    </div>
    <div class="main">
        <div class="toolbar">
            <select on:change={changeFont}>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
                <!-- Add more font options as needed -->
            </select>
            <input type="color" on:input={changeColor}>
            <input type="number" min="12" max="72" step="2" on:input={changeFontSize}>
            <button on:click={addText}>Text</button>
        </div>
        <div class="slide-editor" on:mousemove={handleDrag} on:mouseup={handleDragEnd}>
            {#each slides as slide (slide.id)}
                <div class="slide-content"
                    contenteditable="true"
                    style={`left: 50px; top: 50px; font-size: ${slide.content.title.fontSize}; font-family: ${slide.content.title.fontFamily}; color: ${slide.content.title.color};`}
                    on:dragstart={handleDragStart}
                    on:dragend={handleDragEnd}
                    draggable="true"
                >
                    {slide.content.title.text || 'Title'}
                </div>
                <div class="slide-content"
                    contenteditable="true"
                    style={`left: 50px; top: 150px; font-size: ${slide.content.subtitle.fontSize}; font-family: ${slide.content.subtitle.fontFamily}; color: ${slide.content.subtitle.color};`}
                    on:dragstart={handleDragStart}
                    on:dragend={handleDragEnd}
                    draggable="true"
                >
                    {slide.content.subtitle.text || 'Subtitle'}
                </div>
                <div class="slide-content"
                    contenteditable="true"
                    style={`left: 50px; top: 250px; font-size: ${slide.content.fontSize}; font-family: ${slide.content.fontFamily}; color: ${slide.content.color};`}
                    on:dragstart={handleDragStart}
                    on:dragend={handleDragEnd}
                    draggable="true"
                >
                    {@html slide.content.content}
                </div>
            {/each}
        </div>
    </div>
    <div class="side-tools">
        <button on:click={savePresentation}>Save</button>
        <button on:click={shareViaEmail}>Share</button>
        <button on:click={downloadPresentation}>Download</button>
    </div>
</div>
