<script setup>
import { computed, ref, watch } from 'vue'
import { exportToCsv, exportToPdf } from '../utils/exportData'

const props = defineProps({
  // Unique id prefix so labels/inputs stay unique
  // when two tables are on the same page.
  tableId: {
    type: String,
    required: true,
  },

  // Visible caption describing the table
  caption: {
    type: String,
    required: true,
  },

  // [{ key: 'name', label: 'Plant' }, ...]
  columns: {
    type: Array,
    required: true,
  },

  rows: {
    type: Array,
    default: () => [],
  },

  // Field used as the v-for key
  rowKey: {
    type: String,
    default: 'id',
  },

  rowsPerPage: {
    type: Number,
    default: 10,
  },

  exportFileName: {
    type: String,
    default: 'table-export',
  },

  itemLabel: {
    type: String,
    default: 'records',
  },
})

const globalSearch = ref('')

const columnSearch = ref(
  Object.fromEntries(
    props.columns.map((column) => [column.key, '']),
  ),
)

const sortKey = ref(props.columns[0]?.key ?? '')
const sortDirection = ref('asc')

const currentPage = ref(1)

const filteredRows = computed(() => {
  const global = globalSearch.value.trim().toLowerCase()

  return props.rows.filter((row) => {
    const matchesGlobal =
      global === '' ||
      props.columns.some((column) =>
        String(row[column.key] ?? '')
          .toLowerCase()
          .includes(global),
      )

    const matchesColumns = props.columns.every((column) => {
      const term = columnSearch.value[column.key]
        .trim()
        .toLowerCase()

      return (
        term === '' ||
        String(row[column.key] ?? '')
          .toLowerCase()
          .includes(term)
      )
    })

    return matchesGlobal && matchesColumns
  })
})

const sortedRows = computed(() => {
  const direction = sortDirection.value === 'asc' ? 1 : -1

  return [...filteredRows.value].sort((a, b) => {
    const first = a[sortKey.value]
    const second = b[sortKey.value]

    if (typeof first === 'number' && typeof second === 'number') {
      return (first - second) * direction
    }

    return (
      String(first ?? '').localeCompare(
        String(second ?? ''),
        'en',
        { numeric: true, sensitivity: 'base' },
      ) * direction
    )
  })
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedRows.value.length / props.rowsPerPage)),
)

const pageRows = computed(() => {
  const start = (currentPage.value - 1) * props.rowsPerPage

  return sortedRows.value.slice(start, start + props.rowsPerPage)
})

const firstShown = computed(() =>
  sortedRows.value.length === 0
    ? 0
    : (currentPage.value - 1) * props.rowsPerPage + 1,
)

const lastShown = computed(() =>
  Math.min(
    currentPage.value * props.rowsPerPage,
    sortedRows.value.length,
  ),
)

watch(
  [globalSearch, columnSearch],
  () => {
    currentPage.value = 1
  },
  { deep: true },
)

// do not stay on a page that no longer exists.
watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortDirection.value =
      sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

const ariaSort = (key) => {
  if (sortKey.value !== key) {
    return 'none'
  }

  return sortDirection.value === 'asc' ? 'ascending' : 'descending'
}

const sortSymbol = (key) => {
  if (sortKey.value !== key) {
    return '↕'
  }

  return sortDirection.value === 'asc' ? '↑' : '↓'
}

const clearSearch = () => {
  globalSearch.value = ''

  Object.keys(columnSearch.value).forEach((key) => {
    columnSearch.value[key] = ''
  })
}

const handleExportCsv = () => {
  exportToCsv(props.columns, sortedRows.value, props.exportFileName)
}

const handleExportPdf = () => {
  exportToPdf(
    props.columns,
    sortedRows.value,
    props.exportFileName,
    props.caption,
  )
}

// (e.g. attach it to an email).
defineExpose({ sortedRows })
</script>

<template>
  <section class="data-table">
    <div class="row g-2 align-items-end mb-3">
      <div class="col-12 col-md-6 col-lg-5">
        <label
          :for="`${tableId}-global`"
          class="form-label fw-semibold"
        >
          Search all columns
        </label>

        <input
          :id="`${tableId}-global`"
          v-model="globalSearch"
          type="search"
          class="form-control"
          :placeholder="`Search all ${itemLabel}`"
        />
      </div>

      <div class="col-12 col-md-6 col-lg-7 d-flex flex-wrap gap-2 justify-content-md-end">
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="clearSearch"
        >
          Clear search
        </button>

        <button
          type="button"
          class="btn btn-outline-success"
          :disabled="sortedRows.length === 0"
          @click="handleExportCsv"
        >
          Export CSV
        </button>

        <button
          type="button"
          class="btn btn-success"
          :disabled="sortedRows.length === 0"
          @click="handleExportPdf"
        >
          Export PDF
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-hover align-middle mb-0">

        <caption class="caption-top fw-semibold text-dark">
          {{ caption }}
        </caption>

        <thead class="table-light">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :aria-sort="ariaSort(column.key)"
            >
              <button
                type="button"
                class="sort-button"
                @click="sortBy(column.key)"
              >
                {{ column.label }}
                <span aria-hidden="true">{{ sortSymbol(column.key) }}</span>
              </button>
            </th>
          </tr>
          <tr>
            <td
              v-for="column in columns"
              :key="`search-${column.key}`"
            >
              <label
                :for="`${tableId}-search-${column.key}`"
                class="visually-hidden"
              >
                Search by {{ column.label }}
              </label>

              <input
                :id="`${tableId}-search-${column.key}`"
                v-model="columnSearch[column.key]"
                type="search"
                class="form-control form-control-sm"
                :placeholder="column.label"
              />
            </td>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in pageRows"
            :key="row[rowKey]"
          >
            <td
              v-for="column in columns"
              :key="column.key"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="row[column.key]"
              >
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>

          <tr v-if="pageRows.length === 0">
            <td
              :colspan="columns.length"
              class="text-center py-4"
            >
              No {{ itemLabel }} found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3">
      <p
        class="mb-0"
        aria-live="polite"
      >
        Showing {{ firstShown }}–{{ lastShown }} of
        {{ sortedRows.length }} {{ itemLabel }}
        (10 rows per page)
      </p>

      <nav :aria-label="`${caption} pagination`">
        <ul class="pagination mb-0">
          <li
            class="page-item"
            :class="{ disabled: currentPage === 1 }"
          >
            <button
              type="button"
              class="page-link"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Previous
            </button>
          </li>

          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <button
              type="button"
              class="page-link"
              :aria-current="page === currentPage ? 'page' : undefined"
              :aria-label="`Page ${page}`"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </li>

          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button
              type="button"
              class="page-link"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<style scoped>
table {
  min-width: 900px;
}

.sort-button {
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
  color: inherit;
}

.sort-button:hover {
  color: #35682d;
}

.page-link {
  color: #35682d;
}

.page-item.active .page-link {
  color: #fff;
  background-color: #35682d;
  border-color: #35682d;
}
</style>
