<template>
  <div class="admin-users-management">
    <!-- ХЕДЕР СТРАНИЦЫ -->
    <div class="page-header">
      <h1 class="page-title">
        Управление пользователями
      </h1>
      <button class="add-user-btn" @click="showAddModal = true">
        + Добавить пользователя
      </button>
    </div>

    <!-- ФИЛЬТРЫ -->
    <div class="filters-card">
      <div class="filters-header">
        <h3>Фильтры и поиск</h3>
      </div>
      <div class="filters-body">
        <div class="filters-grid">
          <div class="filter-group">
            <label class="filter-label">Поиск</label>
            <input v-model="filters.search" type="text" class="filter-input" placeholder="Имя, логин или email...">
          </div>
          <div class="filter-group">
            <label class="filter-label">Роль</label>
            <select v-model="filters.role" class="filter-select">
              <option value="">Все роли</option>
              <option value="ADMIN">Администратор</option>
              <option value="REFEREE">Судья</option>
              <option value="SCOREBOARD">Табло</option>
              <option value="VIEWER">Зритель</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Статус</label>
            <select v-model="filters.status" class="filter-select">
              <option value="">Все статусы</option>
              <option value="true">Активные</option>
              <option value="false">Неактивные</option>
            </select>
          </div>
          <div class="filter-actions">
            <button class="apply-filters-btn" @click="loadUsers">Применить</button>
            <button class="reset-filters-btn" @click="resetFilters">Сбросить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- СТАТИСТИКА -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon admin">A</div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.adminCount }}</div>
          <div class="stat-label">Администраторов</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon referee">S</div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.refereeCount }}</div>
          <div class="stat-label">Судей</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon scoreboard">T</div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.scoreboardCount }}</div>
          <div class="stat-label">Операторов табло</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon total">U</div>
        <div class="stat-info">
          <div class="stat-number">{{ stats.totalCount }}</div>
          <div class="stat-label">Всего пользователей</div>
        </div>
      </div>
    </div>

    <!-- ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ -->
    <div class="users-table-card">
      <div class="table-header">
        <h3>Список пользователей</h3>
        <div class="table-actions">
          <button class="export-btn" @click="exportUsers">
            Экспорт
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="users-table">
          <thead>
          <tr>
            <th class="col-user">Пользователь</th>
            <th class="col-contact">Контакт</th>
            <th class="col-role">Роль</th>
            <th class="col-tatami">Татами</th>
            <th class="col-status">Статус</th>
            <th class="col-actions">Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in users" :key="user.id" class="user-row">
            <td class="user-info">
              <div class="user-avatar">{{ getUserInitials(user.name) }}</div>
              <div class="user-details">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-login">@{{ user.username }}</div>
              </div>
            </td>
            <td class="contact-info">
              <div class="contact-email" v-if="user.email">
                {{ user.email }}
              </div>
              <div class="contact-phone" v-if="user.phone">
                {{ user.phone }}
              </div>
              <div class="contact-empty" v-else>Контакты не указаны</div>
            </td>
            <td class="role-info">
                <span class="role-badge" :class="getRoleClass(user.role)">
                  {{ getRoleDisplay(user.role) }}
                </span>
              <div class="referee-level" v-if="user.referee_level">
                {{ user.referee_level === 'NATIONAL' ? 'Национальный' : 'Международный' }}
              </div>
            </td>
            <td class="tatami-info">
                <span v-if="user.tatami_assigned" class="tatami-badge">
                  Татами {{ user.tatami_assigned }}
                </span>
              <span v-else class="no-tatami">Не назначен</span>
            </td>
            <td class="status-info">
                <span class="status-badge" :class="user.is_active ? 'active' : 'inactive'">
                  {{ user.is_active ? 'Активен' : 'Неактивен' }}
                </span>
              <div class="last-login" v-if="user.last_login">
                {{ formatDate(user.last_login) }}
              </div>
            </td>
            <td class="actions-info">
              <div class="action-buttons">
                <button class="btn-edit" @click="editUser(user)" title="Редактировать">
                  Ред.
                </button>
                <button v-if="currentUser.id !== user.id" class="btn-delete" @click="confirmDelete(user)" title="Удалить">
                  Удалить
                </button>
                <button class="btn-reset" @click="resetPassword(user)" title="Сбросить пароль">
                  Сброс
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

        <div v-if="users.length === 0" class="empty-state">
          <div class="empty-icon">Пользователи не найдены</div>
          <h3>Пользователи не найдены</h3>
          <p>Попробуйте изменить параметры фильтрации</p>
          <button class="empty-action-btn" @click="resetFilters">Сбросить фильтры</button>
        </div>
      </div>

      <div v-if="users.length > 0" class="pagination">
        <button class="pagination-btn" :disabled="pagination.page === 1" @click="prevPage">
          ←
        </button>
        <span class="pagination-info">
          Страница {{ pagination.page }} из {{ pagination.totalPages }}
        </span>
        <button class="pagination-btn" :disabled="pagination.page === pagination.totalPages" @click="nextPage">
          →
        </button>
      </div>
    </div>

    <!-- МОДАЛЬ -->
    <div v-if="showAddModal || editingUser" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ editingUser ? 'Редактировать пользователя' : 'Добавить пользователя' }}</h2>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <form @submit.prevent="saveUser" class="user-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Логин *</label>
              <input v-model="userForm.username" type="text" class="form-input" required :readonly="!!editingUser">
            </div>
            <div class="form-group">
              <label class="form-label">Имя *</label>
              <input v-model="userForm.name" type="text" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input v-model="userForm.email" type="email" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Телефон</label>
              <input v-model="userForm.phone" type="tel" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Роль *</label>
              <select v-model="userForm.role" class="form-select" required>
                <option value="VIEWER">Зритель</option>
                <option value="SCOREBOARD">Оператор табло</option>
                <option value="REFEREE">Судья</option>
                <option value="ADMIN">Администратор</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ editingUser ? 'Новый пароль' : 'Пароль *' }}</label>
              <input v-model="userForm.password" type="password" class="form-input"
                     :required="!editingUser"
                     :placeholder="editingUser ? 'Оставьте пустым для сохранения старого' : ''">
            </div>
            <div class="form-group" v-if="userForm.role === 'REFEREE'">
              <label class="form-label">Уровень судьи</label>
              <select v-model="userForm.referee_level" class="form-select">
                <option value="">Не указан</option>
                <option value="NATIONAL">Национальный</option>
                <option value="INTERNATIONAL">Международный</option>
              </select>
            </div>
            <div class="form-group" v-if="userForm.role === 'REFEREE'">
              <label class="form-label">Назначенный татами</label>
              <input v-model.number="userForm.tatami_assigned" type="number" class="form-input" min="1" max="10">
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeModal">Отмена</button>
            <button type="submit" class="btn-save">{{ editingUser ? 'Сохранить' : 'Создать' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ -->
    <div v-if="deletingUser" class="modal-overlay" @click="cancelDelete">
      <div class="confirm-modal" @click.stop>
        <div class="confirm-icon">!</div>
        <h3>Подтверждение удаления</h3>
        <p>Вы уверены, что хотите удалить пользователя <strong>{{ deletingUser.name }}</strong>?</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="cancelDelete">Отмена</button>
          <button class="btn-confirm-delete" @click="deleteUser">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUsersManagement',
  data() {
    return {
      users: [],
      currentUser: { id: 1 },
      filters: { search: '', role: '', status: '' },
      stats: { adminCount: 0, refereeCount: 0, scoreboardCount: 0, totalCount: 0 },
      pagination: { page: 1, perPage: 10, totalPages: 1 },
      showAddModal: false,
      editingUser: null,
      deletingUser: null,
      userForm: {
        username: '', name: '', email: '', phone: '',
        role: 'VIEWER', password: '', referee_level: '', tatami_assigned: null
      }
    }
  },
  mounted() {
    this.loadUsers()
    this.loadStats()
  },
  methods: {
    async loadUsers() {
      this.users = [
        { id: 1, username: 'admin', name: 'Администратор Системы', email: 'admin@judo-stream.kz', phone: '+7 777 123 4567', role: 'ADMIN', is_active: true, last_login: new Date().toISOString() },
        { id: 2, username: 'referee1', name: 'Иван Петров', email: 'referee1@example.com', role: 'REFEREE', referee_level: 'NATIONAL', tatami_assigned: 1, is_active: true, last_login: new Date().toISOString() },
        { id: 3, username: 'scoreboard1', name: 'Алексей Сидоров', role: 'SCOREBOARD', is_active: true, last_login: new Date().toISOString() }
      ]
      this.pagination.totalPages = 3
    },
    loadStats() {
      this.stats = { adminCount: 1, refereeCount: 3, scoreboardCount: 2, totalCount: 15 }
    },
    saveUser() { this.closeModal(); this.loadUsers(); this.loadStats() },
    deleteUser() { this.deletingUser = null; this.loadUsers(); this.loadStats() },
    resetPassword() { alert('Пароль сброшен') },
    editUser(user) {
      this.editingUser = user
      this.userForm = { ...user, password: '', tatami_assigned: user.tatami_assigned || null, referee_level: user.referee_level || '' }
    },
    confirmDelete(user) { this.deletingUser = user },
    cancelDelete() { this.deletingUser = null },
    closeModal() {
      this.showAddModal = false
      this.editingUser = null
      this.userForm = { username: '', name: '', email: '', phone: '', role: 'VIEWER', password: '', referee_level: '', tatami_assigned: null }
    },
    resetFilters() { this.filters = { search: '', role: '', status: '' }; this.pagination.page = 1; this.loadUsers() },
    exportUsers() { console.log('Экспорт') },
    prevPage() { if (this.pagination.page > 1) { this.pagination.page--; this.loadUsers() } },
    nextPage() { if (this.pagination.page < this.pagination.totalPages) { this.pagination.page++; this.loadUsers() } },
    getUserInitials(name) { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) },
    getRoleClass(role) { return { ADMIN: 'role-admin', REFEREE: 'role-referee', SCOREBOARD: 'role-scoreboard', VIEWER: 'role-viewer' }[role] || '' },
    getRoleDisplay(role) { return { ADMIN: 'Администратор', REFEREE: 'Судья', SCOREBOARD: 'Оператор табло', VIEWER: 'Зритель' }[role] || role },
    formatDate(date) { return new Date(date).toLocaleDateString('ru-RU') }
  }
}
</script>

<style scoped>
.admin-users-management { padding: 90px 2rem 2rem; max-width: 1400px; margin: 0 auto; min-height: 100vh; background: linear-gradient(to bottom, #fefefe, #f8f9fa); }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding: 0 1rem; }
.page-title { font-size: 2.2rem; font-weight: 700; color: #1a1a1a; }
.add-user-btn { background: linear-gradient(135deg, #c89b3c, #e0b456); color: white; border: none; padding: 1rem 2rem; border-radius: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(200,155,60,0.3); }
.add-user-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(200,155,60,0.4); }
.filters-card { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); margin-bottom: 2rem; border: 1px solid #f0f0f0; }
.filters-header { padding: 1.5rem 2rem; border-bottom: 1px solid #f0f0f0; }
.filters-header h3 { margin: 0; font-size: 1.3rem; font-weight: 600; color: #1a1a1a; }
.filters-body { padding: 2rem; }
.filters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; align-items: end; }
.filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
.filter-label { font-weight: 600; color: #333; font-size: 0.9rem; }
.filter-input, .filter-select { padding: 0.9rem 1rem; border: 2px solid #e8e8e8; border-radius: 10px; font-size: 1rem; background: #fafafa; transition: all 0.3s ease; }
.filter-input:focus, .filter-select:focus { outline: none; border-color: #c89b3c; background: white; box-shadow: 0 0 0 3px rgba(200,155,60,0.1); }
.filter-actions { display: flex; gap: 1rem; }
.apply-filters-btn, .reset-filters-btn { padding: 0.9rem 1.5rem; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.apply-filters-btn { background: #c89b3c; color: white; }
.apply-filters-btn:hover { background: #e0b456; transform: translateY(-1px); }
.reset-filters-btn { background: #f8f9fa; color: #666; border: 2px solid #e8e8e8; }
.reset-filters-btn:hover { background: #e9ecef; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.stat-card { background: white; border-radius: 16px; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #f0f0f0; transition: all 0.3s ease; }
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
.stat-icon { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: bold; }
.stat-icon.admin { background: linear-gradient(135deg, #dc3545, #e35d6a); color: white; }
.stat-icon.referee { background: linear-gradient(135deg, #ffc107, #ffd54f); color: #1a1a1a; }
.stat-icon.scoreboard { background: linear-gradient(135deg, #17a2b8, #5bc0de); color: white; }
.stat-icon.total { background: linear-gradient(135deg, #28a745, #5cb85c); color: white; }
.stat-number { font-size: 2rem; font-weight: 700; color: #1a1a1a; }
.stat-label { color: #666; font-size: 0.9rem; font-weight: 500; }
.users-table-card { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #f0f0f0; overflow: hidden; }
.table-header { padding: 1.5rem 2rem; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
.table-header h3 { margin: 0; font-size: 1.3rem; font-weight: 600; color: #1a1a1a; }
.export-btn { background: #f8f9fa; color: #666; border: 2px solid #e8e8e8; padding: 0.7rem 1.2rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.export-btn:hover { background: #e9ecef; }
.table-container { overflow-x: auto; }
.users-table { width: 100%; border-collapse: collapse; }
.users-table th { background: #f8f9fa; padding: 1rem 1.5rem; text-align: left; font-weight: 600; color: #333; border-bottom: 1px solid #e8e8e8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; }
.users-table td { padding: 1.5rem; border-bottom: 1px solid #f0f0f0; }
.user-row:hover { background: #f8f9fa; }
.user-info { display: flex; align-items: center; gap: 1rem; }
.user-avatar { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #c89b3c, #e0b456); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.1rem; }
.user-details { display: flex; flex-direction: column; gap: 0.25rem; }
.user-name { font-weight: 600; color: #1a1a1a; }
.user-login { color: #666; font-size: 0.85rem; }
.contact-info { font-size: 0.9rem; }
.contact-empty { color: #999; font-style: italic; }
.role-badge { padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-block; }
.role-admin { background: #ffe6e6; color: #dc3545; }
.role-referee { background: #fff3cd; color: #856404; }
.role-scoreboard { background: #d1ecf1; color: #0c5460; }
.role-viewer { background: #e2e3e5; color: #383d41; }
.referee-level { font-size: 0.8rem; color: #666; margin-top: 0.25rem; }
.tatami-badge { background: linear-gradient(135deg, #c89b3c, #e0b456); color: white; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
.no-tatami { color: #999; font-style: italic; }
.status-badge { padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
.status-badge.active { background: #d4edda; color: #155724; }
.status-badge.inactive { background: #f8d7da; color: #721c24; }
.last-login { font-size: 0.8rem; color: #666; margin-top: 0.25rem; }
.action-buttons { display: flex; gap: 0.5rem; }
.btn-edit, .btn-delete, .btn-reset { width: 36px; height: 36px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; transition: all 0.3s ease; }
.btn-edit { background: #e3f2fd; color: #1976d2; }
.btn-edit:hover { background: #bbdefb; }
.btn-delete { background: #ffebee; color: #d32f2f; }
.btn-delete:hover { background: #ffcdd2; }
.btn-reset { background: #f3e5f5; color: #7b1fa2; }
.btn-reset:hover { background: #e1bee7; }
.empty-state { text-align: center; padding: 4rem 2rem; color: #666; }
.empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
.empty-state h3 { margin: 0 0 1rem 0; color: #333; }
.empty-action-btn { background: #c89b3c; color: white; border: none; padding: 0.9rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.empty-action-btn:hover { background: #e0b456; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; padding: 1.5rem 2rem; border-top: 1px solid #f0f0f0; }
.pagination-btn { width: 40px; height: 40px; border: 2px solid #e8e8e8; background: white; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: all 0.3s ease; }
.pagination-btn:not(:disabled):hover { border-color: #c89b3c; color: #c89b3c; }
.pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.pagination-info { font-weight: 600; color: #333; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
.modal-content { background: white; border-radius: 16px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
.modal-header { padding: 2rem; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
.modal-header h2 { margin: 0; font-size: 1.5rem; font-weight: 600; color: #1a1a1a; }
.modal-close { background: none; border: none; font-size: 2rem; cursor: pointer; color: #666; }
.modal-close:hover { color: #333; }
.user-form { padding: 2rem; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-label { font-weight: 600; color: #333; font-size: 0.9rem; }
.form-input, .form-select { padding: 0.9rem 1rem; border: 2px solid #e8e8e8; border-radius: 10px; font-size: 1rem; background: #fafafa; transition: all 0.3s ease; }
.form-input:focus, .form-select:focus { outline: none; border-color: #c89b3c; background: white; box-shadow: 0 0 0 3px rgba(200,155,60,0.1); }
.form-actions { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid #f0f0f0; }
.btn-cancel, .btn-save { padding: 0.9rem 1.5rem; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.btn-cancel { background: #f8f9fa; color: #666; border: 2px solid #e8e8e8; }
.btn-cancel:hover { background: #e9ecef; }
.btn-save { background: linear-gradient(135deg, #c89b3c, #e0b456); color: white; }
.btn-save:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(200,155,60,0.3); }
.confirm-modal { background: white; border-radius: 16px; padding: 2rem; text-align: center; max-width: 400px; width: 100%; }
.confirm-icon { font-size: 3.5rem; color: #ffc107; margin-bottom: 1rem; font-weight: bold; }
.confirm-modal h3 { margin: 0 0 1rem 0; color: #1a1a1a; }
.confirm-modal p { margin: 0 0 2rem 0; color: #666; line-height: 1.5; }
.confirm-actions { display: flex; gap: 1rem; justify-content: center; }
.btn-confirm-delete { background: #dc3545; color: white; border: none; padding: 0.9rem 1.5rem; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
.btn-confirm-delete:hover { background: #c82333; }

@media (max-width: 768px) {
  .admin-users-management { padding: 90px 1rem 1rem; }
  .page-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
  .filters-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .table-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
  .user-info { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .action-buttons { flex-direction: column; }
  .form-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 1.8rem; }
}
</style>