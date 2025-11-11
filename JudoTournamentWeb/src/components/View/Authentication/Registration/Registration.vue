<template>
  <div class="auth-background">
    <div>
      <div>
        <h1 class="title-registration">Регистрация <i>Judo Tournament</i></h1>
        <form action="#" method="post">
          <label class="form-title">Логин</label>
          <input type="email" name="auth_login" required maxlength="50" placeholder="judoCoolName">
          <label class="form-title">Имя пользователя</label>
          <input type="text" name="auth_name" required maxlength="50" min="3" placeholder="Саша">
          <label class="form-title">Электроная почта</label>
          <input type="email" name="auth_email" placeholder="example@example.com">
          <label class="form-title">Телефон</label>
          <input type="text" maxlength="11" placeholder="+7 (999) 999-9999">
          <label class="form-title">Пароль</label>
          <input type="password" name="auth_password" required maxlength="50" v-model="password">
          <label class="form-title">Повторить Пароль</label>
          <input type="password" name="auth_password" required maxlength="50" v-model="passwordConfirm">
          <button @click="checkPasswordCorrect" class="regis-button" type="submit">Зарегистрироватся</button><br>
          <div class="login-button">
            <p>Есть аккауннт, то войдите: <a @click="RedirectToLogin()">Войти</a></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
.auth-background {
  background: #2c3e50 no-repeat center;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.title-registration {
  text-align: left;
  font-size: 2.5em;
  display: block;
  margin-bottom: 10px;
}

.form-title{
  text-align: left;
  font-size: 1.7em;
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}

form input {
  display: block;
  height: 3em;
}

.login-button {
  display: inline-block;
  font-size: 1.5em;
}

.regis-button {
  margin-top: 1em;
  height: 2.5em;
}
</style>

<script setup lang="js">
import {RedirectToLogin} from "@/router/redirect.js";
import {ref} from "vue";

let password = ref();
let passwordConfirm = ref();

//TODO
//временная проверка
function checkPasswordCorrect(){
  if (password.value === password.value) {
    console.log("Пароль правельный");
  }
  else{
    console.log("Пароль не правельный");
  }
};
</script>