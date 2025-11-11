<template>
  <div class="auth-background"></div>
  <form action="" method="get" class="form-example">
    <div class="form-example">
      <label for="name">Enter your name: </label>
      <input type="text" name="name" id="name" required />
    </div>
    <div class="form-example">
      <label for="email">Enter your email: </label>
      <input type="email" name="email" id="email" required />
    </div>
    <div class="form-example">
      <input type="submit" value="Subscribe!" />
    </div>
  </form>


</template>

<script setup>
</script>

<style scoped>
.auth-background {
  background-image: url('@/assets/BackgroundAutorisation.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1; /* Помещает фон под содержимое */
}</style>