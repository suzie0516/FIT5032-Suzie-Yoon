<template>
  <nav class="navbar navbar-expand-xxl fixed-top custom-navbar">
    <div class="container-fluid navbar-container">

      <!-- =========================
           LOGO + TITLE
      ========================== -->
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


      <!-- =========================
           HAMBURGER / CLOSE
      ========================== -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        :aria-expanded="menuOpen"
        aria-label="Toggle navigation"
      >
        <!-- Closed -->
        <span
          v-if="!menuOpen"
          class="hamburger-icon"
        >
          ☰
        </span>

        <!-- Open -->
        <span
          v-else
          class="close-icon"
        >
          ×
        </span>
      </button>


      <!-- =========================
           NAVIGATION
      ========================== -->
      <div
        id="mainNavbar"
        class="collapse navbar-collapse"
      >
        <ul class="navbar-nav ms-auto align-items-xxl-center">

          <!-- =========================
               EXPLORE
          ========================== -->
          <li class="nav-item dropdown">
            <a
              id="exploreDropdown"
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Explore
            </a>

            <ul
              class="dropdown-menu"
              aria-labelledby="exploreDropdown"
            >
              <li>
                <RouterLink
                  class="dropdown-item"
                  to="/"
                  @click="closeMenu"
                >
                  Melbourne Green Map
                </RouterLink>
              </li>

              <li>
                <RouterLink
                  class="dropdown-item"
                  to="/plants"
                  @click="closeMenu"
                >
                  Find Plants
                </RouterLink>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Greening Projects
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Filters & Layers
                </span>
              </li>
            </ul>
          </li>


          <!-- =========================
               OUR PROGRAMS
          ========================== -->
          <li class="nav-item dropdown">
            <a
              id="programsDropdown"
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Our Programs
            </a>

            <ul
              class="dropdown-menu"
              aria-labelledby="programsDropdown"
            >
              <li>
                <span class="dropdown-item coming-item">
                  Biodiversity Projects
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Habitat & Native Planting
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Community Planting
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Classes & Workshops
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Education Materials
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Greening the City
                </span>
              </li>
            </ul>
          </li>


          <!-- =========================
               RESOURCES
          ========================== -->
          <li class="nav-item dropdown">
            <a
              id="resourcesDropdown"
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Resources
            </a>

            <ul
              class="dropdown-menu"
              aria-labelledby="resourcesDropdown"
            >
              <li>
                <span class="dropdown-item coming-item">
                  Planting Guides
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Latest News
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Newsletter
                </span>
              </li>
            </ul>
          </li>


          <!-- =========================
               EVENTS
          ========================== -->
          <li class="nav-item dropdown">
            <a
              id="eventsDropdown"
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Events
            </a>

            <ul
              class="dropdown-menu"
              aria-labelledby="eventsDropdown"
            >
              <li>
                <span class="dropdown-item coming-item">
                  Run for the Bees
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Green Melbourne Design Contest
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  About Competition
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Finalist Designs
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Explore Designs
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Winning Design
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Current Campaigns
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Community Rating
                </span>
              </li>
            </ul>
          </li>


          <!-- =========================
               ABOUT US
          ========================== -->
          <li class="nav-item dropdown">
            <a
              id="aboutDropdown"
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              About Us
            </a>

            <ul
              class="dropdown-menu"
              aria-labelledby="aboutDropdown"
            >
              <li>
                <span class="dropdown-item coming-item">
                  Our Story
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Our Purpose
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Our Team
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Partners
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Careers / Internship
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Contact Info
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Q & A
                </span>
              </li>

              <li>
                <RouterLink
                  class="dropdown-item"
                  to="/volunteer"
                  @click="closeMenu"
                >
                  Volunteering
                </RouterLink>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Our Impact
                </span>
              </li>
            </ul>
          </li>


          <!-- =========================
               SHOP
          ========================== -->
          <li class="nav-item dropdown">
            <a
              id="shopDropdown"
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Shop
            </a>

            <ul
              class="dropdown-menu"
              aria-labelledby="shopDropdown"
            >
              <li>
                <span class="dropdown-item coming-item">
                  Plants & Equipment
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Merchandise
                </span>
              </li>
            </ul>
          </li>


          <!-- =========================
               DONATE
          ========================== -->
          <li class="nav-item dropdown">
            <a
              id="donateDropdown"
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Donate
            </a>

            <ul
              class="dropdown-menu"
              aria-labelledby="donateDropdown"
            >
              <li>
                <span class="dropdown-item coming-item">
                  Donate Money
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  Donate Monthly
                </span>
              </li>

              <li>
                <span class="dropdown-item coming-item">
                  In-kind Donation
                </span>
              </li>
            </ul>
          </li>


          <!-- =========================
               ACCOUNT
          ========================== -->
          <li class="nav-item dropdown">
            <a
              id="accountDropdown"
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Account
            </a>

            <!-- Logged Out -->
            <ul
              v-if="!isAuthenticated"
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="accountDropdown"
            >
              <li>
                <RouterLink
                  class="dropdown-item"
                  to="/login"
                  @click="closeMenu"
                >
                  Sign In
                </RouterLink>
              </li>

              <li>
                <RouterLink
                  class="dropdown-item"
                  to="/register"
                  @click="closeMenu"
                >
                  Register
                </RouterLink>
              </li>
            </ul>


            <!-- Logged In -->
            <ul
              v-else
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="accountDropdown"
            >
              <li>
                <button
                  class="dropdown-item"
                  type="button"
                  @click="goToAccount"
                >
                  My Account
                </button>
              </li>

              <!-- Admin only -->
              <li v-if="isAdmin">
                <button
                  class="dropdown-item"
                  type="button"
                  @click="goToAdmin"
                >
                  Admin Dashboard
                </button>
              </li>

              <li>
                <hr class="dropdown-divider" />
              </li>

              <li>
                <button
                  class="dropdown-item"
                  type="button"
                  @click="handleLogout"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </li>


          <!-- =========================
               RIGHT AUTH BUTTON
          ========================== -->
          <li class="nav-item sign-in-item">

            <!-- Logged Out -->
            <RouterLink
              v-if="!isAuthenticated"
              class="btn auth-btn"
              to="/login"
              @click="closeMenu"
            >
              Sign In
            </RouterLink>

            <!-- Logged In -->
            <button
              v-else
              class="btn auth-btn"
              type="button"
              @click="handleLogout"
            >
              Sign Out
            </button>

          </li>

        </ul>
      </div>

    </div>
  </nav>

  <!-- Space for fixed navbar -->
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


// =========================
// BOOTSTRAP MENU STATE
// =========================

const handleMenuShown = () => {
  menuOpen.value = true
}

const handleMenuHidden = () => {
  menuOpen.value = false
}


// =========================
// CLOSE MOBILE MENU
// =========================

const closeMenu = () => {
  /*
    Bootstrap controls the actual collapse state.

    When a navigation link is selected,
    manually close the mobile menu if it is open.
  */

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
      /*
        Fallback:
        menuOpen will still be reset.
      */
      menuOpen.value = false
    }
  } else {
    menuOpen.value = false
  }
}


// =========================
// LOGOUT
// =========================

const handleLogout = () => {
  logout()

  closeMenu()

  router.push('/')
}


// =========================
// ACCOUNT
// =========================

const goToAccount = () => {
  closeMenu()

  router.push('/account')
}


// =========================
// ADMIN
// =========================

const goToAdmin = () => {
  closeMenu()

  router.push('/admin')
}


// =========================
// BOOTSTRAP EVENTS
// =========================

onMounted(() => {
  navbarElement =
    document.getElementById('mainNavbar')

  if (!navbarElement) {
    return
  }

  /*
    Bootstrap fires these events only after
    the collapse has actually opened/closed.

    Therefore the icon always represents
    the real menu state.
  */

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

/* =========================
   NAVBAR
========================= */

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


/* =========================
   LOGO + TITLE
========================= */

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


/* =========================
   NAVIGATION
========================= */

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


/* =========================
   DROPDOWN
========================= */

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


/*
  These items are included in the sitemap,
  but their pages will be implemented later.
*/

.coming-item {
  color: #3e493f;
}


.coming-item:hover {
  color: #35682d;

  background-color: #f1f7ee;
}


/* =========================
   SIGN IN / SIGN OUT
========================= */

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


/* =========================
   HAMBURGER / CLOSE
========================= */

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


/* =========================
   FIXED NAVBAR SPACER
========================= */

.navbar-spacer {
  height: 79px;
}


/* =========================
   BELOW 1400px
   -> HAMBURGER
========================= */

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


/* =========================
   MOBILE
========================= */

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


/* =========================
   VERY SMALL MOBILE
========================= */

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

</style>