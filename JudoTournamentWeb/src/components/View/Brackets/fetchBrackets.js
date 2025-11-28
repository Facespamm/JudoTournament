export const createBracket = async (categoryData) => {
    try {
        const response = await fetch(`http://127.0.0.1:5001/api/brackets/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mobile_app_2024'
            },
            body: JSON.stringify(categoryData)
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

export const fetchBrackets = async () => {
    try {
        const response = await fetch('http://127.0.0.1:5001/api/brackets/')

        if (!response.ok) {
            const err = await response.json()
            throw new Error(err.message || `HTTP ${response.status}`)
        }

        const data = await response.json()
        return { success: true, brackets: data.brackets || [], total: data.total || 0 }
    } catch (error) {
        console.error('Ошибка загрузки спортсменов:', error)
        return { success: false, error: error.message || 'Неизвестная ошибка' }
    }
}


export const fetchBracketDetail = async (id) => {
    try {
        const response = await fetch(`http://127.0.0.1:5001/api/brackets/${id}/fights
`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // ДЛЯ ОТЛАДКИ - выведем что приходит с сервера
        console.log('Tournament detail response:', data);

        return data;
    } catch (error) {
        console.error('Error fetching tournament details:', error);
        throw error;
    }
};

export const createFight = async (bracketFightData, id) => {
    try {
        const response = await fetch(`http://127.0.0.1:5001/api/brackets/${id}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mobile_app_2024'
            },
            body: JSON.stringify(bracketFightData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при создании боя');
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('Ошибка при создании боев:', error);
        return { success: false, error: error.message };
    }
};