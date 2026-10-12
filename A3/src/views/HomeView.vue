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
// Location data
const melbourneCoordinates = [-37.8136, 144.9631]

const claytonCoordinates = [-37.9161, 145.1164]

const brimbankCoordinates = [-37.7810, 144.8320]

const humeCoordinates = [-37.5980, 144.9190]

const wyndhamCoordinates = [-37.8999, 144.6611]

// Search
const searchQuery = ref('')

const searchMessage = ref('')

const searchResult = ref(null)

const isSearching = ref(false)

let lastSearchTime = 0
// Map settings
const mapCenter = ref(melbourneCoordinates)

const zoom = ref(11)

const mapKey = ref(0)
// Map layers
const priorityAreas = ref(true)

const activeProjects = ref(true)

const plantedSites = ref(true)

const plantSuppliers = ref(false)

const donationPoints = ref(false)
// Move map
const moveMap = (coordinates, newZoom = 13) => {

  mapCenter.value = [...coordinates]

  zoom.value = newZoom

  mapKey.value++

}
// Search location
const searchLocation = async () => {
  const query = searchQuery.value.trim()

  if (!query) {
    searchMessage.value = 'Enter a suburb, postcode or address.'
    return
  }

  if (isSearching.value) return

  // The public search service is limited to one request per second.
  if (Date.now() - lastSearchTime < 1100) {
    searchMessage.value = 'Please wait a moment before searching again.'
    return
  }

  isSearching.value = true
  lastSearchTime = Date.now()
  searchMessage.value = 'Searching locations...'

  try {
    const params = new URLSearchParams({
      format: 'jsonv2',
      countrycodes: 'au',
      limit: '1',
      addressdetails: '1',
      viewbox: '140.9,-33.9,150.1,-39.3',
    })

    if (/^\d{4}$/.test(query)) {
      params.set('postalcode', query)
      params.set('country', 'Australia')
    } else {
      params.set('q', query)
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      { headers: { Accept: 'application/json' } },
    )

    if (!response.ok) throw new Error('Location search unavailable')

    const results = await response.json()
    const place = results[0]

    if (!place) {
      searchResult.value = null
      searchMessage.value = 'No matching Australian location found.'
      return
    }

    const coordinates = [Number(place.lat), Number(place.lon)]
    if (!coordinates.every(Number.isFinite)) throw new Error('Invalid coordinates')

    searchResult.value = {
      coordinates,
      name: place.display_name,
    }
    moveMap(coordinates, /^\d{4}$/.test(query) ? 13 : 15)
    searchMessage.value = `Showing: ${place.display_name}`
  } catch {
    searchMessage.value = 'Search failed. Check your connection and try again.'
  } finally {
    isSearching.value = false
  }
}

// My location
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

                placeholder="Search suburb, postcode or address"

                @keyup.enter="searchLocation"

              />

            </div>

            <div class="col-6 col-lg-auto">

              <button

                class="btn map-search-btn w-100"

                type="button"

                @click="searchLocation"
                :disabled="isSearching"

              >

                {{ isSearching ? 'Searching...' : 'Search' }}

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

            <LMarker
              v-if="searchResult"
              :lat-lng="searchResult.coordinates"
            >
              <LPopup>{{ searchResult.name }}</LPopup>
            </LMarker>

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

          <p class="small text-muted mt-2">
            Place search data © OpenStreetMap contributors (Nominatim).
          </p>

        </div>

      </div>

    </section>
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

              <button type="button" class="card-link" disabled title="Plant donations are not open yet">
                Donate Plants · Coming soon
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

              <button type="button" class="card-link" disabled title="Project funding is not open yet">
                Fund a Project · Coming soon
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
            <article class="event-card event-card--coral">
              <img class="event-photo" src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&amp;fit=crop&amp;w=900&amp;q=80" alt="Plants being grown in a community garden" loading="lazy" />
              <div class="event-details">
                <div class="event-meta"><span class="event-date">SEP <strong>19</strong></span><span class="event-type">COMMUNITY EVENT</span></div>
                <h3>Community Planting Day</h3>
                <p>Join local volunteers for a community planting session.</p>
                <p class="event-status">Past event</p>
                <RouterLink to="/volunteer" class="event-action">Explore volunteering <span aria-hidden="true">→</span></RouterLink>
              </div>
            </article>
          </div>
          <div class="col-12 col-md-4">
            <article class="event-card event-card--amber">
              <img class="event-photo" src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&amp;fit=crop&amp;w=900&amp;q=80" alt="Lush green plants at a nursery" loading="lazy" />
              <div class="event-details">
                <div class="event-meta"><span class="event-date">OCT <strong>04</strong></span><span class="event-type">WORKSHOP</span></div>
                <h3>Native Plant Workshop</h3>
                <p>Learn how to select plants that support local biodiversity.</p>
                <p class="event-status">Past event</p>
                <RouterLink to="/plants" class="event-action">Explore native plants <span aria-hidden="true">→</span></RouterLink>
              </div>
            </article>
          </div>
          <div class="col-12 col-md-4">
            <article class="event-card event-card--blue">
              <img class="event-photo" src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&amp;fit=crop&amp;w=900&amp;q=80" alt="Creative indoor space for a design workshop" loading="lazy" />
              <div class="event-details">
                <div class="event-meta"><span class="event-date">OCT <strong>18</strong></span><span class="event-type">DESIGN CHALLENGE</span></div>
                <h3>Green Melbourne Design Challenge</h3>
                <p>Explore community designs for a greener Melbourne.</p>
                <RouterLink to="/design-challenge" class="event-action">Explore designs <span aria-hidden="true">→</span></RouterLink>
              </div>
            </article>
          </div>
        </div>
      </div>

    </section>

  </main>
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



.hero-section {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 520px;
  overflow: hidden;
  isolation: isolate;
  background: #213a27;
}

.hero-section::before {
  content: "";
  position: absolute;
  inset: -8px;
  z-index: -2;
  background: url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=85") center / cover no-repeat;
  filter: blur(3px);
}

.hero-section::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(90deg, rgba(12, 36, 20, .72), rgba(20, 51, 27, .38));
}

.hero-content {

  position: relative;

  z-index: 1;

  padding-top: 70px;

  padding-bottom: 70px;

}

.hero-eyebrow {

  margin-bottom: 14px;

  color: #d5e9ce;

  font-size: 0.82rem;

  font-weight: 700;

  letter-spacing: 2px;

}

.hero-content h1 {

  max-width: 780px;

  margin-bottom: 22px;

  color: #fff;

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

  color: #f0f5ed;

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

  color: white;

  background: rgba(255,255,255,.08);

  border: 1px solid rgba(255,255,255,.85);

}

.secondary-btn:hover {

  color: white;

  background: #35682d;

}



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


/* Homepage accents */
.hero-actions .primary-btn {
  background: #f5b76b;
  border: 1px solid #f5b76b;
  color: #263629;
  font-weight: 700;
  border-radius: 999px;
  box-shadow: 0 8px 24px rgba(0,0,0,.15);
}
.hero-actions .primary-btn:hover { background: #ffd094; border-color: #ffd094; color: #263629; }
.hero-actions .secondary-btn {
  background: rgba(255,255,255,.16);
  border: 1px solid rgba(255,255,255,.85);
  color: #fff;
  border-radius: 999px;
  backdrop-filter: blur(8px);
}
.hero-actions .secondary-btn:hover { background: #fff; color: #294e2c; }
.support-section { background: #faf6f0; }
.action-card { border-color: #eee8e1; box-shadow: 0 5px 22px rgba(51,47,36,.045); }
.action-card:nth-child(1) { border-top: 4px solid #dc8776; }
.action-card .card-link { color: #a84740; }
.support-section .col-md-4:nth-child(2) .action-card { border-top-color: #e6b45d; }
.support-section .col-md-4:nth-child(2) .card-link { color: #95600d; }
.support-section .col-md-4:nth-child(3) .action-card { border-top-color: #77a8b8; }
.support-section .col-md-4:nth-child(3) .card-link { color: #276e88; }
.events-section { background: #fcfaf7; }
.event-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  border: 1px solid #e8e5df;
  border-radius: 18px;
  background: white;
  box-shadow: 0 12px 32px rgba(39,52,44,.07);
  transition: transform .2s ease, box-shadow .2s ease;
}
.event-card:hover { transform: translateY(-5px); box-shadow: 0 18px 40px rgba(39,52,44,.12); }
.event-photo { display: block; width: 100%; height: 210px; object-fit: cover; background: #e7e9e0; }
.event-details { padding: 24px; flex: 1; }
.event-meta { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.event-date {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 57px;
  min-height: 59px;
  padding: 5px;
  border-radius: 9px;
  letter-spacing: .07em;
  background: #f9e9e6;
  color: #a74c43;
}
.event-date strong { color: inherit; font-size: 1.75rem; }
.event-type { margin: 0; color: #9b5149; font-size: .7rem; line-height: 1.4; }
.event-card--amber .event-date { background: #fff0d5; color: #915b15; }
.event-card--amber .event-type { color: #95600d; }
.event-card--blue .event-date { background: #e5f0f5; color: #316d86; }
.event-card--blue .event-type { color: #316d86; }
.event-card h3 { color: #273c35; font-size: 1.22rem; line-height: 1.3; }
.event-card .event-details > p { color: #64716b; line-height: 1.65; }
@media (prefers-reduced-motion: reduce) { .event-card { transition: none; } }


/* Event links */
.event-action {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  align-self: flex-start;
  margin-top: auto;
  padding: .4rem 0;
  color: #8c423d;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.event-card--amber .event-action { color: #81520e; }
.event-card--blue .event-action { color: #245f79; }
.event-action:hover { color: #243d32; }
.event-action:focus-visible, .card-link:focus-visible {
  outline: 3px solid #243d32;
  outline-offset: 4px;
  border-radius: 3px;
}
.event-status { font-size: .85rem; font-weight: 600; color: #696969 !important; }
.action-card .card-link:disabled { color: #667368; cursor: not-allowed; text-decoration: none; opacity: .85; }
@media (max-width: 575.98px) {
  .event-photo { height: 190px; }
  .event-details { padding: 20px; }
}

</style>