/**
 * PropertiesPanel Module - Edit component properties
 * Pure Bootstrap classes with grouped cards
 */

import EventBus from '../core/EventBus.js';
import StateManager from '../core/StateManager.js';
import { TEXT_ALIGN_OPTIONS } from '../config/bootstrap-config.js';
import { testApiEndpoint, extractArrayFromResponse, extractPropertiesFromFirstItem } from '../utils/api.js';

export class PropertiesPanel {
    constructor() {
        this.panel = document.getElementById('properties-panel');
        this.currentComponent = null;
        this.apiTestModal = new bootstrap.Modal(document.getElementById('apiTestModal'));
        this.propertyPickerModal = new bootstrap.Modal(document.getElementById('propertyPickerModal'));
        this.lastApiData = null;
        this.currentPickerField = null;
    }

    init() {
        EventBus.on('component:selected', (component) => {
            this.currentComponent = component;
            this.render(component);
        });

        EventBus.on('component:deselected', () => {
            this.currentComponent = null;
            this.renderEmpty();
        });
    }

    render(component) {
        this.panel.innerHTML = '';
        
        const container = document.createElement('div');
        container.className = 'd-flex flex-column gap-3';
        
        // Content Card (based on component type)
        const contentCard = this.createContentCard(component);
        if (contentCard) {
            container.appendChild(contentCard);
        }
        
        // Options Card (for select, radio)
        if (['select', 'radio'].includes(component.type)) {
            container.appendChild(this.createOptionsCard(component));
        }
        
        this.panel.appendChild(container);
        this.attachEventListeners(component);
    }

    createContentCard(component) {
        let content = '';
        
        switch (component.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'tel':
            case 'date':
            case 'textarea':
                content = this.getFormFieldContent(component);
                break;
            case 'select':
                content = this.getSelectFieldContent(component);
                break;
            case 'checkbox':
                content = this.getCheckboxContent(component);
                break;
            case 'radio':
                content = this.getRadioContent(component);
                break;
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'paragraph':
                content = this.getTypographyContent(component);
                break;
            case 'separator':
                return null; // No content properties for separator
        }
        
        return content ? this.createCard('Content', content) : null;
    }

    getFormFieldContent(component) {
        let html = `
            <div class="mb-3">
                <label class="form-label small fw-bold">Label</label>
                <input type="text" class="form-control form-control-sm" name="label" value="${component.properties.label || ''}">
            </div>
            
            <div class="mb-3">
                <label class="form-label small fw-bold">Field Name</label>
                <input type="text" class="form-control form-control-sm" name="name" value="${component.properties.name || ''}">
            </div>
            
            <div class="mb-3">
                <label class="form-label small fw-bold">Placeholder</label>
                <input type="text" class="form-control form-control-sm" name="placeholder" value="${component.properties.placeholder || ''}">
            </div>
        `;
        
        if (component.type === 'number') {
            html += `
                <div class="row mb-3">
                    <div class="col-4">
                        <label class="form-label small fw-bold">Min</label>
                        <input type="text" class="form-control form-control-sm" name="min" value="${component.properties.min || ''}">
                    </div>
                    <div class="col-4">
                        <label class="form-label small fw-bold">Max</label>
                        <input type="text" class="form-control form-control-sm" name="max" value="${component.properties.max || ''}">
                    </div>
                    <div class="col-4">
                        <label class="form-label small fw-bold">Step</label>
                        <input type="text" class="form-control form-control-sm" name="step" value="${component.properties.step || '1'}">
                    </div>
                </div>
            `;
        }
        
        if (component.type === 'textarea') {
            html += `
                <div class="mb-3">
                    <label class="form-label small fw-bold">Rows</label>
                    <input type="number" class="form-control form-control-sm" name="rows" value="${component.properties.rows || 3}">
                </div>
            `;
        }
        
        html += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="required" id="prop-required" ${component.properties.required ? 'checked' : ''}>
                <label class="form-check-label small" for="prop-required">Required field</label>
            </div>
        `;
        
        return html;
    }

    getSelectFieldContent(component) {
        return `
            <div class="mb-3">
                <label class="form-label small fw-bold">Label</label>
                <input type="text" class="form-control form-control-sm" name="label" value="${component.properties.label || ''}">
            </div>
            
            <div class="mb-3">
                <label class="form-label small fw-bold">Field Name</label>
                <input type="text" class="form-control form-control-sm" name="name" value="${component.properties.name || ''}">
            </div>
            
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="required" id="prop-required" ${component.properties.required ? 'checked' : ''}>
                <label class="form-check-label small" for="prop-required">Required field</label>
            </div>
        `;
    }

    getCheckboxContent(component) {
        return `
            <div class="mb-3">
                <label class="form-label small fw-bold">Label</label>
                <input type="text" class="form-control form-control-sm" name="label" value="${component.properties.label || ''}">
            </div>
            
            <div class="mb-3">
                <label class="form-label small fw-bold">Field Name</label>
                <input type="text" class="form-control form-control-sm" name="name" value="${component.properties.name || ''}">
            </div>
            
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="checked" id="prop-checked" ${component.properties.checked ? 'checked' : ''}>
                <label class="form-check-label small" for="prop-checked">Checked by default</label>
            </div>
        `;
    }

    getRadioContent(component) {
        return `
            <div class="mb-3">
                <label class="form-label small fw-bold">Label</label>
                <input type="text" class="form-control form-control-sm" name="label" value="${component.properties.label || ''}">
            </div>
            
            <div class="mb-3">
                <label class="form-label small fw-bold">Group Name</label>
                <input type="text" class="form-control form-control-sm" name="name" value="${component.properties.name || ''}">
            </div>
            
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="required" id="prop-required" ${component.properties.required ? 'checked' : ''}>
                <label class="form-check-label small" for="prop-required">Required field</label>
            </div>
        `;
    }

    getTypographyContent(component) {
        return `
            <div class="mb-3">
                <label class="form-label small fw-bold">Content</label>
                <textarea class="form-control form-control-sm" name="content" rows="3">${component.properties.content || ''}</textarea>
            </div>
            
            <div>
                <label class="form-label small fw-bold">Text Alignment</label>
                <select class="form-select form-select-sm" name="textAlign">
                    ${TEXT_ALIGN_OPTIONS.map(opt => 
                        `<option value="${opt.value}" ${component.properties.textAlign === opt.value ? 'selected' : ''}>${opt.label}</option>`
                    ).join('')}
                </select>
            </div>
        `;
    }

    createOptionsCard(component) {
        const options = component.properties.options || [];
        const dataSource = component.properties.dataSource || 'manual';
        const apiHeaders = component.properties.apiHeaders || [];
        
        let optionsHtml = '';
        options.forEach((opt, index) => {
            const label = typeof opt === 'string' ? opt : opt.label;
            const value = typeof opt === 'string' ? opt : opt.value;
            
            optionsHtml += `
                <div class="input-group input-group-sm mb-2" data-option-index="${index}">
                    <input type="text" class="form-control form-control-sm" placeholder="Label" value="${label}" data-field="label">
                    <input type="text" class="form-control form-control-sm" placeholder="Value" value="${value}" data-field="value">
                    <button class="btn btn-outline-danger btn-sm" type="button" data-action="remove-option">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            `;
        });

        let headersHtml = '';
        apiHeaders.forEach((header, index) => {
            headersHtml += `
                <div class="input-group input-group-sm mb-2" data-header-index="${index}">
                    <input type="text" class="form-control form-control-sm" placeholder="Header Key (e.g. Authorization)" value="${header.key || ''}" data-field="key">
                    <input type="text" class="form-control form-control-sm" placeholder="Header Value (e.g. Bearer token)" value="${header.value || ''}" data-field="value">
                    <button class="btn btn-outline-danger btn-sm" type="button" data-action="remove-header">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            `;
        });
        
        const content = `
            <div class="mb-3">
                <label class="form-label small fw-bold">Data Source</label>
                <select class="form-select form-select-sm" name="dataSource">
                    <option value="manual" ${dataSource === 'manual' ? 'selected' : ''}>Manual Entry</option>
                    <option value="api" ${dataSource === 'api' ? 'selected' : ''}>From API</option>
                </select>
            </div>
            
            <div id="manual-options" style="display: ${dataSource === 'manual' ? 'block' : 'none'}">
                <label class="form-label small fw-bold">Options (Label - Value)</label>
                <div id="options-list">
                    ${optionsHtml}
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary w-100 mt-2" id="btn-add-option">
                    <i class="bi bi-plus"></i> Add Option
                </button>
            </div>
            
            <div id="api-options" style="display: ${dataSource === 'api' ? 'block' : 'none'}">
                <div class="mb-3">
                    <label class="form-label small fw-bold">API URL</label>
                    <input type="text" class="form-control form-control-sm" name="apiUrl" value="${component.properties.apiUrl || ''}" placeholder="https://api.example.com/options">
                </div>

                <div class="mb-3">
                    <label class="form-label small fw-bold">HTTP Method</label>
                    <select class="form-select form-select-sm" name="apiMethod">
                        <option value="GET" ${component.properties.apiMethod === 'GET' ? 'selected' : ''}>GET</option>
                        <option value="POST" ${component.properties.apiMethod === 'POST' ? 'selected' : ''}>POST</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label small fw-bold">Headers</label>
                    <div class="form-text mb-2">For authentication or custom headers</div>
                    <div id="headers-list">
                        ${headersHtml}
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-secondary w-100 mt-2" id="btn-add-header">
                        <i class="bi bi-plus"></i> Add Header
                    </button>
                </div>

                <div class="mb-3">
                    <button type="button" class="btn btn-sm btn-primary w-100" id="btn-test-api">
                        <i class="bi bi-lightning"></i> Test API
                    </button>
                </div>

                <hr>
                
                <div class="mb-3">
                    <label class="form-label small fw-bold">Label Key</label>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control form-control-sm" name="apiLabelKey" value="${component.properties.apiLabelKey || 'label'}" placeholder="label">
                        <button class="btn btn-outline-secondary" type="button" id="btn-pick-label-key" ${!this.lastApiData ? 'disabled' : ''}>
                            <i class="bi bi-cursor"></i> Pick
                        </button>
                    </div>
                    <div class="form-text">JSON key for option labels</div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label small fw-bold">Value Key</label>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control form-control-sm" name="apiValueKey" value="${component.properties.apiValueKey || 'value'}" placeholder="value">
                        <button class="btn btn-outline-secondary" type="button" id="btn-pick-value-key" ${!this.lastApiData ? 'disabled' : ''}>
                            <i class="bi bi-cursor"></i> Pick
                        </button>
                    </div>
                    <div class="form-text">JSON key for option values</div>
                </div>

                <div>
                    <label class="form-label small fw-bold">Response Path (optional)</label>
                    <input type="text" class="form-control form-control-sm" name="apiResponsePath" value="${component.properties.apiResponsePath || ''}" placeholder="e.g., data.items">
                    <div class="form-text">Path to array if not at root level</div>
                </div>
            </div>
        `;
        
        return this.createCard('Options', content);
    }

    createCard(title, content) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header bg-light py-2">
                <h6 class="card-title mb-0 small fw-bold">${title}</h6>
            </div>
            <div class="card-body">
                ${content}
            </div>
        `;
        return card;
    }

    attachEventListeners(component) {
        const form = this.panel;
        
        // Listen to all input changes
        form.addEventListener('input', (e) => {
            const field = e.target;
            const propertyName = field.name;
            
            if (!propertyName) return;
            
            let value = field.value;

            // Handle checkboxes
            if (field.type === 'checkbox') {
                value = field.checked;
            }

            // Handle number inputs
            if (field.type === 'number') {
                value = field.value ? Number(field.value) : '';
            }

            // Update component
            StateManager.updateComponent(component.id, { [propertyName]: value });
        });

        // Data source change
        const dataSourceSelect = form.querySelector('select[name="dataSource"]');
        if (dataSourceSelect) {
            dataSourceSelect.addEventListener('change', (e) => {
                const manual = form.querySelector('#manual-options');
                const api = form.querySelector('#api-options');
                
                if (e.target.value === 'manual') {
                    manual.style.display = 'block';
                    api.style.display = 'none';
                } else {
                    manual.style.display = 'none';
                    api.style.display = 'block';
                }
                
                StateManager.updateComponent(component.id, { dataSource: e.target.value });
            });
        }

        // Add option button
        const btnAddOption = form.querySelector('#btn-add-option');
        if (btnAddOption) {
            btnAddOption.addEventListener('click', () => {
                this.addOption(component);
            });
        }

        // Add header button
        const btnAddHeader = form.querySelector('#btn-add-header');
        if (btnAddHeader) {
            btnAddHeader.addEventListener('click', () => {
                this.addHeader(component);
            });
        }

        // Test API button
        const btnTestApi = form.querySelector('#btn-test-api');
        if (btnTestApi) {
            btnTestApi.addEventListener('click', () => {
                this.testApi(component);
            });
        }

        // Property picker buttons
        const btnPickLabelKey = form.querySelector('#btn-pick-label-key');
        const btnPickValueKey = form.querySelector('#btn-pick-value-key');
        
        if (btnPickLabelKey) {
            btnPickLabelKey.addEventListener('click', () => {
                this.showPropertyPicker('apiLabelKey', 'Label Key');
            });
        }
        
        if (btnPickValueKey) {
            btnPickValueKey.addEventListener('click', () => {
                this.showPropertyPicker('apiValueKey', 'Value Key');
            });
        }

        // Remove buttons
        form.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="remove-option"]')) {
                const optionGroup = e.target.closest('[data-option-index]');
                const index = parseInt(optionGroup.getAttribute('data-option-index'));
                this.removeOption(component, index);
            }
            
            if (e.target.closest('[data-action="remove-header"]')) {
                const headerGroup = e.target.closest('[data-header-index]');
                const index = parseInt(headerGroup.getAttribute('data-header-index'));
                this.removeHeader(component, index);
            }
        });

        // Update options on input
        form.addEventListener('input', (e) => {
            if (e.target.hasAttribute('data-field')) {
                const parent = e.target.closest('[data-option-index]');
                if (parent) {
                    this.updateOptions(component);
                }
                
                const headerParent = e.target.closest('[data-header-index]');
                if (headerParent) {
                    this.updateHeaders(component);
                }
            }
        });
    }

    addOption(component) {
        const options = [...(component.properties.options || [])];
        options.push({ label: 'New Option', value: 'new_option' });
        StateManager.updateComponent(component.id, { options });
        
        // Re-render to show new option
        this.render(component);
    }

    removeOption(component, index) {
        const options = [...(component.properties.options || [])];
        options.splice(index, 1);
        StateManager.updateComponent(component.id, { options });
        
        // Re-render
        this.render(component);
    }

    updateOptions(component) {
        const optionsList = this.panel.querySelector('#options-list');
        if (!optionsList) return;
        
        const optionGroups = optionsList.querySelectorAll('[data-option-index]');
        
        const options = [];
        optionGroups.forEach(group => {
            const labelInput = group.querySelector('[data-field="label"]');
            const valueInput = group.querySelector('[data-field="value"]');
            
            options.push({
                label: labelInput.value,
                value: valueInput.value
            });
        });
        
        StateManager.updateComponent(component.id, { options });
    }

    addHeader(component) {
        const headers = [...(component.properties.apiHeaders || [])];
        headers.push({ key: '', value: '' });
        StateManager.updateComponent(component.id, { apiHeaders: headers });
        
        // Re-render
        this.render(component);
    }

    removeHeader(component, index) {
        const headers = [...(component.properties.apiHeaders || [])];
        headers.splice(index, 1);
        StateManager.updateComponent(component.id, { apiHeaders: headers });
        
        // Re-render
        this.render(component);
    }

    updateHeaders(component) {
        const headersList = this.panel.querySelector('#headers-list');
        if (!headersList) return;
        
        const headerGroups = headersList.querySelectorAll('[data-header-index]');
        
        const headers = [];
        headerGroups.forEach(group => {
            const keyInput = group.querySelector('[data-field="key"]');
            const valueInput = group.querySelector('[data-field="value"]');
            
            if (keyInput.value || valueInput.value) {
                headers.push({
                    key: keyInput.value,
                    value: valueInput.value
                });
            }
        });
        
        StateManager.updateComponent(component.id, { apiHeaders: headers });
    }

    async testApi(component) {
        const url = component.properties.apiUrl;
        const method = component.properties.apiMethod || 'GET';
        const headers = component.properties.apiHeaders || [];

        if (!url) {
            alert('Please enter an API URL');
            return;
        }

        // Show loading state
        const btnTest = this.panel.querySelector('#btn-test-api');
        const originalText = btnTest.innerHTML;
        btnTest.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Testing...';
        btnTest.disabled = true;

        try {
            const result = await testApiEndpoint(url, method, headers);
            
            if (result.success) {
                // Extract array from response
                const arrayData = extractArrayFromResponse(result.data, component.properties.apiResponsePath);
                
                if (arrayData && arrayData.length > 0) {
                    this.lastApiData = arrayData;
                    const properties = extractPropertiesFromFirstItem(arrayData);
                    this.showApiTestResults(result, arrayData, properties);
                    
                    // Enable property picker buttons
                    const btnPickLabel = this.panel.querySelector('#btn-pick-label-key');
                    const btnPickValue = this.panel.querySelector('#btn-pick-value-key');
                    if (btnPickLabel) btnPickLabel.disabled = false;
                    if (btnPickValue) btnPickValue.disabled = false;
                } else {
                    throw new Error('No array found in response. Try setting a Response Path.');
                }
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showApiTestError(error.message);
        } finally {
            btnTest.innerHTML = originalText;
            btnTest.disabled = false;
        }
    }

    showApiTestResults(result, arrayData, properties) {
        const statusDiv = document.getElementById('api-test-status');
        const dataDiv = document.getElementById('api-test-data');
        const keysDiv = document.getElementById('api-available-keys');

        statusDiv.innerHTML = `
            <div class="alert alert-success mb-0">
                <i class="bi bi-check-circle"></i> API Test Successful (Status: ${result.status})
            </div>
        `;

        dataDiv.innerHTML = `
            <div>
                <strong>Found ${arrayData.length} items</strong>
                <pre class="bg-light p-2 rounded mt-2 small"><code>${JSON.stringify(arrayData[0], null, 2)}</code></pre>
            </div>
        `;

        keysDiv.innerHTML = `
            <div class="card">
                <div class="card-header py-2">
                    <strong class="small">Available Properties</strong>
                </div>
                <div class="card-body">
                    <div class="d-flex flex-wrap gap-2">
                        ${properties.map(prop => `<span class="badge bg-primary">${prop}</span>`).join('')}
                    </div>
                    <div class="alert alert-info mt-3 mb-0 small">
                        <i class="bi bi-info-circle"></i> Close this window and click the "Pick" buttons to select Label Key and Value Key from these properties.
                    </div>
                </div>
            </div>
        `;

        this.apiTestModal.show();
    }

    showApiTestError(errorMessage) {
        const statusDiv = document.getElementById('api-test-status');
        const dataDiv = document.getElementById('api-test-data');
        const keysDiv = document.getElementById('api-available-keys');

        statusDiv.innerHTML = `
            <div class="alert alert-danger mb-0">
                <i class="bi bi-x-circle"></i> API Test Failed
            </div>
        `;

        dataDiv.innerHTML = `
            <div class="alert alert-warning mb-0">
                <strong>Error:</strong> ${errorMessage}
            </div>
        `;

        keysDiv.innerHTML = '';

        this.apiTestModal.show();
    }

    showPropertyPicker(fieldName, fieldLabel) {
        if (!this.lastApiData || this.lastApiData.length === 0) {
            alert('Please test the API first to see available properties');
            return;
        }

        this.currentPickerField = fieldName;
        
        const properties = extractPropertiesFromFirstItem(this.lastApiData);
        const instructionEl = document.getElementById('picker-instruction');
        const listEl = document.getElementById('property-picker-list');

        instructionEl.textContent = `Select which property to use for ${fieldLabel}:`;
        
        listEl.innerHTML = properties.map(prop => `
            <button type="button" class="list-group-item list-group-item-action" data-property="${prop}">
                <strong>${prop}</strong>
                <br>
                <small class="text-muted">Example: ${this.lastApiData[0][prop]}</small>
            </button>
        `).join('');

        // Add click listeners
        listEl.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const property = btn.getAttribute('data-property');
                this.selectProperty(property);
            });
        });

        this.propertyPickerModal.show();
    }

    selectProperty(property) {
        if (!this.currentComponent || !this.currentPickerField) return;

        // Update the field
        StateManager.updateComponent(this.currentComponent.id, {
            [this.currentPickerField]: property
        });

        // Update the input field in the UI
        const input = this.panel.querySelector(`input[name="${this.currentPickerField}"]`);
        if (input) {
            input.value = property;
        }

        this.propertyPickerModal.hide();
        
        // Show success toast
        this.showToast(`${this.currentPickerField === 'apiLabelKey' ? 'Label' : 'Value'} Key set to: ${property}`, 'success');
    }

    showToast(message, type = 'info') {
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

    renderEmpty() {
        this.panel.innerHTML = `
            <div class="text-center text-muted py-5">
                <i class="bi bi-gear display-4 opacity-25"></i>
                <p class="mt-3 small">Select a component to edit its properties</p>
            </div>
        `;
    }
}

export default PropertiesPanel;
