<template>
  <nav class="navbar fixed-top custom-navbar">
    <div class="container-fluid navbar-container">
      <RouterLink
        class="navbar-brand brand-area"
        to="/"
        @click="closeMenu"
      >
        <img
          src="../assets/plant-logo.png"
          alt="Pots and Plants Melbourne logo"
          class="brand-icon"
        />
        <span class="brand-title">
          POTS & PLANTS MELBOURNE
        </span>
      </RouterLink>
      <div class="header-auth">
        <template v-if="!isAuthenticated">
          <RouterLink to="/login" class="header-signin" @click="closeMenu">Sign In</RouterLink>
          <RouterLink to="/register" class="btn auth-btn header-register" @click="closeMenu">Register</RouterLink>
        </template>
        <button v-else type="button" class="btn auth-btn" @click="goToAccount">My Account</button>
      </div>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        :aria-expanded="menuOpen"
        aria-label="Toggle navigation"
      >
        <span
          v-if="!menuOpen"
          class="hamburger-icon"
        >
          ☰
        </span>
        <span
          v-else
          class="close-icon"
        >
          ×
        </span>
      </button>
      <div
        id="mainNavbar"
        class="collapse navbar-collapse"
      >
        <ul class="navbar-nav ms-auto align-items-xxl-center">
          <li class="nav-item dropdown">
            <button id="exploreDropdown" class="nav-link dropdown-toggle" type="button"
              data-bs-toggle="dropdown" aria-expanded="false">Explore</button>
            <ul class="dropdown-menu" aria-labelledby="exploreDropdown">
              <li><RouterLink class="dropdown-item" to="/" @click="closeMenu">Melbourne Green Map</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/plants" @click="closeMenu">Plant Finder</RouterLink></li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <button id="communityDropdown" class="nav-link dropdown-toggle" type="button"
              data-bs-toggle="dropdown" aria-expanded="false">Community</button>
            <ul class="dropdown-menu" aria-labelledby="communityDropdown">
              <li><RouterLink class="dropdown-item" to="/programs" @click="closeMenu">Green Melbourne Design Contest</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/design-challenge" @click="closeMenu">Community Ratings</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/volunteer" @click="closeMenu">Volunteering</RouterLink></li>
            </ul>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/programs" @click="closeMenu">Our Programs</RouterLink>
          </li>

          <li class="nav-item dropdown">
            <button id="resourcesDropdown" class="nav-link dropdown-toggle" type="button"
              data-bs-toggle="dropdown" aria-expanded="false">Resources</button>
            <ul class="dropdown-menu" aria-labelledby="resourcesDropdown">
              <li><RouterLink class="dropdown-item" to="/tables" @click="closeMenu">Green Records</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/plants" @click="closeMenu">Plant Guide</RouterLink></li>
            </ul>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/about" @click="closeMenu">About Us</RouterLink>
          </li>

          <li class="nav-item dropdown">
            <button id="accountDropdown" class="nav-link dropdown-toggle" type="button"
              data-bs-toggle="dropdown" aria-expanded="false">Account</button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
              <template v-if="!isAuthenticated">
                <li><RouterLink class="dropdown-item" to="/login" @click="closeMenu">Sign In</RouterLink></li>
                <li><RouterLink class="dropdown-item" to="/register" @click="closeMenu">Register</RouterLink></li>
              </template>
              <template v-else>
                <li><RouterLink class="dropdown-item" to="/account" @click="closeMenu">My Account</RouterLink></li>
                <li><RouterLink class="dropdown-item" to="/email" @click="closeMenu">Send Email</RouterLink></li>
                <li v-if="isAdmin"><RouterLink class="dropdown-item" to="/admin" @click="closeMenu">Admin Dashboard</RouterLink></li>
                <li><hr class="dropdown-divider" /></li>
                <li><button class="dropdown-item" type="button" @click="handleLogout">Sign Out</button></li>
              </template>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="navbar-spacer"></div>
</template>
<script setup>
import {
  onMounted,
  onBeforeUnmount,
  ref,
} from 'vue'
import {
  RouterLink,
  useRouter,
} from 'vue-router'
import {
  isAuthenticated,
  isAdmin,
  logout,
} from '../utils/auth'
const router = useRouter()
const menuOpen = ref(false)
let navbarElement = null
const handleMenuShown = () => {
  menuOpen.value = true
}
const handleMenuHidden = () => {
  menuOpen.value = false
}
const closeMenu = () => {
  if (!navbarElement) {
    menuOpen.value = false
    return
  }
  if (
    navbarElement.classList.contains('show')
  ) {
    const bootstrapObject = window.bootstrap
    if (
      bootstrapObject &&
      bootstrapObject.Collapse
    ) {
      const collapse =
        bootstrapObject.Collapse.getOrCreateInstance(
          navbarElement,
        )
      collapse.hide()
    } else {
      menuOpen.value = false
    }
  } else {
    menuOpen.value = false
  }
}
const handleLogout = async () => {
  try {
    await logout()
    closeMenu()
    await router.push('/')
  } catch (error) {
    console.error('Sign out failed:', error)
  }
}
const goToAccount = () => {
  closeMenu()
  router.push('/account')
}
onMounted(() => {
  navbarElement =
    document.getElementById('mainNavbar')
  if (!navbarElement) {
    return
  }
  navbarElement.addEventListener(
    'shown.bs.collapse',
    handleMenuShown,
  )
  navbarElement.addEventListener(
    'hidden.bs.collapse',
    handleMenuHidden,
  )
})
onBeforeUnmount(() => {
  if (!navbarElement) {
    return
  }
  navbarElement.removeEventListener(
    'shown.bs.collapse',
    handleMenuShown,
  )
  navbarElement.removeEventListener(
    'hidden.bs.collapse',
    handleMenuHidden,
  )
})
</script>
<style scoped>
.custom-navbar {
  background-color: #f7faf5;
  border-bottom:
    1px solid #dce7d8;
  min-height: 78px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06);
}
.navbar-container {
  padding-left: 2rem;
  padding-right: 2rem;
  flex-wrap: nowrap;
}
.brand-area {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 12px;
  margin-right: 1.5rem;
  text-decoration: none;
  flex-shrink: 0;
}
.brand-icon {
  width: 58px;
  height: 58px;
  object-fit: contain;
  flex-shrink: 0;
}
.brand-title {
  color: #35682d;
  font-family:
    Georgia,
    "Times New Roman",
    serif;
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  white-space: nowrap;
  line-height: 1;
}
.navbar-nav {
  gap: 0.15rem;
}
.nav-link {
  color: #3e493f;
  font-size: 0.95rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  padding-left:
    0.65rem !important;
  padding-right:
    0.65rem !important;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}
.nav-link:hover {
  color: #35682d;
}
.dropdown-menu {
  min-width: 220px;
  max-height: 70vh;
  overflow-y: auto;
  border:
    1px solid #dce7d8;
  box-shadow:
    0 5px 15px
    rgba(0, 0, 0, 0.08);
}
.dropdown-item {
  color: #3e493f;
  cursor: pointer;
  white-space: normal;
}
.dropdown-item:hover {
  color: #35682d;
  background-color: #f1f7ee;
}
.router-link-active.dropdown-item {
  color: #35682d;
  font-weight: 600;
}
.sign-in-item {
  margin-left: 0.5rem;
}
.auth-btn {
  color: white;
  background-color: #35682d;
  border:
    1px solid #35682d;
  padding: 7px 15px;
  white-space: nowrap;
  text-decoration: none;
}
.auth-btn:hover {
  color: white;
  background-color: #285222;
  border-color: #285222;
}
.navbar-toggler {
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  padding: 0;
  border: none;
  background: transparent;
  flex-shrink: 0;
}
.hamburger-icon {
  display: block;
  color: #35682d;
  font-size: 2rem;
  font-weight: 400;
  line-height: 1;
}
.close-icon {
  display: block;
  color: #35682d;
  font-size: 2.5rem;
  font-weight: 300;
  line-height: 1;
}
.navbar-toggler:focus {
  box-shadow: none;
}
.navbar-spacer {
  height: 79px;
}
@media (max-width: 1399.98px) {
  .custom-navbar {
    min-height: 74px;
  }
  .navbar-container {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    flex-wrap: wrap;
  }
  .brand-area {
    flex-wrap: nowrap;
    margin-right: auto;
  }
  .brand-icon {
    width: 48px;
    height: 48px;
  }
  .brand-title {
    font-size: 1.2rem;
    white-space: nowrap;
  }
  .navbar-collapse {
    flex-basis: 100%;
    margin-top: 8px;
    padding-top: 10px;
    padding-bottom: 15px;
    border-top:
      1px solid #dce7d8;
  }
  .navbar-nav {
    width: 100%;
    align-items:
      stretch !important;
    gap: 2px;
  }
  .nav-link {
    padding:
      10px 4px !important;
  }
  .dropdown-menu {
    max-height: none;
    overflow-y: visible;
  }
  .sign-in-item {
    margin-left: 0;
    margin-top: 8px;
  }
  .auth-btn {
    width: 100%;
  }
  .navbar-spacer {
    height: 75px;
  }
}
@media (max-width: 575.98px) {
  .navbar-container {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .brand-area {
    gap: 8px;
  }
  .brand-icon {
    width: 38px;
    height: 38px;
  }
  .brand-title {
    font-size: 0.82rem;
    letter-spacing: 0;
    white-space: nowrap;
  }
  .navbar-spacer {
    height: 75px;
  }
}
@media (max-width: 390px) {
  .brand-icon {
    width: 32px;
    height: 32px;
  }
  .brand-title {
    font-size: 0.7rem;
  }
  .brand-area {
    gap: 6px;
  }
}
.header-auth {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}
.header-signin {
  color: #35682d;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}
.header-signin:hover { text-decoration: underline; }
.navbar-toggler { margin-left: 12px; }
.navbar-collapse {
  flex-basis: 100%;
  width: 100%;
  margin-top: 8px;
  padding: 12px 0;
  border-top: 1px solid #dce7d8;
  max-height: calc(100vh - 90px);
  max-height: calc(100dvh - 90px);
  overflow-y: auto;
}
.navbar-nav { width: 100%; align-items: stretch !important; }
.nav-link { padding: 10px 8px !important; }
.nav-link:focus-visible, .dropdown-item:focus-visible, .navbar-toggler:focus-visible {
  outline: 2px solid #35682d;
  outline-offset: 2px;
}
.dropdown-menu { max-height: none; }
@media (max-width: 575.98px) {
  .header-auth { gap: 7px; }
  .header-signin { font-size: .78rem; }
  .header-auth .auth-btn { padding: 6px 9px; font-size: .75rem; }
  .navbar-toggler { width: 36px; margin-left: 5px; }
}
@media (max-width: 390px) {
  .header-auth { gap: 5px; }
  .header-signin { font-size: .72rem; }
  .header-auth .auth-btn { padding: 5px 7px; font-size: .7rem; }
}
button.nav-link { background: transparent; border: 0; }
button.nav-link:hover, button.nav-link:focus-visible { color: #35682d; }
</style>
