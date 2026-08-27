<script setup>
import { ref } from 'vue'
import AppNavbar from '../components/AppNavbar.vue'

const name = ref('')
const email = ref('')
const suburb = ref('')
const interest = ref('')

const nameError = ref('')
const emailError = ref('')
const suburbError = ref('')
const interestError = ref('')

const successMessage = ref('')

const validateForm = () => {
  // Clear old messages
  nameError.value = ''
  emailError.value = ''
  suburbError.value = ''
  interestError.value = ''
  successMessage.value = ''

  let isValid = true

  // Validation 1:
  // Required + minimum length
  if (name.value.trim() === '') {
    nameError.value = 'Name is required.'
    isValid = false
  } else if (name.value.trim().length < 3) {
    nameError.value =
      'Name must contain at least 3 characters.'
    isValid = false
  }

  // Validation 2:
  // Email format validation
  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (email.value.trim() === '') {
    emailError.value = 'Email is required.'
    isValid = false
  } else if (!emailPattern.test(email.value)) {
    emailError.value =
      'Please enter a valid email address.'
    isValid = false
  }

  // Required suburb
  if (suburb.value === '') {
    suburbError.value =
      'Please select your suburb.'
    isValid = false
  }

  // Required interest
  if (interest.value === '') {
    interestError.value =
      'Please select an area of interest.'
    isValid = false
  }

  // Successful submission
  if (isValid) {
    successMessage.value =
      `Thanks ${name.value}! Your volunteer interest has been registered.`

    name.value = ''
    email.value = ''
    suburb.value = ''
    interest.value = ''
  }
}
</script>

<template>
  <AppNavbar />

  <main class="container py-5">

    <section class="mb-4">
      <h1 class="fw-bold">
        VOLUNTEER WITH US
      </h1>

      <p class="text-muted">
        Register your interest in supporting
        community greening projects across Melbourne.
      </p>
    </section>

    <section class="row">

      <div class="col-12 col-md-8 col-lg-6">

        <form
          class="border rounded p-4"
          novalidate
          @submit.prevent="validateForm"
        >

          <!-- Name -->
          <div class="mb-3">

            <label
              for="volunteerName"
              class="form-label fw-bold"
            >
              Full Name
            </label>

            <input
              id="volunteerName"
              v-model="name"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': nameError }"
              placeholder="Enter your full name"
            />

            <div
              v-if="nameError"
              class="invalid-feedback"
            >
              {{ nameError }}
            </div>

          </div>


          <!-- Email -->
          <div class="mb-3">

            <label
              for="volunteerEmail"
              class="form-label fw-bold"
            >
              Email
            </label>

            <input
              id="volunteerEmail"
              v-model="email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': emailError }"
              placeholder="example@email.com"
            />

            <div
              v-if="emailError"
              class="invalid-feedback"
            >
              {{ emailError }}
            </div>

          </div>


          <!-- Suburb -->
          <div class="mb-3">

            <label
              for="volunteerSuburb"
              class="form-label fw-bold"
            >
              Suburb
            </label>

            <select
              id="volunteerSuburb"
              v-model="suburb"
              class="form-select"
              :class="{ 'is-invalid': suburbError }"
            >
              <option value="">
                Select a suburb
              </option>

              <option value="Melbourne">
                Melbourne
              </option>

              <option value="Clayton">
                Clayton
              </option>

              <option value="Brimbank">
                Brimbank
              </option>

              <option value="Hume">
                Hume
              </option>

              <option value="Wyndham">
                Wyndham
              </option>
            </select>

            <div
              v-if="suburbError"
              class="invalid-feedback"
            >
              {{ suburbError }}
            </div>

          </div>


          <!-- Interest -->
          <div class="mb-4">

            <label
              for="volunteerInterest"
              class="form-label fw-bold"
            >
              Area of Interest
            </label>

            <select
              id="volunteerInterest"
              v-model="interest"
              class="form-select"
              :class="{ 'is-invalid': interestError }"
            >
              <option value="">
                Select an area
              </option>

              <option value="Tree Planting">
                Tree Planting
              </option>

              <option value="Community Gardens">
                Community Gardens
              </option>

              <option value="Urban Greening">
                Urban Greening
              </option>

              <option value="Environmental Education">
                Environmental Education
              </option>
            </select>

            <div
              v-if="interestError"
              class="invalid-feedback"
            >
              {{ interestError }}
            </div>

          </div>


          <button
            type="submit"
            class="btn btn-dark"
          >
            Register Interest
          </button>

        </form>


        <!-- Successful validation -->
        <div
          v-if="successMessage"
          class="alert alert-success mt-3"
          role="alert"
        >
          {{ successMessage }}
        </div>

      </div>

    </section>

  </main>
</template>