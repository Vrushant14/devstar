<script>
  import { onMount } from 'svelte';
  

  let slides = [{ id: 1, name: 'Slide 1' }];
  let selectedSlide = 1;
  let presentationName = '';

  function addSlide() {
    const newId = slides.length + 1;
    slides = [...slides, { id: newId, name: `Slide ${newId}` }];
    selectSlide(newId);
  }

  function selectSlide(id) {
    selectedSlide = id;
  }

  function changeSlideName(id, event) {
    const newSlides = slides.map(slide => slide.id === id ? { ...slide, name: event.target.value } : slide);
    slides = newSlides;
  }

  function changePresentationName(event) {
    presentationName = event.target.value;
  }

  function addText() {
    const editor = document.getElementById(`slide-${selectedSlide}`);
    const p = document.createElement('p');
    p.contentEditable = true;
    p.innerText = 'New Text';
    editor.appendChild(p);
  }

  function changeFont(event) {
    const editor = document.getElementById(`slide-${selectedSlide}`);
    editor.style.fontFamily = event.target.value;
  }

  function changeColor(event) {
    const editor = document.getElementById(`slide-${selectedSlide}`);
    editor.style.color = event.target.value;
  }

  function savePresentation() {
    console.log('Save presentation');
  }

  function shareViaEmail() {
    console.log('Share via email');
  }

  function downloadPresentation() {
    console.log('Download presentation');
  }

  function editSlide() {
    console.log('Edit slide');
  }

  onMount(() => {
    console.log('Component mounted');
  });
</script>

<style>
  .container {
    display: flex;
    height: 100vh;
  }

  .sidebar {
    width: 200px;
    background-color: #f4f4f4;
    padding: 10px;
    border-right: 1px solid #ccc;
  }

  .add-slide {
    margin-bottom: 10px;
  }

  .slides-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .slide-item {
    padding: 10px;
    background-color: white;
    border: 1px solid #ccc;
    cursor: pointer;
  }

  .slide-item.selected {
    background-color: #007bff;
    color: white;
  }

  .main {
    flex: 1;
    padding: 20px;
  }

  .toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .slide-editor {
    height: 80vh;
    border: 1px solid #ccc;
    overflow: auto;
    padding: 10px;
  }

  .slide-content {
    padding: 20px;
    border: 1px solid #ccc;
  }

  .side-tools {
    width: 200px;
    background-color: #f4f4f4;
    padding: 10px;
    border-left: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .side-tools button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
</style>

<div class="container">
  <div class="sidebar">
    <input type="text" id="presentation-name" placeholder="Presentation Name" on:change={changePresentationName}>
    <button class="add-slide" on:click={addSlide}>+ Add slide</button>
    <div class="slides-list" id="slides-list">
      {#each slides as slide}
        <div class="slide-item {selectedSlide === slide.id ? 'selected' : ''}" on:click={() => selectSlide(slide.id)} data-slide-id={slide.id}>
          <input class="a" type="text" bind:value={slide.name} on:change={(event) => changeSlideName(slide.id, event)}>
        </div>
      {/each}
    </div>
  </div>
  <div class="main">
    <div class="toolbar">
      <button on:click={addText}>Text</button>
      <select id="font-select" on:change={changeFont}>
        <option value="Arial">Arial</option>
        <option value="Calibri">Calibri</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Comic Sans MS">Comic Sans MS</option>
        <option value="Courier New">Courier New</option>
      </select>
      <input type="color" id="color-picker" on:change={changeColor} value="#000000">
    </div>
    <div class="slide-editor" id="slide-editor">
      {#each slides as slide}
        {#if selectedSlide === slide.id}
          <div class="slide-content" contenteditable="true" id={`slide-${slide.id}`}>
            <div class="slide-title">
              <h1 contenteditable="true">Title</h1>
              <p contenteditable="true">Subtitle</p>
            </div>
            <div class="slide-content-text" contenteditable="true">
              <p contenteditable="true">Content goes here. Click to edit.</p>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
  <div class="side-tools">
    <button on:click={editSlide}>Edit</button>
    <button on:click={savePresentation}>Save</button>
    <button on:click={shareViaEmail}>Share</button>
    <button on:click={downloadPresentation}>Download</button>
  </div>
</div>
