<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">
        POTS & PLANTS MELBOURNE
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav ms-auto align-items-lg-center">

          <!-- Explore -> Find Plants -->
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="exploreDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Explore
            </a>

            <ul class="dropdown-menu" aria-labelledby="exploreDropdown">
              <li>
                <RouterLink class="dropdown-item" to="/plants">
                  Find Plants
                </RouterLink>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <span class="nav-link">Our Programs</span>
          </li>

          <li class="nav-item">
            <span class="nav-link">Resources</span>
          </li>

          <li class="nav-item">
            <span class="nav-link">Events</span>
          </li>

          <!-- About Us -> Volunteering -->
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="aboutDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              About Us
            </a>

            <ul class="dropdown-menu" aria-labelledby="aboutDropdown">
              <li>
                <RouterLink class="dropdown-item" to="/volunteer">
                  Volunteering
                </RouterLink>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <span class="nav-link">Shop</span>
          </li>

          <li class="nav-item">
            <span class="nav-link">Donate</span>
          </li>

          <li class="nav-item">
            <span class="nav-link">Account</span>
          </li>

          <li class="nav-item ms-lg-2">
            <button class="btn btn-dark btn-sm" type="button">
              Sign In
            </button>
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.router-link-active.dropdown-item {
  font-weight: 600;
}

.nav-link {
  cursor: pointer;
}
</style>