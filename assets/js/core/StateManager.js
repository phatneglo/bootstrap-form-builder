/**
 * StateManager - Manages application state
 * Keeps track of all components and their hierarchy
 */

import EventBus from './EventBus.js';
import { generateFormId } from '../utils/uuid.js';

class StateManager {
    constructor() {
        this.state = {
            formId: generateFormId(),
            formName: 'Untitled Form',
            version: '1.0.0',
            components: [],
            selectedComponentId: null
        };
    }

    // Get current state
    getState() {
        return { ...this.state };
    }

    // Get form data
    getFormData() {
        // Deep clone and clean components - remove runtime API properties
        const cleanedComponents = this.state.components.map(comp => {
            const cleaned = JSON.parse(JSON.stringify(comp));
            // Remove runtime API properties that shouldn't be saved
            delete cleaned._apiOptions;
            if (cleaned.properties) {
                delete cleaned.properties._loadedOptions;
            }
            return cleaned;
        });
        
        return {
            formId: this.state.formId,
            formName: this.state.formName,
            version: this.state.version,
            components: cleanedComponents
        };
    }

    // Add component
    addComponent(component, index = null) {
        if (index !== null && index >= 0 && index <= this.state.components.length) {
            this.state.components.splice(index, 0, component);
        } else {
            this.state.components.push(component);
        }
        EventBus.emit('state:changed', this.state);
        return component;
    }

    // Update component
    updateComponent(componentId, properties) {
        const component = this.findComponent(componentId);
        if (component) {
            Object.assign(component.properties, properties);
            EventBus.emit('state:changed', this.state);
            EventBus.emit('component:updated', component);
        }
    }

    // Remove component
    removeComponent(componentId) {
        const index = this.state.components.findIndex(c => c.id === componentId);
        if (index !== -1) {
            const removed = this.state.components.splice(index, 1)[0];
            
            // Deselect if this was selected
            if (this.state.selectedComponentId === componentId) {
                this.state.selectedComponentId = null;
                EventBus.emit('component:deselected');
            }
            
            EventBus.emit('state:changed', this.state);
            return removed;
        }
    }

    // Find component by ID
    findComponent(componentId) {
        return this.state.components.find(c => c.id === componentId);
    }

    // Select component
    selectComponent(componentId) {
        this.state.selectedComponentId = componentId;
        const component = this.findComponent(componentId);
        EventBus.emit('component:selected', component);
    }

    // Deselect component
    deselectComponent() {
        this.state.selectedComponentId = null;
        EventBus.emit('component:deselected');
    }

    // Get selected component
    getSelectedComponent() {
        if (!this.state.selectedComponentId) return null;
        return this.findComponent(this.state.selectedComponentId);
    }

    // Clear all components
    clear() {
        this.state.components = [];
        this.state.selectedComponentId = null;
        this.state.formId = generateFormId();
        EventBus.emit('state:cleared');
        EventBus.emit('state:changed', this.state);
    }

    // Load state from JSON
    loadFromJSON(data) {
        this.state.formId = data.formId;
        this.state.formName = data.formName || 'Untitled Form';
        this.state.version = data.version || '1.0.0';
        
        // Deep clone and clean components - remove runtime API properties
        this.state.components = (data.components || []).map(comp => {
            const cleaned = JSON.parse(JSON.stringify(comp));
            // Remove runtime API properties from loaded JSON
            delete cleaned._apiOptions;
            if (cleaned.properties) {
                delete cleaned.properties._loadedOptions;
            }
            return cleaned;
        });
        
        this.state.selectedComponentId = null;
        
        EventBus.emit('state:loaded', this.state);
        EventBus.emit('state:changed', this.state);
    }

    // Move component
    moveComponent(componentId, newIndex) {
        const currentIndex = this.state.components.findIndex(c => c.id === componentId);
        if (currentIndex === -1) return;

        const [component] = this.state.components.splice(currentIndex, 1);
        this.state.components.splice(newIndex, 0, component);
        
        EventBus.emit('state:changed', this.state);
    }

    // Get component index
    getComponentIndex(componentId) {
        return this.state.components.findIndex(c => c.id === componentId);
    }
}

export default new StateManager();
