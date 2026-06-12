<template>
    <!-- ФИЛЬТРЫ -->
    <div class="judo-tournament-setting_search">
        <select
            v-model="categoryFilter"
            class="judo-tournament-setting_search_select_category"
            name="tournament_filter_category"
        >
            <option value="all">{{ t("tournaments.allCategories") }}</option>
            <option
                v-if="categories.length > 0"
                v-for="cat in categories"
                :key="cat.id"
                :value="cat.id"
            >
                {{ cat.name }} ({{ cat.gender }}, {{ cat.min_age }}–{{
                    cat.max_age
                }}
                {{ t("tournaments.years") }}, {{ cat.min_weight }}–{{
                    cat.max_weight
                }}
                {{ t("tournaments.kg") }})
            </option>
            <option v-else disabled>
                {{ t("tournaments.categoriesLoading") }}
            </option>
        </select>

        <select
            v-model="yearFilter"
            class="judo-tournament-setting_date"
            name="tournament_date"
        >
            <option value="all">{{ t("tournaments.year") }}</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
        </select>

        <input
            v-model="searchQuery"
            type="search"
            name="tournament_search"
            :placeholder="t('tournaments.searchPlaceholder')"
            class="search-input"
        />
    </div>

    <!-- СПИСОК ТУРНИРОВ -->
    <div class="judo-tournament_info">
        <section class="judo-tournament-list">
            <h2>{{ t("tournaments.upcoming") }}</h2>

            <div v-if="isLoading" class="loading-indicator">
                <div class="loading-spinner"></div>
                <p>{{ t("tournaments.loading") }}</p>
            </div>

            <div v-else-if="error" class="error-message">
                <p>{{ error }}</p>
                <button
                    @click="loadTournaments(categoryFilter)"
                    class="retry-button"
                >
                    {{ t("tournaments.retry") }}
                </button>
            </div>

            <div v-else class="tournament-cards-container">
                <article
                    v-for="tournament in visibleTournaments"
                    :key="tournament.id"
                    class="judo-tournament-card"
                    :class="{ live: tournament.status === 'LIVE' }"
                >
                    <div class="judo-tournament_card_info">
                        <div class="tournament-header">
                            <span class="tournament-date-badge">{{
                                formatDate(
                                    tournament.start_date,
                                    tournament.end_date,
                                )
                            }}</span>
                            <span
                                class="tournament-status-badge"
                                :class="getStatusClass(tournament.status)"
                            >
                                {{ getStatusText(tournament.status) }}
                            </span>
                        </div>
                        <h3 class="judo-tournament_card_name">
                            {{ tournament.name }}
                        </h3>
                        <p class="judo-tournament_card_location">
                            {{ getLocation(tournament) }}
                        </p>
                        <div class="tournament-stats">
                            <span class="stat-item">{{
                                t("tournaments.participants", {
                                    count: tournament.athletes_count || 0,
                                })
                            }}</span>
                            <span class="stat-divider">•</span>
                            <span class="stat-item">{{
                                t("tournaments.progress", {
                                    count: tournament.progress_percentage || 0,
                                })
                            }}</span>
                        </div>
                        <div
                            v-if="tournament.description"
                            class="tournament-description"
                        >
                            {{ tournament.description }}
                        </div>

                        <!-- Кнопки действий -->
                        <div class="tournament-actions">
                            <button
                                class="tournament-action-btn tournament-view-details-btn"
                                @click="navigateToDetails(tournament.id)"
                            >
                                {{ t("tournaments.details") }}
                            </button>

                            <!-- Кнопка регистрации — только для Админа, Судьи и Участника -->
                            <template v-if="canSee([ADMIN, REFEREE, ATHLETE])">
                                <button
                                    v-if="!isRegistrationAvailable(tournament)"
                                    class="tournament-action-btn tournament-register-disabled-btn"
                                    disabled
                                >
                                    {{ t("tournaments.registrationClosed") }}
                                </button>

                                <template v-else-if="userRole === ATHLETE">
                                    <!-- Уже зарегистрирован — показать кнопку отмены -->
                                    <button
                                        v-if="registrationMap[tournament.id]"
                                        class="tournament-action-btn tournament-unregister-btn"
                                        @click="
                                            unassignTournament(tournament.id)
                                        "
                                    >
                                        {{ t("tournaments.unregister") }}
                                    </button>

                                    <!-- Не зарегистрирован -->
                                    <button
                                        v-else
                                        class="tournament-action-btn tournament-register-btn"
                                        @click="
                                            isAssignTournament(tournament.id)
                                        "
                                    >
                                        {{ t("tournaments.register") }}
                                    </button>
                                </template>

                                <button
                                    v-else
                                    class="tournament-action-btn tournament-register-btn"
                                    @click="
                                        navigateToRegistration(tournament.id)
                                    "
                                >
                                    {{ t("tournaments.register") }}
                                </button>
                            </template>
                        </div>
                    </div>
                </article>

                <div
                    v-if="visibleTournaments.length === 0 && !isLoading"
                    class="no-tournaments"
                >
                    <p>{{ t("tournaments.empty") }}</p>
                    <small v-if="hasActiveFilters">{{
                        t("tournaments.changeFilters")
                    }}</small>
                </div>
            </div>
        </section>
    </div>

    <!-- ПАГИНАЦИЯ -->
    <div v-if="hasMore" class="judo-tournament_button_pagination">
        <button
            type="button"
            class="judo-tournament_button_pagination_next"
            @click="loadMore"
        >
            {{ t("tournaments.loadMore") }}
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import {
    checkRegistration,
    fetchAssignToTournament,
    fetchTournaments,
    fetchTournamentsByCategory,
    fetchunassignTournament,
} from "@/components/View/Tournaments/fetchTournaments.js";
import { fetchCategories } from "@/components/View/TournamentManagement/fetchTournamentManagement.js";
import { useAuth, USER_ROLES } from "@/composables/useAuth.js";
import { useI18n } from "@/i18n";
import "./Tournaments.css";

const router = useRouter();
const { locale, t } = useI18n();
const dateLocale = computed(
    () => ({ ru: "ru-RU", en: "en-US", kk: "kk-KZ" })[locale.value] ?? "ru-RU",
);

// ─── Роли ─────────────────────────────────────────────────────────
const { canSee, userRole } = useAuth();
const { ADMIN, REFEREE, ATHLETE } = USER_ROLES;

// ─── Фильтры ──────────────────────────────────────────────────────
const categoryFilter = ref("all");
const yearFilter = ref("all");
const searchQuery = ref("");
const debouncedSearch = ref("");
const timeoutId = ref(null);

// ─── Данные ───────────────────────────────────────────────────────
const categories = ref([]);
const rawTournaments = ref([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const error = ref("");

// ─── Пагинация ────────────────────────────────────────────────────
const perPage = 10;
const currentPage = ref(1);
const hasMore = ref(true);

// ─── Вычисляемые свойства ─────────────────────────────────────────
const filteredTournaments = computed(() => {
    let list = rawTournaments.value;

    if (debouncedSearch.value) {
        const query = debouncedSearch.value.toLowerCase();
        list = list.filter(
            (t) =>
                (t.name || "").toLowerCase().includes(query) ||
                (t.venue || "").toLowerCase().includes(query) ||
                (t.city || "").toLowerCase().includes(query) ||
                (t.description || "").toLowerCase().includes(query),
        );
    }

    if (yearFilter.value !== "all" && yearFilter.value) {
        const selectedYear = Number(yearFilter.value);
        list = list.filter((t) => {
            if (!t.start_date) return false;
            return new Date(t.start_date).getFullYear() === selectedYear;
        });
    }

    const statusPriority = {
        LIVE: 0,
        REGISTRATION: 1,
        PLANNED: 2,
        WEIGHING: 3,
        BRACKETS: 4,
        COMPLETED: 5,
    };

    list = [...list].sort((a, b) => {
        const priA = statusPriority[a.status] ?? 10;
        const priB = statusPriority[b.status] ?? 10;
        if (priA !== priB) return priA - priB;
        const dateA = new Date(a.start_date || "9999-12-31");
        const dateB = new Date(b.start_date || "9999-12-31");
        return dateA - dateB;
    });

    return list;
});

const visibleTournaments = computed(() => filteredTournaments.value);
const hasActiveFilters = computed(
    () =>
        searchQuery.value ||
        yearFilter.value !== "all" ||
        categoryFilter.value !== "all",
);

const loadMore = async () => {
    if (isLoading.value || isLoadingMore.value || !hasMore.value) return;
    await loadTournaments(categoryFilter.value, { append: true });
};

// ─── Загрузка данных ──────────────────────────────────────────────
const loadCategories = async () => {
    try {
        const result = await fetchCategories();
        if (
            result &&
            result.success &&
            result.data &&
            Array.isArray(result.data.categories)
        ) {
            categories.value = result.data.categories;
        } else {
            categories.value = [];
        }
    } catch (err) {
        console.error("Ошибка при загрузке категорий:", err);
        categories.value = [];
    }
};

const isAssignTournament = async (id) => {
    try {
        const result = await fetchAssignToTournament(id);
        if (result && result.success && result.data) {
            alert(result.data);
            registrationMap.value[id] = true;
        }
    } catch (err) {
        console.log(err);
    }
};

const registrationMap = ref({});

const loadRegistrationStatus = async (tournaments) => {
    for (const t of tournaments) {
        const result = await checkRegistration(t.id);
        registrationMap.value[t.id] = result;
    }
};

const isRegistered = async (id) => {
    try {
        const result = await checkRegistration(id);
        return result.data;
    } catch (err) {
        console.log(err);
    }
};

const unassignTournament = async (id) => {
    try {
        const result = await fetchunassignTournament(id);
        if (result && result.success && result.data) {
            alert(result.data);
            registrationMap.value[id] = false;
        }
        console.log(result.data.message);
    } catch (err) {
        console.log(err);
    }
};

const loadTournaments = async (category = "all", { append = false } = {}) => {
    if (append) {
        isLoadingMore.value = true;
    } else {
        isLoading.value = true;
        currentPage.value = 1;
        hasMore.value = true;
        rawTournaments.value = [];
    }

    error.value = "";

    try {
        const page = append ? currentPage.value + 1 : 1;
        let result;
        if (category === "all") {
            result = await fetchTournaments({ page, perPage });
        } else {
            result = await fetchTournamentsByCategory(category, {
                page,
                perPage,
            });
        }

        if (result && result.success) {
            const nextTournaments = result.data || [];
            rawTournaments.value = append
                ? [...rawTournaments.value, ...nextTournaments]
                : nextTournaments;
            currentPage.value = page;
            hasMore.value = nextTournaments.length === perPage;

            if (userRole.value === ATHLETE && nextTournaments.length > 0) {
                await loadRegistrationStatus(nextTournaments);
            }
        } else {
            throw new Error(result?.error || t("tournaments.unknownError"));
        }
    } catch (err) {
        console.error("Ошибка при загрузке турниров:", err);
        error.value = t("tournaments.loadError");
        rawTournaments.value = [];
    } finally {
        isLoading.value = false;
        isLoadingMore.value = false;
    }
};

// ─── Вотчеры ──────────────────────────────────────────────────────
watch(categoryFilter, (newCategory) => {
    loadTournaments(newCategory);
});
watch(yearFilter, () => {
    loadTournaments(categoryFilter.value);
});
watch(searchQuery, (newQuery) => {
    if (timeoutId.value !== null) clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(() => {
        debouncedSearch.value = newQuery.trim().toLowerCase();
        loadTournaments(categoryFilter.value);
    }, 500);
});

const handleScroll = () => {
    const scrollOffset = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.offsetHeight - 300;
    if (scrollOffset >= threshold) {
        loadMore();
    }
};

// ─── Вспомогательные функции ──────────────────────────────────────
const isRegistrationAvailable = (tournament) => {
    return ["PLANNED", "REGISTRATION"].includes(tournament.status);
};

const formatDate = (startDate, endDate) => {
    if (!startDate) return t("tournaments.dateMissing");
    const start = new Date(startDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const startStr = start.toLocaleDateString(dateLocale.value, options);
    if (!endDate || startDate === endDate) return startStr;
    const end = new Date(endDate);
    return `${startStr} – ${end.toLocaleDateString(dateLocale.value, options)}`;
};

const getLocation = (tournament) => {
    const parts = [];
    if (tournament.venue) parts.push(tournament.venue);
    if (tournament.city) parts.push(tournament.city);
    if (tournament.country) parts.push(tournament.country);
    return parts.join(", ") || t("tournaments.locationMissing");
};

const getStatusClass = (status) => {
    const statusMap = {
        LIVE: "status-live",
        PLANNED: "status-planned",
        COMPLETED: "status-completed",
        REGISTRATION: "status-registration",
        WEIGHING: "status-weighing",
        BRACKETS: "status-brackets",
    };
    return statusMap[status] || "status-planned";
};

const getStatusText = (status) => {
    const statusMap = {
        LIVE: t("tournaments.status.LIVE"),
        PLANNED: t("tournaments.status.PLANNED"),
        COMPLETED: t("tournaments.status.COMPLETED"),
        REGISTRATION: t("tournaments.status.REGISTRATION"),
        WEIGHING: t("tournaments.status.WEIGHING"),
        BRACKETS: t("tournaments.status.BRACKETS"),
    };
    return statusMap[status] || status;
};

const navigateToDetails = (id) => {
    router.push(`/tournamentdetails/${id}`);
};
const navigateToRegistration = (id) => {
    localStorage.setItem("registrationTournamentId", id);
    router.push("/registrationathlete");
};

// ─── Инициализация ────────────────────────────────────────────────
onMounted(async () => {
    await loadCategories();
    await loadTournaments("all");
    window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    if (timeoutId.value !== null) clearTimeout(timeoutId.value);
});
</script>
<style scoped>
/* ваши стили остаются без изменений */
</style>
