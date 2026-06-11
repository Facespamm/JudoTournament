<template>
    <div
        class="auth-background"
        :style="{ backgroundImage: `url(${BackgroundImage})` }"
    >
        <div class="auth-language-switcher" :aria-label="t('nav.language')">
            <button
                v-for="lang in languages"
                :key="lang.code"
                type="button"
                class="auth-language-btn"
                :class="{ active: locale === lang.code }"
                :disabled="isLoading"
                @click="setLocale(lang.code)"
            >
                {{ lang.shortName }}
            </button>
        </div>

        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h1 class="title-login">
                        <img
                            :src="TrophyIcon"
                            alt="Trophy"
                            class="header-icon"
                        />
                        {{ t("authPages.loginTitle") }}
                    </h1>
                    <p class="subtitle-login">
                        <span class="judo">Judo</span
                        ><span class="stream">-Stream</span>
                    </p>
                    <p class="welcome-text">{{ t("authPages.welcome") }}</p>
                </div>

                <form @submit.prevent="handleLogin" class="auth-form">
                    <div class="input-group">
                        <label for="login" class="form-title">{{
                            t("authPages.login")
                        }}</label>
                        <input
                            id="login"
                            v-model="form.username"
                            type="text"
                            :placeholder="t('authPages.loginPlaceholder')"
                            required
                            autocomplete="username"
                            :disabled="isLoading"
                        />
                    </div>

                    <div class="input-group">
                        <label for="password" class="form-title">{{
                            t("authPages.password")
                        }}</label>
                        <input
                            id="password"
                            v-model="form.password"
                            type="password"
                            :placeholder="t('authPages.passwordPlaceholder')"
                            required
                            autocomplete="current-password"
                            :disabled="isLoading"
                        />
                    </div>

                    <button
                        type="submit"
                        class="btn-primary"
                        :disabled="isLoading"
                    >
                        <span v-if="isLoading">{{
                            t("authPages.loggingIn")
                        }}</span>
                        <span v-else>{{ t("authPages.signIn") }}</span>
                    </button>
                </form>

                <div class="auth-footer">
                    <p>{{ t("authPages.noAccount") }}</p>
                    <button
                        @click="RedirectToRegistration"
                        class="btn-link"
                        :disabled="isLoading"
                    >
                        {{ t("authPages.register") }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Уведомление об ошибке (опционально) -->
        <div v-if="errorMessage" class="error-notification">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import TrophyIcon from "@/components/icons/CupIconAdmin.png";
import BackgroundImage from "@/assets/Background.png";
import { fetchLogin } from "@/components/View/Authentication/Login/Login.js";
import { useAuthStore } from "@/components/stores/authStore.js"; // предполагаем, что у вас есть Pinia store
import { useI18n } from "@/i18n";
import "./Login.css";

const router = useRouter();
const authStore = useAuthStore(); // если используете Pinia
const { locale, languages, setLocale, t } = useI18n();

const form = ref({
    username: "",
    password: "",
});

const isLoading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
    if (!form.value.username.trim() || !form.value.password) {
        errorMessage.value = t("authPages.fillLoginPassword");
        return;
    }

    isLoading.value = true;
    errorMessage.value = "";

    try {
        const payload = {
            username: form.value.username.trim(),
            password: form.value.password,
        };

        console.log("Отправка на логин:", payload);

        const response = await fetchLogin(payload);

        console.log("Ответ сервера:", response);

        if (response?.success === true && response?.token) {
            const token = response.token;
            const user = response.user || {};

            // Сохраняем токен и данные пользователя
            authStore.setToken(token);
            authStore.setUser({
                id: user.id,
                name: user.name?.trim() || "",
                username: user.username,
                role: user.role || "Зритель",
            });

            // Можно сохранить в localStorage / cookies как fallback
            localStorage.setItem("jwt_token", token);
            localStorage.setItem("user_data", JSON.stringify(user));

            // Успешный вход — перенаправление на главную страницу
            router.push("/Home");
        } else {
            errorMessage.value =
                response?.message || t("authPages.invalidCredentials");
        }
    } catch (err) {
        console.error("Ошибка авторизации:", err);
        errorMessage.value =
            err.response?.data?.message || t("authPages.serverError");
    } finally {
        isLoading.value = false;
    }
};

const RedirectToRegistration = () => {
    if (!isLoading.value) {
        router.push({ name: "registration" });
    }
};
</script>

<style scoped>
/* Стили для уведомления об ошибке */
.error-notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #f44336;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    max-width: 90%;
    text-align: center;
    font-size: 0.95rem;
}

.auth-language-switcher {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1001;
    display: flex;
    gap: 6px;
    padding: 6px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(200, 155, 60, 0.25);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
    backdrop-filter: blur(8px);
}

.auth-language-btn {
    min-width: 38px;
    height: 32px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #333;
    font-size: 0.78rem;
    font-weight: 800;
    cursor: pointer;
    transition:
        background 0.2s ease,
        color 0.2s ease;
}

.auth-language-btn.active {
    background: #c89b3c;
    color: #fff;
}

.auth-language-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

@media (max-width: 480px) {
    .auth-language-switcher {
        top: 12px;
        right: 12px;
    }
}
</style>
