/**
 * Component Definitions Configuration
 */

export const COMPONENT_DEFINITIONS = {
    // Form Fields
    text: {
        type: 'text',
        label: 'Text Input',
        icon: 'bi-input-cursor-text',
        category: 'form-fields',
        defaultProperties: {
            label: 'Text Field',
            name: 'textField',
            placeholder: '',
            required: false,
            columnClass: 'col-12',
            wrapperClass: 'mb-3',
            inputClass: 'form-control',
            labelClass: 'form-label'
        }
    },
    
    email: {
        type: 'email',
        label: 'Email Input',
        icon: 'bi-envelope',
        category: 'form-fields',
        defaultProperties: {
            label: 'Email',
            name: 'email',
            placeholder: 'email@example.com',
            required: false,
            columnClass: 'col-12',
            wrapperClass: 'mb-3',
            inputClass: 'form-control',
            labelClass: 'form-label'
        }
    },
    
    number: {
        type: 'number',
        label: 'Number Input',
        icon: 'bi-123',
        category: 'form-fields',
        defaultProperties: {
            label: 'Number',
            name: 'number',
            placeholder: '',
            required: false,
            min: '',
            max: '',
            step: '1',
            columnClass: 'col-12',
            wrapperClass: 'mb-3',
            inputClass: 'form-control',
            labelClass: 'form-label'
        }
    },
    
    tel: {
        type: 'tel',
        label: 'Phone Input',
        icon: 'bi-telephone',
        category: 'form-fields',
        defaultProperties: {
            label: 'Phone Number',
            name: 'phone',
            placeholder: '',
            required: false,
            columnClass: 'col-12',
            wrapperClass: 'mb-3',
            inputClass: 'form-control',
            labelClass: 'form-label'
        }
    },
    
    date: {
        type: 'date',
        label: 'Date Input',
        icon: 'bi-calendar',
        category: 'form-fields',
        defaultProperties: {
            label: 'Date',
            name: 'date',
            required: false,
            columnClass: 'col-12',
            wrapperClass: 'mb-3',
            inputClass: 'form-control',
            labelClass: 'form-label'
        }
    },
    
    textarea: {
        type: 'textarea',
        label: 'Text Area',
        icon: 'bi-textarea-t',
        category: 'form-fields',
        defaultProperties: {
            label: 'Message',
            name: 'message',
            placeholder: '',
            required: false,
            rows: 3,
            columnClass: 'col-12',
            wrapperClass: 'mb-3',
            inputClass: 'form-control',
            labelClass: 'form-label'
        }
    },
    
    select: {
        type: 'select',
        label: 'Select Dropdown',
        icon: 'bi-ui-checks',
        category: 'form-fields',
        defaultProperties: {
            label: 'Select Option',
            name: 'select',
            required: false,
            options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' }
            ],
            dataSource: 'manual', // 'manual' or 'api'
            apiUrl: '',
            apiMethod: 'GET', // 'GET' or 'POST'
            apiHeaders: [], // Array of {key: '', value: ''}
            apiLabelKey: 'label',
            apiValueKey: 'value',
            apiResponsePath: '', // Optional: path to array in response (e.g., 'data.items')
            columnClass: 'col-12',
            wrapperClass: 'mb-3',
            inputClass: 'form-select',
            labelClass: 'form-label'
        }
    },
    
    checkbox: {
        type: 'checkbox',
        label: 'Checkbox',
        icon: 'bi-check-square',
        category: 'form-fields',
        defaultProperties: {
            label: 'Checkbox Label',
            name: 'checkbox',
            checked: false,
            columnClass: 'col-12',
            wrapperClass: 'mb-3 form-check',
            inputClass: 'form-check-input',
            labelClass: 'form-check-label'
        }
    },
    
    radio: {
        type: 'radio',
        label: 'Radio Group',
        icon: 'bi-ui-radios',
        category: 'form-fields',
        defaultProperties: {
            label: 'Radio Group',
            name: 'radioGroup',
            options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' }
            ],
            dataSource: 'manual', // 'manual' or 'api'
            apiUrl: '',
            apiMethod: 'GET', // 'GET' or 'POST'
            apiHeaders: [], // Array of {key: '', value: ''}
            apiLabelKey: 'label',
            apiValueKey: 'value',
            apiResponsePath: '', // Optional: path to array in response
            columnClass: 'col-12',
            wrapperClass: 'mb-3',
            labelClass: 'form-label'
        }
    },
    
    // Typography
    h1: {
        type: 'h1',
        label: 'Heading 1',
        icon: 'bi-type-h1',
        category: 'typography',
        defaultProperties: {
            content: 'Heading 1',
            columnClass: 'col-12',
            wrapperClass: 'mb-3',
            textAlign: ''
        }
    },
    
    h2: {
        type: 'h2',
        label: 'Heading 2',
        icon: 'bi-type-h2',
        category: 'typography',
        defaultProperties: {
            content: 'Heading 2',
            columnClass: 'col-12',
            wrapperClass: 'mb-3',
            textAlign: ''
        }
    },
    
    h3: {
        type: 'h3',
        label: 'Heading 3',
        icon: 'bi-type-h3',
        category: 'typography',
        defaultProperties: {
            content: 'Heading 3',
            columnClass: 'col-12',
            wrapperClass: 'mb-3',
            textAlign: ''
        }
    },
    
    h4: {
        type: 'h4',
        label: 'Heading 4',
        icon: 'bi-type',
        category: 'typography',
        defaultProperties: {
            content: 'Heading 4',
            columnClass: 'col-12',
            wrapperClass: 'mb-3',
            textAlign: ''
        }
    },
    
    paragraph: {
        type: 'paragraph',
        label: 'Paragraph',
        icon: 'bi-paragraph',
        category: 'typography',
        defaultProperties: {
            content: 'This is a paragraph text.',
            columnClass: 'col-12',
            wrapperClass: 'mb-3',
            textAlign: ''
        }
    },
    
    // Layout
    separator: {
        type: 'separator',
        label: 'Line Separator',
        icon: 'bi-dash-lg',
        category: 'layout',
        defaultProperties: {
            columnClass: 'col-12',
            wrapperClass: 'my-3'
        }
    }
};

export function getComponentDefinition(type) {
    return COMPONENT_DEFINITIONS[type];
}

export function getComponentsByCategory(category) {
    return Object.values(COMPONENT_DEFINITIONS).filter(
        comp => comp.category === category
    );
}
