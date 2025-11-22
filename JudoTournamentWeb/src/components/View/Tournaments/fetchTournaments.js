// api/tournaments.js

/**
 * Получение списка турниров
 * @returns {Promise<Object>} - Результат операции
 */
export const fetchTournaments = async () => {
    try {
        const response = await fetch('http://127.0.0.1:5001/tournaments/', {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mobile_app_2024'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return { success: true, data: result };

    } catch (error) {
        console.error('Ошибка при загрузке турниров:', error);
        return {
            success: false,
            error: error.message || 'Произошла неизвестная ошибка'
        };
    }
}