<template>
  <div class="container mt-5">

    <!-- User Information Form -->
    <div class="row">
      <div class="offset-md-2">

        <h1 class="text-center">🗄️W5. Library Registration Form</h1>
        <p class="text-center">
          Let's build some more advanced features into our form.
        </p>

        <form @submit.prevent="submitForm">

          <!-- Username and Gender -->
          <div class="row mb-3">

            <div class="col-md-6 col-sm-6">
              <label for="username" class="form-label">
                Username
              </label>

              <input
                type="text"
                class="form-control"
                id="username"
                v-model="formData.username"
                @blur="validateUsername"
              />

              <div v-if="errors.username" class="text-danger">
                {{ errors.username }}
              </div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="gender" class="form-label">
                Gender
              </label>

              <select
                class="form-select"
                id="gender"
                v-model="formData.gender"
                @blur="validateGender"
              >
                <option value="">Please select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <div v-if="errors.gender" class="text-danger">
                {{ errors.gender }}
              </div>
            </div>

          </div>

          <!-- Password and Confirm Password -->
          <div class="row mb-3">

            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">
                Password
              </label>

              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
                @blur="validatePassword"
              />

              <div v-if="errors.password" class="text-danger">
                {{ errors.password }}
              </div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="confirm-password" class="form-label">
                Confirm password
              </label>

              <input
                type="password"
                class="form-control"
                id="confirm-password"
                v-model="formData.confirmPassword"
                @blur="() => validateConfirmPassword(true)"
              />

              <div
                v-if="errors.confirmPassword"
                class="text-danger"
              >
                {{ errors.confirmPassword }}
              </div>
            </div>

          </div>

          <!-- Australian Resident -->
          <div class="row mb-3">
            <div class="col-sm-6">
              <div class="form-check">

                <input
                  type="checkbox"
                  class="form-check-input"
                  id="isAustralian"
                  v-model="formData.isAustralian"
                  @change="validateResident"
                />

                <label
                  class="form-check-label"
                  for="isAustralian"
                >
                  Australian Resident?
                </label>

                <div
                  v-if="errors.resident"
                  class="text-danger"
                >
                  {{ errors.resident }}
                </div>

              </div>
            </div>
          </div>

          <!-- Reason for joining -->
          <div class="mb-3">

            <label for="reason" class="form-label">
              Reason for joining
            </label>

            <textarea
              class="form-control"
              id="reason"
              rows="3"
              v-model="formData.reason"
              @input="validateReason"
            ></textarea>

            <div
              v-if="errors.reason"
              class="text-danger"
            >
              {{ errors.reason }}
            </div>

            <div
              v-if="friendMessage"
              class="text-success"
            >
              Great to have a friend
            </div>

          </div>

          <!-- Submit and Clear Buttons -->
          <div class="text-center">

            <button
              type="submit"
              class="btn btn-primary me-2"
            >
              Submit
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              @click="clearForm"
            >
              Clear
            </button>

          </div>

        </form>
      </div>
    </div>


    <!-- Submitted User Information DataTable -->
    <div
      class="row mt-5"
      v-if="submittedCards.length"
    >

      <div class="col-12">

        <h2 class="text-center mb-3">
          Submitted User Information
        </h2>

        <DataTable
          :value="submittedCards"
          tableStyle="min-width: 50rem"
        >

          <Column
            field="username"
            header="Username"
          ></Column>

          <Column
            field="password"
            header="Password"
          ></Column>

          <Column
            field="isAustralian"
            header="Australian Resident"
          >
            <template #body="slotProps">
              {{ slotProps.data.isAustralian ? 'Yes' : 'No' }}
            </template>
          </Column>

          <Column
            field="gender"
            header="Gender"
          ></Column>

          <Column
            field="reason"
            header="Reason"
          ></Column>

        </DataTable>

      </div>
    </div>

  </div>
</template>


<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'


const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: ''
})


const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  reason: null
})


const friendMessage = ref(false)


const validateUsername = () => {
  if (formData.value.username.length < 3) {
    errors.value.username =
      'Username must be at least 3 characters.'
  } else {
    errors.value.username = null
  }
}


const validatePassword = () => {
  if (formData.value.password.length < 8) {
    errors.value.password =
      'Password must be at least 8 characters.'
  } else {
    errors.value.password = null
  }
}


const validateConfirmPassword = (blur) => {
  if (
    formData.value.password !==
    formData.value.confirmPassword
  ) {
    if (blur) {
      errors.value.confirmPassword =
        'Passwords do not match.'
    }
  } else {
    errors.value.confirmPassword = null
  }
}


const validateResident = () => {
  if (!formData.value.isAustralian) {
    errors.value.resident =
      'Please confirm Australian residency.'
  } else {
    errors.value.resident = null
  }
}


const validateGender = () => {
  if (!formData.value.gender) {
    errors.value.gender =
      'Please select a gender.'
  } else {
    errors.value.gender = null
  }
}


const validateReason = () => {

  if (formData.value.reason.trim().length < 10) {
    errors.value.reason =
      'Reason must be at least 10 characters.'
  } else {
    errors.value.reason = null
  }

  friendMessage.value =
    formData.value.reason
      .toLowerCase()
      .includes('friend')
}


const submittedCards = ref([])


const submitForm = () => {
  validateUsername()
  validatePassword()
  validateConfirmPassword(true)
  validateResident()
  validateGender()
  validateReason()

  if (
    errors.value.username ||
    errors.value.password ||
    errors.value.confirmPassword ||
    errors.value.resident ||
    errors.value.gender ||
    errors.value.reason
  ) {
    return
  }

  submittedCards.value.push({
    ...formData.value
  })
}


const clearForm = () => {

  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: ''
  }

  errors.value = {
    username: null,
    password: null,
    confirmPassword: null,
    resident: null,
    gender: null,
    reason: null
  }

  friendMessage.value = false
}
</script>


<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275FDA;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
}
</style>