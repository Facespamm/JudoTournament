// @/components/Sidebar/state.js
import { ref, computed } from 'vue';

export const collapsed = ref(false);
export const toggleSidebar = () => (collapsed.value = !collapsed.value);

export const SIDEBAR_WIDTH = 250;
export const sidebarCollapsedWidth = 80;

export const sidebarWidth = computed(() =>
    collapsed.value ? `${sidebarCollapsedWidth}px` : `${SIDEBAR_WIDTH}px`
);