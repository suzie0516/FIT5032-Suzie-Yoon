<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom">
    <div class="container">

      <!-- Logo / Home -->
      <RouterLink
        class="navbar-brand fw-bold"
        to="/"
      >
        POTS & PLANTS MELBOURNE
      </RouterLink>

      <!-- Mobile Menu Button -->
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

      <div
        class="collapse navbar-collapse"
        id="mainNavbar"
      >
        <ul class="navbar-nav ms-auto align-items-lg-center">

          <!-- Green Map -->
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              to="/"
            >
              Explore
            </RouterLink>
          </li>

          <!-- Volunteer Form -->
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              to="/volunteer"
            >
              Our Programs
            </RouterLink>
          </li>

          <!-- Plant Finder -->
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              to="/plants"
            >
              Resources
            </RouterLink>
          </li>

          <!-- Future Pages -->
          <li class="nav-item">
            <span class="nav-link">
              Events
            </span>
          </li>

          <li class="nav-item">
            <span class="nav-link">
              About Us
            </span>
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

          <!-- Sign In -->
          <li class="nav-item ms-lg-2">
            <button
              class="btn btn-dark btn-sm"
              type="button"
            >
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
.router-link-active.nav-link {
  font-weight: 600;
  text-decoration: underline;
}

.nav-link {
  cursor: default;
}
</style>