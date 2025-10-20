/**
 * Resize Module - Handles component resizing in canvas
 */

import StateManager from '../core/StateManager.js';
import EventBus from '../core/EventBus.js';

export class Resize {
    constructor() {
        this.canvasRow = document.getElementById('canvas-row');
        this.isResizing = false;
        this.currentComponent = null;
        this.currentHandle = null;
        this.startX = 0;
        this.startWidth = 0;
        this.widthIndicator = null;
        
        // Bootstrap column sizes (in 12-column grid)
        this.columnSizes = [
            { class: 'col-1', width: 1 },
            { class: 'col-2', width: 2 },
            { class: 'col-3', width: 3 },
            { class: 'col-4', width: 4 },
            { class: 'col-5', width: 5 },
            { class: 'col-6', width: 6 },
            { class: 'col-md-6', width: 6 },
            { class: 'col-7', width: 7 },
            { class: 'col-8', width: 8 },
            { class: 'col-9', width: 9 },
            { class: 'col-10', width: 10 },
            { class: 'col-11', width: 11 },
            { class: 'col-12', width: 12 },
            { class: 'col-md-3', width: 3 },
            { class: 'col-md-4', width: 4 },
            { class: 'col-md-8', width: 8 },
            { class: 'col-md-9', width: 9 }
        ];
    }

    init() {
        this.setupResizeListeners();
        this.createWidthIndicator();
    }

    createWidthIndicator() {
        this.widthIndicator = document.createElement('div');
        this.widthIndicator.className = 'fb-width-indicator';
        this.widthIndicator.style.display = 'none';
        document.body.appendChild(this.widthIndicator);
    }

    setupResizeListeners() {
        // Mousedown on resize handle
        this.canvasRow.addEventListener('mousedown', (e) => {
            const handle = e.target.closest('.fb-resize-handle');
            if (handle) {
                e.preventDefault();
                e.stopPropagation();
                this.startResize(handle, e);
            }
        });

        // Mousemove for resizing
        document.addEventListener('mousemove', (e) => {
            if (this.isResizing) {
                this.doResize(e);
            }
        });

        // Mouseup to stop resizing
        document.addEventListener('mouseup', () => {
            if (this.isResizing) {
                this.stopResize();
            }
        });
    }

    startResize(handle, e) {
        const component = handle.closest('.fb-component');
        if (!component) return;

        this.isResizing = true;
        this.currentComponent = component;
        this.currentHandle = handle.getAttribute('data-resize');
        this.startX = e.clientX;
        
        const rect = component.getBoundingClientRect();
        this.startWidth = rect.width;
        
        // Add resizing class
        component.classList.add('fb-resizing');
        
        // Show width indicator
        this.updateWidthIndicator(component);
    }

    doResize(e) {
        if (!this.currentComponent) return;

        const deltaX = e.clientX - this.startX;
        const containerWidth = this.canvasRow.getBoundingClientRect().width;
        
        // Calculate new width based on handle direction
        let newWidthPx = this.startWidth;
        if (this.currentHandle === 'right') {
            newWidthPx = this.startWidth + deltaX;
        } else if (this.currentHandle === 'left') {
            newWidthPx = this.startWidth - deltaX;
        }

        // Convert to column size
        const widthPercent = (newWidthPx / containerWidth) * 100;
        const columnWidth = Math.round((widthPercent / 100) * 12);
        const clampedWidth = Math.max(1, Math.min(12, columnWidth));
        
        // Find closest matching column class
        const columnClass = this.getColumnClass(clampedWidth);
        
        // Update component temporarily for visual feedback
        this.currentComponent.className = `${columnClass} fb-component fb-resizing`;
        
        // Update width indicator
        this.updateWidthIndicator(this.currentComponent, columnClass);
    }

    stopResize() {
        if (!this.currentComponent) return;

        // Get the final column class
        const classList = Array.from(this.currentComponent.classList);
        const columnClass = classList.find(cls => cls.startsWith('col-'));
        
        // Update state
        const componentId = this.currentComponent.getAttribute('data-component-id');
        if (columnClass && componentId) {
            StateManager.updateComponent(componentId, { columnClass });
        }

        // Remove resizing class
        this.currentComponent.classList.remove('fb-resizing');
        
        // Hide width indicator
        this.widthIndicator.style.display = 'none';
        
        // Reset
        this.isResizing = false;
        this.currentComponent = null;
        this.currentHandle = null;
    }

    getColumnClass(width) {
        // Map width to appropriate Bootstrap column class
        const classMap = {
            1: 'col-1',
            2: 'col-2',
            3: 'col-md-3',
            4: 'col-md-4',
            5: 'col-5',
            6: 'col-md-6',
            7: 'col-7',
            8: 'col-md-8',
            9: 'col-md-9',
            10: 'col-10',
            11: 'col-11',
            12: 'col-12'
        };
        
        return classMap[width] || 'col-12';
    }

    updateWidthIndicator(component, columnClass = null) {
        if (!columnClass) {
            const classList = Array.from(component.classList);
            columnClass = classList.find(cls => cls.startsWith('col-'));
        }
        
        // Extract width from class
        let widthText = columnClass;
        if (columnClass.includes('col-12')) widthText = 'Full Width (12/12)';
        else if (columnClass.includes('6')) widthText = 'Half Width (6/12)';
        else if (columnClass.includes('4')) widthText = 'One Third (4/12)';
        else if (columnClass.includes('3')) widthText = 'One Quarter (3/12)';
        else if (columnClass.includes('8')) widthText = 'Two Thirds (8/12)';
        else if (columnClass.includes('9')) widthText = 'Three Quarters (9/12)';
        
        this.widthIndicator.textContent = widthText;
        
        // Position above component
        const rect = component.getBoundingClientRect();
        this.widthIndicator.style.display = 'block';
        this.widthIndicator.style.left = rect.left + (rect.width / 2) + 'px';
        this.widthIndicator.style.top = rect.top - 35 + window.scrollY + 'px';
    }
}

export default Resize;
