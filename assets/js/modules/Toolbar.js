/**
 * Toolbar Module - Handles toolbar actions
 */

import StateManager from '../core/StateManager.js';
import { exportToJSON, importFromJSON, downloadJSON } from '../utils/json.js';

export class Toolbar {
    constructor() {
        this.btnClear = document.getElementById('btn-clear');
        this.btnLoad = document.getElementById('btn-load');
        this.btnSave = document.getElementById('btn-save');
        this.btnPreview = document.getElementById('btn-preview');
        
        this.loadJsonModal = new bootstrap.Modal(document.getElementById('loadJsonModal'));
        this.previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
        
        this.jsonInput = document.getElementById('json-input');
        this.btnLoadJson = document.getElementById('btn-load-json');
        this.previewContent = document.getElementById('preview-content');
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Clear button
        this.btnClear.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the form? This action cannot be undone.')) {
                StateManager.clear();
            }
        });

        // Load button - open modal
        this.btnLoad.addEventListener('click', () => {
            this.loadJsonModal.show();
        });

        // Load JSON button in modal
        this.btnLoadJson.addEventListener('click', () => {
            this.loadJSON();
        });

        // Save button
        this.btnSave.addEventListener('click', () => {
            this.saveJSON();
        });

        // Preview button
        this.btnPreview.addEventListener('click', () => {
            this.showPreview();
        });
    }

    loadJSON() {
        try {
            const jsonString = this.jsonInput.value.trim();
            
            if (!jsonString) {
                alert('Please paste JSON data');
                return;
            }

            const data = importFromJSON(jsonString);
            StateManager.loadFromJSON(data);
            
            this.loadJsonModal.hide();
            this.jsonInput.value = '';
            
            // Show success message
            this.showToast('Form loaded successfully!', 'success');
            
        } catch (error) {
            alert('Error loading JSON: ' + error.message);
        }
    }

    saveJSON() {
        try {
            const formData = StateManager.getFormData();
            const jsonString = exportToJSON(formData);
            
            // Copy to clipboard
            navigator.clipboard.writeText(jsonString).then(() => {
                this.showToast('JSON copied to clipboard!', 'success');
            }).catch(() => {
                // Fallback: download as file
                downloadJSON(jsonString, `form-${formData.formId}.json`);
                this.showToast('JSON downloaded as file!', 'success');
            });
            
        } catch (error) {
            alert('Error saving JSON: ' + error.message);
        }
    }

    async showPreview() {
        const formData = StateManager.getFormData();
        
        if (formData.components.length === 0) {
            alert('Add components to the canvas first!');
            return;
        }

        // Load API data for components that need it
        for (const component of formData.components) {
            if (['select', 'radio'].includes(component.type) && component.properties.dataSource === 'api') {
                try {
                    const options = await this.loadApiOptionsForPreview(component);
                    if (options) {
                        component.properties._loadedOptions = options;
                    }
                } catch (error) {
                    console.error('Error loading API options for preview:', error);
                }
            }
        }

        // Render preview
        this.previewContent.innerHTML = this.renderPreview(formData);
        this.previewModal.show();
    }

    async loadApiOptionsForPreview(component) {
        try {
            // Import the API utility
            const { fetchApiOptions } = await import('../utils/api.js');
            
            // Use the same function as Canvas
            return await fetchApiOptions(component);
        } catch (error) {
            console.error('Error fetching API options for preview:', error);
        }

        return null;
    }

    renderPreview(formData) {
        const components = formData.components;
        
        let html = '<form class="row g-3">';
        
        components.forEach(component => {
            html += this.renderPreviewComponent(component);
        });
        
        html += `
            <div class="col-12">
                <button type="submit" class="btn btn-primary">Submit</button>
                <button type="reset" class="btn btn-secondary">Reset</button>
            </div>
        `;
        
        html += '</form>';
        
        return html;
    }

    renderPreviewComponent(component) {
        const props = component.properties;
        let html = `<div class="${props.columnClass || 'col-12'}">`;
        html += `<div class="${props.wrapperClass || 'mb-3'}">`;
        
        switch (component.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'tel':
            case 'date':
                html += `
                    <label class="${props.labelClass || 'form-label'}">${props.label}</label>
                    <input 
                        type="${component.type}" 
                        class="${props.inputClass || 'form-control'}"
                        placeholder="${props.placeholder || ''}"
                        ${props.required ? 'required' : ''}
                    >
                `;
                break;
            
            case 'textarea':
                html += `
                    <label class="${props.labelClass || 'form-label'}">${props.label}</label>
                    <textarea 
                        class="${props.inputClass || 'form-control'}"
                        rows="${props.rows || 3}"
                        placeholder="${props.placeholder || ''}"
                        ${props.required ? 'required' : ''}
                    ></textarea>
                `;
                break;
            
            case 'select':
                // Use API loaded options if available, otherwise use manual options
                const selectOptionsList = props._loadedOptions || props.options || [];
                const selectOptions = selectOptionsList.map(opt => {
                    const label = typeof opt === 'string' ? opt : opt.label;
                    const value = typeof opt === 'string' ? opt : opt.value;
                    return `<option value="${value}">${label}</option>`;
                }).join('');
                
                html += `
                    <label class="${props.labelClass || 'form-label'}">${props.label}</label>
                    <select class="${props.inputClass || 'form-select'}" ${props.required ? 'required' : ''}>
                        <option value="">Choose...</option>
                        ${selectOptions}
                    </select>
                `;
                break;
            
            case 'checkbox':
                html += `
                    <div class="form-check">
                        <input class="${props.inputClass || 'form-check-input'}" type="checkbox" ${props.checked ? 'checked' : ''}>
                        <label class="${props.labelClass || 'form-check-label'}">${props.label}</label>
                    </div>
                `;
                break;
            
            case 'radio':
                // Use API loaded options if available, otherwise use manual options
                const radioOptionsList = props._loadedOptions || props.options || [];
                html += `<label class="${props.labelClass || 'form-label'} d-block">${props.label}</label>`;
                radioOptionsList.forEach((opt, i) => {
                    const label = typeof opt === 'string' ? opt : opt.label;
                    const value = typeof opt === 'string' ? opt : opt.value;
                    
                    html += `
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="${props.name}" id="preview-${component.id}-${i}" value="${value}">
                            <label class="form-check-label" for="preview-${component.id}-${i}">${label}</label>
                        </div>
                    `;
                });
                break;
            
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
                const tag = component.type;
                html += `<${tag} class="${props.textAlign || ''}">${props.content}</${tag}>`;
                break;
            
            case 'paragraph':
                html += `<p class="${props.textAlign || ''}">${props.content}</p>`;
                break;
            
            case 'separator':
                html += '<hr>';
                break;
        }
        
        html += '</div></div>';
        return html;
    }

    showToast(message, type = 'info') {
        // Simple toast notification using Bootstrap alert
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        toast.style.zIndex = '9999';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

export default Toolbar;
