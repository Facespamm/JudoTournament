<template>
    <div class="top-bar"></div>

    <div class="sidebar">
        <div class="sidebar-header">
            <h1
                class="sidebar-brand"
                role="button"
                tabindex="0"
                @click="RedirectToHome"
                @keydown.enter="RedirectToHome"
                @keydown.space.prevent="RedirectToHome"
            >
                <img :src="TrophyIcon" class="logo-icon" alt="Trophy" />
                <span class="header-text">Judo-Stream</span>
            </h1>
        </div>

        <nav class="nav-buttons">
            <button
                type="button"
                name="athletes_page"
                @click="RedirectToAthletes"
                :title="t('nav.athletes')"
            >
                <img
                    :src="UserIcon"
                    class="nav-icon"
                    :alt="t('nav.athletes')"
                />
                <span class="nav-text">{{ t("nav.athletes") }}</span>
            </button>
            <button
                type="button"
                name="clubs_page"
                @click="RedirectToClubs"
                :title="t('nav.clubs')"
            >
                <img :src="ClubIcon" class="nav-icon" :alt="t('nav.clubs')" />
                <span class="nav-text">{{ t("nav.clubs") }}</span>
            </button>
            <button
                v-if="canSee([ADMIN, REFEREE])"
                name="referee_page"
                @click="RedirectToReferee"
                :title="t('nav.referees')"
            >
                <img
                    :src="RefereeIcon"
                    class="nav-icon"
                    :alt="t('nav.referees')"
                />
                <span class="nav-text">{{ t("nav.referees") }}</span>
            </button>
            <button
                v-if="canSee([ADMIN])"
                type="button"
                name="admin_page"
                @click="RedirectToAdmin"
                :title="t('nav.admin')"
            >
                <img :src="AdminIcon" class="nav-icon" :alt="t('nav.admin')" />
                <span class="nav-text">{{ t("nav.admin") }}</span>
            </button>
        </nav>

        <div class="footer-nav">
            <button
                type="button"
                name="language_submit"
                @click="cycleLanguage"
                class="language-button"
                :title="t('nav.language')"
            >
                <img
                    :src="GlobeIcon"
                    class="nav-icon"
                    :alt="t('nav.language')"
                />
                <span class="lang-text">{{ currentLanguage.shortName }}</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth, USER_ROLES } from "@/composables/useAuth";
import { useI18n } from "@/i18n";
import HomeIcon from "@/components/icons/Home.png";
import UserIcon from "@/components/icons/Athletes.png";
import TrophyIcon from "@/components/icons/CupIconAdmin.png";
import GlobeIcon from "@/components/icons/LanguageSwitch.png";
import RefereeIcon from "@/components/icons/Referee.png";
import AdminIcon from "@/components/icons/Admin.png";
import ClubIcon from "@/components/icons/ClubIcon.png";

import {
    RedirectToHome,
    RedirectToAthletes,
    RedirectToTournament,
    RedirectToReferee,
    RedirectToAdmin,
    RedirectToClubs,
} from "@/router/redirect.js";

const { canSee } = useAuth();
const { ADMIN, REFEREE } = USER_ROLES;
const { locale, languages, currentLanguage, setLocale, t } = useI18n();

const isLanguageMenuOpen = ref(false);

const cycleLanguage = () => {
    const currentIndex = languages.findIndex(
        (lang) => lang.code === locale.value,
    );
    const nextIndex = (currentIndex + 1) % languages.length;
    setLocale(languages[nextIndex].code);
};
</script>

<style scoped>
.top-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    width: var(--sidebar-width);
    background: var(--sidebar-bg);
    border-right: 1px solid var(--sidebar-border);
    z-index: 1002;
}

.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: var(--sidebar-width);
    background: var(--sidebar-bg);
    border-right: 1px solid var(--sidebar-border);
    z-index: 1001;
    box-shadow: var(--shadow);
    overflow: hidden;

    /* Ключевое: flex колонка, пространство распределяется равномерно */
    display: flex;
    flex-direction: column;
    align-items: center;

    /* Отступы сверху и снизу — небольшие */
    padding: 1.2rem 0.8rem 1rem;
    box-sizing: border-box;
}

/* === ХЕДЕР === */
.sidebar-header {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Небольшой фиксированный отступ снизу от лого */
    padding-bottom: 0.8rem;
    border-bottom: 1px solid var(--sidebar-border);
    width: 100%;
    margin-bottom: 0;
}

.sidebar-header h1 {
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.45rem;
}

.sidebar-brand {
    cursor: pointer;
    border-radius: 10px;
    padding: 0.25rem;
    transition: background 0.2s ease;
}

.sidebar-brand:hover {
    background: var(--hover-bg);
}

.sidebar-brand:focus-visible {
    outline: 2px solid var(--active-color);
    outline-offset: 3px;
}

.logo-icon {
    width: clamp(54px, 6vh, 72px);
    height: clamp(54px, 6vh, 72px);
    object-fit: contain;
}

.header-text {
    font-size: clamp(1.05rem, 1.55vh, 1.25rem);
    font-weight: 800;
    color: var(--text-color);
    white-space: nowrap;
}

/* === НАВИГАЦИЯ — занимает всё свободное пространство между хедером и футером === */
.nav-buttons {
    flex: 1; /* растягивается на всё доступное место */
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* space-evenly равномерно раскидывает кнопки по всей высоте */
    justify-content: space-evenly;
    padding: 0.4rem 0;
}

.nav-buttons button,
.language-button {
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    border-radius: 12px;
    padding: clamp(0.4rem, 0.9vh, 0.8rem) 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(0.2rem, 0.5vh, 0.45rem);
    transition: all 0.25s ease;
    width: 100%;
}

.nav-buttons button:hover,
.language-button:hover {
    background-color: var(--hover-bg);
    color: var(--active-color);
    transform: scale(1.06);
}

.nav-buttons button:active,
.language-button:active {
    background-color: #fff8e1;
    color: var(--active-color);
}

.nav-icon {
    width: clamp(34px, 4.3vh, 48px);
    height: clamp(34px, 4.3vh, 48px);
    object-fit: contain;
}

.nav-text,
.lang-text {
    font-size: clamp(0.82rem, 1.15vh, 0.98rem);
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
    white-space: nowrap;
}

/* === ФУТЕР: ЯЗЫК === */
.footer-nav {
    flex-shrink: 0;
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    padding-top: 0.6rem;
    border-top: 1px solid var(--sidebar-border);
}

/* Меню языков */
.language-menu {
    position: absolute;
    left: 100%;
    margin-left: 12px;
    bottom: 0;
    width: 210px;
    background: white;
    border-radius: 12px;
    box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    border: 1px solid var(--sidebar-border);
    z-index: 1003;
}

.language-option {
    width: 100%;
    padding: 0.85rem 1.2rem;
    background: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-color);
    transition: all 0.2s ease;
    border-bottom: 1px solid #f0f0f0;
}

.language-option:last-child {
    border-bottom: none;
}
.language-option:hover {
    background-color: var(--hover-bg);
    color: var(--active-color);
}
.language-option.active {
    background-color: #fff8e1;
    color: var(--active-color);
    font-weight: 600;
}

.lang-flag {
    font-size: 1.4rem;
}
.lang-name {
    flex: 1;
    font-size: 0.95rem;
}

/* Анимация меню */
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.3s ease;
}
.slide-right-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}
.slide-right-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

/* =============================================
   АДАПТИВНОСТЬ ПО ВЫСОТЕ
   На маленькой высоте текст скрывается
============================================= */
@media (max-height: 700px) {
    .header-text {
        display: none;
    }
    .nav-text,
    .lang-text {
        display: none;
    }
    .sidebar {
        padding: 0.8rem 0.6rem 0.8rem;
    }
    .sidebar-header {
        padding-bottom: 0.5rem;
    }
    .footer-nav {
        padding-top: 0.4rem;
    }
}
</style>
