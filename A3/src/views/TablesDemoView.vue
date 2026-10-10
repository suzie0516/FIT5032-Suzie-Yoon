<script setup>
import AppNavbar from '../components/AppNavbar.vue'
import DataTable from '../components/DataTable.vue'

const plantColumns = [
  { key: 'name', label: 'Plant' },
  { key: 'type', label: 'Type' },
  { key: 'water', label: 'Water needs' },
  { key: 'sunlight', label: 'Sunlight' },
]

const projectColumns = [
  { key: 'name', label: 'Project' },
  { key: 'suburb', label: 'Suburb' },
  { key: 'status', label: 'Status' },
  { key: 'treesTarget', label: 'Trees target' },
]

// Sample records for testing table interactions only.
const plantRows = [
  ['Eucalyptus camaldulensis', 'Tree', 'Low', 'Full sun'],
  ['Acacia dealbata', 'Tree', 'Low', 'Full sun'],
  ['Correa reflexa', 'Shrub', 'Low', 'Part shade'],
  ['Dianella revoluta', 'Grass-like', 'Low', 'Full sun'],
  ['Lomandra longifolia', 'Grass-like', 'Low', 'Part shade'],
  ['Banksia marginata', 'Shrub', 'Low', 'Full sun'],
  ['Melaleuca ericifolia', 'Shrub', 'Medium', 'Full sun'],
  ['Goodenia ovata', 'Shrub', 'Medium', 'Part shade'],
  ['Themeda triandra', 'Grass', 'Low', 'Full sun'],
  ['Bursaria spinosa', 'Shrub', 'Low', 'Full sun'],
  ['Poa labillardierei', 'Grass', 'Medium', 'Full sun'],
  ['Kennedia prostrata', 'Groundcover', 'Low', 'Full sun'],
].map(([name, type, water, sunlight], index) => ({
  id: index + 1, name, type, water, sunlight,
}))

const projectRows = [
  ['Neighbourhood Canopy Pilot', 'Brimbank', 'Planned', 120],
  ['Street Tree Trial', 'Clayton', 'Active', 80],
  ['Community Garden Beds', 'Carlton', 'Planned', 25],
  ['Local Native Planting', 'Footscray', 'Active', 65],
  ['School Shade Garden', 'Sunshine', 'Planned', 40],
  ['Creek Corridor Planting', 'Broadmeadows', 'Active', 150],
  ['Pocket Park Renewal', 'Richmond', 'Completed', 30],
  ['Pollinator Strip Trial', 'Coburg', 'Planned', 20],
  ['Nature Strip Pilot', 'Preston', 'Active', 55],
  ['Suburban Greening Trial', 'Werribee', 'Planned', 95],
  ['Urban Habitat Beds', 'St Kilda', 'Completed', 35],
  ['Local Tree Care Pilot', 'Fitzroy', 'Active', 70],
].map(([name, suburb, status, treesTarget], index) => ({
  id: index + 1, name, suburb, status, treesTarget,
}))
</script>

<template>
  <AppNavbar />
  <main class="container py-5" id="main-content">
    <header class="mb-5">
      <p class="eyebrow">EXPLORE OUR DATA</p>
      <h1>Plants &amp; Greening Projects</h1>
      <p class="text-secondary">
        Try sorting, searching individual columns, changing pages and exporting results.
      </p>
      <p class="small text-secondary">Demo data only — these are not verified project records.</p>
    </header>

    <section class="mb-5" aria-labelledby="plants-heading">
      <h2 id="plants-heading">Native plants</h2>
      <DataTable
        table-id="demo-plants"
        caption="Plant comparison table"
        :columns="plantColumns"
        :rows="plantRows"
        item-label="plants"
        export-file-name="demo-plants"
      />
    </section>

    <section aria-labelledby="projects-heading">
      <h2 id="projects-heading">Greening projects</h2>
      <DataTable
        table-id="demo-projects"
        caption="Greening projects table — sample records"
        :columns="projectColumns"
        :rows="projectRows"
        item-label="projects"
        export-file-name="demo-projects"
      />
    </section>
  </main>
</template>

<style scoped>
h1, h2 { color: #294e27; font-family: Georgia, 'Times New Roman', serif; }
h1 { font-size: clamp(2rem, 4vw, 3rem); }
h2 { margin-bottom: 1rem; }
.eyebrow { color: #a45c36; font-weight: 700; letter-spacing: .12em; font-size: .8rem; }
section { scroll-margin-top: 100px; }
</style>
