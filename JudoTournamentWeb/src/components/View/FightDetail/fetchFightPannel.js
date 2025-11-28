export const startFight = async (data,id) => {
    try {
        const response = await fetch(`http://127.0.0.1:5001/fights/${id}/start
`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mobile_app_2024'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при создании категории');
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('Ошибка при создании категории:', error);
        return { success: false, error: error.message };
    }
};

export const pauseFight = async (data) => {
    try {
        const response = await fetch(`http://127.0.0.1:5001/fights/3/pause`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mobile_app_2024'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при создании категории');
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('Ошибка при создании категории:', error);
        return { success: false, error: error.message };
    }
};

export const endFight = async (data,id) => {
    try {
        const response = await fetch(`http://127.0.0.1:5001/fights/${id}/finish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mobile_app_2024'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при создании категории');
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('Ошибка при создании категории:', error);
        return { success: false, error: error.message };
    }
};

export const resultFight = async (data) => {
    try {
        const response = await fetch(`http://127.0.0.1:5001/results/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mobile_app_2024'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при создании категории');
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('Ошибка при создании категории:', error);
        return { success: false, error: error.message };
    }
};
