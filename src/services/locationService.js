const BASE_URL = 'https://life-line-be.onrender.com/api/location';

const handleResponse = async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const message = data?.message || 'Unable to process location request';
        throw new Error(message);
    }
    return data;
};

export const locationService = {
    async getAll() {
        const response = await fetch(BASE_URL, {
            cache: 'no-store',
            headers: { Accept: 'application/json' },
        });
        const data = await handleResponse(response);
        return data?.data ?? [];
    },

    async create(locationData) {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                link: locationData.link,
            }),
        });
        return handleResponse(response);
    },

    async update(id, locationData) {
        if (!id) {
            throw new Error('Location id is required');
        }

        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                link: locationData.link,
            }),
        });
        return handleResponse(response);
    },

    async delete(id) {
        if (!id) {
            throw new Error('Location id is required');
        }
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: { Accept: 'application/json' },
        });
        return handleResponse(response);
    },
};
