<template>
  <div class="auth-background">
    <div class="auth-form_container">
      <div class="auth-form_container_content">
        <H1> Добро поажловать в Judo tournament</H1>
        <p class="form_auth_block_header_text"> Авторизация</p>
        <form class="auth-form_style" action="#" method="post"> <label>Логин</label>
          <input type="text" name="auth_name" placeholder="Введите логин" required>
          <label>Пароль</label>
          <input type="password" name="auth_password" placeholder="Введите пароль" required>
          <button class="auth-form_button_submit" name="`auth_submit" type="submit"> Войти</button>
          <p class="auth-form_button">Нет аккауннта?Тогда зарегистрируйтесь</p>
          <button type="button" class="auth-form_button" name="auth_button_redirect">Регистрация</button>
        </form>

      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-background {
  background-image: url('@/assets/Background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
.form_auth_block_header_text
{
  color: black;
}
.auth-form_container_content label
{
  color: black;
}
.auth-form_container_content H1
{
  color: black;
}
.auth-form_container_content p
{
  color: black;
}
</style>
<script setup lang="ts">
</script>