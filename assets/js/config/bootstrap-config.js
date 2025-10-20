/**
 * Bootstrap Configuration
 * Available Bootstrap classes and options
 */

export const COLUMN_OPTIONS = [
    { value: 'col-12', label: 'Full Width (12 columns)' },
    { value: 'col-md-6', label: 'Half Width (6 columns)' },
    { value: 'col-md-4', label: 'One Third (4 columns)' },
    { value: 'col-md-3', label: 'One Quarter (3 columns)' },
    { value: 'col-md-8', label: 'Two Thirds (8 columns)' },
    { value: 'col-md-9', label: 'Three Quarters (9 columns)' }
];

export const SPACING_OPTIONS = [
    { value: '', label: 'None' },
    { value: 'mb-1', label: 'Small' },
    { value: 'mb-2', label: 'Small-Medium' },
    { value: 'mb-3', label: 'Medium (Default)' },
    { value: 'mb-4', label: 'Large' },
    { value: 'mb-5', label: 'Extra Large' }
];

export const TEXT_ALIGN_OPTIONS = [
    { value: 'text-start', label: 'Left' },
    { value: 'text-center', label: 'Center' },
    { value: 'text-end', label: 'Right' }
];

export const INPUT_SIZE_OPTIONS = [
    { value: 'form-control-sm', label: 'Small' },
    { value: 'form-control', label: 'Default' },
    { value: 'form-control-lg', label: 'Large' }
];

export const BUTTON_VARIANTS = [
    { value: 'btn-primary', label: 'Primary' },
    { value: 'btn-secondary', label: 'Secondary' },
    { value: 'btn-success', label: 'Success' },
    { value: 'btn-danger', label: 'Danger' },
    { value: 'btn-warning', label: 'Warning' },
    { value: 'btn-info', label: 'Info' },
    { value: 'btn-light', label: 'Light' },
    { value: 'btn-dark', label: 'Dark' },
    { value: 'btn-outline-primary', label: 'Outline Primary' },
    { value: 'btn-outline-secondary', label: 'Outline Secondary' }
];

export const DEFAULT_CLASSES = {
    formControl: 'form-control',
    formLabel: 'form-label',
    formCheck: 'form-check-input',
    formCheckLabel: 'form-check-label',
    formSelect: 'form-select',
    formText: 'form-text',
    wrapper: 'mb-3'
};
