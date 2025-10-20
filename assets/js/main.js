/**
 * Main Entry Point
 * Initializes the Form Builder application
 */

import FormBuilder from './core/FormBuilder.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Create and initialize form builder
        const formBuilder = new FormBuilder();
        await formBuilder.init();

        // Make formBuilder globally accessible for debugging
        window.formBuilder = formBuilder;

        console.log('Form Builder ready to use!');
        console.log('Access via window.formBuilder for debugging');
        
    } catch (error) {
        console.error('Failed to initialize Form Builder:', error);
        alert('Failed to initialize Form Builder. Please check the console for details.');
    }
});
