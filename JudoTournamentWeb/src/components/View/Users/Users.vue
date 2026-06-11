<template>
  <div class="admin-users-management">
    <div class="page-header">
      <h1 class="page-title">{{ t('users.title') }}</h1>
    </div>

    <!-- ФИЛЬТРЫ -->
    <div class="filters-card">
      <div class="filters-header">
        <h3>{{ t('users.filtersTitle') }}</h3>
      </div>
      <div class="filters-body">
        <div class="filters-grid">
          <div class="filter-group">
            <label class="filter-label">{{ t('users.search') }}</label>
            <input v-model="filters.search" type="text" class="filter-input" :placeholder="t('users.searchPlaceholder')" />
          </div>
          <div class="filter-group">
            <label class="filter-label">{{ t('users.role') }}</label>
            <select v-model="filters.role" class="filter-select">
              <option value="">{{ t('users.allRoles') }}</option>
              <option value="ADMIN">{{ t('users.admin') }}</option>
              <option value="REFEREE">{{ t('users.referee') }}</option>
              <option value="SCOREBOARD">{{ t('users.scoreboard') }}</option>
              <option value="PARTICIPANT">{{ t('users.participant') }}</option>
              <option value="VIEWER">{{ t('users.viewer') }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">{{ t('users.status') }}</label>
            <select v-model="filters.status" class="filter-select">
              <option value="">{{ t('users.allStatuses') }}</option>
              <option value="true">{{ t('users.activePlural') }}</option>
              <option value="false">{{ t('users.inactivePlural') }}</option>
            </select>
          </div>
          <div class="filter-actions">
            <button class="apply-filters-btn" @click="loadUsers">{{ t('users.apply') }}</button>
            <button class="reset-filters-btn" @click="resetFilters">{{ t('users.reset') }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- СТАТИСТИКА -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-number">{{ stats.adminCount }}</div>
          <div class="stat-label">{{ t('users.adminsCount') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-number">{{ stats.refereeCount }}</div>
          <div class="stat-label">{{ t('users.refereesCount') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-number">{{ stats.scoreboardCount }}</div>
          <div class="stat-label">{{ t('users.scoreboardCount') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-number">{{ stats.participantCount }}</div>
          <div class="stat-label">{{ t('users.participantsCount') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-info">
          <div class="stat-number">{{ stats.totalCount }}</div>
          <div class="stat-label">{{ t('users.totalActive') }}</div>
        </div>
      </div>
    </div>

    <!-- ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ -->
    <div class="users-table-card">
      <div class="table-header">
        <h3>{{ t('users.listTitle') }}</h3>
        <div class="table-actions">
          <button class="btn-edit" :disabled="!selectedUserId" @click="editSelectedUser" :title="t('users.editSelectedTitle')">
            {{ t('users.edit') }}
          </button>
          <button class="btn-delete" :disabled="!selectedUserId" @click="confirmDeleteSelected" :title="t('users.deleteSelectedTitle')">
            {{ t('users.delete') }}
          </button>
        </div>
      </div>
      <div class="table-container">
        <div v-if="loading" class="loading-state">
          <p>{{ t('users.loadingData') }}</p>
        </div>
        <table v-else-if="users.length > 0" class="users-table">
          <thead>
          <tr>
            <th class="col-select"></th>
            <th class="col-user">{{ t('users.user') }}</th>
            <th class="col-contact">{{ t('users.contact') }}</th>
            <th class="col-role">{{ t('users.role') }}</th>
            <th class="col-status">{{ t('users.status') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="user in users"
              :key="user.id"
              class="user-row"
              :class="{ 'selected-row': selectedUserId === user.id }"
              @click="selectUser(user.id)"
          >
            <td class="col-select">
              <input type="radio" :checked="selectedUserId === user.id" @click.stop="selectUser(user.id)" />
            </td>
            <td class="user-info">
              <div class="user-avatar">{{ getUserInitials(user) }}</div>
              <div class="user-details">
                <div class="user-name">{{ getFullName(user) }}</div>
                <div class="user-login">@{{ user.username || '—' }}</div>
              </div>
            </td>
            <td class="contact-info">
              <div class="contact-email" v-if="user.email">{{ user.email }}</div>
              <div class="contact-phone" v-if="user.phone">{{ user.phone }}</div>
              <div class="contact-empty" v-else>{{ t('users.contactsEmpty') }}</div>
            </td>
            <td class="role-info">
                <span class="role-badge" :class="getRoleClass(getUserRole(user))">
                  {{ getRoleDisplay(getUserRole(user)) }}
                </span>
              <div class="referee-level" v-if="user.referee_level">
                {{ user.referee_level === 'NATIONAL' ? t('users.national') : t('users.international') }}
              </div>
            </td>
            <td class="status-info">
                <span class="status-badge" :class="user.is_active ? 'active' : 'inactive'">
                  {{ user.is_active ? t('users.active') : t('users.inactive') }}
                </span>
              <div class="last-login" v-if="user.last_login">
                {{ formatDate(user.last_login) }}
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else class="empty-state">
          <div class="empty-icon">{{ t('users.notFound') }}</div>
          <h3>{{ t('users.notFound') }}</h3>
          <p>{{ t('users.changeFilters') }}</p>
          <button class="empty-action-btn" @click="resetFilters">{{ t('users.resetFilters') }}</button>
        </div>
      </div>

      <div v-if="users.length > 0 && !loading" class="pagination">
        <button class="pagination-btn" :disabled="pagination.page === 1" @click="prevPage">←</button>
        <span class="pagination-info">{{ t('users.pageInfo', { page: pagination.page, total: pagination.totalPages }) }}</span>
        <button class="pagination-btn" :disabled="pagination.page === pagination.totalPages" @click="nextPage">→</button>
      </div>
    </div>

    <!-- МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ -->
    <UserEditModal v-if="editingUser" :user="userForm" @close="closeModal" @save="handleSaveUser" />

    <!-- МОДАЛЬНОЕ ОКНО ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ -->
    <div v-if="deletingUser" class="modal-overlay" @click="cancelDelete">
      <div class="confirm-modal" @click.stop>
        <div class="confirm-icon">!</div>
        <h3>{{ t('users.deleteConfirmTitle') }}</h3>
        <p>{{ t('users.deleteConfirmText') }} <strong>{{ getFullName(deletingUser) }}</strong>?</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="cancelDelete">{{ t('users.cancel') }}</button>
          <button class="btn-confirm-delete" @click="deleteUser">{{ t('users.delete') }}</button>
        </div>
      </div>
    </div>

    <!-- МОДАЛЬНОЕ ОКНО УСПЕШНОГО УДАЛЕНИЯ -->
    <div v-if="showDeleteSuccessModal" class="modal-overlay" @click.self="closeDeleteSuccessModal">
      <div class="admin-modal-content success-modal" @click.stop>
        <div class="success-icon">✅</div>
        <h2>{{ t('users.successTitle') }}</h2>
        <p class="success-text">{{ deleteSuccessMessage }}</p>
        <div class="admin-modal-actions">
          <button class="admin-modal-button-submit" @click="closeDeleteSuccessModal">
            {{ t('users.continue') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { GetCountRolesUsers, GetAllUsersInformation, DeleteUser } from "@/components/View/Users/fetchUsers.js";
import UserEditModal from '@/components/View/Users/UserEditModal.vue';
import { useI18n } from '@/i18n';
import './Users.css';

export default {
  name: 'AdminUsersManagement',
  components: { UserEditModal },
  setup() {
    const { locale, t } = useI18n();
    const dateLocale = computed(() => ({ ru: 'ru-RU', en: 'en-US', kk: 'kk-KZ' })[locale.value] ?? 'ru-RU');

    return { dateLocale, t };
  },
  data() {
    return {
      users: [],
      filters: {
        search: '',
        role: '',
        status: ''
      },
      stats: {
        adminCount: 0,
        refereeCount: 0,
        scoreboardCount: 0,
        participantCount: 0,
        totalCount: 0
      },
      pagination: {
        page: 1,
        perPage: 10,
        totalPages: 1
      },
      loading: false,
      editingUser: null,
      deletingUser: null,
      selectedUserId: null,
      showDeleteSuccessModal: false,
      deleteSuccessMessage: '',
      userForm: {
        id: null,
        username: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        phone: '',
        is_active: true
      }
    };
  },
  mounted() {
    this.loadStats();
    this.loadUsers();
  },
  methods: {
    getUserRole(user) {
      return user?.roles?.[0]?.name || user?.roles?.[0] || null;
    },
    getFullName(user) {
      if (!user) return '—';
      const parts = [];
      if (user.last_name) parts.push(user.last_name);
      if (user.first_name) parts.push(user.first_name);
      if (user.middle_name) parts.push(user.middle_name);
      return parts.join(' ') || user.username || '—';
    },
    getUserInitials(user) {
      const name = this.getFullName(user);
      if (name === '—') return '??';
      return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).join('').slice(0, 2) || '??';
    },
    async loadStats() {
      try {
        const res = await GetCountRolesUsers();
        if (!res?.success || !res?.data) return;
        const { total_active_users, users_by_role } = res.data;
        this.stats.totalCount = total_active_users || 0;
        const getCount = (role) => users_by_role.find(r => r.normalized_name === role)?.count || 0;
        this.stats.adminCount = getCount('ADMIN');
        this.stats.refereeCount = getCount('REFEREE');
        this.stats.scoreboardCount = getCount('SCOREBOARD');
        this.stats.participantCount = getCount('PARTICIPANT');
      } catch (err) {
        console.error('Ошибка загрузки статистики:', err);
      }
    },
    async loadUsers() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.page,
          per_page: this.pagination.perPage
        };
        if (this.filters.search) params.search = this.filters.search;
        if (this.filters.role) params.role = this.filters.role;
        if (this.filters.status !== '') {
          params.is_active = this.filters.status === 'true';
        }
        const res = await GetAllUsersInformation(params);
        if (res?.success && Array.isArray(res.data)) {
          this.users = res.data.filter(u => u?.id != null);
          this.pagination.totalPages = res.total_pages || Math.ceil((res.total || res.data.length) / this.pagination.perPage) || 1;
        } else {
          this.users = [];
          this.pagination.totalPages = 1;
        }
      } catch (err) {
        console.error('Ошибка загрузки пользователей:', err);
        this.users = [];
      } finally {
        this.loading = false;
      }
    },
    selectUser(id) {
      this.selectedUserId = this.selectedUserId === id ? null : id;
    },
    editSelectedUser() {
      if (!this.selectedUserId) return;
      const user = this.users.find(u => u.id === this.selectedUserId);
      if (user) this.editUser(user);
    },
    confirmDeleteSelected() {
      if (!this.selectedUserId) return;
      const user = this.users.find(u => u.id === this.selectedUserId);
      if (user) this.confirmDelete(user);
    },
    editUser(user) {
      this.editingUser = true;
      this.userForm = {
        id: user.id,
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        middle_name: user.middle_name || '',
        email: user.email || '',
        phone: user.phone || '',
        is_active: user.is_active ?? true
      };
    },
    async handleSaveUser() {
      this.editingUser = false;
      this.userForm = {
        id: null,
        username: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        phone: '',
        is_active: true
      };
      await this.loadUsers();
      await this.loadStats();
      this.selectedUserId = null;
    },
    confirmDelete(user) {
      this.deletingUser = user;
    },
    cancelDelete() {
      this.deletingUser = null;
    },
    async deleteUser() {
      if (!this.deletingUser?.id) return;

      const userId = this.deletingUser.id;
      const userName = this.getFullName(this.deletingUser);

      try {
        const result = await DeleteUser(userId);

        if (result.success) {
          this.deletingUser = null;
          this.selectedUserId = null;
          this.deleteSuccessMessage = this.t('users.deletedMessage', { name: userName });
          this.showDeleteSuccessModal = true;
          await this.loadUsers();
          await this.loadStats();
        } else {
          const errorMsg = result.message || this.t('users.deleteFailed');
          alert(this.t('users.errorPrefix', { message: errorMsg }));
        }
      } catch (err) {
        console.error('Ошибка удаления пользователя:', err);
        alert(this.t('users.deleteError'));
      }
    },
    closeDeleteSuccessModal() {
      this.showDeleteSuccessModal = false;
      this.deleteSuccessMessage = '';
    },
    closeModal() {
      this.editingUser = false;
      this.userForm = {
        id: null,
        username: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        phone: '',
        is_active: true
      };
    },
    resetFilters() {
      this.filters = { search: '', role: '', status: '' };
      this.pagination.page = 1;
      this.loadUsers();
    },
    prevPage() {
      if (this.pagination.page > 1) {
        this.pagination.page--;
        this.loadUsers();
      }
    },
    nextPage() {
      if (this.pagination.page < this.pagination.totalPages) {
        this.pagination.page++;
        this.loadUsers();
      }
    },
    getRoleClass(role) {
      const map = {
        'ADMIN': 'role-admin',
        'REFEREE': 'role-referee',
        'SCOREBOARD': 'role-scoreboard',
        'PARTICIPANT': 'role-participant',
        'VIEWER': 'role-viewer'
      };
      return map[role] || 'role-viewer';
    },
    getRoleDisplay(role) {
      const map = {
        'ADMIN': this.t('users.admin'),
        'REFEREE': this.t('users.referee'),
        'SCOREBOARD': this.t('users.scoreboardOperator'),
        'PARTICIPANT': this.t('users.participant'),
        'VIEWER': this.t('users.viewer')
      };
      return map[role] || role || '—';
    },
    formatDate(date) {
      if (!date) return '—';
      try {
        return new Date(date).toLocaleDateString(this.dateLocale, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      } catch {
        return '—';
      }
    }
  }
};
</script>

<style scoped>
.admin-modal-content {
  background: white;
  border-radius: 16px;
  width: 380px;
  max-width: 92vw;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 30px 24px;
  text-align: center;
}

.success-icon {
  font-size: 3.5rem;
  margin-bottom: 10px;
}

.admin-modal-content h2 {
  margin: 0 0 10px;
  font-size: 1.4rem;
  color: #1a1a1a;
}

.success-text {
  font-size: 1.05rem;
  line-height: 1.4;
  margin-bottom: 24px;
  color: #555;
}

.admin-modal-actions {
  display: flex;
  justify-content: center;
}

.admin-modal-button-submit {
  background: linear-gradient(135deg, #c89b3c, #e0b456);
  color: white;
  border: none;
  padding: 12px 32px;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.admin-modal-button-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.3);
}
</style>
