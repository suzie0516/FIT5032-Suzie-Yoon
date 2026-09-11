<script setup>
import { computed, ref } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()

const fullName = ref('')

const email = ref('')

const password = ref('')

const confirmPassword = ref('')

const errorMessage = ref('')

const successMessage = ref('')


// --------------------------------
// Real-time full name validation
// --------------------------------

const isFullNameValid = computed(() => {
  const normalizedName =
    fullName.value.trim()

  const nameParts =
    normalizedName.split(/\s+/)

  /*
    Do not allow angle brackets in names.

    Vue normally escapes interpolated text,
    but rejecting HTML-tag characters here
    provides an additional validation layer
    for user-supplied account data.
  */
  const containsUnsafeCharacters =
    /[<>]/.test(normalizedName)

  return (
    normalizedName.length > 0 &&
    nameParts.length >= 2 &&
    nameParts.every(
      (part) => part.length >= 1,
    ) &&
    !containsUnsafeCharacters
  )
})


// --------------------------------
// Real-time email validation
// --------------------------------

const emailPattern =
  /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/

const isEmailValid = computed(() => {
  return emailPattern.test(
    email.value.trim(),
  )
})


// --------------------------------
// Real-time password validation
// --------------------------------

const passwordRules = computed(() => ({
  length: password.value.length >= 8,

  uppercase:
    /[A-Z]/.test(password.value),

  lowercase:
    /[a-z]/.test(password.value),

  number:
    /[0-9]/.test(password.value),

  /*
    Whitespace does not count as a
    special character.
  */
  special:
    /[^A-Za-z0-9\s]/.test(
      password.value,
    ),
}))

const isPasswordValid = computed(() => {
  return Object.values(
    passwordRules.value,
  ).every(Boolean)
})


// --------------------------------
// Confirm password validation
// --------------------------------

const passwordsMatch = computed(() => {
  return (
    confirmPassword.value.length > 0 &&
    password.value ===
      confirmPassword.value
  )
})


// --------------------------------
// Hash password
// --------------------------------

const hashPassword = async (
  plainPassword,
) => {
  const data =
    new TextEncoder().encode(
      plainPassword,
    )

  const hashBuffer =
    await crypto.subtle.digest(
      'SHA-256',
      data,
    )

  return Array.from(
    new Uint8Array(hashBuffer),
  )
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
}


// --------------------------------
// Register user
// --------------------------------

const register = async () => {
  errorMessage.value = ''

  successMessage.value = ''


  // Check empty fields
  if (
    !fullName.value.trim() ||
    !email.value.trim() ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value =
      'Please complete all fields.'

    return
  }


  // Validate full name
  if (!isFullNameValid.value) {
    errorMessage.value =
      'Please enter a valid full name using at least two words and do not use HTML characters.'

    return
  }


  // Validate email
  if (!isEmailValid.value) {
    errorMessage.value =
      'Please enter a valid email address.'

    return
  }


  // Validate password
  if (!isPasswordValid.value) {
    errorMessage.value =
      'Please make sure your password meets all requirements.'

    return
  }


  // Validate matching passwords
  if (!passwordsMatch.value) {
    errorMessage.value =
      'Passwords do not match.'

    return
  }


  // Retrieve existing users
  let users = []

  try {
    users =
      JSON.parse(
        localStorage.getItem('users'),
      ) || []

    if (!Array.isArray(users)) {
      users = []
    }
  } catch {
    users = []
  }


  // Prevent duplicate email accounts
  const normalizedEmail =
    email.value
      .trim()
      .toLowerCase()

  const existingUser =
    users.find(
      (user) =>
        user.email
          ?.toLowerCase() ===
        normalizedEmail,
    )

  if (existingUser) {
    errorMessage.value =
      'An account with this email already exists.'

    return
  }


  // Hash password before storage
  const passwordHash =
    await hashPassword(
      password.value,
    )


  /*
    Self-registered accounts always
    receive the normal user role.

    Users cannot select or assign
    themselves the administrator role.
  */
  const newUser = {
    id: Date.now(),

    fullName:
      fullName.value
        .trim()
        .replace(/\s+/g, ' '),

    email: normalizedEmail,

    passwordHash,

    role: 'user',
  }


  // Store new account
  users.push(newUser)

  localStorage.setItem(
    'users',
    JSON.stringify(users),
  )


  successMessage.value =
    'Registration successful. You can now sign in.'


  // Clear form
  fullName.value = ''

  email.value = ''

  password.value = ''

  confirmPassword.value = ''


  // Move to login page
  setTimeout(() => {
    router.push('/login')
  }, 1000)
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

          <!-- =========================
               FULL NAME
          ========================== -->
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


          <!-- =========================
               EMAIL
          ========================== -->
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


          <!-- =========================
               PASSWORD
          ========================== -->
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


          <!-- =========================
               CONFIRM PASSWORD
          ========================== -->
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


          <!-- =========================
               GENERAL ERROR
          ========================== -->
          <div
            v-if="errorMessage"
            class="alert alert-danger"
            role="alert"
            aria-live="polite"
          >
            {{ errorMessage }}
          </div>


          <!-- =========================
               SUCCESS
          ========================== -->
          <div
            v-if="successMessage"
            class="alert alert-success"
            role="status"
            aria-live="polite"
          >
            {{ successMessage }}
          </div>


          <!-- =========================
               CREATE ACCOUNT
          ========================== -->
          <button
            type="submit"
            class="btn btn-dark w-100"
          >
            Create Account
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