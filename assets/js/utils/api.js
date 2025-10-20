/**
 * API Utilities
 * Functions for testing API endpoints and extracting data
 */

// Cache for API responses
const apiCache = new Map();

export async function testApiEndpoint(url, method = 'GET', headers = []) {
    try {
        // Prepare headers
        const headerObj = {};
        headers.forEach(header => {
            if (header.key && header.value) {
                headerObj[header.key] = header.value;
            }
        });

        // Fetch options
        const options = {
            method: method,
            headers: headerObj
        };

        // Make request
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        return {
            success: true,
            data: data,
            status: response.status
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

export async function fetchApiOptions(component) {
    const props = component.properties;
    
    // Check if using API data source
    if (props.dataSource !== 'api' || !props.apiUrl) {
        return null;
    }

    // Create cache key
    const cacheKey = `${props.apiUrl}_${props.apiMethod}_${JSON.stringify(props.apiHeaders)}`;
    
    // Check cache first
    if (apiCache.has(cacheKey)) {
        const cached = apiCache.get(cacheKey);
        return processApiResponse(cached, props);
    }

    try {
        // Fetch from API
        const result = await testApiEndpoint(
            props.apiUrl,
            props.apiMethod || 'GET',
            props.apiHeaders || []
        );

        if (result.success) {
            // Cache the response
            apiCache.set(cacheKey, result.data);
            return processApiResponse(result.data, props);
        }
    } catch (error) {
        console.error('Error fetching API options:', error);
    }

    return null;
}

function processApiResponse(data, props) {
    // Extract array from response
    const arrayData = extractArrayFromResponse(data, props.apiResponsePath);
    
    if (!arrayData || !Array.isArray(arrayData)) {
        return null;
    }

    // Map to options format
    const labelKey = props.apiLabelKey || 'label';
    const valueKey = props.apiValueKey || 'value';

    return arrayData.map(item => ({
        label: getNestedValue(item, labelKey),
        value: getNestedValue(item, valueKey)
    }));
}

function getNestedValue(obj, path) {
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return '';
        }
    }
    
    return value;
}

export function extractArrayFromResponse(data, path = '') {
    // If path is provided, navigate to it
    if (path) {
        const parts = path.split('.');
        let current = data;
        
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                return null;
            }
        }
        
        data = current;
    }

    // Check if data is already an array
    if (Array.isArray(data)) {
        return data;
    }

    // If data is an object, try to find an array property
    if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            if (Array.isArray(data[key])) {
                return data[key];
            }
        }
    }

    return null;
}

export function extractPropertiesFromFirstItem(array) {
    if (!Array.isArray(array) || array.length === 0) {
        return [];
    }

    const firstItem = array[0];
    
    if (typeof firstItem !== 'object' || firstItem === null) {
        return [];
    }

    return Object.keys(firstItem);
}

export function findArrayPath(obj, currentPath = '') {
    // Find the path to the first array in the response
    const paths = [];

    function traverse(current, path) {
        if (Array.isArray(current)) {
            paths.push(path || 'root');
        } else if (typeof current === 'object' && current !== null) {
            for (const key in current) {
                const newPath = path ? `${path}.${key}` : key;
                traverse(current[key], newPath);
            }
        }
    }

    traverse(obj, currentPath);
    return paths;
}

export function getValueByPath(obj, path) {
    if (!path) return obj;
    
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
            current = current[part];
        } else {
            return undefined;
        }
    }
    
    return current;
}

export function clearApiCache() {
    apiCache.clear();
}
