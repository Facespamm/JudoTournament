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
import "./Registration.css"
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
</style>