<template>
  <div class="auth-background" :style="{ backgroundImage: `url(${BackgroundImage})` }">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="title-registration">
            <img :src="TrophyIcon" alt="Trophy" class="header-icon" />
            Регистрация
          </h1>
          <p class="subtitle-registration">
            <span class="judo">Judo</span><span class="stream">-Stream</span>
          </p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="input-group">
            <label class="form-title">Логин</label>
            <input
                type="text"
                v-model="form.login"
                name="auth_login"
                required
                maxlength="50"
                placeholder="judoCoolName"
            />
          </div>

          <div class="input-group">
            <label class="form-title">Имя пользователя</label>
            <input
                type="text"
                v-model="form.name"
                name="auth_name"
                required
                minlength="3"
                maxlength="50"
                placeholder="Саша"
            />
          </div>

          <div class="input-group">
            <label class="form-title">Электронная почта</label>
            <input
                type="email"
                v-model="form.email"
                name="auth_email"
                placeholder="example@example.com"
            />
          </div>

          <div class="input-group">
            <label class="form-title">Телефон</label>
            <input
                type="tel"
                v-model="form.phone"
                maxlength="18"
                placeholder="+7 (999) 999-9999"
            />
          </div>

          <div class="input-group">
            <label class="form-title">Пароль</label>
            <input
                type="password"
                v-model="form.password"
                name="auth_password"
                required
                maxlength="50"
            />
          </div>

          <div class="input-group">
            <label class="form-title">Повторить пароль</label>
            <input
                type="password"
                v-model="form.passwordConfirm"
                required
                maxlength="50"
            />
          </div>

          <button type="submit" class="btn-primary">
            Зарегистрироваться
          </button>
        </form>

        <div class="auth-footer">
          <p>Уже есть аккаунт?</p>
          <button @click="RedirectToLogin" class="btn-link">
            Войти
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TrophyIcon from '@/components/icons/CupIcon.png'
import BackgroundImage from '@/assets/Background.png'

const router = useRouter()

const form = ref({
  login: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: ''
})

const handleRegister = () => {
  if (form.value.password !== form.value.passwordConfirm) {
    alert('Пароли не совпадают!')
    return
  }

  if (!form.value.login || !form.value.name || !form.value.password) {
    alert('Заполните все обязательные поля!')
    return
  }

  console.log('Регистрация:', form.value)
  // router.push('/home')
}

const RedirectToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<style scoped>
/* === ФОН === */
.auth-background {
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem 1rem;
  overflow: hidden;
}

/* === КОНТЕЙНЕР === */
.auth-container {
  width: 100%;
  max-width: 420px;
  margin-left: 5%;
  max-height: 100%;
  display: flex;
  align-items: center;

}

/* === КАРТОЧКА === */
.auth-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(200, 155, 60, 0.2);
  padding: 2rem 2rem 1.8rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.5s ease-out;
  width: 100%;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c89b3c transparent;
}

.auth-card::-webkit-scrollbar {
  width: 6px;
}

.auth-card::-webkit-scrollbar-track {
  background: transparent;
}

.auth-card::-webkit-scrollbar-thumb {
  background: #c89b3c;
  border-radius: 10px;
}

.auth-card::-webkit-scrollbar-thumb:hover {
  background: #b8872c;
}

/* === ЗАГОЛОВОК === */
.auth-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.title-registration {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin: 0 0 0.6rem 0;
}

.subtitle-registration {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
}

.judo {
  color: #1a1a1a;
}

.stream {
  color: #c89b3c;
}

.header-icon {
  width: 36px;
  height: 36px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* === ФОРМА === */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-title {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.input-group input {
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  background: #fafafa;
  color: #333;
  transition: all 0.3s ease;
}

.input-group input::placeholder {
  color: #999;
}

.input-group input:focus {
  outline: none;
  border-color: #c89b3c;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(200, 155, 60, 0.1);
  transform: translateY(-1px);
}

/* === КНОПКИ === */
.btn-primary {
  margin-top: 0.5rem;
  padding: 0.9rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(200, 155, 60, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

/* === ФУТЕР === */
.auth-footer {
  text-align: center;
  margin-top: 1.2rem;
  padding-top: 1rem;
  border-top: 1px solid #e8e8e8;
  color: #555;
  font-size: 0.9rem;
}

.auth-footer p {
  margin: 0 0 0.5rem;
}

.btn-link {
  background: none;
  border: none;
  color: #c89b3c;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
}

.btn-link:hover {
  color: #b8872c;
  background: rgba(200, 155, 60, 0.1);
}

/* === АНИМАЦИЯ === */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* === АДАПТИВ === */
@media (max-width: 992px) {
  .auth-container {
    margin-left: 3%;
  }
}

@media (max-width: 768px) {
  .auth-background {
    padding: 1.5rem 1rem;
  }

  .auth-container {
    margin-left: 0;
    max-width: 100%;
    justify-content: center;
  }

  .auth-card {
    padding: 1.8rem 1.5rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .auth-background {
    padding: 1rem;
  }

  .auth-card {
    padding: 1.5rem 1.2rem 1.2rem;
  }

  .title-registration {
    font-size: 1.8rem;
  }

  .subtitle-registration {
    font-size: 1.2rem;
  }

  .header-icon {
    width: 30px;
    height: 30px;
  }
}
</style>