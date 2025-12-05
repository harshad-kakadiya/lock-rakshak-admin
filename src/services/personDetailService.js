const BASE_URL = 'https://life-line-be.onrender.com/api/personal-detail';

const handleResponse = async (response) => {
    if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Unable to process person detail request';
        try {
            const data = await response.json();
            errorMessage = data?.message || errorMessage;
        } catch (e) {
            // If response is not JSON, use status text
            errorMessage = response.statusText || `HTTP ${response.status} Error`;
        }
        
        // Provide more specific error messages
        if (response.status === 404) {
            errorMessage = 'API endpoint not found. Please check if the backend endpoint is configured correctly.';
        } else if (response.status === 500) {
            errorMessage = 'Server error. Please try again later.';
        }
        
        throw new Error(errorMessage);
    }
    const data = await response.json().catch(() => ({}));
    return data;
};

// Normalize API response to match component expectations
const normalizePersonDetail = (item) => {
    if (!item) return item;
    return {
        ...item,
        id: item._id || item.id,
        phone: item.phone || '',
        address: item.address || '',
        email: item.email || '',
    };
};

export const personDetailService = {
    // Get all person details
    async getAll() {
        const response = await fetch(BASE_URL, {
            cache: 'no-store',
            headers: { Accept: 'application/json' },
        });
        const data = await handleResponse(response);
        // Handle both array response and wrapped response
        const items = Array.isArray(data) ? data : (data?.data ?? []);
        return items.map(normalizePersonDetail);
    },

    // Get person detail by ID
    async getById(id) {
        if (!id) {
            throw new Error('Person detail id is required');
        }
        const response = await fetch(`${BASE_URL}/${id}`, {
            headers: { Accept: 'application/json' },
        });
        const data = await handleResponse(response);
        return normalizePersonDetail(data?.data || data);
    },

    // Create new person detail
    async create(personData) {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                phone: personData.phone || '',
                address: personData.address || '',
                email: personData.email || '',
            }),
        });
        const data = await handleResponse(response);
        return normalizePersonDetail(data?.data || data);
    },

    // Update person detail
    async update(id, personData) {
        if (!id) {
            throw new Error('Person detail id is required');
        }

        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                phone: personData.phone || '',
                address: personData.address || '',
                email: personData.email || '',
            }),
        });
        const data = await handleResponse(response);
        return normalizePersonDetail(data?.data || data);
    },

    // Delete person detail
    async delete(id) {
        if (!id) {
            throw new Error('Person detail id is required');
        }
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: { Accept: 'application/json' },
        });
        return handleResponse(response);
    },
};

