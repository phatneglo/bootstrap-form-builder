/**
 * FormField Component - Renders form input elements
 * Pure Bootstrap classes
 */

import BaseComponent from './BaseComponent.js';

export class FormField extends BaseComponent {
    render() {
        let content = '';

        switch (this.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'tel':
            case 'date':
                content = this.renderInput();
                break;
            case 'textarea':
                content = this.renderTextarea();
                break;
            case 'select':
                content = this.renderSelect();
                break;
            case 'checkbox':
                content = this.renderCheckbox();
                break;
            case 'radio':
                content = this.renderRadioGroup();
                break;
            default:
                content = '<div class="alert alert-warning">Unknown field type</div>';
        }

        return this.renderWrapper(content);
    }

    renderInput() {
        const required = this.properties.required ? 'required' : '';
        const placeholder = this.properties.placeholder ? `placeholder="${this.properties.placeholder}"` : '';
        
        let additionalAttrs = '';
        if (this.type === 'number') {
            if (this.properties.min) additionalAttrs += ` min="${this.properties.min}"`;
            if (this.properties.max) additionalAttrs += ` max="${this.properties.max}"`;
            if (this.properties.step) additionalAttrs += ` step="${this.properties.step}"`;
        }

        return `
            <label class="${this.properties.labelClass || 'form-label'}">
                ${this.properties.label}
                ${this.properties.required ? '<span class="text-danger">*</span>' : ''}
            </label>
            <input 
                type="${this.type}" 
                class="${this.properties.inputClass || 'form-control'}" 
                name="${this.properties.name}"
                ${placeholder}
                ${required}
                ${additionalAttrs}
            >
        `;
    }

    renderTextarea() {
        const required = this.properties.required ? 'required' : '';
        const placeholder = this.properties.placeholder ? `placeholder="${this.properties.placeholder}"` : '';
        const rows = this.properties.rows || 3;

        return `
            <label class="${this.properties.labelClass || 'form-label'}">
                ${this.properties.label}
                ${this.properties.required ? '<span class="text-danger">*</span>' : ''}
            </label>
            <textarea 
                class="${this.properties.inputClass || 'form-control'}" 
                name="${this.properties.name}"
                rows="${rows}"
                ${placeholder}
                ${required}
            ></textarea>
        `;
    }

    renderSelect() {
        const required = this.properties.required ? 'required' : '';
        const options = this.properties.options || [];

        const optionsHtml = options.map(opt => {
            // Support both old format (string) and new format (object with label/value)
            const label = typeof opt === 'string' ? opt : opt.label;
            const value = typeof opt === 'string' ? opt : opt.value;
            return `<option value="${value}">${label}</option>`;
        }).join('');

        return `
            <label class="${this.properties.labelClass || 'form-label'}">
                ${this.properties.label}
                ${this.properties.required ? '<span class="text-danger">*</span>' : ''}
            </label>
            <select 
                class="${this.properties.inputClass || 'form-select'}" 
                name="${this.properties.name}"
                ${required}
            >
                <option value="">Choose...</option>
                ${optionsHtml}
            </select>
        `;
    }

    renderCheckbox() {
        const checked = this.properties.checked ? 'checked' : '';

        return `
            <div class="form-check">
                <input 
                    class="${this.properties.inputClass || 'form-check-input'}" 
                    type="checkbox" 
                    name="${this.properties.name}"
                    id="${this.id}"
                    ${checked}
                >
                <label class="${this.properties.labelClass || 'form-check-label'}" for="${this.id}">
                    ${this.properties.label}
                </label>
            </div>
        `;
    }

    renderRadioGroup() {
        const options = this.properties.options || [];
        const required = this.properties.required ? 'required' : '';

        const optionsHtml = options.map((opt, index) => {
            // Support both old format (string) and new format (object with label/value)
            const label = typeof opt === 'string' ? opt : opt.label;
            const value = typeof opt === 'string' ? opt : opt.value;
            
            return `
                <div class="form-check">
                    <input 
                        class="form-check-input" 
                        type="radio" 
                        name="${this.properties.name}"
                        id="${this.id}-${index}"
                        value="${value}"
                        ${required}
                    >
                    <label class="form-check-label" for="${this.id}-${index}">
                        ${label}
                    </label>
                </div>
            `;
        }).join('');

        return `
            <label class="${this.properties.labelClass || 'form-label'} d-block">
                ${this.properties.label}
                ${this.properties.required ? '<span class="text-danger">*</span>' : ''}
            </label>
            ${optionsHtml}
        `;
    }
}

export default FormField;
