/**
 * Palette Module - Displays available components
 * Pure Bootstrap classes
 */

import ComponentRegistry from '../core/ComponentRegistry.js';

export class Palette {
    constructor() {
        this.registry = ComponentRegistry;
        this.containers = {
            'form-fields': document.getElementById('palette-form-fields'),
            'typography': document.getElementById('palette-typography'),
            'layout': document.getElementById('palette-layout')
        };
    }

    init() {
        this.renderPalette();
    }

    renderPalette() {
        const categories = ['form-fields', 'typography', 'layout'];
        
        categories.forEach(category => {
            const components = this.registry.getComponentsByCategory(category);
            const container = this.containers[category];
            
            if (!container) return;
            
            container.innerHTML = '';
            
            components.forEach(component => {
                const item = this.createPaletteItem(component);
                container.appendChild(item);
            });
        });
    }

    createPaletteItem(componentDef) {
        const item = document.createElement('div');
        item.className = 'btn btn-outline-primary btn-sm text-start fb-palette-item';
        item.setAttribute('draggable', 'true');
        item.setAttribute('data-component-type', componentDef.type);
        
        item.innerHTML = `
            <i class="bi ${componentDef.icon} me-2"></i>
            ${componentDef.label}
        `;

        // Add drag event listeners
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('componentType', componentDef.type);
            item.classList.add('fb-dragging');
        });

        item.addEventListener('dragend', (e) => {
            item.classList.remove('fb-dragging');
        });

        return item;
    }
}

export default Palette;
