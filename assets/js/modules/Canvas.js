/**
 * Canvas Module - Manages the form building workspace
 * Pure Bootstrap classes
 */

import EventBus from '../core/EventBus.js';
import StateManager from '../core/StateManager.js';
import FormField from '../components/FormField.js';
import Typography from '../components/Typography.js';
import Layout from '../components/Layout.js';
import { fetchApiOptions } from '../utils/api.js';

export class Canvas {
    constructor() {
        this.canvasRow = document.getElementById('canvas-row');
        this.placeholder = document.getElementById('canvas-placeholder');
        this.draggedComponent = null;
        this.draggedElement = null;
        this.apiOptionsCache = new Map();
        this.setupEventListeners();
    }

    init() {
        // Listen to state changes
        EventBus.on('state:changed', () => this.render());
        EventBus.on('state:cleared', () => this.clear());
        EventBus.on('state:loaded', () => this.render());
        EventBus.on('component:updated', () => this.render());
    }

    setupEventListeners() {
        // Click to select component
        this.canvasRow.addEventListener('click', (e) => {
            const component = e.target.closest('.fb-component');
            
            // Handle delete button
            if (e.target.closest('[data-action="delete"]')) {
                e.stopPropagation();
                if (component) {
                    const componentId = component.getAttribute('data-component-id');
                    StateManager.removeComponent(componentId);
                }
                return;
            }

            // Select component
            if (component) {
                const componentId = component.getAttribute('data-component-id');
                StateManager.selectComponent(componentId);
                this.highlightSelected(componentId);
            } else {
                StateManager.deselectComponent();
                this.clearSelection();
            }
        });

        // Drag to reorder - Start
        this.canvasRow.addEventListener('mousedown', (e) => {
            const component = e.target.closest('.fb-component');
            
            // Don't interfere with resize handles or delete button
            if (e.target.closest('.fb-resize-handle') || e.target.closest('[data-action="delete"]')) {
                return;
            }

            if (component) {
                this.startDragReorder(component, e);
            }
        });

        // Drag to reorder - Move
        document.addEventListener('mousemove', (e) => {
            if (this.draggedComponent) {
                this.dragReorder(e);
            }
        });

        // Drag to reorder - End
        document.addEventListener('mouseup', () => {
            if (this.draggedComponent) {
                this.endDragReorder();
            }
        });
    }

    startDragReorder(element, e) {
        // Small delay to distinguish click from drag
        this.dragTimeout = setTimeout(() => {
            this.draggedComponent = element;
            this.draggedElement = element;
            
            const componentId = element.getAttribute('data-component-id');
            this.draggedComponentId = componentId;
            
            // Add dragging class
            element.classList.add('fb-dragging');
            element.style.cursor = 'grabbing';
            
            // Store initial position
            this.initialY = e.clientY;
        }, 100);
    }

    dragReorder(e) {
        if (!this.draggedComponent) return;

        // Find drop position
        const components = Array.from(this.canvasRow.querySelectorAll('.fb-component:not(.fb-dragging)'));
        
        let insertBeforeElement = null;
        
        for (const component of components) {
            const rect = component.getBoundingClientRect();
            const middle = rect.top + rect.height / 2;
            
            if (e.clientY < middle) {
                insertBeforeElement = component;
                break;
            }
        }

        // Visual feedback - show where it will be inserted
        if (insertBeforeElement) {
            this.canvasRow.insertBefore(this.draggedElement, insertBeforeElement);
        } else {
            // Append to end (after placeholder if visible)
            if (this.placeholder.classList.contains('fb-hidden')) {
                this.canvasRow.appendChild(this.draggedElement);
            }
        }
    }

    endDragReorder() {
        clearTimeout(this.dragTimeout);
        
        if (!this.draggedComponent) return;

        // Remove dragging class
        this.draggedComponent.classList.remove('fb-dragging');
        this.draggedComponent.style.cursor = '';

        // Calculate new index
        const allComponents = Array.from(this.canvasRow.querySelectorAll('.fb-component'));
        const newIndex = allComponents.indexOf(this.draggedComponent);

        // Update state
        if (this.draggedComponentId && newIndex !== -1) {
            StateManager.moveComponent(this.draggedComponentId, newIndex);
        }

        // Reset
        this.draggedComponent = null;
        this.draggedElement = null;
        this.draggedComponentId = null;
    }

    async render() {
        const state = StateManager.getState();
        
        // Clear canvas except placeholder
        const components = this.canvasRow.querySelectorAll('.fb-component');
        components.forEach(comp => comp.remove());

        // Show/hide placeholder
        if (state.components.length === 0) {
            this.placeholder.classList.remove('fb-hidden');
        } else {
            this.placeholder.classList.add('fb-hidden');
            
            // Render each component
            for (const component of state.components) {
                // Load API options if needed
                if (['select', 'radio'].includes(component.type) && component.properties.dataSource === 'api') {
                    const options = await this.loadApiOptions(component);
                    if (options) {
                        component._apiOptions = options;
                    }
                }
                
                const element = this.renderComponent(component);
                this.canvasRow.appendChild(element);
            }

            // Highlight selected component
            if (state.selectedComponentId) {
                this.highlightSelected(state.selectedComponentId);
            }
        }
    }

    async loadApiOptions(component) {
        const cacheKey = `${component.id}_${component.properties.apiUrl}`;
        
        // Check cache
        if (this.apiOptionsCache.has(cacheKey)) {
            return this.apiOptionsCache.get(cacheKey);
        }

        try {
            const options = await fetchApiOptions(component);
            if (options) {
                this.apiOptionsCache.set(cacheKey, options);
                return options;
            }
        } catch (error) {
            console.error('Error loading API options:', error);
        }

        return null;
    }

    renderComponent(component) {
        let componentInstance;

        // Use API options if available
        if (component._apiOptions) {
            component = {
                ...component,
                properties: {
                    ...component.properties,
                    _loadedOptions: component._apiOptions
                }
            };
        }

        switch (component.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'tel':
            case 'date':
            case 'textarea':
            case 'select':
            case 'checkbox':
            case 'radio':
                componentInstance = new FormField(component);
                break;
            
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'paragraph':
                componentInstance = new Typography(component);
                break;
            
            case 'separator':
                componentInstance = new Layout(component);
                break;
            
            default:
                console.warn(`Unknown component type: ${component.type}`);
                return document.createElement('div');
        }

        return componentInstance.render();
    }

    highlightSelected(componentId) {
        this.clearSelection();
        const element = this.canvasRow.querySelector(`[data-component-id="${componentId}"]`);
        if (element) {
            element.classList.add('fb-selected');
        }
    }

    clearSelection() {
        const selected = this.canvasRow.querySelectorAll('.fb-selected');
        selected.forEach(el => el.classList.remove('fb-selected'));
    }

    clear() {
        const components = this.canvasRow.querySelectorAll('.fb-component');
        components.forEach(comp => comp.remove());
        this.placeholder.classList.remove('fb-hidden');
        this.clearSelection();
        this.apiOptionsCache.clear();
    }
}

export default Canvas;
