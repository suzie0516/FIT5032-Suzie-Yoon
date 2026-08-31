<template>
  <nav class="navbar navbar-expand-xxl fixed-top custom-navbar">
    <div class="container-fluid navbar-container">

      <!-- Logo + title -->
      <RouterLink
        class="navbar-brand brand-area"
        to="/"
      >
        <img
          src="../assets/plant-logo.png"
          alt="Pots and Plants logo"
          class="brand-icon"
        />

        <span class="brand-title">
          POTS & PLANTS MELBOURNE
        </span>
      </RouterLink>

      <!-- Hamburger / Close -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        :aria-expanded="menuOpen"
        aria-label="Toggle navigation"
        @click="menuOpen = !menuOpen"
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

      <!-- Navigation -->
      <div
        id="mainNavbar"
        class="collapse navbar-collapse"
      >
        <ul class="navbar-nav ms-auto align-items-xxl-center">

          <!-- Explore -->
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
                  to="/plants"
                >
                  Find Plants
                </RouterLink>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <span class="nav-link">
              Our Programs
            </span>
          </li>

          <li class="nav-item">
            <span class="nav-link">
              Resources
            </span>
          </li>

          <li class="nav-item">
            <span class="nav-link">
              Events
            </span>
          </li>

          <!-- About Us -->
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
                <RouterLink
                  class="dropdown-item"
                  to="/volunteer"
                >
                  Volunteering
                </RouterLink>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <span class="nav-link">
              Shop
            </span>
          </li>

          <li class="nav-item">
            <span class="nav-link">
              Donate
            </span>
          </li>

          <li class="nav-item">
            <span class="nav-link">
              Account
            </span>
          </li>

          <li class="nav-item sign-in-item">
            <button
              class="btn sign-in-btn"
              type="button"
            >
              Sign In
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
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const menuOpen = ref(false)
</script>


<style scoped>

/* =========================
   NAVBAR
========================= */

.custom-navbar {
  background-color: #f7faf5;
  border-bottom: 1px solid #dce7d8;

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

  /* Never separate logo and title */
  flex-wrap: nowrap;

  gap: 12px;

  margin-right: 1.5rem;

  text-decoration: none;

  flex-shrink: 0;
}


/* Plant picture only */
.brand-icon {
  width: 58px;
  height: 58px;

  object-fit: contain;

  flex-shrink: 0;
}


/* Real HTML title */
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

  padding-left: 0.65rem !important;
  padding-right: 0.65rem !important;

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
  border: 1px solid #dce7d8;

  box-shadow:
    0 5px 15px rgba(0, 0, 0, 0.08);
}

.dropdown-item {
  color: #3e493f;
}

.dropdown-item:hover {
  color: #35682d;

  background-color: #f1f7ee;
}

.router-link-active.dropdown-item {
  color: #35682d;

  font-weight: 600;
}


/* =========================
   SIGN IN
========================= */

.sign-in-item {
  margin-left: 0.5rem;
}

.sign-in-btn {
  color: white;

  background-color: #35682d;

  border: 1px solid #35682d;

  padding: 7px 15px;

  white-space: nowrap;
}

.sign-in-btn:hover {
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

  /*
    Logo and title still NEVER wrap.
  */
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

  /*
    Menu appears below only AFTER
    user clicks hamburger.
  */
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

    align-items: stretch !important;

    gap: 2px;
  }

  .nav-link {
    padding:
      10px 4px !important;
  }

  .sign-in-item {
    margin-left: 0;

    margin-top: 8px;
  }

  .sign-in-btn {
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