const createTournament = async (tournamentData) => {
    try {
        // Подготавливаем данные в нужном формате
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
        };

        const response = await fetch('http://127.0.0.1:5000/api/tournaments/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Добавьте другие необходимые заголовки, например, авторизацию
                // 'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return { success: true, data: result };

    } catch (error) {
        console.error('Ошибка при создании турнира:', error);
        return {
            success: false,
            error: error.message || 'Произошла неизвестная ошибка'
        };
    }
}