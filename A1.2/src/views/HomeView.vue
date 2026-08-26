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


// --------------------------------------------------
// 1. LOCATION DATA
// --------------------------------------------------

// Each coordinate is stored once.
// Search and markers use the same values.

const melbourneCoordinates = [-37.8136, 144.9631]
const claytonCoordinates = [-37.9161, 145.1164]

// Sunshine area used as the Brimbank example location
const brimbankCoordinates = [-37.7810, 144.8320]

const humeCoordinates = [-37.5980, 144.9190]
const wyndhamCoordinates = [-37.8999, 144.6611]


const locations = [
  {
    name: 'Melbourne',
    coordinates: melbourneCoordinates
  },
  {
    name: 'Clayton',
    coordinates: claytonCoordinates
  },
  {
    name: 'Brimbank',
    coordinates: brimbankCoordinates
  },
  {
    name: 'Hume',
    coordinates: humeCoordinates
  },
  {
    name: 'Wyndham',
    coordinates: wyndhamCoordinates
  }
]


// --------------------------------------------------
// 2. SEARCH DATA
// --------------------------------------------------

const searchQuery = ref('')
const searchMessage = ref('')


// --------------------------------------------------
// 3. MAP SETTINGS
// --------------------------------------------------

const mapCenter = ref(melbourneCoordinates)
const zoom = ref(11)

// Changing this value recreates the Leaflet map.
// This makes map movement reliable after a search.
const mapKey = ref(0)


// --------------------------------------------------
// 4. MAP LAYERS
// --------------------------------------------------

const priorityAreas = ref(true)
const activeProjects = ref(true)
const plantedSites = ref(true)
const plantSuppliers = ref(false)
const donationPoints = ref(false)


// --------------------------------------------------
// 5. MOVE MAP
// --------------------------------------------------

const moveMap = (coordinates, newZoom = 13) => {
  // Give Vue a new coordinate array.
  mapCenter.value = [...coordinates]

  // Change zoom.
  zoom.value = newZoom

  // Recreate map using the new centre.
  mapKey.value++
}


// --------------------------------------------------
// 6. SEARCH
// --------------------------------------------------

const searchLocation = () => {
  const query = searchQuery.value.trim().toLowerCase()

  // Empty search validation
  if (query === '') {
    searchMessage.value =
      'Please enter a suburb, postcode or project.'

    return
  }

  // Find matching location in JavaScript data
  const location = locations.find(
    (item) => item.name.toLowerCase() === query
  )

  // Invalid location
  if (!location) {
    searchMessage.value =
      'Location not found. Try Melbourne, Clayton, Brimbank, Hume or Wyndham.'

    return
  }

  // Move map
  moveMap(location.coordinates, 13)

  searchMessage.value =
    `Showing results for: ${location.name}`
}


// --------------------------------------------------
// 7. MY LOCATION
// --------------------------------------------------

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

    <!-- ========================================= -->
    <!-- PAGE TITLE -->
    <!-- ========================================= -->

    <section class="mb-4">

      <h1 class="fw-bold">
        MELBOURNE GREEN MAP
      </h1>

      <p class="text-muted">
        Explore Melbourne's greening projects,
        priority areas and planted sites.
      </p>

    </section>


    <!-- ========================================= -->
    <!-- SEARCH -->
    <!-- ========================================= -->

    <section class="mb-4">

      <div class="row g-2">

        <div class="col-12 col-md-7">

          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Search Melbourne, Clayton, Brimbank, Hume or Wyndham"
            @keyup.enter="searchLocation"
          />

        </div>


        <div class="col-6 col-md-auto">

          <button
            class="btn btn-dark w-100"
            type="button"
            @click="searchLocation"
          >
            Search
          </button>

        </div>


        <div class="col-6 col-md-auto">

          <button
            class="btn btn-outline-dark w-100"
            type="button"
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


    <!-- ========================================= -->
    <!-- MAP LAYERS -->
    <!-- ========================================= -->

    <section class="mb-4">

      <h5 class="fw-bold">
        MAP LAYERS
      </h5>


      <div class="d-flex flex-wrap gap-3">

        <!-- Priority Areas -->

        <div class="form-check">

          <input
            id="priorityAreas"
            v-model="priorityAreas"
            class="form-check-input"
            type="checkbox"
          />

          <label
            class="form-check-label"
            for="priorityAreas"
          >
            Priority areas
          </label>

        </div>


        <!-- Active Projects -->

        <div class="form-check">

          <input
            id="activeProjects"
            v-model="activeProjects"
            class="form-check-input"
            type="checkbox"
          />

          <label
            class="form-check-label"
            for="activeProjects"
          >
            Active projects
          </label>

        </div>


        <!-- Planted Sites -->

        <div class="form-check">

          <input
            id="plantedSites"
            v-model="plantedSites"
            class="form-check-input"
            type="checkbox"
          />

          <label
            class="form-check-label"
            for="plantedSites"
          >
            Planted sites
          </label>

        </div>


        <!-- Plant Suppliers -->

        <div class="form-check">

          <input
            id="plantSuppliers"
            v-model="plantSuppliers"
            class="form-check-input"
            type="checkbox"
          />

          <label
            class="form-check-label"
            for="plantSuppliers"
          >
            Plant suppliers
          </label>

        </div>


        <!-- Donation Points -->

        <div class="form-check">

          <input
            id="donationPoints"
            v-model="donationPoints"
            class="form-check-input"
            type="checkbox"
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


    <!-- ========================================= -->
    <!-- MAP -->
    <!-- ========================================= -->

    <section class="map-container">

      <LMap
        :key="mapKey"
        :zoom="zoom"
        :center="mapCenter"
        :use-global-leaflet="false"
        style="height: 450px; width: 100%"
      >


        <!-- OpenStreetMap -->

        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />


        <!-- ===================================== -->
        <!-- BRIMBANK PRIORITY AREA -->
        <!-- ===================================== -->

        <LMarker
          v-if="priorityAreas"
          :lat-lng="brimbankCoordinates"
        >

          <LPopup>

            <div>

              <strong>
                Priority Greening Area - Brimbank
              </strong>

              <p class="mb-1 mt-2">
                Priority area for urban greening
                and canopy improvement.
              </p>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=-37.7810,144.8320"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>

            </div>

          </LPopup>

        </LMarker>


        <!-- ===================================== -->
        <!-- ACTIVE PROJECT -->
        <!-- ===================================== -->

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
                Current community planting and
                greening project.
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


        <!-- ===================================== -->
        <!-- MELBOURNE PLANTED SITE -->
        <!-- ===================================== -->

        <LMarker
          v-if="plantedSites"
          :lat-lng="melbourneCoordinates"
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


        <!-- ===================================== -->
        <!-- PLANT SUPPLIER -->
        <!-- ===================================== -->

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
                Supplier of plants for local
                greening projects.
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


        <!-- ===================================== -->
        <!-- DONATION POINT -->
        <!-- ===================================== -->

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
                Community plant and greening
                donation point.
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