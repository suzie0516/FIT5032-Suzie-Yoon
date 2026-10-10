<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import { currentUser, logout } from '../utils/auth'

const router = useRouter()

const accountType = computed(() => {
  if (currentUser.value?.role === 'admin') {
    return 'Administrator'
  }

  return 'Member'
})

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<template>
  <div>
    <AppNavbar />

    <main class="account-page">
      <div class="container">
        <section class="account-heading">
          <p class="section-label">ACCOUNT</p>
          <h1>My Account</h1>
          <p>
            View your Pots & Plants Melbourne account information.
          </p>
        </section>

        <section v-if="currentUser" class="account-card">
          <div class="account-header">
            <div class="avatar">
              {{ currentUser.fullName?.charAt(0).toUpperCase() }}
            </div>

            <div>
              <h2>{{ currentUser.fullName }}</h2>
              <p class="member-label">{{ accountType }}</p>
            </div>
          </div>

          <hr />

          <div class="account-details">
            <div class="detail-row">
              <div class="detail-label">Full Name</div>
              <div class="detail-value">
                {{ currentUser.fullName }}
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-label">Email Address</div>
              <div class="detail-value">
                {{ currentUser.email }}
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-label">Account Type</div>
              <div class="detail-value">
                {{ accountType }}
              </div>
            </div>
          </div>

          <div class="account-actions">
            <RouterLink to="/" class="btn back-btn">
              Back to Home
            </RouterLink>

            <button
              type="button"
              class="btn signout-btn"
              @click="handleLogout"
            >
              Sign Out
            </button>
          </div>
        </section>

        <section v-else class="account-card text-center">
          <h2>Sign in required</h2>

          <p>
            Please sign in to view your account information.
          </p>

          <RouterLink to="/login" class="btn signout-btn">
            Sign In
          </RouterLink>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.account-page {
  min-height: calc(100vh - 75px);
  padding: 70px 0 90px;
  background: #f5f8f3;
}

.account-heading {
  max-width: 700px;
  margin: 0 auto 32px;
  text-align: center;
}

.section-label {
  margin-bottom: 8px;
  color: #4f7c43;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.account-heading h1 {
  margin-bottom: 12px;
  color: #1f3d2b;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 2.6rem;
  font-weight: 700;
}

.account-heading p {
  margin: 0;
  color: #667267;
  font-size: 1rem;
}

.account-card {
  max-width: 760px;
  margin: 0 auto;
  padding: 36px;
  background: #ffffff;
  border: 1px solid #dfe8dc;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(34, 66, 45, 0.08);
}

.account-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  display: flex;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #4f7c43;
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 700;
}

.account-header h2 {
  margin: 0 0 4px;
  color: #243b2d;
  font-size: 1.5rem;
  font-weight: 700;
}

.member-label {
  margin: 0;
  color: #66806d;
  font-size: 0.95rem;
}

.account-card hr {
  margin: 28px 0;
  border-color: #dfe8dc;
  opacity: 1;
}

.account-details {
  display: flex;
  flex-direction: column;
}

.detail-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  padding: 17px 0;
  border-bottom: 1px solid #edf1eb;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: #667267;
  font-weight: 600;
}

.detail-value {
  color: #263b2c;
  overflow-wrap: anywhere;
}

.account-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.back-btn {
  padding: 10px 20px;
  border: 1px solid #4f7c43;
  background: #ffffff;
  color: #4f7c43;
  font-weight: 600;
}

.back-btn:hover {
  border-color: #3e6535;
  background: #f0f5ee;
  color: #3e6535;
}

.signout-btn {
  padding: 10px 20px;
  border: 1px solid #4f7c43;
  background: #4f7c43;
  color: #ffffff;
  font-weight: 600;
}

.signout-btn:hover {
  border-color: #3e6535;
  background: #3e6535;
  color: #ffffff;
}

@media (max-width: 576px) {
  .account-page {
    padding: 45px 0 70px;
  }

  .account-heading h1 {
    font-size: 2rem;
  }

  .account-card {
    padding: 24px;
  }

  .account-header {
    align-items: flex-start;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .account-actions {
    flex-direction: column;
  }

  .account-actions .btn {
    width: 100%;
  }
}
</style>