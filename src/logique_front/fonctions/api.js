/**
 * @param {string} url 
 * @param {string} method 
 * @param {object} headers 
 * @param {object} body (optionnel)
 */
export default async function apiRequest(url, method, headers = {}, body = null) {
    try {
        const options = {
            method: method,
            headers: { ...headers }
        };

        if (body) {
            options.body = JSON.stringify(body);
            options.credentials = 'include';
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (method === 'GET') {
            return data
        }

        return {
            success: true,
            status: response.status,
            dataResponse: data,
            headers: response.headers
        };

    } catch (error) {
        console.error('API Request failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}