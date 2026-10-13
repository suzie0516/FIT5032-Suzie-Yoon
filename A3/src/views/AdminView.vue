<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import { auth } from '../firebase'
import { currentUser } from '../utils/auth'

const router = useRouter()

const users = ref([])
const totalUsers = ref(0)
const totalMembers = ref(0)
const totalAdmins = ref(0)
const loading = ref(false)
const error = ref('')

const loadUsers = async () => {
  loading.value = true
  error.value = ''

  try {
    const token = await auth.currentUser.getIdToken(true)

    const baseUrl = import.meta.env.VITE_FUNCTIONS_BASE_URL

    if (!baseUrl) {
      throw new Error('Firebase Functions URL is missing.')
    }

    const response = await fetch(`${baseUrl}/adminOverview`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Administrator access required.')
      }

      throw new Error('Unable to load account data.')
    }

    const data = await response.json()

    users.value = data.users
    totalUsers.value = data.totalUsers
    totalMembers.value = data.totalMembers
    totalAdmins.value = data.totalAdmins
  } catch (err) {
    console.error(err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(loadUsers)
</script>

<template>
  <div>
    <AppNavbar />

    <main class="admin-page">
      <div class="container">
        <section class="admin-heading">
          <p class="section-label">STAFF ACCESS</p>
          <h1>Admin Dashboard</h1>
          <p>Manage and review registered accounts for Pots & Plants Melbourne.</p>
        </section>

        <section class="welcome-card">
          <div>
            <p class="welcome-label">Signed in as</p>
            <h2>{{ currentUser?.fullName || 'Administrator' }}</h2>
            <p class="admin-email">{{ currentUser?.email }}</p>
          </div>

          <span class="admin-badge">Administrator</span>
        </section>

        <div v-if="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <section class="stats-grid" aria-label="Account statistics">
          <article class="stat-card">
            <p>Total Accounts</p>
            <strong>{{ loading ? '...' : totalUsers }}</strong>
          </article>

          <article class="stat-card">
            <p>Members</p>
            <strong>{{ loading ? '...' : totalMembers }}</strong>
          </article>

          <article class="stat-card">
            <p>Administrators</p>
            <strong>{{ loading ? '...' : totalAdmins }}</strong>
          </article>
        </section>

        <section class="users-card">
          <div class="table-heading">
            <div>
              <p class="section-label">USER MANAGEMENT</p>
              <h2>Registered Accounts</h2>
            </div>

            <div class="d-flex gap-2">
              <button
                type="button"
                class="btn account-btn"
                :disabled="loading"
                @click="loadUsers"
              >
                {{ loading ? 'Loading...' : 'Refresh' }}
              </button>

              <button
                type="button"
                class="btn account-btn"
                @click="router.push('/account')"
              >
                My Account
              </button>
            </div>
          </div>

          <p v-if="loading" role="status">Loading Firebase accounts...</p>

          <div v-else-if="users.length" class="table-responsive">
            <table class="table align-middle">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.fullName }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span
                      class="role-badge"
                      :class="{ 'admin-role': user.role === 'admin' }"
                    >
                      {{ user.role === 'admin' ? 'Administrator' : 'Member' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p v-else-if="!error" class="empty-state">
            No registered accounts are available.
          </p>
        </section>

        <section class="security-note">
          <h2>Restricted Area</h2>
          <p>
            Account information is retrieved from Firebase Authentication.
            Access is verified by a protected Cloud Function.
          </p>
        </section>
      </div>
    </main>
  </div>
</template>
<style scoped>
.admin-page {
  min-height: calc(100vh - 79px);

  padding:
    65px 0
    90px;

  background-color: #f5f8f3;
}


.admin-heading {
  max-width: 760px;

  margin:
    0 auto
    35px;

  text-align: center;
}


.section-label {
  margin-bottom: 8px;

  color: #4f7c43;

  font-size: 0.82rem;

  font-weight: 700;

  letter-spacing: 0.14em;
}


.admin-heading h1 {
  margin-bottom: 12px;

  color: #1f3d2b;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 2.6rem;

  font-weight: 700;
}


.admin-heading p {
  margin: 0;

  color: #667267;
}


.welcome-card {
  display: flex;

  max-width: 950px;

  margin:
    0 auto
    24px;

  padding: 28px;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  background-color: #315c39;

  border-radius: 16px;

  color: white;

  box-shadow:
    0 10px 25px
    rgba(34, 66, 45, 0.12);
}


.welcome-label {
  margin-bottom: 5px;

  color: #dcebd9;

  font-size: 0.85rem;

  font-weight: 600;

  text-transform: uppercase;

  letter-spacing: 0.08em;
}


.welcome-card h2 {
  margin-bottom: 4px;

  font-size: 1.5rem;

  font-weight: 700;
}


.admin-email {
  margin: 0;

  color: #e8f2e5;
}


.admin-badge {
  padding:
    8px 14px;

  border:
    1px solid
    rgba(255, 255, 255, 0.45);

  border-radius: 999px;

  background-color:
    rgba(255, 255, 255, 0.12);

  font-size: 0.85rem;

  font-weight: 700;

  white-space: nowrap;
}


.stats-grid {
  display: grid;

  max-width: 950px;

  margin:
    0 auto
    24px;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 16px;
}


.stat-card {
  padding: 24px;

  background-color: white;

  border:
    1px solid #dfe8dc;

  border-radius: 14px;

  text-align: center;

  box-shadow:
    0 6px 18px
    rgba(34, 66, 45, 0.06);
}


.stat-card p {
  margin-bottom: 8px;

  color: #69766b;

  font-weight: 600;
}


.stat-card strong {
  color: #315c39;

  font-size: 2rem;
}


.users-card {
  max-width: 950px;

  margin:
    0 auto
    24px;

  padding: 30px;

  background-color: white;

  border:
    1px solid #dfe8dc;

  border-radius: 16px;

  box-shadow:
    0 8px 22px
    rgba(34, 66, 45, 0.07);
}


.table-heading {
  display: flex;

  margin-bottom: 22px;

  align-items: center;

  justify-content: space-between;

  gap: 20px;
}


.table-heading h2 {
  margin: 0;

  color: #263d2c;

  font-size: 1.45rem;
}


.account-btn {
  border:
    1px solid #4f7c43;

  color: #4f7c43;

  background-color: white;

  font-weight: 600;
}


.account-btn:hover {
  color: white;

  background-color: #4f7c43;
}


.table {
  margin-bottom: 0;
}


.table thead th {
  padding:
    14px
    12px;

  color: #526157;

  background-color: #f3f7f1;

  border-bottom:
    1px solid #dce7d8;

  font-size: 0.88rem;

  font-weight: 700;
}


.table tbody td {
  padding:
    15px
    12px;

  color: #334439;

  border-color: #e8eee5;
}


.role-badge {
  display: inline-block;

  padding:
    5px 10px;

  border-radius: 999px;

  color: #49614d;

  background-color: #edf3eb;

  font-size: 0.8rem;

  font-weight: 700;
}


.admin-role {
  color: #ffffff;

  background-color: #4f7c43;
}


.empty-state {
  padding: 35px;

  color: #6b776d;

  background-color: #f7f9f6;

  border-radius: 10px;

  text-align: center;
}


.security-note {
  max-width: 950px;

  margin: 0 auto;

  padding: 24px 28px;

  border-left:
    5px solid #4f7c43;

  background-color: #edf4ea;

  border-radius: 10px;
}


.security-note h2 {
  margin-bottom: 8px;

  color: #315c39;

  font-size: 1.1rem;

  font-weight: 700;
}


.security-note p {
  margin: 0;

  color: #526157;

  line-height: 1.65;
}


@media (max-width: 767.98px) {
  .admin-page {
    padding:
      45px 0
      70px;
  }


  .admin-heading h1 {
    font-size: 2rem;
  }


  .welcome-card {
    align-items: flex-start;

    flex-direction: column;
  }


  .stats-grid {
    grid-template-columns: 1fr;
  }


  .users-card {
    padding: 22px;
  }


  .table-heading {
    align-items: flex-start;

    flex-direction: column;
  }


  .account-btn {
    width: 100%;
  }
}
</style>
