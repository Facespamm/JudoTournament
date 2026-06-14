import { useAuthStore } from "@/components/stores/authStore";

export async function getReferees() {
  try {
    const authStore = useAuthStore();
    const token = authStore.token;
    const response = await fetch("/api/referee/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || `HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      referees: data.referees || [],
      total: data.count_referees || 0,
    };
  } catch (err) {
    console.error("Ошибка загрузки судей:", err);
    return {
      success: false,
      referees: [], // добавьте пустой массив
      total: 0, // и общее количество
      error: err.message || null,
    };
  }
}
