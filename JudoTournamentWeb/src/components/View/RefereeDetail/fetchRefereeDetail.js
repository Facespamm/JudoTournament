import { useAuthStore } from "@/components/stores/authStore";

export const fetchRefereeDetail = async (id) => {
  try {
    const authStore = useAuthStore();
    const token = authStore.token;
    const response = await fetch(`/api/referee/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching athlete details:", error);
    throw error;
  }
};
