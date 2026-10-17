<script setup>
import spiralGardenImage from '../assets/challenge/spiral-garden.png'
import geometricPondImage from '../assets/challenge/geometric-pond.png'
import wildflowerGardenImage from '../assets/challenge/wildflower-garden.png'
import communityGardenImage from '../assets/challenge/community-garden.png'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import { auth } from '../firebase'
import { isAuthenticated } from '../utils/auth'

const router = useRouter()
const baseUrl = import.meta.env.VITE_FUNCTIONS_BASE_URL

// Concept designs for an illustrative community challenge.
const designs = [
  {
    id: 'spiral-garden-1',
    name: 'Spiral Garden',
    category: 'Pollinator planting',
    description: 'A winding native-plant garden with paths for local residents.',
    image: spiralGardenImage,
    photoAlt: 'Green garden plants shown as an illustrative concept image',
  },
  {
    id: 'octagon-pond-2',
    name: 'Octagon Pond',
    category: 'Rainwater and habitat',
    description: 'A small rain garden and pond concept supporting urban biodiversity.',
    image: geometricPondImage,
    photoAlt: 'Green woodland shown as an illustrative environment image',
  },
  {
    id: 'native-bee-walk-3',
    name: 'Native Bee Walk',
    category: 'Pollinator corridor',
    description: 'A walking route with native flowering plants for local pollinators.',
    image: wildflowerGardenImage,
    photoAlt: 'Lush planting shown as an illustrative garden image',
  },
  {
    id: 'rainwater-pocket-park-4',
    name: 'Rainwater Pocket Park',
    category: 'Urban green space',
    description: 'A neighbourhood pocket park using water-sensitive landscaping.',
    image: communityGardenImage,
    photoAlt: 'Leafy green plants shown as an illustrative planting image',
  },
]

const index = ref(0)
const activeDesign = computed(() => designs[index.value])
const results = ref({})
const myRatings = ref({})
const designRating = ref(0)
const applicabilityRating = ref(0)
const creativityRating = ref(0)
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const score = computed(() => results.value[activeDesign.value.id] || {
  count: 0, design: 0, applicability: 0, creativity: 0, overall: 0,
})
const existingRating = computed(() => !!myRatings.value[activeDesign.value.id])
const ratingComplete = computed(() =>
  [designRating.value, applicabilityRating.value, creativityRating.value]
    .every((value) => Number.isInteger(value) && value >= 1 && value <= 5)
)

function selectDesign(newIndex) {
  index.value = (newIndex + designs.length) % designs.length
  const mine = myRatings.value[activeDesign.value.id]
  designRating.value = mine?.design || 0
  applicabilityRating.value = mine?.applicability || 0
  creativityRating.value = mine?.creativity || 0
  errorMessage.value = ''
  successMessage.value = ''
}

async function loadRatings() {
  loading.value = true
  errorMessage.value = ''
  try {
    if (!baseUrl) throw new Error('Firebase Functions URL is missing.')
    await auth.authStateReady()
    const headers = {}
    if (auth.currentUser) {
      headers.Authorization = `Bearer ${await auth.currentUser.getIdToken()}`
    }
    const response = await fetch(`${baseUrl}/designRatings`, { headers })
    if (!response.ok) throw new Error('Unable to load community ratings.')
    const data = await response.json()
    results.value = data.results || {}
    myRatings.value = data.mine || {}
    selectDesign(index.value)
  } catch (error) {
    console.error(error)
    errorMessage.value = error.message || 'Unable to load ratings.'
  } finally {
    loading.value = false
  }
}

async function submitRating() {
  errorMessage.value = ''
  successMessage.value = ''
  if (!auth.currentUser) {
    errorMessage.value = 'Please sign in before rating.'
    return
  }
  if (!ratingComplete.value) {
    errorMessage.value = 'Please rate all three categories from 1 to 5.'
    return
  }
  saving.value = true
  try {
    const token = await auth.currentUser.getIdToken()
    const response = await fetch(`${baseUrl}/designRatings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        designId: activeDesign.value.id,
        design: designRating.value,
        applicability: applicabilityRating.value,
        creativity: creativityRating.value,
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Unable to save rating.')
    await loadRatings()
    successMessage.value = 'Your rating has been saved. Community averages are updated.'
  } catch (error) {
    console.error(error)
    errorMessage.value = error.message || 'Unable to save rating.'
  } finally {
    saving.value = false
  }
}

function goToLogin() {
  router.push({ name: 'login', query: { redirect: '/design-challenge' } })
}

onMounted(loadRatings)
</script>

<template>
  <div>
    <AppNavbar />
    <main class="rating-page">
      <section class="challenge-header">
        <div class="container">
          <p class="eyebrow">GREEN MELBOURNE DESIGN CHALLENGE</p>
          <h1>Community Design Ratings</h1>
          <p class="intro">Explore four illustrative urban greening concepts and share your rating.</p>
        </div>
      </section>

      <div class="container design-content">
        <nav class="design-selector" aria-label="Select a design">
          <button
            v-for="(item, i) in designs"
            :key="item.id"
            type="button"
            class="design-tab"
            :class="{ active: i === index }"
            :aria-current="i === index ? 'true' : undefined"
            @click="selectDesign(i)"
          >{{ i + 1 }}. {{ item.name }}</button>
        </nav>

        <section class="design-summary" aria-labelledby="design-name">
          <div class="design-photo">
            <img :src="activeDesign.image" :alt="activeDesign.photoAlt" loading="lazy" />
          </div>
          <div class="design-details">
            <p class="section-label">FINALIST CONCEPT {{ index + 1 }} OF {{ designs.length }}</p>
            <h2 id="design-name">{{ activeDesign.name }}</h2>
            <p class="design-category">{{ activeDesign.category }}</p>
            <p>{{ activeDesign.description }}</p>
            <p class="photo-note">Representative photography only — not an official design rendering or confirmed project.</p>
          </div>
        </section>

        <p v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</p>
        <p v-if="successMessage" class="alert alert-success" role="status">{{ successMessage }}</p>
        <p v-if="loading" role="status">Refreshing community ratings...</p>

        <section class="public-rating-card" aria-labelledby="public-heading">
          <div>
            <p class="section-label">COMMUNITY SCORE</p>
            <h2 id="public-heading">Public Rating</h2>
            <p class="rating-description">Average of ratings submitted by signed-in community members for this design.</p>
            <p class="rating-description">{{ score.count }} {{ score.count === 1 ? 'rating' : 'ratings' }} received.</p>
          </div>
          <div class="public-score">
            <div class="score-line"><strong>{{ score.overall.toFixed(1) }} / 5</strong></div>
            <div class="public-stars">
              <span v-for="star in 5" :key="star" class="public-star" :class="{ filled: score.overall >= star - 0.5 }" aria-hidden="true">★</span>
              <span class="visually-hidden">Community average {{ score.overall.toFixed(1) }} out of 5</span>
            </div>
          </div>
        </section>

        <section v-if="score.count" class="average-grid" aria-label="Average category ratings">
          <article class="average-card"><span>Design</span><strong>{{ score.design.toFixed(1) }}</strong></article>
          <article class="average-card"><span>Applicability</span><strong>{{ score.applicability.toFixed(1) }}</strong></article>
          <article class="average-card"><span>Creativity</span><strong>{{ score.creativity.toFixed(1) }}</strong></article>
        </section>

        <section class="your-rating-card" aria-labelledby="own-rating-heading">
          <div class="rating-heading">
            <div>
              <p class="section-label">HAVE YOUR SAY</p>
              <h2 id="own-rating-heading">{{ existingRating ? 'Update Your Rating' : 'Your Rating' }}</h2>
            </div>
            <span v-if="isAuthenticated" class="signed-in-badge">Signed in</span>
          </div>
          <p class="rating-description">Choose a score from 1 to 5 for each category. You can update your rating later.</p>
          <div v-for="item in [
            { id: 'design', label: 'Design', description: 'Appearance and overall design quality', value: designRating },
            { id: 'applicability', label: 'Applicability', description: 'Suitability for Melbourne', value: applicabilityRating },
            { id: 'creativity', label: 'Creativity', description: 'Originality of the proposal', value: creativityRating },
          ]" :key="item.id" class="rating-row">
            <div>
              <h3>{{ item.label }}</h3>
              <p>{{ item.description }}</p>
            </div>
            <div class="interactive-stars" role="group" :aria-label="`${item.label} score`">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="star-button"
                :class="{ selected: star <= item.value }"
                :aria-label="`${item.label}: ${star} out of 5`"
                :aria-pressed="star === item.value"
                @click="item.id === 'design' ? designRating = star : item.id === 'applicability' ? applicabilityRating = star : creativityRating = star"
              >★</button>
            </div>
          </div>
          <div class="rating-actions">
            <button v-if="!isAuthenticated" type="button" class="btn login-btn" @click="goToLogin">Sign In to Rate</button>
            <button v-else type="button" class="btn submit-btn" :disabled="!ratingComplete || saving || loading" @click="submitRating">
              {{ saving ? 'Saving...' : existingRating ? 'Update Rating' : 'Submit Rating' }}
            </button>
          </div>
        </section>

        <section class="next-design">
          <div>
            <p class="section-label">DESIGN CHALLENGE</p>
            <h2>Explore another concept</h2>
          </div>
          <button type="button" class="next-button" @click="selectDesign(index + 1)" :aria-label="`Next design after ${activeDesign.name}`">→</button>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>

.rating-page {

  min-height: calc(100vh - 79px);



  padding-bottom: 90px;



  background-color: #f7f9f5;

}





/* =================================

   HEADER

================================= */



.challenge-header {

  padding:

    65px 0

    45px;



  text-align: center;



  background-color: #edf4e9;



  border-bottom:

    1px solid #dce7d8;

}





.challenge-header .container {

  max-width: 900px;

}





.eyebrow,

.section-label {

  margin-bottom: 9px;



  color: #315c39;



  font-size: 0.82rem;



  font-weight: 700;



  letter-spacing: 0.14em;

}





.challenge-header h1 {

  margin-bottom: 14px;



  color: #203b29;



  font-family:

    Georgia,

    "Times New Roman",

    serif;



  font-size: 2.7rem;



  font-weight: 700;

}





.intro {

  margin: 0;



  color: #435449;



  font-size: 1.05rem;

}





/* =================================

   GALLERY

================================= */



.design-gallery {

  display: grid;



  margin-top: 45px;



  grid-template-columns:

    1.25fr 1fr;



  gap: 20px;

}





.design-image {

  position: relative;



  min-height: 330px;



  overflow: hidden;



  border-radius: 18px;



  background-size: cover;



  background-position: center;



  box-shadow:

    0 8px 24px

    rgba(35, 65, 42, 0.1);

}





.image-one {

  background:

    linear-gradient(

      135deg,

      rgba(48, 91, 52, 0.25),

      rgba(20, 45, 25, 0.45)

    ),

    linear-gradient(

      135deg,

      #8cac75,

      #365e36

    );

}





.image-two {

  background:

    linear-gradient(

      135deg,

      rgba(80, 110, 66, 0.2),

      rgba(26, 55, 31, 0.45)

    ),

    linear-gradient(

      135deg,

      #b5c99f,

      #537b4d

    );

}





.image-overlay {

  position: absolute;



  right: 0;

  bottom: 0;

  left: 0;



  padding:

    25px

    28px;



  color: white;



  background:

    linear-gradient(

      transparent,

      rgba(18, 39, 22, 0.75)

    );



  font-size: 1.15rem;



  font-weight: 700;

}





/* =================================

   CATEGORY

================================= */



.category-row {

  display: flex;



  margin:

    25px 0;



  align-items: center;



  flex-wrap: wrap;



  gap: 10px;

}





.category-label {

  margin-right: 4px;



  color: #435449;



  font-weight: 700;

}





.category-badge {

  padding:

    7px

    13px;



  color: #3f6939;



  background-color: #e7f0e2;



  border-radius: 999px;



  font-size: 0.85rem;



  font-weight: 700;

}





/* =================================

   PUBLIC RATING

================================= */



.public-rating-card {

  display: flex;



  padding: 32px;



  align-items: center;



  justify-content: space-between;



  gap: 30px;



  background-color: white;



  border:

    1px solid #dfe8dc;



  border-radius: 16px;



  box-shadow:

    0 7px 20px

    rgba(35, 65, 42, 0.06);

}





.public-rating-card h2,

.your-rating-card h2,

.next-design h2 {

  margin: 0;



  color: #263f2d;



  font-family:

    Georgia,

    "Times New Roman",

    serif;



  font-weight: 700;

}





.rating-description {

  max-width: 520px;



  margin:

    10px 0

    0;



  color: #435449;

}





.public-score {

  min-width: 240px;



  text-align: right;

}





.public-stars {

  margin-bottom: 6px;



  white-space: nowrap;

}





.public-star {

  color: #d5ddd2;



  font-size: 2rem;

}





.public-star.filled {

  color: #d39b24;

}





.score-line strong {

  color: #263f2d;



  font-size: 1.35rem;

}





.score-line span {

  margin-left: 6px;



  color: #435449;

}





/* =================================

   CATEGORY AVERAGES

================================= */



.average-grid {

  display: grid;



  margin-top: 18px;



  grid-template-columns:

    repeat(3, 1fr);



  gap: 14px;

}





.average-card {

  display: flex;



  padding:

    18px

    20px;



  align-items: center;



  justify-content: space-between;



  background-color: #edf4e9;



  border-radius: 12px;

}





.average-card span {

  color: #536359;



  font-weight: 600;

}





.average-card strong {

  color: #35682d;



  font-size: 1.3rem;

}





/* =================================

   YOUR RATING

================================= */



.your-rating-card {

  margin-top: 28px;



  padding: 34px;



  background-color: white;



  border:

    1px solid #dfe8dc;



  border-radius: 16px;



  box-shadow:

    0 7px 20px

    rgba(35, 65, 42, 0.06);

}





.rating-heading {

  display: flex;



  margin-bottom: 12px;



  align-items: center;



  justify-content: space-between;



  gap: 20px;

}





.signed-in-badge {

  padding:

    7px

    13px;



  color: #35682d;



  background-color: #e8f1e4;



  border-radius: 999px;



  font-size: 0.82rem;



  font-weight: 700;

}





.rating-row {

  display: grid;



  padding:

    25px 0;



  align-items: center;



  grid-template-columns:

    minmax(0, 1fr)

    auto;



  gap: 30px;



  border-bottom:

    1px solid #e6ece3;

}





.rating-row h3 {

  margin-bottom: 6px;



  color: #304737;



  font-size: 1.05rem;



  font-weight: 700;

}





.rating-row p {

  max-width: 580px;



  margin: 0;



  color: #435449;



  font-size: 0.92rem;

}





/* =================================

   INTERACTIVE STARS

================================= */



.interactive-stars {

  display: flex;



  gap: 3px;



  white-space: nowrap;

}





.star-button {

  padding: 2px;



  border: 0;



  color: #d3dbd0;



  background: transparent;



  font-size: 2rem;



  line-height: 1;



  cursor: pointer;



  transition:

    color 0.15s ease,

    transform 0.15s ease;

}





.star-button:hover,

.star-button:focus {

  outline: 2px solid #315c39;



  transform: scale(1.08);

}





.star-button.selected {

  color: #d39b24;

}





/* =================================

   ACTIONS

================================= */



.rating-actions {

  display: flex;



  margin-top: 28px;



  justify-content: flex-end;

}





.submit-btn,

.login-btn {

  padding:

    10px

    22px;



  color: white;



  background-color: #315c39;



  border:

    1px solid #4f7c43;



  font-weight: 700;

}





.submit-btn:hover,

.login-btn:hover {

  color: white;



  background-color: #3c6334;



  border-color: #3c6334;

}





.submit-btn:disabled {

  color: #6d776e;



  background-color: #dce3d9;



  border-color: #dce3d9;



  cursor: not-allowed;

}





.login-message {

  width: 100%;



  padding: 20px;



  background-color: #f2f6ef;



  border-radius: 10px;

}





.login-message p {

  margin-bottom: 12px;



  color: #435449;

}





/* =================================

   NEXT DESIGN

================================= */



.next-design {

  display: flex;



  margin-top: 28px;



  padding:

    28px

    32px;



  align-items: center;



  justify-content: space-between;



  gap: 20px;



  background-color: #eaf2e6;



  border-radius: 16px;

}





.next-button {

  width: 54px;

  height: 54px;



  border:

    1px solid #4f7c43;



  border-radius: 50%;



  color: #315c39;



  background-color: transparent;



  font-size: 1.7rem;



  line-height: 1;



  transition:

    color 0.2s ease,

    background-color 0.2s ease;

}





.next-button:hover {

  color: white;



  background-color: #315c39;

}





/* =================================

   RESPONSIVE

================================= */



@media (max-width: 767.98px) {



  .challenge-header {

    padding:

      45px 0

      35px;

  }





  .challenge-header h1 {

    font-size: 2rem;

  }





  .design-gallery {

    grid-template-columns: 1fr;

  }





  .design-image {

    min-height: 250px;

  }





  .public-rating-card {

    align-items: flex-start;



    flex-direction: column;

  }





  .public-score {

    min-width: 0;



    text-align: left;

  }





  .average-grid {

    grid-template-columns: 1fr;

  }





  .your-rating-card {

    padding: 24px;

  }





  .rating-row {

    grid-template-columns: 1fr;



    gap: 12px;

  }





  .rating-heading {

    align-items: flex-start;



    flex-direction: column;

  }





  .rating-actions {

    justify-content: stretch;

  }





  .submit-btn,

  .login-btn {

    width: 100%;

  }





  .next-design {

    padding: 24px;

  }

}




/* Design browsing and illustrative photography */
.design-content { max-width: 1100px; }
.design-selector { display: flex; gap: 10px; margin-top: 32px; margin-bottom: 24px; flex-wrap: wrap; }
.design-tab { border: 1px solid #79977b; background: white; color: #284e30; padding: 10px 15px; border-radius: 10px; font-weight: 600; }
.design-tab.active, .design-tab:hover { background: #315c39; color: white; }
.design-tab:focus-visible, .star-button:focus-visible, .next-button:focus-visible { outline: 3px solid #1b4f9c; outline-offset: 3px; }
.design-summary { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(260px, 1fr); background: white; border-radius: 18px; border: 1px solid #dfe8dc; overflow: hidden; margin-bottom: 24px; }
.design-photo { min-height: 280px; background: #dcead7; }
.design-photo img { display: block; width: 100%; height: 100%; min-height: 280px; object-fit: cover; }
.design-details { padding: 28px; align-self: center; color: #37483b; }
.design-details h2 { color: #203b29; font: bold 2rem Georgia, serif; }
.design-category { color: #315c39; font-weight: 700; }
.photo-note { color: #465549; font-size: .87rem; margin-top: 20px; }
.challenge-header .intro, .rating-description, .rating-row p, .score-line span, .category-label, .login-message p { color: #37483b; }
.eyebrow, .section-label { color: #315c39; }
.next-design .section-label { color: #315c39; }
.public-star { color: #68766a; }
.star-button { color: #6d776e; }
.star-button.selected { color: #966900; }
.star-button:focus-visible { transform: scale(1.08); }
.submit-btn:disabled { color: #384b3d; }
@media (max-width: 767.98px) { .design-summary { grid-template-columns: 1fr; } .design-details { padding: 20px; } }

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>