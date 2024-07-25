<script>
	import PptxGenJS from "pptxgenjs";
	import { onMount } from 'svelte';

	let presentationSlides = [];
	let currentSlideIndex = 0;
	let currentSlide = { title: "", content: "" };
	let currentFont = "Arial";
	let currentColor = "#000000";
	let currentSize = "16";
	let isBold = false;

	const fonts = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"];
	const colors = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FFA500", "#800080"];
	const sizes = ["12", "14", "16", "18", "20", "24", "28", "32"];

	onMount(() => {
		const savedSlides = localStorage.getItem("presentationSlides");
		if (savedSlides) {
			presentationSlides = JSON.parse(savedSlides);
			selectSlide(0);
		} else {
			addSlide();
		}
	});

	function handleSaveClick() {
		currentSlide.content = document.querySelector('.slide-content').innerHTML;
		presentationSlides[currentSlideIndex] = { ...currentSlide };
		presentationSlides = [...presentationSlides]; // Trigger reactivity
		localStorage.setItem("presentationSlides", JSON.stringify(presentationSlides));
	}

	function addSlide() {
		const newSlide = {
			name: "Slide " + (presentationSlides.length + 1),
			content: ""
		};
		presentationSlides = [...presentationSlides, newSlide];
		selectSlide(presentationSlides.length - 1);
		handleSaveClick(); // Save immediately after adding
	}

	function selectSlide(index) {
		currentSlideIndex = index;
		currentSlide = { ...presentationSlides[currentSlideIndex] };
	}

	function deleteSlide(index) {
		presentationSlides.splice(index, 1);
		handleSaveClick();
		if (presentationSlides.length === 0) {
			addSlide();
		} else {
			selectSlide(Math.min(index, presentationSlides.length - 1));
		}
	}

	function applyTextStyle() {
		const selection = window.getSelection();
		if (selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			const span = document.createElement('span');
			span.style.fontFamily = currentFont;
			span.style.color = currentColor;
			span.style.fontSize = currentSize + 'px';
			span.style.fontWeight = isBold ? 'bold' : 'normal';
			range.surroundContents(span);

			// Trigger save after applying style
			currentSlide.content = document.querySelector('.slide-content').innerHTML;
			handleSaveClick();
		}
	}

	function downloadPresentation() {
		// Ensure we have the latest content before downloading
		handleSaveClick();

		const pptx = new PptxGenJS();
		presentationSlides.forEach(slide => {
			const slideObj = pptx.addSlide();

			// Add slide name as the only title
			slideObj.addText(slide.name, { x: 0.5, y: 0.5, fontSize: 24, bold: true });

			// Process content
			const parser = new DOMParser();
			const doc = parser.parseFromString(slide.content, 'text/html');
			const textElements = doc.body.children;

			let yPosition = 1.5;
			for (let element of textElements) {
				if (element.textContent.trim()) {
					const text = element.textContent.trim();
					const color = element.style.color || '#000000';
					const fontFace = element.style.fontFamily || 'Arial';
					const fontSize = parseInt(element.style.fontSize) || 18;
					const isBold = element.style.fontWeight === 'bold';

					slideObj.addText(text, {
						x: 0.5,
						y: yPosition,
						fontSize: fontSize,
						color: color,
						fontFace: fontFace,
						bold: isBold
					});

					yPosition += 0.5;
				}
			}
		});
		pptx.writeFile("presentation.pptx");
	}
</script>

<main class="app-container">
	<aside class="sidebar left-sidebar">
		<div class="sidebar-content">
			<h2>Slides</h2>
			<ul class="sidebar-list">
				{#each presentationSlides as slide, index}
					<li class="sidebar-item">
						<input
							type="text"
							bind:value={slide.name}
							on:input={() => {
								handleSaveClick();
								if (index === currentSlideIndex) {
									currentSlide = { ...currentSlide, name: slide.name };
								}
							}}
							class="slide-name-input {index === currentSlideIndex ? 'active' : ''}"
						/>
						<button
							on:click={() => selectSlide(index)}
							class="sidebar-button {index === currentSlideIndex ? 'bg-dark-grey' : ''}"
						>
							Edit
						</button>
						<button
							on:click={() => deleteSlide(index)}
							class="delete-button"
							title="Delete slide"
						>
							×
						</button>
					</li>
				{/each}
			</ul>
			<button on:click={addSlide} class="add-button">+ Add Slide</button>
		</div>
	</aside>

	<div class="main-content">
		<div class="header">
			<input
				type="text"
				bind:value={currentSlide.title}
				class="title-input"
				placeholder="Slide Title"
				on:input={handleSaveClick}
			/>
			<button class="save-button" on:click={handleSaveClick}>Save</button>
			<button class="download-button" on:click={downloadPresentation}>Download</button>
		</div>
		<div
			class="slide-content"
			contenteditable="true"
			bind:innerHTML={currentSlide.content}
			on:input={(e) => {
				currentSlide.content = e.target.innerHTML;
				handleSaveClick();
			}}
		></div>
	</div>

	<aside class="sidebar right-sidebar">
		<div class="sidebar-content">
			<h2>Styling</h2>
			<select bind:value={currentFont} on:change={() => { applyTextStyle(); handleSaveClick(); }}>
				{#each fonts as font}
					<option value={font}>{font}</option>
				{/each}
			</select>
			<select bind:value={currentColor} on:change={() => { applyTextStyle(); handleSaveClick(); }}>
				{#each colors as color}
					<option value={color} style="background-color: {color};">{color}</option>
				{/each}
			</select>
			<select bind:value={currentSize} on:change={() => { applyTextStyle(); handleSaveClick(); }}>
				{#each sizes as size}
					<option value={size}>{size}px</option>
				{/each}
			</select>
			<label>
				<input type="checkbox" bind:checked={isBold} on:change={() => { applyTextStyle(); handleSaveClick(); }}>
				Bold
			</label>
			<button on:click={() => { applyTextStyle(); handleSaveClick(); }} class="apply-style-button">Apply Style</button>
		</div>
	</aside>
</main>

<style>
	.app-container {
		display: flex;
		height: 100vh;
		font-family: Arial, sans-serif;
	}

	.sidebar {
		width: 250px;
		background: #f0f0f0;
		padding: 20px;
		overflow-y: auto;
	}

	.left-sidebar {
		order: 1;
	}

	.right-sidebar {
		order: 3;
	}

	.main-content {
		flex-grow: 1;
		padding: 20px;
		display: flex;
		flex-direction: column;
		order: 2;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.title-input {
		font-size: 24px;
		font-weight: bold;
		border: none;
		background: transparent;
		outline: none;
		width: 70%;
	}

	.slide-content {
		flex-grow: 1;
		border: 1px solid #ccc;
		padding: 20px;
		overflow-y: auto;
		background: white;
	}

	.sidebar-list {
		list-style-type: none;
		padding: 0;
	}

	.sidebar-item {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.sidebar-button {
		flex-grow: 1;
		text-align: left;
		padding: 10px;
		background: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
	}

	.sidebar-button.bg-dark-grey {
		background-color: #4a5568;
		color: white;
	}

	.delete-button {
		background: #e53e3e;
		color: white;
		border: none;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		margin-left: 10px;
		cursor: pointer;
	}

	.add-button, .save-button, .download-button, .apply-style-button {
		width: 100%;
		padding: 10px;
		margin-top: 10px;
		background: #4CAF50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.bg-dark-grey {
		background-color: #4a5568;
		color: white;
	}

	.slide-name-input {
		width: calc(100% - 70px);
		padding: 5px;
		margin-right: 5px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.slide-name-input.active {
		border-color: #4a5568;
		font-weight: bold;
	}

	.sidebar-button {
		width: 40px;
	}

	.right-sidebar select, .right-sidebar input[type="checkbox"] {
		width: 100%;
		margin-bottom: 10px;
		padding: 5px;
	}

	.right-sidebar label {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.right-sidebar input[type="checkbox"] {
		margin-right: 5px;
	}
</style>
