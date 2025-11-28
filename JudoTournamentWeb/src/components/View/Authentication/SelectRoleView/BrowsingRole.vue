<!-- [file name]: BrowsingRole.vue -->
<template>
  <div class="role-content">
    <div class="login-section">
      <button class="login-button" @click="redirectToLogin">
        Войти в систему
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const redirectToLogin = () => {
  router.push('/Login')
}
</script>

<style scoped>
.role-content {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.login-section {
  text-align: center;
}

.login-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  font-size: 1.1rem;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>