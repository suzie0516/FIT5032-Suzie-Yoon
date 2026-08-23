<script setup>
import { ref } from 'vue'
import AppNavbar from '../components/AppNavbar.vue'

// Search box data
const searchQuery = ref('')
const searchMessage = ref('')

// Map layer filters
const priorityAreas = ref(true)
const activeProjects = ref(true)
const plantedSites = ref(true)
const plantSuppliers = ref(false)
const donationPoints = ref(false)

// Run when the Search button is clicked
const searchLocation = () => {
  if (searchQuery.value.trim() === '') {
    searchMessage.value = 'Please enter a suburb, postcode or project.'
    return
  }

  searchMessage.value = `Showing results for: ${searchQuery.value}`
}
</script>

<template>
  <AppNavbar />

  <main class="container py-5">

    <!-- Page title -->
    <section class="mb-4">
      <h1 class="fw-bold">MELBOURNE GREEN MAP</h1>

      <p class="text-muted">
        Explore Melbourne's greening projects, priority areas and planted sites.
      </p>
    </section>

    <!-- Location search -->
    <section class="mb-4">
      <div class="row g-2">

        <!-- Search input -->
        <div class="col-12 col-md-7">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Search suburb, postcode or project"
          />
        </div>

        <!-- Search button -->
        <div class="col-6 col-md-auto">
          <button
            class="btn btn-dark w-100"
            @click="searchLocation"
          >
            Search
          </button>
        </div>

        <!-- My Location button -->
        <div class="col-6 col-md-auto">
          <button class="btn btn-outline-dark w-100">
            My Location
          </button>
        </div>

      </div>

      <!-- Search result message -->
      <p
        v-if="searchMessage"
        class="mt-2 mb-0"
      >
        {{ searchMessage }}
      </p>
    </section>

    <!-- Map filters -->
    <section class="mb-4">
      <h5 class="fw-bold">MAP LAYERS</h5>

      <div class="d-flex flex-wrap gap-3">

        <!-- Priority areas -->
        <div class="form-check">
          <input
            v-model="priorityAreas"
            class="form-check-input"
            type="checkbox"
            id="priorityAreas"
          />
          <label
            class="form-check-label"
            for="priorityAreas"
          >
            Priority areas
          </label>
        </div>

        <!-- Active projects -->
        <div class="form-check">
          <input
            v-model="activeProjects"
            class="form-check-input"
            type="checkbox"
            id="activeProjects"
          />
          <label
            class="form-check-label"
            for="activeProjects"
          >
            Active projects
          </label>
        </div>

        <!-- Planted sites -->
        <div class="form-check">
          <input
            v-model="plantedSites"
            class="form-check-input"
            type="checkbox"
            id="plantedSites"
          />
          <label
            class="form-check-label"
            for="plantedSites"
          >
            Planted sites
          </label>
        </div>

        <!-- Plant suppliers -->
        <div class="form-check">
          <input
            v-model="plantSuppliers"
            class="form-check-input"
            type="checkbox"
            id="plantSuppliers"
          />
          <label
            class="form-check-label"
            for="plantSuppliers"
          >
            Plant suppliers
          </label>
        </div>

        <!-- Donation points -->
        <div class="form-check">
          <input
            v-model="donationPoints"
            class="form-check-input"
            type="checkbox"
            id="donationPoints"
          />
          <label
            class="form-check-label"
            for="donationPoints"
          >
            Donation points
          </label>
        </div>

      </div>
    </section>

    <!-- Temporary map area -->
    <section
      class="border rounded bg-light d-flex align-items-center justify-content-center"
      style="min-height: 400px"
    >
      <div class="text-center">

        <h3>Melbourne Green Map</h3>

        <p class="text-muted">
          Active map layers:
        </p>

        <div class="d-flex flex-wrap justify-content-center gap-2">

          <span
            v-if="priorityAreas"
            class="badge text-bg-danger"
          >
            Priority Areas
          </span>

          <span
            v-if="activeProjects"
            class="badge text-bg-success"
          >
            Active Projects
          </span>

          <span
            v-if="plantedSites"
            class="badge text-bg-primary"
          >
            Planted Sites
          </span>

          <span
            v-if="plantSuppliers"
            class="badge text-bg-warning"
          >
            Plant Suppliers
          </span>

          <span
            v-if="donationPoints"
            class="badge text-bg-dark"
          >
            Donation Points
          </span>

        </div>

      </div>
    </section>

  </main>
</template>