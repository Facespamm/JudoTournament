import { useAuthStore } from "@/components/stores/authStore";

// @/components/View/Tournaments/fetchTournamentDetail.js
export const fetchTournamentDetail = async (id) => {
    try {
        const response = await fetch(`/api/tournaments/${id}`);

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

export const updateTournamentDetail = async (id, tournamentData) => {
    try {
        const response = await fetch(`/api/tournaments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mobile_app_2024'
            },
            body: JSON.stringify(tournamentData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || errorData.detail || `HTTP error! status: ${response.status}`
            );
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error updating tournament details:', error);
        return { success: false, error: error.message };
    }
};

export const fetchCategoriesById = async (categoryId) => {
    try {
        const response = await fetch(`/api/tournaments/${categoryId}/categories`, {
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

const getAuthHeaders = () => {
    const authStore = useAuthStore();
    const token = authStore.token;

    return {
        "Content-Type": "application/json",
        "X-API-Key": "mobile_app_2024",
        Authorization: `Bearer ${token}`,
    };
};

export const fetchTournamentCategoriesForAssign = async (tournamentId) => {
    try {
        const response = await fetch(
            `/api/tournaments/${tournamentId}/categories-for-assignt`,
            {
                method: "GET",
                headers: getAuthHeaders(),
            },
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                    errorData.detail ||
                    `HTTP error! status: ${response.status}`,
            );
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching tournament categories for assign:", error);
        return { success: false, error: error.message };
    }
};

export const addCategoryToTournament = async (
    tournamentId,
    categoryId,
    hasConsolation = false,
) => {
    try {
        const params = new URLSearchParams({
            category_id: String(categoryId),
            has_consolation: String(Boolean(hasConsolation)),
        });

        const response = await fetch(
            `/api/tournaments/${tournamentId}/add-category?${params.toString()}`,
            {
                method: "POST",
                headers: getAuthHeaders(),
            },
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                    errorData.detail ||
                    `HTTP error! status: ${response.status}`,
            );
        }

        const data = await response.json().catch(() => ({}));
        return { success: true, data };
    } catch (error) {
        console.error("Error adding category to tournament:", error);
        return { success: false, error: error.message };
    }
};

export const removeCategoryFromTournament = async (tournamentId, categoryId) => {
    try {
        const response = await fetch(
            `/api/tournaments/${tournamentId}/remove-category/${categoryId}`,
            {
                method: "DELETE",
                headers: getAuthHeaders(),
            },
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                    errorData.detail ||
                    `HTTP error! status: ${response.status}`,
            );
        }

        const data = await response.json().catch(() => ({}));
        return { success: true, data };
    } catch (error) {
        console.error("Error removing category from tournament:", error);
        return { success: false, error: error.message };
    }
};

export const fetchTournamentAthletesForAssign = async ({
    tournamentId,
    clubId,
    search,
    page = 1,
    perPage = 50,
} = {}) => {
    try {
        const params = new URLSearchParams({
            page_size: String(page),
            per_page: String(perPage),
        });

        if (tournamentId) params.set("tournament_id", String(tournamentId));
        if (clubId) params.set("club_id", String(clubId));
        if (search) {
            params.set("search_name", search);
            params.set("search", search);
        }

        const response = await fetch(`/api/athletes/?${params.toString()}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                    errorData.detail ||
                    `HTTP error! status: ${response.status}`,
            );
        }

        const data = await response.json();
        return { success: true, athletes: data.athletes || data || [] };
    } catch (error) {
        console.error("Error fetching tournament athletes for assign:", error);
        return { success: false, error: error.message, athletes: [] };
    }
};

export const addClubToTournamentUpdate = async (tournamentId, clubId = null) => {
    try {
        const params = new URLSearchParams();
        if (clubId) params.set("club_id", String(clubId));

        const response = await fetch(
            `/api/tournaments/${tournamentId}/add-club?${params.toString()}`,
            {
                method: "POST",
                headers: getAuthHeaders(),
            },
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                    errorData.detail ||
                    `HTTP error! status: ${response.status}`,
            );
        }

        const data = await response.json().catch(() => ({}));
        return { success: true, data };
    } catch (error) {
        console.error("Error adding club to tournament:", error);
        return { success: false, error: error.message };
    }
};

export const removeClubFromTournamentUpdate = async (tournamentId, clubId) => {
    try {
        const response = await fetch(
            `/api/tournaments/${tournamentId}/remove-club/${clubId}`,
            {
                method: "DELETE",
                headers: getAuthHeaders(),
            },
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                    errorData.detail ||
                    `HTTP error! status: ${response.status}`,
            );
        }

        const data = await response.json().catch(() => ({}));
        return { success: true, data };
    } catch (error) {
        console.error("Error removing club from tournament:", error);
        return { success: false, error: error.message };
    }
};

export const addAthletesToTournamentUpdate = async (tournamentId, athleteIds) => {
    try {
        const response = await fetch(`/api/tournaments/${tournamentId}/add-athletes`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ athlete_ids: athleteIds }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                    errorData.detail ||
                    `HTTP error! status: ${response.status}`,
            );
        }

        const data = await response.json().catch(() => ({}));
        return { success: true, data };
    } catch (error) {
        console.error("Error adding athletes to tournament:", error);
        return { success: false, error: error.message };
    }
};

export const removeAthleteFromTournamentUpdate = async (tournamentId, athleteId) => {
    try {
        const response = await fetch(
            `/api/tournaments/${tournamentId}/remove-athlete/${athleteId}`,
            {
                method: "DELETE",
                headers: getAuthHeaders(),
            },
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                    errorData.detail ||
                    `HTTP error! status: ${response.status}`,
            );
        }

        const data = await response.json().catch(() => ({}));
        return { success: true, data };
    } catch (error) {
        console.error("Error removing athlete from tournament:", error);
        return { success: false, error: error.message };
    }
};


