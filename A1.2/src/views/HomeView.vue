<script setup>
import { ref } from 'vue'
import AppNavbar from '../components/AppNavbar.vue'

import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup
} from '@vue-leaflet/vue-leaflet'

import 'leaflet/dist/leaflet.css'

// Search data
const searchQuery = ref('')
const searchMessage = ref('')

// Leaflet map reference
const mapRef = ref(null)

// Map settings
const zoom = ref(11)
const mapCenter = ref([-37.8136, 144.9631])

// Sample Melbourne locations
const locations = [
  {
    name: 'Melbourne',
    coordinates: [-37.8136, 144.9631]
  },
  {
    name: 'Clayton',
    coordinates: [-37.9161, 145.1164]
  },
  {
    name: 'Brimbank',
    coordinates: [-37.6690, 144.8430]
  },
  {
    name: 'Hume',
    coordinates: [-37.5980, 144.9190]
  },
  {
    name: 'Wyndham',
    coordinates: [-37.8999, 144.6611]
  }
]

// Map layer filters
const priorityAreas = ref(true)
const activeProjects = ref(true)
const plantedSites = ref(true)
const plantSuppliers = ref(false)
const donationPoints = ref(false)

// Move Leaflet map to a location
const moveMap = (coordinates, newZoom = 13) => {
  mapCenter.value = coordinates
  zoom.value = newZoom

  if (mapRef.value?.leafletObject) {
    mapRef.value.leafletObject.setView(coordinates, newZoom)
  }
}

// Search for a Melbourne location
const searchLocation = () => {
  const query = searchQuery.value.trim().toLowerCase()

  if (query === '') {
    searchMessage.value =
      'Please enter a suburb, postcode or project.'
    return
  }

  const location = locations.find(
    (item) => item.name.toLowerCase() === query
  )

  if (location) {
    moveMap(location.coordinates, 13)

    searchMessage.value =
      `Showing results for: ${location.name}`
  } else {
    searchMessage.value =
      'Location not found. Try Melbourne, Clayton, Brimbank, Hume or Wyndham.'
  }
}

// Move map to user's current location
const useMyLocation = () => {
  if (!navigator.geolocation) {
    searchMessage.value =
      'Geolocation is not supported by your browser.'
    return
  }

  searchMessage.value = 'Finding your location...'

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coordinates = [
        position.coords.latitude,
        position.coords.longitude
      ]

      moveMap(coordinates, 15)

      searchMessage.value =
        'Your current location is shown on the map.'
    },
    () => {
      searchMessage.value =
        'Unable to access your location. Please allow location permission.'
    }
  )
}
</script>

<template>
  <AppNavbar />

  <main class="container py-5">

    <!-- Page title -->
    <section class="mb-4">
      <h1 class="fw-bold">
        MELBOURNE GREEN MAP
      </h1>

      <p class="text-muted">
        Explore Melbourne's greening projects, priority areas and planted sites.
      </p>
    </section>

    <!-- Location search -->
    <section class="mb-4">
      <div class="row g-2">

        <div class="col-12 col-md-7">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Search suburb, postcode or project"
            @keyup.enter="searchLocation"
          />
        </div>

        <div class="col-6 col-md-auto">
          <button
            class="btn btn-dark w-100"
            @click="searchLocation"
          >
            Search
          </button>
        </div>

        <div class="col-6 col-md-auto">
          <button
            class="btn btn-outline-dark w-100"
            @click="useMyLocation"
          >
            My Location
          </button>
        </div>

      </div>

      <p
        v-if="searchMessage"
        class="mt-2 mb-0"
      >
        {{ searchMessage }}
      </p>
    </section>

    <!-- Map layers -->
    <section class="mb-4">
      <h5 class="fw-bold">
        MAP LAYERS
      </h5>

      <div class="d-flex flex-wrap gap-3">

        <div class="form-check">
          <input
            v-model="priorityAreas"
            class="form-check-input"
            type="checkbox"
            id="priorityAreas"
          />
          <label class="form-check-label" for="priorityAreas">
            Priority areas
          </label>
        </div>

        <div class="form-check">
          <input
            v-model="activeProjects"
            class="form-check-input"
            type="checkbox"
            id="activeProjects"
          />
          <label class="form-check-label" for="activeProjects">
            Active projects
          </label>
        </div>

        <div class="form-check">
          <input
            v-model="plantedSites"
            class="form-check-input"
            type="checkbox"
            id="plantedSites"
          />
          <label class="form-check-label" for="plantedSites">
            Planted sites
          </label>
        </div>

        <div class="form-check">
          <input
            v-model="plantSuppliers"
            class="form-check-input"
            type="checkbox"
            id="plantSuppliers"
          />
          <label class="form-check-label" for="plantSuppliers">
            Plant suppliers
          </label>
        </div>

        <div class="form-check">
          <input
            v-model="donationPoints"
            class="form-check-input"
            type="checkbox"
            id="donationPoints"
          />
          <label class="form-check-label" for="donationPoints">
            Donation points
          </label>
        </div>

      </div>
    </section>

    <!-- Interactive Melbourne Map -->
    <section class="map-container">

      <LMap
        ref="mapRef"
        v-model:zoom="zoom"
        :center="mapCenter"
        :use-global-leaflet="false"
        style="height: 450px; width: 100%"
      >

        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <!-- Brimbank Priority Area -->
        <LMarker
          v-if="priorityAreas"
          :lat-lng="[-37.6690, 144.8430]"
        >
          <LPopup>
            <div>
              <strong>
                Priority Greening Area - Brimbank
              </strong>

              <p class="mb-1 mt-2">
                Priority area for urban greening and canopy improvement.
              </p>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=-37.6690,144.8430"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </div>
          </LPopup>
        </LMarker>

        <!-- Active Project -->
        <LMarker
          v-if="activeProjects"
          :lat-lng="[-37.7080, 144.9500]"
        >
          <LPopup>
            <div>
              <strong>
                Active Community Greening Project
              </strong>

              <p class="mb-1 mt-2">
                Current community planting and greening project.
              </p>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=-37.7080,144.9500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </div>
          </LPopup>
        </LMarker>

        <!-- Melbourne Planted Site -->
        <LMarker
          v-if="plantedSites"
          :lat-lng="[-37.8136, 144.9631]"
        >
          <LPopup>
            <div>
              <strong>
                Melbourne Planted Site
              </strong>

              <p class="mb-1 mt-2">
                Existing urban planting site.
              </p>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=-37.8136,144.9631"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </div>
          </LPopup>
        </LMarker>

        <!-- Plant Supplier -->
        <LMarker
          v-if="plantSuppliers"
          :lat-lng="[-37.8768, 145.0458]"
        >
          <LPopup>
            <div>
              <strong>
                Native Plant Supplier
              </strong>

              <p class="mb-1 mt-2">
                Supplier of plants for local greening projects.
              </p>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=-37.8768,145.0458"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </div>
          </LPopup>
        </LMarker>

        <!-- Donation Point -->
        <LMarker
          v-if="donationPoints"
          :lat-lng="[-37.8409, 144.9465]"
        >
          <LPopup>
            <div>
              <strong>
                Plant Donation Point
              </strong>

              <p class="mb-1 mt-2">
                Community plant and greening donation point.
              </p>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=-37.8409,144.9465"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </div>
          </LPopup>
        </LMarker>

      </LMap>

    </section>

  </main>
</template>

<style scoped>
.map-container {
  width: 100%;
  overflow: hidden;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}
</style>