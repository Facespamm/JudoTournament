// src/services/tournamentService.js

export const createTournament = async (tournamentData) => {
    try {
        const payload = {
            name: tournamentData.name,
            description: tournamentData.description || "",
            start_date: tournamentData.start_date,
            end_date: tournamentData.end_date,
            venue: tournamentData.venue,
            city: tournamentData.city || "",
            country: tournamentData.country || "Казахстан",
            status: tournamentData.status || "PLANNED",
            tatami_count: tournamentData.tatami_count || 1
        }

        const response = await fetch('http://127.0.0.1:5001/tournaments/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ' + token // раскомментируй когда будет авторизация
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        return { success: true, data: result }

    } catch (error) {
        console.error('Ошибка при создании турнира:', error)
        return { success: false, error: error.message || 'Произошла неизвестная ошибка' }
    }
}

export const createCategory = async (categoryData) => {
    try {
        const response = await fetch(`http://127.0.0.1:5001/categories/`, {
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

export const fetchCategories = async (tournamentId) => {
    try {
        const response = await fetch(`http://127.0.0.1:5001/categories/?tournament_id=${tournamentId}`, {
            headers: {
                'X-API-Key': 'mobile_app_2024'
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка при загрузке категорий');
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
        return { success: false, error: error.message };
    }
};

