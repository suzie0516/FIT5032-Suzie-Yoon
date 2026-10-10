<script setup>

import { computed, ref } from 'vue'

import { useRouter } from 'vue-router'

import { registerUser } from '../utils/auth'

const router = useRouter()

const fullName = ref('')

const email = ref('')

const password = ref('')

const confirmPassword = ref('')

const errorMessage = ref('')

const successMessage = ref('')

const isLoading = ref(false)

const isFullNameValid = computed(() => {

  const name = fullName.value.trim()

  return name.split(/\s+/).length >= 2 && !/[<>]/.test(name)

})

const emailPattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/

const isEmailValid = computed(() => emailPattern.test(email.value.trim()))

const passwordRules = computed(() => ({

  length: password.value.length >= 8,

  uppercase: /[A-Z]/.test(password.value),

  lowercase: /[a-z]/.test(password.value),

  number: /[0-9]/.test(password.value),

  special: /[^A-Za-z0-9\s]/.test(password.value),

}))

const isPasswordValid = computed(() => Object.values(passwordRules.value).every(Boolean))

const passwordsMatch = computed(() => confirmPassword.value.length > 0 && password.value === confirmPassword.value)

const register = async () => {

  if (isLoading.value) return

  errorMessage.value = ''

  successMessage.value = ''

  if (!fullName.value.trim() || !email.value.trim() || !password.value || !confirmPassword.value) {

    errorMessage.value = 'Please complete all fields.'

    return

  }

  if (!isFullNameValid.value) {

    errorMessage.value = 'Please enter your first and last name without HTML characters.'

    return

  }

  if (!isEmailValid.value) {

    errorMessage.value = 'Please enter a valid email address.'

    return

  }

  if (!isPasswordValid.value) {

    errorMessage.value = 'Please make sure your password meets all requirements.'

    return

  }

  if (!passwordsMatch.value) {

    errorMessage.value = 'Passwords do not match.'

    return

  }

  isLoading.value = true

  try {

    await registerUser(fullName.value, email.value, password.value)

    successMessage.value = 'Account created successfully.'

    password.value = ''

    confirmPassword.value = ''

    await router.push('/')

  } catch (error) {

    if (error.code === 'auth/email-already-in-use') {

      errorMessage.value = 'An account with this email already exists.'

    } else if (error.code === 'auth/invalid-email') {

      errorMessage.value = 'Please enter a valid email address.'

    } else if (error.code === 'auth/weak-password') {

      errorMessage.value = 'Please choose a stronger password.'

    } else if (error.code === 'auth/network-request-failed') {

      errorMessage.value = 'Network error. Please try again.'

    } else {

      errorMessage.value = 'Unable to create your account. Please try again.'

      console.error('Registration failed:', error.code)

    }

  } finally {

    isLoading.value = false

  }

}

</script>

<template>

  <main class="register-page">

    <div class="container">

      <div class="register-card">

        <h1>Create Account</h1>

        <p class="intro">

          Join Pots & Plants Melbourne to participate

          in our urban greening community.

        </p>

        <form

          @submit.prevent="register"

          novalidate

        >

          <div class="mb-3">

            <label

              for="fullName"

              class="form-label"

            >

              Full Name

            </label>

            <input

              id="fullName"

              v-model="fullName"

              type="text"

              class="form-control"

              :class="{

                'is-valid':

                  fullName.length > 0 &&

                  isFullNameValid,

                'is-invalid':

                  fullName.length > 0 &&

                  !isFullNameValid,

              }"

              autocomplete="name"

              required

            />

            <div

              v-if="

                fullName.length > 0 &&

                !isFullNameValid

              "

              class="invalid-feedback"

            >

              Please enter your first and last name

              without HTML characters.

            </div>

            <div

              v-if="

                fullName.length > 0 &&

                isFullNameValid

              "

              class="valid-feedback"

            >

              Valid full name.

            </div>

          </div>

          <div class="mb-3">

            <label

              for="email"

              class="form-label"

            >

              Email Address

            </label>

            <input

              id="email"

              v-model="email"

              type="email"

              class="form-control"

              :class="{

                'is-valid':

                  email.length > 0 &&

                  isEmailValid,

                'is-invalid':

                  email.length > 0 &&

                  !isEmailValid,

              }"

              autocomplete="email"

              required

            />

            <div

              v-if="

                email.length > 0 &&

                !isEmailValid

              "

              class="invalid-feedback"

            >

              Please enter a valid email address.

            </div>

            <div

              v-if="

                email.length > 0 &&

                isEmailValid

              "

              class="valid-feedback"

            >

              Valid email address.

            </div>

          </div>

          <div class="mb-3">

            <label

              for="password"

              class="form-label"

            >

              Password

            </label>

            <input

              id="password"

              v-model="password"

              type="password"

              class="form-control"

              :class="{

                'is-valid':

                  password.length > 0 &&

                  isPasswordValid,

                'is-invalid':

                  password.length > 0 &&

                  !isPasswordValid,

              }"

              autocomplete="new-password"

              required

            />

            <div

              v-if="password.length > 0"

              class="password-rules"

            >

              <div

                :class="

                  passwordRules.length

                    ? 'rule-valid'

                    : 'rule-invalid'

                "

              >

                {{

                  passwordRules.length

                    ? '✓'

                    : '✗'

                }}

                At least 8 characters

              </div>

              <div

                :class="

                  passwordRules.uppercase

                    ? 'rule-valid'

                    : 'rule-invalid'

                "

              >

                {{

                  passwordRules.uppercase

                    ? '✓'

                    : '✗'

                }}

                At least one uppercase letter

              </div>

              <div

                :class="

                  passwordRules.lowercase

                    ? 'rule-valid'

                    : 'rule-invalid'

                "

              >

                {{

                  passwordRules.lowercase

                    ? '✓'

                    : '✗'

                }}

                At least one lowercase letter

              </div>

              <div

                :class="

                  passwordRules.number

                    ? 'rule-valid'

                    : 'rule-invalid'

                "

              >

                {{

                  passwordRules.number

                    ? '✓'

                    : '✗'

                }}

                At least one number

              </div>

              <div

                :class="

                  passwordRules.special

                    ? 'rule-valid'

                    : 'rule-invalid'

                "

              >

                {{

                  passwordRules.special

                    ? '✓'

                    : '✗'

                }}

                At least one special character

              </div>

            </div>

          </div>

          <div class="mb-4">

            <label

              for="confirmPassword"

              class="form-label"

            >

              Confirm Password

            </label>

            <input

              id="confirmPassword"

              v-model="confirmPassword"

              type="password"

              class="form-control"

              :class="{

                'is-valid':

                  confirmPassword.length > 0 &&

                  passwordsMatch,

                'is-invalid':

                  confirmPassword.length > 0 &&

                  !passwordsMatch,

              }"

              autocomplete="new-password"

              required

            />

            <div

              v-if="

                confirmPassword.length > 0 &&

                !passwordsMatch

              "

              class="invalid-feedback"

            >

              Passwords do not match.

            </div>

            <div

              v-if="

                confirmPassword.length > 0 &&

                passwordsMatch

              "

              class="valid-feedback"

            >

              Passwords match.

            </div>

          </div>

          <div

            v-if="errorMessage"

            class="alert alert-danger"

            role="alert"

            aria-live="polite"

          >

            {{ errorMessage }}

          </div>

          <div

            v-if="successMessage"

            class="alert alert-success"

            role="status"

            aria-live="polite"

          >

            {{ successMessage }}

          </div>

          <button

            :disabled="isLoading"

            type="submit"

            class="btn btn-dark w-100"

          >

            {{ isLoading ? 'Creating Account...' : 'Create Account' }}

          </button>

        </form>

        <p class="sign-in-text">

          Already have an account?

          <RouterLink to="/login">

            Sign in

          </RouterLink>

        </p>

      </div>

    </div>

  </main>

</template>

<style scoped>

.register-page {

  padding: 60px 16px;

  min-height: 75vh;

  background: #f7f8f5;

}

.register-card {

  width: 100%;

  max-width: 520px;

  margin: 0 auto;

  padding: 36px;

  background: white;

  border:

    1px solid #dedede;

  border-radius: 12px;

}

.register-card h1 {

  margin-bottom: 10px;

  font-weight: 700;

}

.intro {

  margin-bottom: 30px;

  color: #555;

}

.password-rules {

  margin-top: 10px;

  font-size: 0.875rem;

  line-height: 1.7;

}

.rule-valid {

  color: #198754;

}

.rule-invalid {

  color: #dc3545;

}

.sign-in-text {

  margin-top: 22px;

  margin-bottom: 0;

  text-align: center;

}

@media (max-width: 576px) {

  .register-page {

    padding:

      30px 12px;

  }

  .register-card {

    padding:

      24px 18px;

  }

}

</style>
