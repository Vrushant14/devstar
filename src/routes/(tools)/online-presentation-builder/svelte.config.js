import adapter from '@sveltejs/adapter-node';

const config = {
    kit: {
        adapter: adapter({ out: 'build' }),
        target: '#svelte',
        // Add any other necessary configurations
    }
};

export default config;