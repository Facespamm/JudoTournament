<template>
    <div class="judo-tournament-setting_search">
        <select
            v-model="categoryFilter"
            class="judo-tournament-setting_search_select_category"
            name="tournament_filter_category"
        >
            <option value="">{{ t("tournaments.allCategories") }}</option>
            <option
                v-if="categories.length > 0"
                v-for="cat in categories"
                :key="cat.id"
                :value="cat.id"
            >
                {{ cat.name }} ({{ cat.gender }}, {{ cat.min_age }}-{{
                    cat.max_age
                }}
                {{ t("tournaments.years") }}, {{ cat.min_weight }}-{{
                    cat.max_weight
                }}
                {{ t("tournaments.kg") }})
            </option>
            <option v-else disabled>
                {{ t("tournaments.categoriesLoading") }}
            </option>
        </select>

        <select
            v-model="statusFilter"
            class="judo-tournament-setting_date"
            name="tournament_status"
        >
            <option value="">{{ t("tournaments.allStatuses") }}</option>
            <option
                v-for="status in tournamentStatuses"
                :key="status"
                :value="status"
            >
                {{ getStatusText(status) }}
            </option>
        </select>

        <input
            v-model="searchQuery"
            type="search"
            name="tournament_search"
            minlength="3"
            :placeholder="t('tournaments.searchPlaceholder')"
            class="search-input"
        />
    </div>

    <div class="judo-tournament_info">
        <section class="judo-tournament-list">
            <h2>{{ t("adminDashboard.allTournaments") }}</h2>

            <div v-if="isLoading" class="loading-indicator">
                <div class="loading-spinner"></div>
                <p>{{ t("tournaments.loading") }}</p>
            </div>

            <div v-else-if="error" class="error-message">
                <p>{{ error }}</p>
                <button @click="loadTournaments()" class="retry-button">
                    {{ t("tournaments.retry") }}
                </button>
            </div>

            <div v-else class="tournament-cards-container">
                <article
                    v-for="tournament in visibleTournaments"
                    :key="getTournamentId(tournament)"
                    class="judo-tournament-card"
                    :class="{ live: tournament.status === 'LIVE' }"
                >
                    <div class="judo-tournament_card_info">
                        <div class="tournament-header">
                            <span class="tournament-date-badge">
                                {{
                                    formatDate(
                                        tournament.start_date,
                                        tournament.end_date,
                                    )
                                }}
                            </span>
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
                            <span class="stat-item">
                                {{
                                    t("tournaments.participants", {
                                        count: tournament.athletes_count || 0,
                                    })
                                }}
                            </span>
                            <span class="stat-divider">•</span>
                            <span class="stat-item">
                                {{
                                    t("tournaments.progress", {
                                        count:
                                            tournament.progress_percentage || 0,
                                    })
                                }}
                            </span>
                        </div>

                        <div
                            v-if="tournament.description"
                            class="tournament-description"
                        >
                            {{ tournament.description }}
                        </div>

                        <div class="tournament-actions">
                            <button
                                class="tournament-action-btn tournament-view-details-btn"
                                @click="navigateToDetails(tournament)"
                            >
                                {{ t("adminDashboard.manage") }}
                            </button>
                        </div>
                    </div>
                </article>

                <div
                    v-if="visibleTournaments.length === 0 && !isLoading"
                    class="no-tournaments"
                >
                    <p>{{ t("tournaments.empty") }}</p>
                    <small v-if="hasActiveFilters">
                        {{ t("tournaments.changeFilters") }}
                    </small>
                </div>
            </div>
        </section>
    </div>

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
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { fetchTournaments } from "@/components/View/Tournaments/fetchTournaments.js";
import { fetchCategories } from "@/components/View/TournamentManagement/fetchTournamentManagement.js";
import { useI18n } from "@/i18n";
import "./Tournaments.css";

const router = useRouter();
const { locale, t } = useI18n();
const dateLocale = computed(
    () => ({ ru: "ru-RU", en: "en-US", kk: "kk-KZ" })[locale.value] ?? "ru-RU",
);

const categoryFilter = ref("");
const statusFilter = ref("");
const searchQuery = ref("");
const debouncedSearch = ref("");
const timeoutId = ref(null);

const categories = ref([]);
const rawTournaments = ref([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const error = ref("");

const perPage = 10;
const currentPage = ref(1);
const hasMore = ref(true);

const tournamentStatuses = [
    "LIVE",
    "REGISTRATION",
    "PLANNED",
    "WEIGHING",
    "BRACKETS",
    "COMPLETED",
];

const filteredTournaments = computed(() => rawTournaments.value);

const visibleTournaments = computed(() => filteredTournaments.value);
const hasActiveFilters = computed(
    () => searchQuery.value || categoryFilter.value || statusFilter.value,
);

const loadMore = async () => {
    if (isLoading.value || isLoadingMore.value || !hasMore.value) return;
    await loadTournaments({ append: true });
};

const loadCategories = async () => {
    try {
        const result = await fetchCategories();
        categories.value =
            result?.success && Array.isArray(result.data?.categories)
                ? result.data.categories
                : [];
    } catch (err) {
        console.error("Ошибка при загрузке категорий:", err);
        categories.value = [];
    }
};

const loadTournaments = async ({ append = false } = {}) => {
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
        const result = await fetchTournaments({
            page,
            perPage,
            status: statusFilter.value || undefined,
            categoryId: categoryFilter.value || undefined,
            search: debouncedSearch.value || undefined,
        });

        if (result?.success) {
            const nextTournaments = result.data || [];
            rawTournaments.value = append
                ? [...rawTournaments.value, ...nextTournaments]
                : nextTournaments;
            currentPage.value = page;
            hasMore.value = nextTournaments.length === perPage;
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

watch(categoryFilter, async () => {
    await loadTournaments();
});

watch(statusFilter, async () => {
    await loadTournaments();
});

watch(searchQuery, (newQuery) => {
    if (timeoutId.value !== null) clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(async () => {
        const normalizedQuery = newQuery.trim().toLowerCase();
        if (normalizedQuery.length > 0 && normalizedQuery.length < 3) return;

        debouncedSearch.value = normalizedQuery;
        await loadTournaments();
    }, 500);
});

const handleScroll = () => {
    const scrollOffset = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.offsetHeight - 300;
    if (scrollOffset >= threshold) {
        loadMore();
    }
};

const formatDate = (startDate, endDate) => {
    if (!startDate) return t("tournaments.dateMissing");
    const start = new Date(startDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const startStr = start.toLocaleDateString(dateLocale.value, options);
    if (!endDate || startDate === endDate) return startStr;
    const end = new Date(endDate);
    return `${startStr} - ${end.toLocaleDateString(dateLocale.value, options)}`;
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

const getTournamentId = (tournament) => {
    return tournament?.tournament_id ?? tournament?.id;
};

const navigateToDetails = (tournament) => {
    const id = getTournamentId(tournament);
    if (!id) return;
    router.push(`/tournamentdetails/${id}/update`);
};

onMounted(async () => {
    await loadCategories();
    await loadTournaments();
    window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    if (timeoutId.value !== null) clearTimeout(timeoutId.value);
});
</script>

<style scoped></style>
