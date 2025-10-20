/**
 * FormBuilder - Main controller class
 * Initializes and coordinates all modules
 */

import Palette from '../modules/Palette.js';
import Canvas from '../modules/Canvas.js';
import DragDrop from '../modules/DragDrop.js';
import Resize from '../modules/Resize.js';
import PropertiesPanel from '../modules/PropertiesPanel.js';
import Toolbar from '../modules/Toolbar.js';
import StateManager from './StateManager.js';
import EventBus from './EventBus.js';

export class FormBuilder {
    constructor() {
        this.modules = {};
        this.initialized = false;
    }

    async init() {
        if (this.initialized) {
            console.warn('FormBuilder already initialized');
            return;
        }

        console.log('Initializing Form Builder...');

        try {
            // Initialize modules
            this.modules.palette = new Palette();
            this.modules.canvas = new Canvas();
            this.modules.dragDrop = new DragDrop();
            this.modules.resize = new Resize();
            this.modules.propertiesPanel = new PropertiesPanel();
            this.modules.toolbar = new Toolbar();

            // Initialize each module
            this.modules.palette.init();
            this.modules.canvas.init();
            this.modules.dragDrop.init();
            this.modules.resize.init();
            this.modules.propertiesPanel.init();
            this.modules.toolbar.init();

            // Set up global event listeners
            this.setupGlobalListeners();

            this.initialized = true;
            console.log('Form Builder initialized successfully!');

            // Emit ready event
            EventBus.emit('app:ready');

        } catch (error) {
            console.error('Error initializing Form Builder:', error);
            throw error;
        }
    }

    setupGlobalListeners() {
        // Listen for app-level events
        EventBus.on('component:added', (component) => {
            console.log('Component added:', component.type);
        });

        EventBus.on('component:selected', (component) => {
            console.log('Component selected:', component.id);
        });

        EventBus.on('state:cleared', () => {
            console.log('State cleared');
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when editing text inputs
            const activeElement = document.activeElement;
            const isEditingText = activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.contentEditable === 'true' ||
                activeElement.isContentEditable
            );

            // Delete selected component with Delete key (only when not editing text)
            if (e.key === 'Delete' && !isEditingText) {
                const selected = StateManager.getSelectedComponent();
                if (selected) {
                    StateManager.removeComponent(selected.id);
                }
            }

            // Deselect with Escape key (only when not editing text)
            if (e.key === 'Escape' && !isEditingText) {
                StateManager.deselectComponent();
            }
        });
    }

    // Get module instance
    getModule(name) {
        return this.modules[name];
    }

    // Get state
    getState() {
        return StateManager.getState();
    }

    // Export form data
    exportJSON() {
        return StateManager.getFormData();
    }

    // Import form data
    importJSON(data) {
        StateManager.loadFromJSON(data);
    }

    // Clear form
    clear() {
        StateManager.clear();
    }
}

export default FormBuilder;
