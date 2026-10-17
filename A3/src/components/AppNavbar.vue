<template>
    <nav class="navbar fixed-top custom-navbar" aria-label="Main navigation">
      <div class="container-fluid navbar-container">
        <RouterLink class="navbar-brand brand-area" to="/" @click="closeMenu">
          <img src="../assets/plant-logo.png" alt="" class="brand-icon" />
          <span class="brand-title">POTS & PLANTS MELBOURNE</span>
        </RouterLink>

        <div class="header-auth">
          <template v-if="!isAuthenticated">
            <RouterLink to="/login" class="header-signin" @click="closeMenu">Sign In</RouterLink>
            <RouterLink to="/register" class="btn auth-btn" @click="closeMenu">Register</RouterLink>
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
          :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'"
        >
          <span aria-hidden="true" class="menu-symbol">{{ menuOpen ? '×' : '☰' }}</span>
        </button>

        <div id="mainNavbar" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item dropdown">
              <button id="exploreDropdown" class="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Explore</button>
              <ul class="dropdown-menu" aria-labelledby="exploreDropdown">
                <li><RouterLink class="dropdown-item" to="/" @click="closeMenu">Melbourne Green Map</RouterLink></li>
                <li><RouterLink class="dropdown-item" to="/plants" @click="closeMenu">Plant Finder</RouterLink></li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <button id="communityDropdown" class="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Community</button>
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
              <button id="resourcesDropdown" class="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Resources</button>
              <ul class="dropdown-menu" aria-labelledby="resourcesDropdown">
                <li><RouterLink class="dropdown-item" to="/tables" @click="closeMenu">Green Records</RouterLink></li>
                <li><RouterLink class="dropdown-item" to="/plants" @click="closeMenu">Plant Guide</RouterLink></li>
              </ul>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" to="/about" @click="closeMenu">About Us</RouterLink>
            </li>

            <li class="nav-item dropdown">
              <button id="accountDropdown" class="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Account</button>
              <ul class="dropdown-menu" aria-labelledby="accountDropdown">
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
    <div class="navbar-spacer" aria-hidden="true"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { isAuthenticated, isAdmin, logout } from '../utils/auth'

const router = useRouter()
const menuOpen = ref(false)
let navbarElement = null

const handleMenuShown = () => { menuOpen.value = true }
const handleMenuHidden = () => { menuOpen.value = false }

const closeMenu = () => {
  if (!navbarElement) return
  const BootstrapCollapse = window.bootstrap?.Collapse
  if (navbarElement.classList.contains('show') && BootstrapCollapse) {
    BootstrapCollapse.getOrCreateInstance(navbarElement).hide()
  } else {
    menuOpen.value = false
  }
}

const goToAccount = () => {
  closeMenu()
  router.push('/account')
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

onMounted(() => {
  navbarElement = document.getElementById('mainNavbar')
  if (!navbarElement) return
  navbarElement.addEventListener('shown.bs.collapse', handleMenuShown)
  navbarElement.addEventListener('hidden.bs.collapse', handleMenuHidden)
})

onBeforeUnmount(() => {
  if (!navbarElement) return
  navbarElement.removeEventListener('shown.bs.collapse', handleMenuShown)
  navbarElement.removeEventListener('hidden.bs.collapse', handleMenuHidden)
})
</script>

<style scoped>
.custom-navbar {
  min-height: 78px;
  background: #f7faf5;
  border-bottom: 1px solid #d9e6dd;
  box-shadow: 0 3px 15px rgba(27, 65, 46, 0.08);
}
.navbar-container { padding: 9px 2rem; flex-wrap: wrap; }
.brand-area { display: inline-flex; align-items: center; gap: 12px; min-width: 0; margin-right: 12px; text-decoration: none; }
.brand-icon { width: 54px; height: 54px; object-fit: contain; flex-shrink: 0; }
.brand-title { color: #2d623c; font-family: Georgia, 'Times New Roman', serif; font-weight: 700; font-size: 1.35rem; letter-spacing: 0.3px; white-space: nowrap; }
.header-auth { margin-left: auto; display: flex; align-items: center; gap: 12px; }
.header-signin { color: #27607b; text-decoration: none; white-space: nowrap; font-weight: 650; }
.header-signin:hover { text-decoration: underline; }
.auth-btn { background: #336f4c; border: 1px solid #336f4c; color: #fff; border-radius: 9px; padding: 8px 15px; text-decoration: none; white-space: nowrap; }
.auth-btn:hover { background: #26583b; border-color: #26583b; color: #fff; }
.navbar-toggler { width: 44px; height: 44px; margin-left: 12px; padding: 0; display: flex; align-items: center; justify-content: center; border: 1px solid #cbded5; border-radius: 10px; color: #2a6857; }
.menu-symbol { font-size: 1.8rem; line-height: 1; }
.navbar-collapse { flex-basis: 100%; width: 100%; margin-top: 9px; padding: 10px 0; border-top: 1px solid #dce7d8; max-height: calc(100dvh - 100px); overflow-y: auto; }
.navbar-nav { gap: 3px; width: 100%; }
.nav-link { display: inline-flex; align-items: center; padding: 10px 9px !important; color: #314d3b; font-size: .95rem; font-weight: 600; text-decoration: none; cursor: pointer; border-radius: 8px; }
.nav-link:hover, .nav-link.router-link-exact-active { color: #276785; background: #eaf3f5; }
button.nav-link { background: transparent; border: 0; }
button.nav-link:hover { background: #eaf3f5; }
.dropdown-menu { min-width: 215px; border: 1px solid #d9e6e5; border-radius: 12px; box-shadow: 0 10px 25px rgba(25, 67, 67, .12); padding: 8px; }
.dropdown-item { color: #314d3b; border-radius: 6px; padding: 9px 12px; white-space: normal; cursor: pointer; }
.dropdown-item:hover, .dropdown-item.router-link-active { background: #eaf4f4; color: #245d7a; }
.nav-link:focus-visible, .dropdown-item:focus-visible, .header-signin:focus-visible, .auth-btn:focus-visible, .navbar-toggler:focus-visible { outline: 3px solid #237a9b; outline-offset: 3px; }
.navbar-spacer { height: 80px; }
@media (max-width: 1399.98px) {
  .navbar-container { padding-left: 1.25rem; padding-right: 1.25rem; }
  .brand-icon { width: 46px; height: 46px; }
  .brand-title { font-size: 1.12rem; }
  .navbar-spacer { height: 77px; }
}
@media (max-width: 575.98px) {
  .navbar-container { padding: 10px .75rem; }
  .brand-area { gap: 6px; margin-right: 4px; }
  .brand-icon { width: 36px; height: 36px; }
  .brand-title { font-size: .78rem; letter-spacing: 0; }
  .header-auth { gap: 6px; }
  .header-signin { font-size: .75rem; }
  .auth-btn { padding: 6px 8px; font-size: .75rem; }
  .navbar-toggler { width: 35px; height: 35px; margin-left: 5px; }
  .menu-symbol { font-size: 1.5rem; }
  .navbar-spacer { height: 75px; }
}
@media (max-width: 390px) {
  .brand-icon { width: 30px; height: 30px; }
  .brand-title { font-size: .69rem; }
  .header-signin { font-size: .69rem; }
  .auth-btn { padding: 5px 6px; font-size: .68rem; }
}
</style>
