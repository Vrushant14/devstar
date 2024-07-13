import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

const config = {
    kit: {
        adapter: adapter({ out: 'build' }),
        // Add any other necessary configurations
    },
    preprocess: [vitePreprocess()]
};

export default config;
function addSlide() {
    const newSlideId = slides.length + 1;
    slides = [...slides, { 
        id: newSlideId, 
        name: `Slide ${newSlideId}`, 
        content: { 
            title: { text: 'Title', fontSize: '36px', left: '50px', top: '50px' }, 
            subtitle: { text: 'Subtitle', fontSize: '24px', left: '50px', top: '150px' }, 
            content: '<p contenteditable="true">Content goes here. Click to edit.</p>' 
        } 
    }];
    selectSlide(newSlideId);
}
