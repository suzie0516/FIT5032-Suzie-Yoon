<script setup>
import { ref, computed, watch } from 'vue'
import AppNavbar from '../components/AppNavbar.vue'

const savedPlants = localStorage.getItem('plants')
// Plant data

const defaultPlants = [
  {
    name: 'River Red Gum',
    type: 'Tree',
    water: 'Low',
    sunlight: 'Full Sun',
    biodiversity: 'High',
    season: 'All Year'
  },
  {
    name: 'Silver Banksia',
    type: 'Tree',
    water: 'Low',
    sunlight: 'Full Sun',
    biodiversity: 'High',
    season: 'Autumn'
  },
  {
    name: 'Common Tussock Grass',
    type: 'Grass',
    water: 'Low',
    sunlight: 'Full Sun',
    biodiversity: 'Medium',
    season: 'Spring'
  },
  {
    name: 'Kangaroo Grass',
    type: 'Grass',
    water: 'Low',
    sunlight: 'Full Sun',
    biodiversity: 'High',
    season: 'Spring'
  },
  {
    name: 'Hop Goodenia',
    type: 'Shrub',
    water: 'Medium',
    sunlight: 'Part Shade',
    biodiversity: 'Medium',
    season: 'Spring'
  },
  {
    name: 'Austral Indigo',
    type: 'Shrub',
    water: 'Medium',
    sunlight: 'Part Shade',
    biodiversity: 'High',
    season: 'Spring'
  },
  {
    name: 'Blackwood',
    type: 'Tree',
    water: 'Medium',
    sunlight: 'Full Sun',
    biodiversity: 'High',
    season: 'All Year'
  },
  {
    name: 'Native Violet',
    type: 'Groundcover',
    water: 'Medium',
    sunlight: 'Shade',
    biodiversity: 'Medium',
    season: 'Spring'
  },
  {
    name: 'Running Postman',
    type: 'Groundcover',
    water: 'Low',
    sunlight: 'Full Sun',
    biodiversity: 'High',
    season: 'Winter'
  },
  {
    name: 'Chocolate Lily',
    type: 'Flower',
    water: 'Medium',
    sunlight: 'Full Sun',
    biodiversity: 'High',
    season: 'Spring'
  },
  {
    name: 'Golden Wattle',
    type: 'Shrub',
    water: 'Low',
    sunlight: 'Full Sun',
    biodiversity: 'High',
    season: 'Winter'
  },
  {
    name: 'Blue Flax Lily',
    type: 'Flower',
    water: 'Medium',
    sunlight: 'Part Shade',
    biodiversity: 'High',
    season: 'Spring'
  },
  {
    name: 'Sweet Bursaria',
    type: 'Shrub',
    water: 'Low',
    sunlight: 'Full Sun',
    biodiversity: 'High',
    season: 'Summer'
  },
  {
    name: 'Wallaby Grass',
    type: 'Grass',
    water: 'Low',
    sunlight: 'Full Sun',
    biodiversity: 'Medium',
    season: 'Spring'
  },
  {
    name: 'Spiny-headed Mat-rush',
    type: 'Grass',
    water: 'Low',
    sunlight: 'Part Shade',
    biodiversity: 'High',
    season: 'Spring'
  }
]

const plants = ref(
  savedPlants ? JSON.parse(savedPlants) : defaultPlants
)

if (!savedPlants) {
  localStorage.setItem(
    'plants',
    JSON.stringify(plants.value)
  )
}

watch(
  plants,
  (newPlants) => {
    localStorage.setItem(
      'plants',
      JSON.stringify(newPlants)
    )
  },
  { deep: true }
)

// Global search
const globalSearch = ref('')

// Individual column searches
const nameSearch = ref('')
const typeSearch = ref('')
const waterSearch = ref('')
const sunlightSearch = ref('')
const biodiversitySearch = ref('')
const seasonSearch = ref('')

// Sorting
const sortKey = ref('name')
const sortDirection = ref('asc')

// Pagination
const currentPage = ref(1)
const rowsPerPage = 10

const filteredPlants = computed(() => {
  const global = globalSearch.value.toLowerCase().trim()

  return plants.value.filter((plant) => {
    // Global search checks every column
    const matchesGlobal =
      global === '' ||
      Object.values(plant).some((value) =>
        String(value).toLowerCase().includes(global)
      )

    // Individual column searches
    const matchesName = plant.name
      .toLowerCase()
      .includes(nameSearch.value.toLowerCase())

    const matchesType = plant.type
      .toLowerCase()
      .includes(typeSearch.value.toLowerCase())

    const matchesWater = plant.water
      .toLowerCase()
      .includes(waterSearch.value.toLowerCase())

    const matchesSunlight = plant.sunlight
      .toLowerCase()
      .includes(sunlightSearch.value.toLowerCase())

    const matchesBiodiversity = plant.biodiversity
      .toLowerCase()
      .includes(biodiversitySearch.value.toLowerCase())

    const matchesSeason = plant.season
      .toLowerCase()
      .includes(seasonSearch.value.toLowerCase())

    return (
      matchesGlobal &&
      matchesName &&
      matchesType &&
      matchesWater &&
      matchesSunlight &&
      matchesBiodiversity &&
      matchesSeason
    )
  })
})

const sortedPlants = computed(() => {
  return [...filteredPlants.value].sort((a, b) => {
    const first = String(a[sortKey.value]).toLowerCase()
    const second = String(b[sortKey.value]).toLowerCase()

    if (first < second) {
      return sortDirection.value === 'asc' ? -1 : 1
    }

    if (first > second) {
      return sortDirection.value === 'asc' ? 1 : -1
    }

    return 0
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedPlants.value.length / rowsPerPage))
)

const paginatedPlants = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage
  const end = start + rowsPerPage

  return sortedPlants.value.slice(start, end)
})

// Change sorting when a heading is clicked
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortDirection.value =
      sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const sortSymbol = (key) => {
  if (sortKey.value !== key) {
    return '↕'
  }

  return sortDirection.value === 'asc' ? '↑' : '↓'
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Return to page 1 whenever search/filter results change
watch(
  [
    globalSearch,
    nameSearch,
    typeSearch,
    waterSearch,
    sunlightSearch,
    biodiversitySearch,
    seasonSearch
  ],
  () => {
    currentPage.value = 1
  }
)
</script>

<template>
  <AppNavbar />

  <main class="container py-5">
    <section class="mb-4">
      <h1 class="fw-bold">PLANT FINDER</h1>

      <p class="text-muted">
        Search and compare plants suitable for Melbourne urban greening projects.
      </p>
    </section>

    <!-- Global search -->
    <section class="mb-4">
      <label
        for="globalPlantSearch"
        class="form-label fw-bold"
      >
        Search all plant data
      </label>

      <input
        id="globalPlantSearch"
        v-model="globalSearch"
        type="text"
        class="form-control"
        placeholder="Search plant name, type, water, sunlight, biodiversity or season"
      />
    </section>

    <section>
      <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle">

          <!-- Sortable headings -->
          <thead class="table-light">
            <tr>
              <th
                class="sortable"
                @click="sortBy('name')"
              >
                Plant {{ sortSymbol('name') }}
              </th>

              <th
                class="sortable"
                @click="sortBy('type')"
              >
                Type {{ sortSymbol('type') }}
              </th>

              <th
                class="sortable"
                @click="sortBy('water')"
              >
                Water {{ sortSymbol('water') }}
              </th>

              <th
                class="sortable"
                @click="sortBy('sunlight')"
              >
                Sunlight {{ sortSymbol('sunlight') }}
              </th>

              <th
                class="sortable"
                @click="sortBy('biodiversity')"
              >
                Biodiversity {{ sortSymbol('biodiversity') }}
              </th>

              <th
                class="sortable"
                @click="sortBy('season')"
              >
                Season {{ sortSymbol('season') }}
              </th>
            </tr>

            <!-- Individual column search -->
            <tr>
              <th>
                <input
                  v-model="nameSearch"
                  class="form-control form-control-sm"
                  placeholder="Search plant"
                />
              </th>

              <th>
                <input
                  v-model="typeSearch"
                  class="form-control form-control-sm"
                  placeholder="Search type"
                />
              </th>

              <th>
                <input
                  v-model="waterSearch"
                  class="form-control form-control-sm"
                  placeholder="Search water"
                />
              </th>

              <th>
                <input
                  v-model="sunlightSearch"
                  class="form-control form-control-sm"
                  placeholder="Search sunlight"
                />
              </th>

              <th>
                <input
                  v-model="biodiversitySearch"
                  class="form-control form-control-sm"
                  placeholder="Search biodiversity"
                />
              </th>

              <th>
                <input
                  v-model="seasonSearch"
                  class="form-control form-control-sm"
                  placeholder="Search season"
                />
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="plant in paginatedPlants"
              :key="plant.name"
            >
              <td>{{ plant.name }}</td>
              <td>{{ plant.type }}</td>
              <td>{{ plant.water }}</td>
              <td>{{ plant.sunlight }}</td>
              <td>{{ plant.biodiversity }}</td>
              <td>{{ plant.season }}</td>
            </tr>

            <!-- No results -->
            <tr v-if="paginatedPlants.length === 0">
              <td
                colspan="6"
                class="text-center py-4"
              >
                No plants found.
              </td>
            </tr>
          </tbody>

        </table>
      </div>

      <!-- Pagination information -->
      <div
        class="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3"
      >
        <p class="mb-0">
          Showing
          {{ paginatedPlants.length }}
          of
          {{ sortedPlants.length }}
          matching plants
          — maximum 10 rows per page
        </p>

        <div class="d-flex align-items-center gap-2">
          <button
            class="btn btn-outline-dark"
            :disabled="currentPage === 1"
            @click="previousPage"
          >
            Previous
          </button>

          <span>
            Page {{ currentPage }} of {{ totalPages }}
          </span>

          <button
            class="btn btn-outline-dark"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.sortable {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.sortable:hover {
  background-color: #e9ecef;
}

table {
  min-width: 1000px;
}

th {
  vertical-align: middle;
}
</style>