<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'

import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
} from '@vue-leaflet/vue-leaflet'

import 'leaflet/dist/leaflet.css'


// ==================================================
// LOCATION DATA
// ==================================================

const melbourneCoordinates = [-37.8136, 144.9631]
const claytonCoordinates = [-37.9161, 145.1164]
const brimbankCoordinates = [-37.7810, 144.8320]
const humeCoordinates = [-37.5980, 144.9190]
const wyndhamCoordinates = [-37.8999, 144.6611]

const locations = [
  {
    name: 'Melbourne',
    coordinates: melbourneCoordinates,
  },
  {
    name: 'Clayton',
    coordinates: claytonCoordinates,
  },
  {
    name: 'Brimbank',
    coordinates: brimbankCoordinates,
  },
  {
    name: 'Hume',
    coordinates: humeCoordinates,
  },
  {
    name: 'Wyndham',
    coordinates: wyndhamCoordinates,
  },
]


// ==================================================
// SEARCH
// ==================================================

const searchQuery = ref('')
const searchMessage = ref('')


// ==================================================
// MAP SETTINGS
// ==================================================

const mapCenter = ref(melbourneCoordinates)
const zoom = ref(11)
const mapKey = ref(0)


// ==================================================
// MAP LAYERS
// ==================================================

const priorityAreas = ref(true)
const activeProjects = ref(true)
const plantedSites = ref(true)
const plantSuppliers = ref(false)
const donationPoints = ref(false)


// ==================================================
// MOVE MAP
// ==================================================

const moveMap = (coordinates, newZoom = 13) => {
  mapCenter.value = [...coordinates]
  zoom.value = newZoom
  mapKey.value++
}


// ==================================================
// SEARCH LOCATION
// ==================================================

const searchLocation = () => {
  const query =
    searchQuery.value.trim().toLowerCase()

  if (query === '') {
    searchMessage.value =
      'Please enter a suburb, postcode or project.'

    return
  }

  const location = locations.find(
    (item) =>
      item.name.toLowerCase() === query,
  )

  if (!location) {
    searchMessage.value =
      'Location not found. Try Melbourne, Clayton, Brimbank, Hume or Wyndham.'

    return
  }

  moveMap(location.coordinates, 13)

  searchMessage.value =
    `Showing results for: ${location.name}`
}


// ==================================================
// MY LOCATION
// ==================================================

const useMyLocation = () => {
  if (!navigator.geolocation) {
    searchMessage.value =
      'Geolocation is not supported by your browser.'

    return
  }

  searchMessage.value =
    'Finding your location...'

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coordinates = [
        position.coords.latitude,
        position.coords.longitude,
      ]

      moveMap(coordinates, 15)

      searchMessage.value =
        'Your current location is shown on the map.'
    },

    () => {
      searchMessage.value =
        'Unable to access your location. Please allow location permission.'
    },
  )
}
</script>


<template>
  <AppNavbar />

  <!-- ==================================================
       HERO
  =================================================== -->

  <header class="hero-section">
    <div class="container hero-content">

      <p class="hero-eyebrow">
        GROWING A GREENER MELBOURNE
      </p>

      <h1>
        Greener neighbourhoods start
        with our community.
      </h1>

      <p class="hero-description">
        Discover urban greening projects,
        find native plants and help create
        healthier habitats across Melbourne.
      </p>

      <div class="hero-actions">

        <a
          href="#green-map"
          class="btn primary-btn"
        >
          Explore Green Map
        </a>

        <RouterLink
          to="/volunteer"
          class="btn secondary-btn"
        >
          Volunteer
        </RouterLink>

      </div>

    </div>
  </header>


  <!-- ==================================================
       GREEN MAP
  =================================================== -->

  <main>

    <section
      id="green-map"
      class="green-map-section"
    >
      <div class="container">

        <div class="section-heading">

          <p class="section-label">
            EXPLORE MELBOURNE
          </p>

          <h2>
            Melbourne Green Map
          </h2>

          <p>
            Explore Melbourne's greening
            projects, priority areas,
            planted sites and community
            resources.
          </p>

        </div>


        <!-- SEARCH -->

        <div class="search-panel">

          <div class="row g-2">

            <div class="col-12 col-lg">

              <label
                for="mapSearch"
                class="visually-hidden"
              >
                Search location
              </label>

              <input
                id="mapSearch"
                v-model="searchQuery"
                type="text"
                class="form-control search-input"
                placeholder="Search suburb, postcode or project"
                @keyup.enter="searchLocation"
              />

            </div>


            <div class="col-6 col-lg-auto">

              <button
                class="btn map-search-btn w-100"
                type="button"
                @click="searchLocation"
              >
                Search
              </button>

            </div>


            <div class="col-6 col-lg-auto">

              <button
                class="btn location-btn w-100"
                type="button"
                @click="useMyLocation"
              >
                My Location
              </button>

            </div>

          </div>


          <p
            v-if="searchMessage"
            class="search-message"
            aria-live="polite"
          >
            {{ searchMessage }}
          </p>

        </div>


        <!-- MAP LAYERS -->

        <div class="layer-panel">

          <div class="layer-heading">
            Map Layers
          </div>


          <div class="layer-options">

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

        </div>


        <!-- MAP -->

        <div class="map-container">

          <LMap
            :key="mapKey"
            :zoom="zoom"
            :center="mapCenter"
            :use-global-leaflet="false"
            style="height: 500px; width: 100%"
          >

            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />


            <!-- PRIORITY AREA -->

            <LMarker
              v-if="priorityAreas"
              :lat-lng="brimbankCoordinates"
            >
              <LPopup>

                <div class="map-popup">

                  <strong>
                    Priority Greening Area -
                    Brimbank
                  </strong>

                  <p>
                    Priority area for urban
                    greening and canopy
                    improvement.
                  </p>

                  <div class="popup-actions">

                    <button
                      type="button"
                      class="popup-link"
                    >
                      View Project
                    </button>

                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=-37.7810,144.8320"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>

                  </div>

                </div>

              </LPopup>
            </LMarker>


            <!-- ACTIVE PROJECT -->

            <LMarker
              v-if="activeProjects"
              :lat-lng="[-37.7080, 144.9500]"
            >
              <LPopup>

                <div class="map-popup">

                  <strong>
                    Active Community
                    Greening Project
                  </strong>

                  <p>
                    Current community planting
                    and greening project.
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


            <!-- PLANTED SITE -->

            <LMarker
              v-if="plantedSites"
              :lat-lng="melbourneCoordinates"
            >
              <LPopup>

                <div class="map-popup">

                  <strong>
                    Melbourne Planted Site
                  </strong>

                  <p>
                    Existing urban planting
                    site.
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


            <!-- PLANT SUPPLIER -->

            <LMarker
              v-if="plantSuppliers"
              :lat-lng="[-37.8768, 145.0458]"
            >
              <LPopup>

                <div class="map-popup">

                  <strong>
                    Native Plant Supplier
                  </strong>

                  <p>
                    Supplier of plants for
                    local greening projects.
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


            <!-- DONATION POINT -->

            <LMarker
              v-if="donationPoints"
              :lat-lng="[-37.8409, 144.9465]"
            >
              <LPopup>

                <div class="map-popup">

                  <strong>
                    Plant Donation Point
                  </strong>

                  <p>
                    Community plant and
                    greening donation point.
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

        </div>

      </div>
    </section>


    <!-- ==================================================
         GET INVOLVED
    =================================================== -->

    <section class="support-section">

      <div class="container">

        <div class="section-heading centered">

          <p class="section-label">
            GET INVOLVED
          </p>

          <h2>
            Help grow a greener Melbourne
          </h2>

          <p>
            There are many ways to support
            urban greening and biodiversity
            in your local community.
          </p>

        </div>


        <div class="row g-4">

          <!-- Donate Plants -->

          <div class="col-12 col-md-4">

            <article class="action-card">

              <div class="action-icon">
                🌱
              </div>

              <h3>
                Donate Plants
              </h3>

              <p>
                Support community planting
                projects by contributing
                suitable plants.
              </p>

              <button
                type="button"
                class="card-link"
              >
                Donate Plants
              </button>

            </article>

          </div>


          <!-- Fund Project -->

          <div class="col-12 col-md-4">

            <article class="action-card">

              <div class="action-icon">
                🌳
              </div>

              <h3>
                Fund a Project
              </h3>

              <p>
                Help local greening projects
                create healthier and more
                resilient neighbourhoods.
              </p>

              <button
                type="button"
                class="card-link"
              >
                Fund a Project
              </button>

            </article>

          </div>


          <!-- Volunteer -->

          <div class="col-12 col-md-4">

            <article class="action-card">

              <div class="action-icon">
                🤝
              </div>

              <h3>
                Volunteer
              </h3>

              <p>
                Join community planting,
                maintenance and urban
                greening activities.
              </p>

              <RouterLink
                to="/volunteer"
                class="card-link"
              >
                Volunteer
              </RouterLink>

            </article>

          </div>

        </div>

      </div>

    </section>


    <!-- ==================================================
         OUR IMPACT
    =================================================== -->

    <section class="impact-section">

      <div class="container">

        <div class="section-heading centered">

          <p class="section-label light-label">
            OUR IMPACT
          </p>

          <h2>
            Growing together
          </h2>

          <p>
            Community action helps make
            Melbourne greener and more
            biodiverse.
          </p>

        </div>


        <div class="row g-4 impact-grid">

          <div class="col-12 col-md-4">

            <div class="impact-item">

              <strong>
                5,000+
              </strong>

              <span>
                Trees & plants
              </span>

            </div>

          </div>


          <div class="col-12 col-md-4">

            <div class="impact-item">

              <strong>
                25+
              </strong>

              <span>
                Greening projects
              </span>

            </div>

          </div>


          <div class="col-12 col-md-4">

            <div class="impact-item">

              <strong>
                1,200+
              </strong>

              <span>
                Community volunteers
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>


    <!-- ==================================================
         UPCOMING EVENTS
    =================================================== -->

    <section class="events-section">

      <div class="container">

        <div class="section-heading">

          <p class="section-label">
            WHAT'S ON
          </p>

          <h2>
            Upcoming Events
          </h2>

          <p>
            Join upcoming activities and
            community events across Melbourne.
          </p>

        </div>


        <div class="row g-4">

          <div class="col-12 col-md-4">

            <article class="event-card">

              <div class="event-date">
                SEP
                <strong>19</strong>
              </div>

              <div>

                <p class="event-type">
                  COMMUNITY EVENT
                </p>

                <h3>
                  Community Planting Day
                </h3>

                <p>
                  Join local volunteers for
                  a community planting
                  session.
                </p>

              </div>

            </article>

          </div>


          <div class="col-12 col-md-4">

            <article class="event-card">

              <div class="event-date">
                OCT
                <strong>04</strong>
              </div>

              <div>

                <p class="event-type">
                  WORKSHOP
                </p>

                <h3>
                  Native Plant Workshop
                </h3>

                <p>
                  Learn how to select plants
                  that support local
                  biodiversity.
                </p>

              </div>

            </article>

          </div>


          <div class="col-12 col-md-4">

            <article class="event-card">

              <div class="event-date">
                OCT
                <strong>18</strong>
              </div>

              <div>

                <p class="event-type">
                  DESIGN CHALLENGE
                </p>

                <h3>
                  Green Melbourne Design
                  Challenge
                </h3>

                <p>
                  Explore community designs
                  for a greener Melbourne.
                </p>

              </div>

            </article>

          </div>

        </div>

      </div>

    </section>

  </main>


  <!-- ==================================================
       FOOTER
  =================================================== -->

  <footer class="site-footer">

    <div class="container">

      <div class="row g-4">

        <div class="col-12 col-lg-5">

          <h2 class="footer-brand">
            POTS & PLANTS MELBOURNE
          </h2>

          <p>
            Helping Melbourne communities
            grow greener, healthier and more
            biodiverse neighbourhoods.
          </p>

        </div>


        <div class="col-6 col-lg">

          <h3>
            Explore
          </h3>

          <RouterLink to="/plants">
            Find Plants
          </RouterLink>

          <a href="#green-map">
            Green Map
          </a>

        </div>


        <div class="col-6 col-lg">

          <h3>
            Get Involved
          </h3>

          <RouterLink to="/volunteer">
            Volunteer
          </RouterLink>

          <span>
            Donate
          </span>

        </div>


        <div class="col-12 col-lg">

          <h3>
            Account
          </h3>

          <RouterLink to="/login">
            Sign In
          </RouterLink>

          <RouterLink to="/register">
            Register
          </RouterLink>

        </div>

      </div>


      <div class="footer-bottom">
        © 2026 Pots & Plants Melbourne
      </div>

    </div>

  </footer>

</template>


<style scoped>

/* ==================================================
   GENERAL
================================================== */

section {
  scroll-margin-top: 100px;
}

.section-heading {
  max-width: 720px;
  margin-bottom: 32px;
}

.section-heading.centered {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.section-heading h2 {
  margin-bottom: 12px;

  color: #203a24;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: clamp(2rem, 4vw, 3rem);

  font-weight: 600;
}

.section-heading p:not(.section-label) {
  color: #657066;

  font-size: 1.05rem;

  line-height: 1.7;
}

.section-label {
  margin-bottom: 8px;

  color: #56864b;

  font-size: 0.78rem;

  font-weight: 700;

  letter-spacing: 1.8px;
}


/* ==================================================
   HERO
================================================== */

.hero-section {
  position: relative;

  display: flex;

  align-items: center;

  min-height: 480px;

  overflow: hidden;

  background:
    linear-gradient(
      110deg,
      #e7f1e3 0%,
      #f7faf5 55%,
      #dcebd7 100%
    );
}

.hero-section::after {
  content: "";

  position: absolute;

  right: -100px;
  bottom: -160px;

  width: 480px;
  height: 480px;

  border-radius: 50%;

  background:
    rgba(76, 124, 66, 0.1);
}

.hero-content {
  position: relative;

  z-index: 1;

  padding-top: 70px;
  padding-bottom: 70px;
}

.hero-eyebrow {
  margin-bottom: 14px;

  color: #56864b;

  font-size: 0.82rem;

  font-weight: 700;

  letter-spacing: 2px;
}

.hero-content h1 {
  max-width: 780px;

  margin-bottom: 22px;

  color: #203a24;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: clamp(
    2.7rem,
    6vw,
    5.2rem
  );

  font-weight: 600;

  line-height: 1.05;
}

.hero-description {
  max-width: 650px;

  margin-bottom: 30px;

  color: #566259;

  font-size: 1.15rem;

  line-height: 1.7;
}

.hero-actions {
  display: flex;

  flex-wrap: wrap;

  gap: 12px;
}

.primary-btn {
  padding: 11px 22px;

  color: white;

  background: #35682d;

  border: 1px solid #35682d;
}

.primary-btn:hover {
  color: white;

  background: #285222;

  border-color: #285222;
}

.secondary-btn {
  padding: 11px 22px;

  color: #35682d;

  background: transparent;

  border: 1px solid #35682d;
}

.secondary-btn:hover {
  color: white;

  background: #35682d;
}


/* ==================================================
   MAP SECTION
================================================== */

.green-map-section {
  padding: 80px 0;

  background: white;
}

.search-panel {
  margin-bottom: 22px;

  padding: 20px;

  background: #f7faf5;

  border: 1px solid #dce7d8;

  border-radius: 10px;
}

.search-input {
  min-height: 46px;
}

.map-search-btn {
  min-height: 46px;

  padding-left: 24px;
  padding-right: 24px;

  color: white;

  background: #35682d;

  border-color: #35682d;
}

.map-search-btn:hover {
  color: white;

  background: #285222;

  border-color: #285222;
}

.location-btn {
  min-height: 46px;

  padding-left: 20px;
  padding-right: 20px;

  color: #35682d;

  background: white;

  border: 1px solid #35682d;
}

.location-btn:hover {
  color: white;

  background: #35682d;
}

.search-message {
  margin-top: 12px;
  margin-bottom: 0;

  color: #455747;

  font-size: 0.92rem;
}


/* ==================================================
   MAP LAYERS
================================================== */

.layer-panel {
  display: flex;

  align-items: center;

  gap: 28px;

  margin-bottom: 22px;

  padding: 18px 20px;

  border: 1px solid #e1e8de;

  border-radius: 10px;
}

.layer-heading {
  color: #294e27;

  font-weight: 700;

  white-space: nowrap;
}

.layer-options {
  display: flex;

  flex-wrap: wrap;

  gap: 12px 25px;
}

.form-check-input:checked {
  background-color: #35682d;

  border-color: #35682d;
}


/* ==================================================
   MAP
================================================== */

.map-container {
  width: 100%;

  overflow: hidden;

  border: 1px solid #d9e1d6;

  border-radius: 12px;

  box-shadow:
    0 5px 20px
    rgba(0, 0, 0, 0.06);
}

.map-popup p {
  margin-top: 8px;
  margin-bottom: 8px;
}

.popup-actions {
  display: flex;

  gap: 12px;
}

.popup-link {
  padding: 0;

  color: #35682d;

  background: none;

  border: 0;

  text-decoration: underline;
}


/* ==================================================
   SUPPORT / GET INVOLVED
================================================== */

.support-section {
  padding: 85px 0;

  background: #f5f8f3;
}

.action-card {
  height: 100%;

  padding: 34px;

  background: white;

  border: 1px solid #e0e8dc;

  border-radius: 12px;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.action-card:hover {
  transform: translateY(-4px);

  box-shadow:
    0 10px 25px
    rgba(0, 0, 0, 0.07);
}

.action-icon {
  margin-bottom: 18px;

  font-size: 2rem;
}

.action-card h3 {
  margin-bottom: 12px;

  color: #294e27;

  font-size: 1.3rem;

  font-weight: 700;
}

.action-card p {
  min-height: 72px;

  color: #69736a;

  line-height: 1.6;
}

.card-link {
  padding: 0;

  color: #35682d;

  background: none;

  border: 0;

  font-weight: 700;

  text-decoration: none;
}

.card-link:hover {
  color: #244c20;

  text-decoration: underline;
}


/* ==================================================
   IMPACT
================================================== */

.impact-section {
  padding: 80px 0;

  color: white;

  background: #294e2c;
}

.impact-section .section-heading h2 {
  color: white;
}

.impact-section
.section-heading
p:not(.section-label) {
  color: #dce8dc;
}

.light-label {
  color: #bcd4b6;
}

.impact-item {
  text-align: center;
}

.impact-item strong {
  display: block;

  margin-bottom: 8px;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: clamp(
    2.5rem,
    5vw,
    4rem
  );

  font-weight: 600;
}

.impact-item span {
  color: #dce8dc;

  font-size: 1rem;
}


/* ==================================================
   EVENTS
================================================== */

.events-section {
  padding: 85px 0;

  background: white;
}

.event-card {
  display: flex;

  gap: 20px;

  height: 100%;

  padding: 26px;

  border: 1px solid #dfe7dc;

  border-radius: 12px;
}

.event-date {
  min-width: 60px;

  color: #56864b;

  font-size: 0.75rem;

  font-weight: 700;

  text-align: center;

  letter-spacing: 1px;
}

.event-date strong {
  display: block;

  color: #294e27;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 2rem;

  line-height: 1.1;
}

.event-type {
  margin-bottom: 6px;

  color: #56864b;

  font-size: 0.72rem;

  font-weight: 700;

  letter-spacing: 1px;
}

.event-card h3 {
  margin-bottom: 10px;

  color: #294e27;

  font-size: 1.2rem;

  font-weight: 700;
}

.event-card p:last-child {
  margin-bottom: 0;

  color: #69736a;

  line-height: 1.6;
}


/* ==================================================
   FOOTER
================================================== */

.site-footer {
  padding: 55px 0 25px;

  color: #dce7da;

  background: #182d1b;
}

.footer-brand {
  margin-bottom: 15px;

  color: white;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 1.3rem;
}

.site-footer h3 {
  margin-bottom: 15px;

  color: white;

  font-size: 0.95rem;

  font-weight: 700;
}

.site-footer a,
.site-footer span {
  display: block;

  margin-bottom: 9px;

  color: #cbd8c9;

  text-decoration: none;
}

.site-footer a:hover {
  color: white;
}

.site-footer p {
  max-width: 450px;

  color: #b9c9b7;

  line-height: 1.7;
}

.footer-bottom {
  margin-top: 40px;

  padding-top: 20px;

  color: #94aa91;

  border-top:
    1px solid rgba(
      255,
      255,
      255,
      0.12
    );

  font-size: 0.85rem;
}


/* ==================================================
   TABLET / MOBILE
================================================== */

@media (max-width: 991.98px) {

  .hero-section {
    min-height: 420px;
  }

  .layer-panel {
    align-items: flex-start;

    flex-direction: column;

    gap: 12px;
  }
}


@media (max-width: 575.98px) {

  .hero-content {
    padding-top: 50px;
    padding-bottom: 50px;
  }

  .hero-content h1 {
    font-size: 2.55rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-actions .btn {
    width: 100%;
  }

  .green-map-section,
  .support-section,
  .impact-section,
  .events-section {
    padding-top: 55px;
    padding-bottom: 55px;
  }

  .layer-options {
    flex-direction: column;

    gap: 10px;
  }

  .action-card p {
    min-height: auto;
  }
}
</style>