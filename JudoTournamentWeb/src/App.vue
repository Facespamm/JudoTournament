<template>
  <div id="app">
    <!-- Сайдбар: скрыт на login и registration -->
    <Sidebar v-if="route.meta.hideSidebar !== true" />
    <div class="main-content" :class="{ 'with-sidebar': route.meta.hideSidebar !== true }">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Sidebar from "@/components/Sidebar/Sidebar.vue"

const route = useRoute()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;

}

#app {
  display: flex;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  max-width: 100%;
}

.main-content {
  flex: 1;
  min-width: 0;
  padding: 0;
  margin: 0;
  min-height: 100vh;
}

/* Когда есть сайдбар - сдвигаем контент вправо */
.main-content.with-sidebar {
  margin-left: 220px;
}

/* На мобильных убираем отступ */
@media (max-width: 768px) {
  .main-content.with-sidebar {
    margin-left: 0;
  }
}
</style>