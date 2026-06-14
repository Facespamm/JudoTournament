<template>
    <div class="tournament-update-page">
        <section class="update-navigation">
            <h2>{{ t("tournamentUpdate.title") }}</h2>
            <nav class="update-tabs">
                <button
                    class="update-tab"
                    :class="{ active: activeTab === 'info' }"
                    @click="activeTab = 'info'"
                >
                    {{ t("tournamentUpdate.infoTab") }}
                </button>
                <button
                    class="update-tab"
                    :class="{ active: activeTab === 'participants' }"
                    @click="selectTab('participants')"
                >
                    {{ t("tournamentUpdate.participantsTab") }}
                </button>
                <button
                    class="update-tab"
                    :class="{ active: activeTab === 'categories' }"
                    @click="selectTab('categories')"
                >
                    {{ t("tournamentUpdate.categoriesTab") }}
                </button>
            </nav>
        </section>

        <section class="update-content">
            <div v-if="isLoading" class="update-state">
                <div class="update-spinner"></div>
                <p>{{ t("tournamentDetails.loading") }}</p>
            </div>

            <div v-else-if="error" class="update-state error">
                <p>{{ error }}</p>
                <button class="secondary-btn" @click="loadTournament">
                    {{ t("tournamentDetails.retry") }}
                </button>
            </div>

            <form
                v-else-if="activeTab === 'info'"
                class="update-form"
                @submit.prevent="submitUpdate"
            >
                <div class="form-grid">
                    <label class="form-field">
                        <span>{{ t("tournamentUpdate.name") }}</span>
                        <input v-model.trim="form.name" type="text" required />
                    </label>

                    <div class="date-range-field">
                        <label class="date-field">
                            <span>{{ t("tournamentUpdate.from") }}</span>
                            <input v-model="form.start_date" type="date" />
                        </label>

                        <label class="date-field">
                            <span>{{ t("tournamentUpdate.to") }}</span>
                            <input
                                v-model="form.end_date"
                                type="date"
                                :min="form.start_date || undefined"
                            />
                        </label>
                    </div>

                    <label class="form-field">
                        <span>{{ t("tournamentUpdate.venue") }}</span>
                        <input v-model.trim="form.venue" type="text" />
                    </label>

                    <label class="form-field">
                        <span>{{ t("tournamentUpdate.city") }}</span>
                        <input v-model.trim="form.city" type="text" />
                    </label>

                    <label class="form-field">
                        <span>{{ t("tournamentUpdate.country") }}</span>
                        <input v-model.trim="form.country" type="text" />
                    </label>

                    <label class="form-field">
                        <span>{{ t("tournamentUpdate.tatamiCount") }}</span>
                        <input
                            v-model.number="form.tatami_count"
                            type="number"
                            min="1"
                            required
                        />
                    </label>

                    <label class="form-field">
                        <span>{{ t("tournamentUpdate.athletesCount") }}</span>
                        <input
                            :value="form.athletes_count"
                            type="number"
                            disabled
                        />
                    </label>

                    <label class="checkbox-field">
                        <input
                            v-model="form.has_consolation_fights"
                            type="checkbox"
                        />
                        <span>{{
                            t("tournamentUpdate.hasConsolationFights")
                        }}</span>
                    </label>

                    <label class="form-field full-width">
                        <span>{{ t("tournamentUpdate.description") }}</span>
                        <textarea
                            v-model.trim="form.description"
                            rows="5"
                        ></textarea>
                    </label>
                </div>

                <p v-if="successMessage" class="success-message">
                    {{ successMessage }}
                </p>
                <p v-if="submitError" class="submit-error">{{ submitError }}</p>

                <div class="form-actions">
                    <button class="secondary-btn" type="button" @click="goBack">
                        {{ t("tournamentUpdate.back") }}
                    </button>
                    <button
                        class="primary-btn"
                        type="submit"
                        :disabled="isSubmitting"
                    >
                        {{
                            isSubmitting
                                ? t("tournamentUpdate.updating")
                                : t("tournamentUpdate.update")
                        }}
                    </button>
                </div>
            </form>

            <div
                v-else-if="activeTab === 'participants'"
                class="participants-panel"
            >
                <div class="participants-toolbar">
                    <select v-model="selectedClubId" class="club-select">
                        <option value="">{{ t("tournamentUpdate.allClubs") }}</option>
                        <option v-for="club in clubs" :key="club.id" :value="club.id">
                            {{ club.name || club.club_name }}
                        </option>
                    </select>

                    <div class="participant-search-grid">
                        <input
                            v-model.trim="athleteSearchLastName"
                            class="participant-search"
                            type="search"
                            :placeholder="t('tournamentUpdate.lastNameSearch')"
                        />
                        <input
                            v-model.trim="athleteSearchFirstName"
                            class="participant-search"
                            type="search"
                            :placeholder="t('tournamentUpdate.firstNameSearch')"
                        />
                        <input
                            v-model.trim="athleteSearchMiddleName"
                            class="participant-search"
                            type="search"
                            :placeholder="t('tournamentUpdate.middleNameSearch')"
                        />
                    </div>

                    <div class="participant-actions">
                        <button
                            class="secondary-btn"
                            type="button"
                            :disabled="!selectedClubId || isParticipantActionLoading"
                            @click="detachSelectedClub"
                        >
                            {{ t("tournamentUpdate.detachClub") }}
                        </button>
                        <button
                            class="primary-btn"
                            type="button"
                            :disabled="!selectedClubId || isParticipantActionLoading"
                            @click="attachSelectedClub"
                        >
                            {{ t("tournamentUpdate.attachClub") }}
                        </button>
                    </div>
                </div>

                <div class="participant-actions selected-athlete-actions">
                    <button
                        class="secondary-btn"
                        type="button"
                        :disabled="selectedAthleteIds.length !== 1 || isParticipantActionLoading"
                        @click="detachSelectedAthlete"
                    >
                        {{ t("tournamentUpdate.detachAthlete") }}
                    </button>
                    <button
                        class="primary-btn"
                        type="button"
                        :disabled="selectedAthleteIds.length === 0 || isParticipantActionLoading"
                        @click="attachSelectedAthletes"
                    >
                        {{ t("tournamentUpdate.attachAthletes") }}
                    </button>
                </div>

                <p v-if="participantsError" class="submit-error">{{ participantsError }}</p>
                <p v-if="participantsSuccessMessage" class="success-message">
                    {{ participantsSuccessMessage }}
                </p>

                <div v-if="isParticipantsLoading" class="update-state participants-loading">
                    <div class="update-spinner"></div>
                    <p>{{ t("tournamentUpdate.participantsLoading") }}</p>
                </div>

                <div v-else class="participants-table-wrap">
                    <table class="participants-table">
                        <thead>
                            <tr>
                                <th class="participant-select-col">
                                    <input
                                        type="checkbox"
                                        :checked="isAllAthletesSelected"
                                        @change="toggleAllAthletes"
                                    />
                                </th>
                                <th>{{ t("tournamentUpdate.athleteName") }}</th>
                                <th>{{ t("tournamentUpdate.gender") }}</th>
                                <th>{{ t("tournamentUpdate.age") }}</th>
                                <th>{{ t("tournamentUpdate.rank") }}</th>
                                <th>{{ t("tournamentUpdate.assignmentStatus") }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="athlete in filteredAthletes"
                                :key="athlete.id"
                                :class="{
                                    selected: selectedAthleteIds.includes(athlete.id),
                                    assigned: athlete.has_tournament,
                                }"
                                @click="toggleAthleteSelection(athlete.id)"
                            >
                                <td class="participant-select-col" @click.stop>
                                    <input
                                        type="checkbox"
                                        :checked="selectedAthleteIds.includes(athlete.id)"
                                        @change="toggleAthleteSelection(athlete.id)"
                                    />
                                </td>
                                <td>{{ getAthleteName(athlete) }}</td>
                                <td>{{ getGenderText(athlete.gender) }}</td>
                                <td>{{ athlete.age ?? "—" }}</td>
                                <td>{{ athlete.rank || "—" }}</td>
                                <td>
                                    <span class="assignment-badge" :class="{ assigned: athlete.has_tournament }">
                                        {{
                                            athlete.has_tournament
                                                ? t("tournamentUpdate.athleteAttached")
                                                : t("tournamentUpdate.athleteDetached")
                                        }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div v-if="filteredAthletes.length === 0" class="no-categories">
                        {{ t("tournamentUpdate.athletesEmpty") }}
                    </div>

                    <div v-if="athletesHasMore" class="participants-pagination">
                        <button
                            class="secondary-btn"
                            type="button"
                            :disabled="isMoreParticipantsLoading"
                            @click="loadMoreAthletesForAssign"
                        >
                            {{
                                isMoreParticipantsLoading
                                    ? t("tournamentUpdate.participantsLoading")
                                    : t("tournamentUpdate.loadMoreAthletes")
                            }}
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="categories-panel">
                <div class="categories-toolbar">
                    <input
                        v-model.trim="categorySearch"
                        class="category-search"
                        type="search"
                        :placeholder="t('tournamentUpdate.categorySearch')"
                    />

                    <div class="category-actions">
                        <button
                            class="secondary-btn"
                            type="button"
                            :disabled="!selectedCategory || isCategoryActionLoading"
                            @click="detachSelectedCategory"
                        >
                            {{ t("tournamentUpdate.detachCategory") }}
                        </button>
                        <button
                            class="primary-btn"
                            type="button"
                            :disabled="!selectedCategory || isCategoryActionLoading"
                            @click="attachSelectedCategory"
                        >
                            {{ t("tournamentUpdate.attachCategory") }}
                        </button>
                    </div>
                </div>

                <p v-if="categoryError" class="submit-error">{{ categoryError }}</p>
                <p v-if="categorySuccessMessage" class="success-message">
                    {{ categorySuccessMessage }}
                </p>

                <div v-if="isCategoriesLoading" class="update-state categories-loading">
                    <div class="update-spinner"></div>
                    <p>{{ t("tournamentUpdate.categoriesLoading") }}</p>
                </div>

                <div v-else class="categories-list">
                    <button
                        v-for="category in filteredCategories"
                        :key="getCategoryId(category)"
                        class="category-row"
                        :class="{
                            selected:
                                selectedCategory &&
                                getCategoryId(selectedCategory) === getCategoryId(category),
                            assigned: isCategoryAssigned(category),
                        }"
                        type="button"
                        @click="selectedCategory = category"
                    >
                        <span class="category-name">{{ category.name }}</span>
                        <span class="category-meta">
                            {{ formatCategoryMeta(category) }}
                        </span>
                        <span class="category-status">
                            {{
                                isCategoryAssigned(category)
                                    ? t("tournamentUpdate.categoryAttached")
                                    : t("tournamentUpdate.categoryDetached")
                            }}
                        </span>
                    </button>

                    <div v-if="filteredCategories.length === 0" class="no-categories">
                        {{ t("tournamentUpdate.categoriesEmpty") }}
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
    fetchTournamentDetail,
    fetchTournamentCategoriesForAssign,
    fetchTournamentAthletesForAssign,
    addCategoryToTournament,
    removeCategoryFromTournament,
    addClubToTournamentUpdate,
    removeClubFromTournamentUpdate,
    addAthletesToTournamentUpdate,
    removeAthleteFromTournamentUpdate,
    updateTournamentDetail,
} from "@/components/View/TournamentDetails/fetchTournamentDetail.js";
import { getClubs } from "@/components/View/Clubs/fetchClubs.js";
import { useI18n } from "@/i18n";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const activeTab = ref("info");
const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref("");
const submitError = ref("");
const successMessage = ref("");
const categories = ref([]);
const categorySearch = ref("");
const selectedCategory = ref(null);
const isCategoriesLoading = ref(false);
const isCategoryActionLoading = ref(false);
const categoryError = ref("");
const categorySuccessMessage = ref("");
const clubs = ref([]);
const athletes = ref([]);
const selectedClubId = ref("");
const athleteSearchLastName = ref("");
const athleteSearchFirstName = ref("");
const athleteSearchMiddleName = ref("");
const selectedAthleteIds = ref([]);
const isParticipantsLoading = ref(false);
const isMoreParticipantsLoading = ref(false);
const isParticipantActionLoading = ref(false);
const participantsError = ref("");
const participantsSuccessMessage = ref("");
const athletesPerPage = 20;
const athletesCurrentPage = ref(1);
const athletesHasMore = ref(false);
const athleteSearchTimeoutId = ref(null);

const form = reactive({
    name: "",
    start_date: "",
    end_date: "",
    venue: "",
    city: "",
    country: "",
    tatami_count: 1,
    athletes_count: 0,
    description: "",
    has_consolation_fights: false,
});

const tournamentId = () => Number(route.params.id);

const filteredCategories = computed(() => {
    const query = categorySearch.value.toLowerCase();
    if (!query) return categories.value;

    return categories.value.filter((category) => {
        const searchable = [
            category.name,
            category.gender,
            category.min_age,
            category.max_age,
            category.min_weight,
            category.max_weight,
        ]
            .filter((value) => value !== undefined && value !== null)
            .join(" ")
            .toLowerCase();

        return searchable.includes(query);
    });
});

const filteredAthletes = computed(() => {
    const query = athleteSearchQuery.value.toLowerCase();
    if (!query) return athletes.value;

    return athletes.value.filter((athlete) => {
        return [
            athlete.last_name,
            athlete.first_name,
            athlete.middle_name,
            athlete.rank,
            athlete.gender,
            athlete.age,
        ]
            .filter((value) => value !== undefined && value !== null)
            .join(" ")
            .toLowerCase()
            .includes(query);
    });
});

const athleteSearchQuery = computed(() =>
    [
        athleteSearchLastName.value,
        athleteSearchFirstName.value,
        athleteSearchMiddleName.value,
    ]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(" "),
);

const isAllAthletesSelected = computed(() => {
    return (
        filteredAthletes.value.length > 0 &&
        filteredAthletes.value.every((athlete) =>
            selectedAthleteIds.value.includes(athlete.id),
        )
    );
});

const getCategoryId = (category) => category?.category_id ?? category?.id;

const isCategoryAssigned = (category) => {
    return Boolean(
        category?.assign ??
            category?.is_assigned ??
            category?.assigned ??
            category?.attached ??
            category?.is_attached ??
            category?.in_tournament,
    );
};

const formatCategoryMeta = (category) => {
    const parts = [];
    if (category.gender) parts.push(category.gender);
    if (category.min_age || category.max_age) {
        parts.push(`${category.min_age ?? ""}-${category.max_age ?? ""}`);
    }
    if (category.min_weight || category.max_weight) {
        parts.push(`${category.min_weight ?? ""}-${category.max_weight ?? ""} ${t("tournaments.kg")}`);
    }
    return parts.join(", ");
};

const getAthleteName = (athlete) => {
    return [
        athlete.last_name,
        athlete.first_name,
        athlete.middle_name,
    ]
        .filter(Boolean)
        .join(" ");
};

const getGenderText = (gender) => {
    if (!gender) return "—";
    const normalized = String(gender).toUpperCase();
    if (normalized === "MALE" || normalized === "M") {
        return t("tournamentUpdate.genderMale");
    }
    if (normalized === "FEMALE" || normalized === "F") {
        return t("tournamentUpdate.genderFemale");
    }
    return gender;
};

const normalizeAthletesResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.athletes)) return data.athletes;
    if (Array.isArray(data?.data?.athletes)) return data.data.athletes;
    if (Array.isArray(data?.items)) return data.items;
    if (data?.athletes && typeof data.athletes === "object") {
        return Object.values(data.athletes);
    }
    if (data && typeof data === "object") return Object.values(data);
    return [];
};

const selectTab = (tab) => {
    activeTab.value = tab;
    if (tab === "categories" && categories.value.length === 0) {
        loadCategoriesForAssign();
    }
    if (tab === "participants" && athletes.value.length === 0) {
        loadParticipantsData();
    }
};

const toDateInputValue = (value) => {
    if (!value) return "";
    return String(value).slice(0, 10);
};

const normalizeNullableString = (value) => {
    const normalized = String(value ?? "").trim();
    return normalized.length > 0 ? normalized : null;
};

const fillForm = (tournament) => {
    form.name = tournament.name || "";
    form.start_date = toDateInputValue(tournament.start_date);
    form.end_date = toDateInputValue(tournament.end_date);
    form.venue = tournament.venue || "";
    form.city = tournament.city || "";
    form.country = tournament.country || "";
    form.tatami_count = tournament.tatami_count || 1;
    form.athletes_count = tournament.athletes_count || 0;
    form.description = tournament.description || "";
    form.has_consolation_fights = Boolean(tournament.has_consolation_fights);
};

const loadTournament = async () => {
    isLoading.value = true;
    error.value = "";
    submitError.value = "";
    successMessage.value = "";

    try {
        const id = tournamentId();
        if (!id || isNaN(id)) throw new Error(t("tournamentDetails.invalidId"));

        const response = await fetchTournamentDetail(id);
        const tournament = response?.tournament || response;
        fillForm(tournament);
    } catch (err) {
        console.error("Error loading tournament for update:", err);
        error.value =
            err instanceof Error
                ? err.message
                : t("tournamentDetails.loadError");
    } finally {
        isLoading.value = false;
    }
};

const normalizeCategoriesResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.categories)) return data.categories;
    if (Array.isArray(data?.data?.categories)) return data.data.categories;
    if (Array.isArray(data?.items)) return data.items;
    return [];
};

const loadCategoriesForAssign = async ({ keepMessage = false } = {}) => {
    const id = tournamentId();
    if (!id || isNaN(id)) {
        categoryError.value = t("tournamentDetails.invalidId");
        return;
    }

    isCategoriesLoading.value = true;
    categoryError.value = "";
    if (!keepMessage) categorySuccessMessage.value = "";

    try {
        const result = await fetchTournamentCategoriesForAssign(id);
        if (!result.success) {
            throw new Error(result.error || t("tournamentUpdate.categoriesLoadFailed"));
        }

        categories.value = normalizeCategoriesResponse(result.data);
        selectedCategory.value = null;
    } catch (err) {
        console.error("Error loading categories for assign:", err);
        categoryError.value =
            err instanceof Error
                ? err.message
                : t("tournamentUpdate.categoriesLoadFailed");
    } finally {
        isCategoriesLoading.value = false;
    }
};

const loadParticipantsData = async () => {
    await Promise.all([loadClubs(), loadAthletesForAssign()]);
};

const loadClubs = async () => {
    if (clubs.value.length > 0) return;
    try {
        clubs.value = await getClubs();
    } catch (err) {
        console.error("Error loading clubs:", err);
        participantsError.value = t("tournamentUpdate.clubsLoadFailed");
    }
};

const loadAthletesForAssign = async ({
    keepMessage = false,
    append = false,
} = {}) => {
    const id = tournamentId();
    if (!id || isNaN(id)) {
        participantsError.value = t("tournamentDetails.invalidId");
        return;
    }

    if (append) {
        if (
            isParticipantsLoading.value ||
            isMoreParticipantsLoading.value ||
            !athletesHasMore.value
        ) {
            return;
        }
        isMoreParticipantsLoading.value = true;
    } else {
        isParticipantsLoading.value = true;
        athletesCurrentPage.value = 1;
        athletesHasMore.value = false;
        athletes.value = [];
        selectedAthleteIds.value = [];
    }

    participantsError.value = "";
    if (!keepMessage) participantsSuccessMessage.value = "";

    try {
        const page = append ? athletesCurrentPage.value + 1 : 1;
        const result = await fetchTournamentAthletesForAssign({
            tournamentId: id,
            clubId: selectedClubId.value || undefined,
            search: athleteSearchQuery.value || undefined,
            page,
            perPage: athletesPerPage,
        });

        if (!result.success) {
            throw new Error(result.error || t("tournamentUpdate.athletesLoadFailed"));
        }

        const nextAthletes = normalizeAthletesResponse(result.athletes);
        athletes.value = append
            ? [...athletes.value, ...nextAthletes]
            : nextAthletes;
        athletesCurrentPage.value = page;
        athletesHasMore.value = nextAthletes.length === athletesPerPage;
    } catch (err) {
        console.error("Error loading athletes for assign:", err);
        participantsError.value =
            err instanceof Error
                ? err.message
                : t("tournamentUpdate.athletesLoadFailed");
    } finally {
        isParticipantsLoading.value = false;
        isMoreParticipantsLoading.value = false;
    }
};

const loadMoreAthletesForAssign = () => {
    loadAthletesForAssign({ append: true, keepMessage: true });
};

const toggleAthleteSelection = (athleteId) => {
    const index = selectedAthleteIds.value.indexOf(athleteId);
    if (index === -1) {
        selectedAthleteIds.value.push(athleteId);
    } else {
        selectedAthleteIds.value.splice(index, 1);
    }
};

const toggleAllAthletes = () => {
    if (isAllAthletesSelected.value) {
        selectedAthleteIds.value = selectedAthleteIds.value.filter(
            (id) => !filteredAthletes.value.some((athlete) => athlete.id === id),
        );
        return;
    }

    const ids = filteredAthletes.value.map((athlete) => athlete.id);
    selectedAthleteIds.value = Array.from(
        new Set([...selectedAthleteIds.value, ...ids]),
    );
};

const attachSelectedClub = async () => {
    await updateClubAssignment("attach");
};

const detachSelectedClub = async () => {
    await updateClubAssignment("detach");
};

const updateClubAssignment = async (action) => {
    const id = tournamentId();
    if (!id || isNaN(id) || !selectedClubId.value) return;

    isParticipantActionLoading.value = true;
    participantsError.value = "";
    participantsSuccessMessage.value = "";

    try {
        const result =
            action === "attach"
                ? await addClubToTournamentUpdate(id, selectedClubId.value)
                : await removeClubFromTournamentUpdate(id, selectedClubId.value);

        if (!result.success) {
            throw new Error(result.error || t("tournamentUpdate.participantActionFailed"));
        }

        participantsSuccessMessage.value =
            action === "attach"
                ? t("tournamentUpdate.clubAttachSuccess")
                : t("tournamentUpdate.clubDetachSuccess");
        await loadAthletesForAssign({ keepMessage: true });
    } catch (err) {
        console.error("Error updating club assignment:", err);
        participantsError.value =
            err instanceof Error
                ? err.message
                : t("tournamentUpdate.participantActionFailed");
    } finally {
        isParticipantActionLoading.value = false;
    }
};

const attachSelectedAthletes = async () => {
    const id = tournamentId();
    if (!id || isNaN(id) || selectedAthleteIds.value.length === 0) return;

    isParticipantActionLoading.value = true;
    participantsError.value = "";
    participantsSuccessMessage.value = "";

    try {
        const result = await addAthletesToTournamentUpdate(
            id,
            selectedAthleteIds.value,
        );

        if (!result.success) {
            throw new Error(result.error || t("tournamentUpdate.participantActionFailed"));
        }

        participantsSuccessMessage.value = t("tournamentUpdate.athletesAttachSuccess");
        await loadAthletesForAssign({ keepMessage: true });
    } catch (err) {
        console.error("Error attaching athletes:", err);
        participantsError.value =
            err instanceof Error
                ? err.message
                : t("tournamentUpdate.participantActionFailed");
    } finally {
        isParticipantActionLoading.value = false;
    }
};

const detachSelectedAthlete = async () => {
    const id = tournamentId();
    const athleteId = selectedAthleteIds.value[0];
    if (!id || isNaN(id) || !athleteId) return;

    isParticipantActionLoading.value = true;
    participantsError.value = "";
    participantsSuccessMessage.value = "";

    try {
        const result = await removeAthleteFromTournamentUpdate(id, athleteId);

        if (!result.success) {
            throw new Error(result.error || t("tournamentUpdate.participantActionFailed"));
        }

        participantsSuccessMessage.value = t("tournamentUpdate.athleteDetachSuccess");
        await loadAthletesForAssign({ keepMessage: true });
    } catch (err) {
        console.error("Error detaching athlete:", err);
        participantsError.value =
            err instanceof Error
                ? err.message
                : t("tournamentUpdate.participantActionFailed");
    } finally {
        isParticipantActionLoading.value = false;
    }
};

const attachSelectedCategory = async () => {
    await updateSelectedCategoryAssignment("attach");
};

const detachSelectedCategory = async () => {
    await updateSelectedCategoryAssignment("detach");
};

const updateSelectedCategoryAssignment = async (action) => {
    const id = tournamentId();
    const categoryId = getCategoryId(selectedCategory.value);
    if (!id || isNaN(id) || !categoryId) return;

    isCategoryActionLoading.value = true;
    categoryError.value = "";
    categorySuccessMessage.value = "";

    try {
        const result =
            action === "attach"
                ? await addCategoryToTournament(
                      id,
                      categoryId,
                      form.has_consolation_fights,
                  )
                : await removeCategoryFromTournament(id, categoryId);

        if (!result.success) {
            throw new Error(result.error || t("tournamentUpdate.categoryActionFailed"));
        }

        categorySuccessMessage.value =
            action === "attach"
                ? t("tournamentUpdate.categoryAttachSuccess")
                : t("tournamentUpdate.categoryDetachSuccess");
        await loadCategoriesForAssign({ keepMessage: true });
    } catch (err) {
        console.error("Error updating category assignment:", err);
        categoryError.value =
            err instanceof Error
                ? err.message
                : t("tournamentUpdate.categoryActionFailed");
    } finally {
        isCategoryActionLoading.value = false;
    }
};

const submitUpdate = async () => {
    submitError.value = "";
    successMessage.value = "";

    const id = tournamentId();
    if (!id || isNaN(id)) {
        submitError.value = t("tournamentDetails.invalidId");
        return;
    }

    if (
        form.start_date &&
        form.end_date &&
        form.start_date > form.end_date
    ) {
        submitError.value = t("tournamentUpdate.endBeforeStart");
        return;
    }

    const payload = {
        name: normalizeNullableString(form.name),
        description: normalizeNullableString(form.description),
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        venue: normalizeNullableString(form.venue),
        city: normalizeNullableString(form.city),
        country: normalizeNullableString(form.country),
        tatami_count: Number(form.tatami_count),
        has_consolation_fights: Boolean(form.has_consolation_fights),
    };

    isSubmitting.value = true;
    try {
        const result = await updateTournamentDetail(id, payload);
        if (!result.success) {
            throw new Error(result.error || t("tournamentUpdate.updateFailed"));
        }

        successMessage.value = t("tournamentUpdate.updateSuccess");
    } catch (err) {
        console.error("Error updating tournament:", err);
        submitError.value =
            err instanceof Error
                ? err.message
                : t("tournamentUpdate.updateFailed");
    } finally {
        isSubmitting.value = false;
    }
};

const goBack = () => {
    router.back();
};

onMounted(() => {
    loadTournament();
});

onUnmounted(() => {
    if (athleteSearchTimeoutId.value !== null) {
        clearTimeout(athleteSearchTimeoutId.value);
    }
});

watch(selectedClubId, () => {
    if (activeTab.value === "participants") {
        loadAthletesForAssign();
    }
});

watch([athleteSearchLastName, athleteSearchFirstName, athleteSearchMiddleName], () => {
    if (activeTab.value !== "participants") return;
    if (athleteSearchTimeoutId.value !== null) {
        clearTimeout(athleteSearchTimeoutId.value);
    }
    athleteSearchTimeoutId.value = setTimeout(() => {
        loadAthletesForAssign();
    }, 350);
});
</script>

<style scoped>
.tournament-update-page {
    width: 100%;
    min-height: 100vh;
    padding: 80px 24px 40px;
    box-sizing: border-box;
    background: #ffffff;
    color: #1a1a1a;
    font-family: "Inter", "Segoe UI", sans-serif;
}

.update-navigation,
.update-content {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.update-navigation {
    padding: 2rem;
    margin-bottom: 2rem;
    text-align: center;
}

.update-navigation h2 {
    margin: 0 0 1.5rem;
    font-size: 1.8rem;
    font-weight: 700;
}

.update-tabs {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.update-tab {
    flex: 1;
    min-width: 200px;
    padding: 1rem 2rem;
    border: 2px solid #e8e8e8;
    border-radius: 12px;
    background: #f5f5f5;
    color: #666;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.update-tab:hover {
    border-color: #c89b3c;
    color: #1a1a1a;
}

.update-tab.active {
    background: linear-gradient(135deg, #c89b3c, #e0b456);
    border-color: #c89b3c;
    color: white;
    box-shadow: 0 6px 16px rgba(200, 155, 60, 0.3);
}

.update-content {
    min-height: 60vh;
    padding: 2.5rem;
}

.update-state,
.placeholder-panel {
    min-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: #666;
    text-align: center;
}

.update-spinner {
    width: 42px;
    height: 42px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #c89b3c;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.update-form {
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem 1.15rem;
}

.date-range-field {
    display: flex;
    align-items: center;
    gap: 1rem;
    grid-column: 1 / -1;
    width: min(100%, 620px);
    margin: 0.25rem 0;
}

.date-field {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex: 1;
    min-width: 0;
}

.date-field span {
    color: #333;
    font-size: 1rem;
    font-weight: 700;
    white-space: nowrap;
}

.date-field input {
    width: 100%;
    min-width: 0;
    padding: 0.65rem 0.85rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font: inherit;
    font-size: 1.05rem;
    background: white;
    transition: border-color 0.2s ease;
}

.date-field input:focus {
    outline: none;
    border-color: #c89b3c;
}

.form-field,
.checkbox-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-field span,
.checkbox-field span {
    color: #333;
    font-size: 1rem;
    font-weight: 600;
}

.form-field input,
.form-field select,
.form-field textarea {
    width: 100%;
    padding: 0.65rem 0.85rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font: inherit;
    font-size: 1.05rem;
    background: white;
    transition: border-color 0.2s ease;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
    outline: none;
    border-color: #c89b3c;
}

.form-field input:disabled {
    background: #f5f5f5;
    color: #777;
    cursor: not-allowed;
}

.form-field textarea {
    resize: vertical;
}

.checkbox-field {
    justify-content: center;
    flex-direction: row;
    align-items: center;
    padding: 0.65rem 0.85rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
}

.checkbox-field input {
    width: 18px;
    height: 18px;
    accent-color: #c89b3c;
}

.full-width {
    grid-column: 1 / -1;
}

.success-message,
.submit-error {
    margin-top: 1.25rem;
    font-weight: 600;
}

.success-message {
    color: #2e7d32;
}

.submit-error {
    color: #d32f2f;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
}

.categories-panel {
    width: 100%;
}

.categories-toolbar {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.category-search {
    width: min(100%, 420px);
    padding: 0.7rem 0.9rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font: inherit;
    font-size: 1rem;
    transition: border-color 0.2s ease;
}

.category-search:focus {
    outline: none;
    border-color: #c89b3c;
}

.category-actions {
    display: flex;
    gap: 0.75rem;
}

.categories-loading {
    min-height: 220px;
}

.categories-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.category-row {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(180px, 1fr) minmax(160px, 1.2fr) auto;
    gap: 1rem;
    align-items: center;
    padding: 0.95rem 1rem;
    border: 2px solid #e8e8e8;
    border-radius: 10px;
    background: #fff;
    color: #1a1a1a;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
}

.category-row:hover {
    border-color: #c89b3c;
    box-shadow: 0 4px 12px rgba(200, 155, 60, 0.12);
}

.category-row.selected {
    border-color: #c89b3c;
    background: #fff8e8;
}

.category-row.assigned {
    border-left: 5px solid #2e7d32;
}

.category-name {
    font-weight: 700;
    font-size: 1rem;
}

.category-meta {
    color: #666;
    font-size: 0.95rem;
}

.category-status {
    color: #555;
    font-weight: 700;
    font-size: 0.9rem;
    white-space: nowrap;
}

.no-categories {
    padding: 2rem;
    border: 2px dashed #e0e0e0;
    border-radius: 10px;
    color: #666;
    text-align: center;
}

.participants-panel {
    width: 100%;
}

.participants-toolbar {
    display: grid;
    grid-template-columns: minmax(180px, 260px) minmax(220px, 1fr) auto;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
}

.club-select,
.participant-search {
    width: 100%;
    padding: 0.7rem 0.9rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font: inherit;
    font-size: 1rem;
    background: #fff;
    transition: border-color 0.2s ease;
}

.participant-search-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
}

.club-select:focus,
.participant-search:focus {
    outline: none;
    border-color: #c89b3c;
}

.participant-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
}

.selected-athlete-actions {
    margin-bottom: 1rem;
}

.participants-loading {
    min-height: 220px;
}

.participants-table-wrap {
    width: 100%;
    overflow-x: auto;
}

.participants-table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 10px;
    overflow: hidden;
}

.participants-table th,
.participants-table td {
    padding: 0.85rem 0.9rem;
    border-bottom: 1px solid #eeeeee;
    text-align: left;
    font-size: 0.95rem;
}

.participants-table th {
    background: #f7f7f7;
    color: #333;
    font-weight: 800;
}

.participants-table tbody tr {
    cursor: pointer;
    transition: background 0.2s ease;
}

.participants-table tbody tr:hover {
    background: #fffaf0;
}

.participants-table tbody tr.selected {
    background: #fff8e8;
}

.participants-table tbody tr.assigned {
    border-left: 5px solid #2e7d32;
}

.participants-pagination {
    display: flex;
    justify-content: center;
    margin-top: 1.25rem;
}

.participant-select-col {
    width: 48px;
    text-align: center;
}

.participant-select-col input {
    width: 18px;
    height: 18px;
    accent-color: #c89b3c;
}

.assignment-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.3rem 0.6rem;
    border-radius: 999px;
    background: #f1f1f1;
    color: #666;
    font-weight: 700;
    font-size: 0.85rem;
    white-space: nowrap;
}

.assignment-badge.assigned {
    background: #e8f5e9;
    color: #2e7d32;
}

.primary-btn,
.secondary-btn {
    min-width: 140px;
    padding: 0.7rem 1.15rem;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.primary-btn {
    border: none;
    background: linear-gradient(135deg, #c89b3c, #e0b456);
    color: white;
}

.primary-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.secondary-btn {
    border: 2px solid #c89b3c;
    background: white;
    color: #c89b3c;
}

.secondary-btn:disabled,
.primary-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .tournament-update-page {
        padding: 72px 1rem 32px;
    }

    .update-navigation,
    .update-content {
        padding: 1.5rem;
    }

    .update-tabs,
    .form-actions {
        flex-direction: column;
    }

    .update-tab {
        min-width: auto;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .date-range-field {
        flex-direction: column;
        align-items: stretch;
    }

    .categories-toolbar,
    .category-actions {
        flex-direction: column;
        align-items: stretch;
    }

    .category-search {
        width: 100%;
    }

    .category-row {
        grid-template-columns: 1fr;
        gap: 0.35rem;
    }

    .participants-toolbar {
        grid-template-columns: 1fr;
    }

    .participant-search-grid {
        grid-template-columns: 1fr;
    }

    .participant-actions {
        flex-direction: column;
    }
}
</style>
