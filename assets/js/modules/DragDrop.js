/**
 * DragDrop Module - Handles drag and drop functionality
 */

import EventBus from '../core/EventBus.js';
import StateManager from '../core/StateManager.js';
import ComponentRegistry from '../core/ComponentRegistry.js';

export class DragDrop {
    constructor() {
        this.canvasRow = document.getElementById('canvas-row');
        this.draggedElement = null;
        this.dropIndicator = null;
        this.createDropIndicator();
    }

    init() {
        this.setupDropZone();
    }

    createDropIndicator() {
        this.dropIndicator = document.createElement('div');
        this.dropIndicator.className = 'fb-drop-indicator';
        this.dropIndicator.style.display = 'none';
    }

    setupDropZone() {
        this.canvasRow.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            
            const componentType = e.dataTransfer.types.includes('componenttype');
            if (componentType) {
                this.showDropIndicator(e);
            }
        });

        this.canvasRow.addEventListener('dragleave', (e) => {
            if (e.target === this.canvasRow) {
                this.hideDropIndicator();
            }
        });

        this.canvasRow.addEventListener('drop', (e) => {
            e.preventDefault();
            this.hideDropIndicator();
            
            const componentType = e.dataTransfer.getData('componentType');
            if (componentType) {
                this.handleDrop(componentType, e);
            }
        });
    }

    showDropIndicator(e) {
        const dropTarget = this.findDropTarget(e.clientY);
        
        if (dropTarget.element) {
            if (dropTarget.position === 'before') {
                dropTarget.element.parentNode.insertBefore(this.dropIndicator, dropTarget.element);
            } else {
                dropTarget.element.parentNode.insertBefore(this.dropIndicator, dropTarget.element.nextSibling);
            }
            this.dropIndicator.style.display = 'block';
        } else {
            // Append to end
            this.canvasRow.appendChild(this.dropIndicator);
            this.dropIndicator.style.display = 'block';
        }
    }

    hideDropIndicator() {
        this.dropIndicator.style.display = 'none';
        if (this.dropIndicator.parentNode) {
            this.dropIndicator.parentNode.removeChild(this.dropIndicator);
        }
    }

    findDropTarget(mouseY) {
        const components = Array.from(this.canvasRow.querySelectorAll('.fb-component'));
        
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            const rect = component.getBoundingClientRect();
            const middle = rect.top + rect.height / 2;
            
            if (mouseY < middle) {
                return { element: component, position: 'before' };
            }
        }
        
        if (components.length > 0) {
            return { element: components[components.length - 1], position: 'after' };
        }
        
        return { element: null, position: 'end' };
    }

    handleDrop(componentType, e) {
        try {
            // Create new component
            const component = ComponentRegistry.createComponent(componentType);
            
            // Calculate insert index
            const dropTarget = this.findDropTarget(e.clientY);
            let insertIndex = null;
            
            if (dropTarget.element) {
                const componentId = dropTarget.element.getAttribute('data-component-id');
                const currentIndex = StateManager.getComponentIndex(componentId);
                
                if (dropTarget.position === 'before') {
                    insertIndex = currentIndex;
                } else {
                    insertIndex = currentIndex + 1;
                }
            }
            
            // Add to state
            StateManager.addComponent(component, insertIndex);
            EventBus.emit('component:added', component);
            
        } catch (error) {
            console.error('Error dropping component:', error);
        }
    }
}

export default DragDrop;
