<template>
    <div class="tournament-view">
        <!-- Загрузка -->
        <div
            v-if="tournamentLoading"
            class="loading"
            style="text-align: center; padding: 4rem"
        >
            {{ t("registrationTournament.loadingTournament") }}
        </div>

        <!-- Ошибка -->
        <div
            v-else-if="tournamentError"
            class="error"
            style="text-align: center; padding: 4rem; color: #e53e3e"
        >
            {{ tournamentError }}
        </div>

        <template v-else>
            <!-- Заголовок и статус -->
            <div class="header">
                <button class="btn-back" @click="router.back()">
                    {{ t("registrationTournament.back") }}
                </button>
                <h1 class="title">
                    {{
                        tournament.name ||
                        t("registrationTournament.tournamentNameFallback")
                    }}
                </h1>
                <span class="status-tag" :class="statusClass">{{
                    statusText
                }}</span>
            </div>

            <!-- Краткая информация -->
            <div class="info-cards">
                <div class="info-card">
                    <strong>{{ t("registrationTournament.date") }}</strong>
                    <span>{{
                        formatDate(tournament.start_date, tournament.end_date)
                    }}</span>
                </div>
                <div class="info-card">
                    <strong>{{ t("registrationTournament.location") }}</strong>
                    <span>{{ getLocation(tournament) }}</span>
                </div>
                <div class="info-card">
                    <strong>{{
                        t("registrationTournament.participants")
                    }}</strong>
                    <span
                        >{{ tournament.athletes_count || 0 }}
                        {{ t("registrationTournament.peopleShort") }}</span
                    >
                </div>
                <div class="info-card">
                    <strong>{{ t("registrationTournament.tatami") }}</strong>
                    <span>{{ tournament.tatami_count || 0 }}</span>
                </div>
            </div>

            <!-- Описание -->
            <section class="section description-section">
                <h2 class="section-title">
                    {{ t("registrationTournament.about") }}
                </h2>
                <p class="description-text">
                    {{
                        tournament.description ||
                        t("registrationTournament.noDescription")
                    }}
                </p>
            </section>

            <!-- Фильтры и поиск -->
            <section class="section filters-section">
                <div class="filters-grid">
                    <div class="filter-group">
                        <label for="club-select" class="filter-label">{{
                            t("registrationTournament.club")
                        }}</label>
                        <select
                            id="club-select"
                            v-model="selectedClubId"
                            :disabled="loadingClubs"
                            class="select-input"
                        >
                            <option value="">
                                {{ t("registrationTournament.allClubs") }}
                            </option>
                            <option
                                v-for="club in clubs"
                                :key="club.id"
                                :value="club.id"
                            >
                                {{ club.name }} ({{ club.city }})
                            </option>
                        </select>
                        <small v-if="loadingClubs" class="text-muted">{{
                            t("registrationTournament.loadingClubs")
                        }}</small>
                        <small v-if="clubsError" class="text-error">{{
                            clubsError
                        }}</small>

                        <!--<label for="category-select" class="filter-label mt-1">Категория *</label>
            <select id="category-select" v-model="selectedCategoryId" :disabled="categoriesLoading" class="select-input" required>
              <option value="">Выберите категорию</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
                {{ cat.gender ? ` (${cat.gender === 'MALE' ? 'М' : cat.gender === 'FEMALE' ? 'Ж' : cat.gender})` : '' }}
                {{ cat.min_age !== undefined && cat.max_age !== undefined ? `, ${cat.min_age}-${cat.max_age} лет` : '' }}
                {{ cat.min_weight !== undefined && cat.max_weight !== undefined ? `, ${cat.min_weight}-${cat.max_weight} кг` : '' }}
              </option>
            </select>
            <small v-if="categoriesLoading" class="text-muted">Загрузка категорий...</small>-->

                        <button
                            v-if="selectedClubId"
                            @click="registerClub"
                            :disabled="loadingClubs || registeringClub"
                            class="btn btn-primary mt-1"
                        >
                            {{
                                registeringClub
                                    ? t("registrationTournament.registering")
                                    : t("registrationTournament.registerClub")
                            }}
                        </button>
                        <small
                            v-if="clubRegistrationMessage"
                            :class="clubRegistrationClass"
                        >
                            {{ clubRegistrationMessage.text }}
                        </small>
                    </div>

                    <div class="search-group">
                        <h3 class="search-title">
                            {{ t("registrationTournament.searchByName") }}
                        </h3>
                        <div class="search-inputs">
                            <input
                                v-model="searchLastName"
                                type="text"
                                :placeholder="
                                    t('registrationTournament.lastName')
                                "
                                class="text-input"
                            />
                            <input
                                v-model="searchFirstName"
                                type="text"
                                :placeholder="
                                    t('registrationTournament.firstName')
                                "
                                class="text-input"
                            />
                            <input
                                v-model="searchMiddleName"
                                type="text"
                                :placeholder="
                                    t('registrationTournament.middleName')
                                "
                                class="text-input"
                            />
                            <div class="search-actions">
                                <button
                                    @click="handleSearch"
                                    :disabled="loadingAthletes"
                                    class="btn btn-primary"
                                >
                                    {{
                                        loadingAthletes
                                            ? t(
                                                  "registrationTournament.searching",
                                              )
                                            : t("registrationTournament.find")
                                    }}
                                </button>
                                <button
                                    @click="handleClearSearch"
                                    class="btn btn-secondary"
                                >
                                    {{ t("registrationTournament.reset") }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Таблица атлетов -->
            <section class="section athletes-section">
                <div class="section-header">
                    <h2 class="section-title">
                        {{
                            t("registrationTournament.athletesForRegistration")
                        }}
                    </h2>
                    <div v-if="filteredAthletes.length" class="counter">
                        {{
                            t("registrationTournament.found", {
                                count: filteredAthletes.length,
                            })
                        }}
                    </div>
                    <button
                        v-if="filteredAthletes.length > 0"
                        @click="registerAthletes"
                        :disabled="
                            loadingAthletes ||
                            selectedAthletes.length === 0 ||
                            registeringAthletes
                        "
                        class="btn btn-primary"
                    >
                        <!--|| !selectedCategoryId -->
                        {{
                            registeringAthletes
                                ? t("registrationTournament.registering")
                                : t("registrationTournament.registerSelected")
                        }}
                    </button>
                </div>

                <div v-if="loadingAthletes" class="loading">
                    {{ t("registrationTournament.loadingAthletes") }}
                </div>
                <div v-if="athletesError" class="error">
                    {{ athletesError }}
                </div>
                <small
                    v-if="athletesRegistrationMessage"
                    :class="athletesRegistrationClass"
                >
                    {{ athletesRegistrationMessage.text }}
                </small>

                <div class="table-container">
                    <table
                        class="athletes-table"
                        v-if="filteredAthletes.length"
                    >
                        <colgroup>
                            <col class="col-select" />
                            <col class="col-number" />
                            <col class="col-name" />
                            <col class="col-gender" />
                            <col class="col-age" />
                            <col class="col-club" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th class="admin-col-select">
                                    <input
                                        type="checkbox"
                                        :checked="isAllSelected"
                                        @change="toggleAll"
                                    />
                                </th>
                                <th>#</th>
                                <th>
                                    {{ t("registrationTournament.fullName") }}
                                </th>
                                <th>
                                    {{ t("registrationTournament.gender") }}
                                </th>
                                <th>{{ t("registrationTournament.age") }}</th>
                                <th>{{ t("registrationTournament.club") }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(athlete, index) in filteredAthletes"
                                :key="athlete.id"
                                class="admin-table-row"
                                :class="{
                                    'admin-selected-row':
                                        selectedAthletes.includes(athlete.id),
                                }"
                                @click.stop="toggleSelect(athlete.id)"
                            >
                                <td class="admin-col-select">
                                    <input
                                        type="checkbox"
                                        :checked="
                                            selectedAthletes.includes(
                                                athlete.id,
                                            )
                                        "
                                    />
                                </td>
                                <td>{{ index + 1 }}</td>
                                <td
                                    :data-label="
                                        t('registrationTournament.fullName')
                                    "
                                >
                                    <div class="athlete-name">
                                        {{ fullAthleteName(athlete) }}
                                    </div>
                                </td>
                                <td
                                    :data-label="
                                        t('registrationTournament.gender')
                                    "
                                >
                                    <span
                                        class="admin-athletes-count gender-badge"
                                        :style="
                                            athlete.gender?.toLowerCase() ===
                                            'male'
                                                ? 'background: linear-gradient(135deg,#1e88e5,#42a5f5)'
                                                : 'background: linear-gradient(135deg,#d81b60,#f06292)'
                                        "
                                    >
                                        {{
                                            athlete.gender?.toLowerCase() ===
                                            "male"
                                                ? t(
                                                      "registrationTournament.maleShort",
                                                  )
                                                : t(
                                                      "registrationTournament.femaleShort",
                                                  )
                                        }}
                                    </span>
                                </td>
                                <td
                                    :data-label="
                                        t('registrationTournament.age')
                                    "
                                >
                                    <span class="admin-athletes-count">{{
                                        athlete.age ?? "—"
                                    }}</span>
                                </td>
                                <td
                                    :data-label="
                                        t('registrationTournament.club')
                                    "
                                    class="admin-short-name"
                                >
                                    {{ getClubName(athlete.clubId) || "—" }}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div v-else class="empty-state">
                        <p>
                            {{ t("registrationTournament.athletesNotFound") }}
                        </p>
                        <small>{{
                            t("registrationTournament.emptyHint")
                        }}</small>
                    </div>
                </div>
                <div
                    v-if="athletesHasMore"
                    class="athletes-pagination"
                >
                    <button
                        type="button"
                        class="btn btn-secondary"
                        :disabled="loadingMoreAthletes"
                        @click="loadMoreAthletes"
                    >
                        {{
                            loadingMoreAthletes
                                ? t("registrationTournament.loadingAthletes")
                                : t("athletesPage.loadMore")
                        }}
                    </button>
                </div>
            </section>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "@/i18n";
import { getClubs } from "@/components/View/Clubs/fetchClubs.js";
import { fetchTournamentDetail } from "@/components/View/TournamentDetails/fetchTournamentDetail.js";
import { fetchCategories } from "@/components/View/TournamentManagement/fetchTournamentManagement.js";
import {
    getClubAthletes,
    addClubToTournament,
    addAthletesToTournament,
    getAllAthletesForRegister,
} from "@/components/View/RegistrationAthletesTournament/fetchRegistrationAthletesTornament.js";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const tournamentId = ref(
    localStorage.getItem("registrationTournamentId") || route.params.id || null,
);

// === Данные турнира ===
const tournament = ref({});
const tournamentLoading = ref(false);
const tournamentError = ref(null);

const loadTournament = async () => {
    if (!tournamentId.value) {
        tournamentError.value = t("registrationTournament.tournamentIdMissing");
        return;
    }
    tournamentLoading.value = true;
    tournamentError.value = null;
    try {
        const data = await fetchTournamentDetail(tournamentId.value);
        tournament.value = data;
    } catch (err) {
        tournamentError.value = t("registrationTournament.tournamentLoadError");
        console.error(err);
    } finally {
        tournamentLoading.value = false;
    }
};

// === Остальные состояния ===
const clubs = ref([]);
const loadingClubs = ref(false);
const clubsError = ref(null);

const categories = ref([]);
const categoriesLoading = ref(false);

const athletes = ref([]);
const loadingAthletes = ref(false);
const loadingMoreAthletes = ref(false);
const athletesError = ref(null);
const athletesPerPage = 10;
const athletesCurrentPage = ref(1);
const athletesHasMore = ref(true);

const selectedClubId = ref("");
const selectedCategoryId = ref("");
const searchLastName = ref("");
const searchFirstName = ref("");
const searchMiddleName = ref("");
const selectedAthletes = ref([]);

const clubRegistrationMessage = ref(null);
const athletesRegistrationMessage = ref(null);
const registeringClub = ref(false);
const registeringAthletes = ref(false);

// === Вспомогательные ===
const formatDate = (start, end) => {
    if (!start) return t("registrationTournament.dateMissing");
    const locale = t("registrationTournament.dateLocale");
    const s = new Date(start).toLocaleDateString(locale);
    if (!end || start === end) return s;
    return `${s} – ${new Date(end).toLocaleDateString(locale)}`;
};

const getLocation = (tournament) =>
    [tournament.city, tournament.country].filter(Boolean).join(", ") ||
    t("registrationTournament.locationMissing");

const statusText = computed(() => {
    switch (tournament.value.status) {
        case "REGISTRATION":
            return t("registrationTournament.registrationOpen");
        case "LIVE":
            return t("registrationTournament.live");
        case "COMPLETED":
            return t("registrationTournament.completed");
        default:
            return t("registrationTournament.planned");
    }
});

const statusClass = computed(
    () => `status-${(tournament.value.status || "planned").toLowerCase()}`,
);

const getClubName = (clubId) =>
    clubs.value.find((c) => c.id === clubId)?.name || "—";

const fullAthleteName = (athlete) =>
    [athlete.lastName, athlete.firstName, athlete.middleName]
        .map((p) => p?.trim())
        .filter(Boolean)
        .join(" ") || "—";

const filteredAthletes = computed(() => {
    let list = athletes.value.slice();
    if (selectedClubId.value && tournamentId.value) {
        const tid = Number(tournamentId.value);
        list = list.filter(
            (a) => !a.tournaments?.some((t) => t.tournament_id === tid),
        );
    }
    return list;
});

const clubRegistrationClass = computed(() =>
    clubRegistrationMessage.value?.type === "error"
        ? "text-error"
        : "text-success",
);

const athletesRegistrationClass = computed(() =>
    athletesRegistrationMessage.value?.type === "error"
        ? "text-error"
        : "text-success",
);

// === Загрузка атлетов ===
const athleteSearchQuery = computed(() =>
    [searchLastName.value, searchFirstName.value, searchMiddleName.value]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(" "),
);

const loadAthletes = async ({ append = false } = {}) => {
    if (append) {
        if (
            loadingAthletes.value ||
            loadingMoreAthletes.value ||
            !athletesHasMore.value
        ) {
            return;
        }
        loadingMoreAthletes.value = true;
    } else {
        loadingAthletes.value = true;
        athletesCurrentPage.value = 1;
        athletesHasMore.value = true;
        athletes.value = [];
        selectedAthletes.value = [];
    }

    athletesError.value = null;

    try {
        const page = append ? athletesCurrentPage.value + 1 : 1;
        const result = selectedClubId.value && !athleteSearchQuery.value
            ? await getClubAthletes(selectedClubId.value, {
                  tournamentId: tournamentId.value,
                  page,
                  perPage: athletesPerPage,
              })
            : await getAllAthletesForRegister({
                  tournamentId: tournamentId.value,
                  clubId: selectedClubId.value || undefined,
                  search: athleteSearchQuery.value || undefined,
                  page,
                  perPage: athletesPerPage,
              });

        if (result?.athletes) {
            const nextAthletes = Object.values(result.athletes).map((athlete) =>
                mapAthlete(
                    athlete,
                    selectedClubId.value ? Number(selectedClubId.value) : null,
                ),
            );
            athletes.value = append
                ? [...athletes.value, ...nextAthletes]
                : nextAthletes;
            athletesCurrentPage.value = page;
            athletesHasMore.value = nextAthletes.length === athletesPerPage;
        } else {
            athletesError.value =
                result?.error || t("registrationTournament.athletesLoadError");
        }
    } catch (err) {
        athletesError.value = t("registrationTournament.athletesLoadFailed");
    } finally {
        loadingAthletes.value = false;
        loadingMoreAthletes.value = false;
    }
};

const loadMoreAthletes = () => loadAthletes({ append: true });

const mapAthlete = (a, clubId = null) => ({
    id: a.id,
    lastName: a.last_name?.trim() || "",
    firstName: a.first_name?.trim() || "",
    middleName: a.middle_name?.trim() || "",
    gender: a.gender,
    age: a.age,
    currentWeight: a.current_weight ?? null,
    categoryName: a.rank || "—",
    clubId: clubId ?? a.club_id ?? null,
    phoneNumber: a.license_number || "—",
    tournaments: a.tournaments || [],
});

// === Инициализация ===
onMounted(async () => {
    await loadTournament();

    loadingClubs.value = true;
    try {
        clubs.value = await getClubs();
    } catch {
        clubsError.value = t("registrationTournament.clubsLoadFailed");
    } finally {
        loadingClubs.value = false;
    }

    categoriesLoading.value = true;
    try {
        const result = await fetchCategories();
        if (result.success) {
            categories.value =
                result.data?.categories || result.categories || [];
        }
    } catch (err) {
        console.error("Ошибка загрузки категорий:", err);
    } finally {
        categoriesLoading.value = false;
    }

    await loadAthletes();
});

// === Выбор клуба ===
watch(selectedClubId, async () => {
    await loadAthletes();
});

// === Поиск ===
const handleSearch = async () => {
    if (
        !searchLastName.value &&
        !searchFirstName.value &&
        !searchMiddleName.value
    ) {
        handleClearSearch();
        return;
    }
    await loadAthletes();
};

const handleClearSearch = () => {
    searchLastName.value = "";
    searchFirstName.value = "";
    searchMiddleName.value = "";
    selectedClubId.value = "";
    selectedCategoryId.value = "";
    athletesError.value = null;
    selectedAthletes.value = [];
    loadAthletes();
};

// === Регистрация клуба ===
const registerClub = async () => {
    if (!selectedClubId.value || !tournamentId.value) return;
    registeringClub.value = true;
    clubRegistrationMessage.value = null;
    try {
        const result = await addClubToTournament(
            tournamentId.value,
            selectedClubId.value,
        );
        clubRegistrationMessage.value = result.success
            ? {
                  type: "success",
                  text: t("registrationTournament.clubRegistered"),
              }
            : {
                  type: "error",
                  text:
                      result.error ||
                      t("registrationTournament.clubRegistrationError"),
              };
    } catch {
        clubRegistrationMessage.value = {
            type: "error",
            text: t("registrationTournament.clubRegistrationFailed"),
        };
    } finally {
        registeringClub.value = false;
    }
};

function toggleSelect(id) {
    const idx = selectedAthletes.value.indexOf(id);
    console.log(selectedAthletes.value[idx]);
    if (idx === -1) selectedAthletes.value.push(id);
    else selectedAthletes.value.splice(idx, 1);
}

// === Регистрация атлетов ===
const registerAthletes = async () => {
    if (!selectedAthletes.value.length || !tournamentId.value) return;
    // if (!selectedCategoryId.value) {
    //   athletesRegistrationMessage.value = 'Ошибка: выберите категорию!'
    //   return
    // }
    registeringAthletes.value = true;
    athletesRegistrationMessage.value = null;
    try {
        const result = await addAthletesToTournament(tournamentId.value, {
            category_id: Number(selectedCategoryId.value),
            athlete_ids: selectedAthletes.value,
        });
        athletesRegistrationMessage.value = result.success
            ? {
                  type: "success",
                  text: t("registrationTournament.athletesRegistered", {
                      count: selectedAthletes.value.length,
                  }),
              }
            : {
                  type: "error",
                  text:
                      result.error ||
                      t("registrationTournament.athletesRegistrationError"),
              };

        if (result.success) {
            selectedAthletes.value = [];
            await loadAthletes();
            // Обновляем счётчик участников турнира
            await loadTournament();
        }
    } catch {
        athletesRegistrationMessage.value = {
            type: "error",
            text: t("registrationTournament.athletesRegistrationError"),
        };
    } finally {
        registeringAthletes.value = false;
    }
};

const isAllSelected = computed(
    () =>
        filteredAthletes.value.length > 0 &&
        filteredAthletes.value.every((a) =>
            selectedAthletes.value.includes(a.id),
        ),
);

function toggleAll() {
    if (isAllSelected.value) {
        const filteredIds = filteredAthletes.value.map((a) => a.id);
        selectedAthletes.value = selectedAthletes.value.filter(
            (id) => !filteredIds.includes(id),
        );
    } else {
        filteredAthletes.value.forEach((a) => {
            if (!selectedAthletes.value.includes(a.id))
                selectedAthletes.value.push(a.id);
        });
    }
}
</script>

<style scoped>
.tournament-view {
    min-height: 100vh;
    background: #ffffff;
    padding: 5px 2rem 4rem;
    max-width: 1600px;
    margin: 0 auto;
    font-family:
        "SF Pro Display",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        sans-serif;
    color: #1a1a1a;
}
.header {
    display: grid;
    grid-template-columns: minmax(9rem, 1fr) minmax(0, auto) minmax(9rem, 1fr);
    align-items: center;
    gap: 1rem;
    min-height: 4.5rem;
    padding-top: 5px;
    text-align: center;
    margin-bottom: 2rem;
}
.title {
    grid-column: 2;
    line-height: 1.15;
    font-size: 2.6rem;
    font-weight: 900;
    background: linear-gradient(90deg, #c89b3c, #f4d03f);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
}
.status-tag {
    grid-column: 3;
    justify-self: end;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 0;
    padding: 0.5rem 1.2rem;
    border-radius: 30px;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}
.status-registration {
    background: #d69e2e;
    color: white;
}
.status-live {
    background: #e53e3e;
    color: white;
    animation: pulse 1.8s infinite;
}
.status-completed {
    background: #38a169;
    color: white;
}
.status-planned {
    background: #3182ce;
    color: white;
}
@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
}
.info-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin: 0 auto 3rem;
    max-width: 100%;
}
.info-card {
    background: white;
    padding: 1.4rem;
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    border-top: 5px solid #c89b3c;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}
.info-card strong {
    font-size: 0.9rem;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
}
.info-card span {
    font-size: 1.3rem;
    font-weight: 800;
    color: #1a1a1a;
}
.section {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 2.5rem;
    border-top: 5px solid #c89b3c;
    padding: 1rem;
}
.section-title {
    font-size: 1.6rem;
    font-weight: 800;
    color: #c89b3c;
    margin: 0;
    padding: 1rem 1rem;
    background: white;
    border-bottom: 1px solid #eee;
}
.description-text {
    padding: 1.3rem;
    font-size: 1.05rem;
    color: #444;
    white-space: pre-line;
}
.filters-section .filters-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    padding: 1.8rem 1.6rem;
}
.filter-group,
.search-group {
    background: #f9f9fb;
    padding: 1rem;
    border-radius: 16px;
}
.filter-label,
.search-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.8rem;
    display: block;
}
.select-input,
.text-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 14px;
    font-size: 1rem;
    font-weight: 600;
    background: white;
    box-sizing: border-box;
}
.select-input:focus,
.text-input:focus {
    border-color: #c89b3c;
    box-shadow: 0 0 0 3px rgba(200, 155, 60, 0.15);
}
.search-inputs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.2rem;
}
.search-actions {
    display: flex;
    gap: 0.8rem;
}
.btn {
    padding: 0.75rem 1.6rem;
    border: none;
    border-radius: 14px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s;
}
.btn-primary {
    background: linear-gradient(135deg, #c89b3c, #f4d03f);
    color: white;
    box-shadow: 0 3px 10px rgba(200, 155, 60, 0.25);
}
.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(200, 155, 60, 0.35);
}
.btn-secondary {
    background: #6c757d;
    color: white;
}
.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.mt-1 {
    margin-top: 1rem;
}
.athletes-section .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 1.2rem 1.6rem;
    border-bottom: 1px solid #eee;
}
.counter {
    background: #fffbeb;
    color: #92400e;
    padding: 0.5rem 1.2rem;
    border-radius: 30px;
    font-weight: 700;
    font-size: 0.9rem;
}
.table-container {
    overflow-x: auto;
    padding: 0 1rem 1rem;
}
.athletes-pagination {
    display: flex;
    justify-content: center;
    padding: 0 1rem 1.25rem;
}
.athletes-table {
    width: 100%;
    min-width: 760px;
    table-layout: fixed;
    border-collapse: collapse;
    font-size: 0.95rem;
}
.col-select {
    width: 3rem;
}
.col-number {
    width: 4rem;
}
.col-name {
    width: 42%;
}
.col-gender {
    width: 9rem;
}
.col-age {
    width: 9rem;
}
.col-club {
    width: 18rem;
}
.athletes-table th {
    background: white;
    color: #333;
    font-weight: 700;
    padding: 1rem 0.75rem;
    text-align: left;
    text-transform: uppercase;
    font-size: 0.85rem;
    border-bottom: 1px solid #e5e7eb;
}
.athletes-table td {
    padding: 1rem 0.75rem;
    position: relative;
    vertical-align: middle;
    border-bottom: 1px solid rgba(203, 213, 225, 0.5);
}
.athletes-table th:nth-child(4),
.athletes-table th:nth-child(5),
.athletes-table td:nth-child(4),
.athletes-table td:nth-child(5) {
    text-align: center;
}
.athletes-table tbody tr {
    position: relative;
    cursor: pointer;
    transition: background 0.3s;
}
.athletes-table tbody tr:hover {
    background: #fdfdfb;
}
.admin-selected-row {
    background: #fff8e1;
}
.admin-col-select {
    width: 3rem;
    text-align: center;
}
.admin-col-select input {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
}
.athlete-name {
    font-size: 1.15rem;
    font-weight: 700;
    color: #000;
    overflow-wrap: anywhere;
}
.admin-athletes-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    padding: 0.3rem 0.65rem;
    border-radius: 999px;
    background: #f3f4f6;
    color: #1f2937;
    font-weight: 700;
    font-size: 0.85rem;
}
.gender-badge {
    color: #ffffff;
}
.admin-short-name {
    font-weight: 600;
    color: #374151;
    overflow-wrap: anywhere;
}
.contact {
    font-family: "Courier New", monospace;
    font-weight: 600;
    color: #555;
}
.empty-state {
    text-align: center;
    padding: 4rem 1.6rem;
    color: #666;
}
.empty-state p {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
}
.loading,
.error {
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
}
.text-success {
    color: #28a745;
    font-weight: 700;
}
.text-error {
    color: #e53e3e;
    font-weight: 700;
}
.text-muted {
    color: #888;
    font-style: italic;
}
@media (max-width: 1200px) {
    .filters-grid {
        grid-template-columns: 1fr;
    }
}
@media (max-width: 992px) {
    .search-inputs {
        grid-template-columns: 1fr;
    }
    .info-cards {
        grid-template-columns: 1fr 1fr;
    }
}
@media (max-width: 768px) {
    .header {
        grid-template-columns: 1fr;
        justify-items: center;
    }
    .title,
    .status-tag,
    .btn-back {
        grid-column: 1;
    }
    .title {
        font-size: 2.2rem;
    }
    .section-title {
        font-size: 1.5rem;
    }
    .info-cards {
        grid-template-columns: 1fr;
    }
}

.btn-back {
    grid-column: 1;
    justify-self: start;
    align-self: center;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f1f5f9;
    color: #334155;
    border: none;
    border-radius: 10px;
    padding: 0.5rem 1.2rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 0;
}
.btn-back:hover {
    background: #e2e8f0;
}
</style>
