
<script setup>
import { ref } from 'vue'
import { auth } from '../firebase'

const subject = ref('Pots & Plants Melbourne')
const message = ref('Hello, this is my email attachment test.')
const file = ref(null)
const busy = ref(false)
const status = ref('')

const onFile = (event) => {
  file.value = event.target.files?.[0] || null
}

const toBase64 = (selectedFile) => new Promise((resolve, reject) => {
  const reader = new FileReader()

  reader.onload = () => {
    resolve(String(reader.result).split(',')[1])
  }

  reader.onerror = reject
  reader.readAsDataURL(selectedFile)
})

const send = async () => {
  status.value = ''

  if (!auth.currentUser) {
    status.value = 'Please sign in first.'
    return
  }

  const baseUrl = import.meta.env.VITE_FUNCTIONS_BASE_URL

  if (!baseUrl) {
    status.value = 'Cloud Function URL is not configured.'
    return
  }

  if (
    file.value &&
    (
      file.value.size > 1024 * 1024 ||
      !['application/pdf', 'text/csv'].includes(file.value.type)
    )
  ) {
    status.value = 'Choose a PDF or CSV file smaller than 1 MB.'
    return
  }

  busy.value = true

  try {
    const attachment = file.value
      ? {
          filename: file.value.name.replace(/[^a-zA-Z0-9_.-]/g, '_'),
          contentType: file.value.type,
          base64: await toBase64(file.value),
        }
      : null

    const token = await auth.currentUser.getIdToken()

    const response = await fetch(`${baseUrl}/sendEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        subject: subject.value,
        message: message.value,
        attachment,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Email failed')
    }

    status.value = result.message
  } catch (error) {
    status.value = error.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <main
    class="container py-5"
    style="max-width: 680px; margin-top: 80px"
  >
    <h1>Email a Document</h1>

    <p>
      Send a PDF or CSV attachment to your
      Firebase account email address.
    </p>

    <form @submit.prevent="send">
      <label class="form-label" for="subject">
        Subject
      </label>

      <input
        id="subject"
        v-model="subject"
        class="form-control mb-3"
        required
        minlength="3"
        maxlength="120"
      />

      <label class="form-label" for="message">
        Message
      </label>

      <textarea
        id="message"
        v-model="message"
        class="form-control mb-3"
        required
        maxlength="2000"
      ></textarea>

      <label class="form-label" for="attachment">
        Attachment (PDF or CSV, optional, 1 MB max)
      </label>

      <input
        id="attachment"
        class="form-control mb-3"
        type="file"
        accept=".pdf,.csv,application/pdf,text/csv"
        @change="onFile"
      />

      <button
        class="btn btn-success"
        type="submit"
        :disabled="busy"
      >
        {{ busy ? 'Sending...' : 'Send Email' }}
      </button>
    </form>

    <p role="status" aria-live="polite" class="mt-3">
      {{ status }}
    </p>
  </main>
</template>
