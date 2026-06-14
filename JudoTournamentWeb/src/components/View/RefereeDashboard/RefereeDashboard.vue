<template>
    <div class="referee-dashboard">
        <!-- ЗАГОЛОВОК -->
        <div class="dashboard-header">
            <h1>{{ t("refereeDashboard.title") }}</h1>
            <p>{{ t("refereeDashboard.subtitle") }}</p>
        </div>

        <!-- СТАТИСТИКА -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon active">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
                <div class="stat-info">
                    <div class="stat-number">
                        {{ stats.active_tournaments || 0 }}
                    </div>
                    <div class="stat-label">
                        {{ t("refereeDashboard.activeTournamentsCount") }}
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon athletes">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
                <div class="stat-info">
                    <div class="stat-number">
                        {{ stats.unique_athletes || 0 }}
                    </div>
                    <div class="stat-label">
                        {{ t("refereeDashboard.participants") }}
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon live">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 2C10.89 2 10 2.89 10 4V6.76L8.41 8.35C7.91 8.85 7.91 9.66 8.41 10.15L10.59 12.33L8.41 14.51C7.91 15 7.91 15.82 8.41 16.31L10 17.9V20C10 21.11 10.89 22 12 22C13.11 22 14 21.11 14 20V17.9L15.59 16.31C16.09 15.82 16.09 15 15.59 14.51L13.41 12.33L15.59 10.15C16.09 9.66 16.09 8.85 15.59 8.35L14 6.76V4C14 2.89 13.11 2 12 2Z"
                            fill="currentColor"
                        />
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                    </svg>
                </div>
                <div class="stat-info">
                    <div class="stat-number">{{ stats.live_fights || 0 }}</div>
                    <div class="stat-label">
                        {{ t("refereeDashboard.liveFights") }}
                    </div>
                </div>
            </div>
        </div>

        <!-- БЫСТРЫЕ ДЕЙСТВИЯ -->
        <div class="quick-actions-section">
            <h2>{{ t("refereeDashboard.quickActions") }}</h2>
            <div class="actions-grid">
                <button class="action-btn" @click="navigateToBrackets">
                    <span class="action-icon brackets">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z"
                                fill="currentColor"
                            />
                            <path
                                d="M3 3V21H5V19H3V5H5V3H3ZM19 3V5H21V19H19V21H21V3H19Z"
                                fill="currentColor"
                            />
                        </svg>
                    </span>
                    <span class="action-text">{{
                        t("refereeDashboard.brackets")
                    }}</span>
                </button>

                <button class="action-btn" @click="navigateToTatami">
                    <span class="action-icon tatami">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                            />
                            <circle
                                cx="12"
                                cy="12"
                                r="6"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                            />
                            <circle cx="12" cy="12" r="2" fill="currentColor" />
                            <path
                                d="M12 2V6M12 18V22M22 12H18M6 12H2"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                            />
                        </svg>
                    </span>
                    <span class="action-text">{{
                        t("refereeDashboard.tatami")
                    }}</span>
                </button>

                <button class="action-btn" @click="navigateToReferees">
                    <span class="action-icon referees">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                                fill="currentColor"
                            />
                            <path
                                d="M17 8L19 10L23 6"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </span>
                    <span class="action-text">{{
                        t("refereeDashboard.referees")
                    }}</span>
                </button>
            </div>
        </div>
        <!-- TOAST УВЕДОМЛЕНИЕ -->
        <transition name="fade">
            <div
                v-if="toast.visible"
                class="toast-notification"
                :class="toast.type"
            >
                <div class="toast-content">
                    <span class="toast-icon">{{
                        toast.type === "success" ? "✓" : "✕"
                    }}</span>
                    <span class="toast-message">{{ toast.message }}</span>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "@/i18n";
import "./RefereeDashboard.css";
import {
    GetRefereeStatistics,
    GetLiveTournamentReferee,
} from "@/components/View/RefereeDashboard/fetchRefereeDashboard.js";

const router = useRouter();
const { t } = useI18n();

const stats = ref({});
const activeTournaments = ref([]);

const toast = ref({
    visible: false,
    message: "",
    type: "success",
});

const showToast = (
    message,
    type = "success",
    duration = type === "success" ? 3000 : 5000,
) => {
    toast.value = { visible: true, message, type };
    setTimeout(() => {
        toast.value.visible = false;
    }, duration);
};

const loadDashboardData = async () => {
    try {
        const statsData = await GetRefereeStatistics();
        if (statsData?.success && statsData?.data) {
            stats.value = statsData.data;
        } else {
            showToast(t("refereeDashboard.statsLoadFailed"), "error");
            stats.value = {};
        }

        const tournamentsData = await GetLiveTournamentReferee();
        if (tournamentsData?.success) {
            activeTournaments.value = Array.isArray(tournamentsData.data)
                ? tournamentsData.data
                : tournamentsData.data?.tournaments ||
                  tournamentsData.data?.active_tournaments ||
                  [];
        } else {
            showToast(t("refereeDashboard.tournamentsLoadFailed"), "error");
            activeTournaments.value = [];
        }
    } catch (error) {
        console.error("Ошибка загрузки данных панели судьи:", error);
        showToast(t("refereeDashboard.dashboardLoadFailed"), "error");
        stats.value = {};
        activeTournaments.value = [];
    }
};

const getStatusClass = (status) => {
    const statusMap = {
        LIVE: "status-live",
        BRACKETS: "status-brackets",
        REGISTRATION: "status-registration",
        WEIGHING: "status-weighing",
    };
    return statusMap[status] || "status-default";
};

const getStatusText = (status) => {
    const statusMap = {
        LIVE: "LIVE",
        BRACKETS: t("refereeDashboard.statusBrackets"),
        REGISTRATION: t("refereeDashboard.statusRegistration"),
        WEIGHING: t("refereeDashboard.statusWeighing"),
    };
    return statusMap[status] || status;
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(
        t("refereeDashboard.dateLocale"),
    );
};

const navigateToBrackets = () => router.push("/brackets");
const navigateToTatami = () => router.push("/tatami");
const navigateToTournaments = () => router.push("/tournament");
const navigateToTournament = (id) => router.push(`/tournament/${id}`);
const navigateToReferees = () => router.push("/referee");

onMounted(() => {
    loadDashboardData();
});
</script>

<style scoped>
.stat-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    transition: all 0.3s ease;
}

.stat-icon svg {
    width: 28px;
    height: 28px;
}

.stat-icon.active {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
    color: #fff;
    box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
}

.stat-icon.athletes {
    background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
    color: #fff;
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.stat-icon.live {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    color: #fff;
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%,
    100% {
        box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
    }
    50% {
        box-shadow: 0 4px 20px rgba(231, 76, 60, 0.5);
    }
}

.action-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    transition: all 0.3s ease;
    margin-bottom: 12px;
}

.action-icon svg {
    width: 24px;
    height: 24px;
}

.action-icon.brackets {
    background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
    color: #fff;
}

.action-icon.tatami {
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    color: #fff;
}

.action-icon.tournaments {
    background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
    color: #fff;
}

.action-icon.referees {
    background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
    color: #fff;
}

.action-btn:hover .action-icon {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.stat-card:hover .stat-icon {
    transform: scale(1.1) rotate(5deg);
}
</style>
