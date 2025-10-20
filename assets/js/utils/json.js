/**
 * JSON Import/Export Utilities
 */

export function exportToJSON(formData) {
    try {
        return JSON.stringify(formData, null, 2);
    } catch (error) {
        console.error('Error exporting to JSON:', error);
        throw new Error('Failed to export form data to JSON');
    }
}

export function importFromJSON(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        validateFormJSON(data);
        return data;
    } catch (error) {
        console.error('Error importing JSON:', error);
        throw new Error('Invalid JSON format');
    }
}

export function validateFormJSON(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid form data structure');
    }
    
    if (!data.formId || !data.components || !Array.isArray(data.components)) {
        throw new Error('Missing required fields: formId or components array');
    }
    
    return true;
}

export function downloadJSON(jsonString, filename = 'form.json') {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

export function copyToClipboard(text) {
    return navigator.clipboard.writeText(text).then(() => {
        return true;
    }).catch((error) => {
        console.error('Failed to copy:', error);
        return false;
    });
}
