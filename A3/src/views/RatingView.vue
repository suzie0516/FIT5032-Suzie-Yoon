<script setup>

import { computed, onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'



import AppNavbar from '../components/AppNavbar.vue'

import {

  currentUser,

  isAuthenticated,

} from '../utils/auth'





const router = useRouter()



const DESIGN_ID = 'spiral-garden-1'

const STORAGE_KEY = 'designRatings'





// --------------------------------

// User rating

// --------------------------------

const designRating = ref(0)

const applicabilityRating = ref(0)

const creativityRating = ref(0)



const hoverDesign = ref(0)

const hoverApplicability = ref(0)

const hoverCreativity = ref(0)



const ratings = ref([])



const successMessage = ref('')

const errorMessage = ref('')





// --------------------------------

// Load ratings

// --------------------------------

const loadRatings = () => {

  try {

    const storedRatings =

      JSON.parse(

        localStorage.getItem(STORAGE_KEY),

      )



    ratings.value =

      Array.isArray(storedRatings)

        ? storedRatings

        : []

  } catch {

    ratings.value = []

  }

}





// --------------------------------

// Ratings for this design

// --------------------------------

const designRatings = computed(() => {

  return ratings.value.filter(

    (rating) =>

      rating.designId === DESIGN_ID,

  )

})





// --------------------------------

// Number of ratings

// --------------------------------

const ratingCount = computed(() => {

  return designRatings.value.length

})





// --------------------------------

// Average category ratings

// --------------------------------

function calculateAverage(items, category) {
  const validRatings = items
    .map(rating => rating?.[category])
    .filter(value =>
      value !== null &&
      value !== undefined &&
      typeof value !== 'boolean' &&
      !(typeof value === 'string' && value.trim() === '')
    )
    .map(value => Number(value))
    .filter(value => Number.isFinite(value) && value >= 1 && value <= 5)

  if (validRatings.length === 0) return 0
  return validRatings.reduce((sum, value) => sum + value, 0) / validRatings.length
}

const averageDesign = computed(() => calculateAverage(designRatings.value, 'design'))
const averageApplicability = computed(() => calculateAverage(designRatings.value, 'applicability'))
const averageCreativity = computed(() => calculateAverage(designRatings.value, 'creativity'))

// --------------------------------
// Overall public rating
// --------------------------------
const publicRating = computed(() => {

  if (ratingCount.value === 0) {

    return 0

  }



  return (

    averageDesign.value +

    averageApplicability.value +

    averageCreativity.value

  ) / 3

})





const formattedPublicRating = computed(() => {

  return publicRating.value.toFixed(1)

})





// --------------------------------

// Display stars for public average

// --------------------------------

const publicStarFilled = (star) => {

  return publicRating.value >=

    star - 0.5

}





// --------------------------------

// Load existing rating for user

// --------------------------------

const loadCurrentUserRating = () => {

  if (!currentUser.value) {

    return

  }



  const existingRating =

    ratings.value.find(

      (rating) =>

        rating.designId === DESIGN_ID &&

        rating.userId ===

          currentUser.value.id,

    )



  if (!existingRating) {

    return

  }



  designRating.value =

    existingRating.design



  applicabilityRating.value =

    existingRating.applicability



  creativityRating.value =

    existingRating.creativity

}





// --------------------------------

// Validation

// --------------------------------

const ratingComplete = computed(() => {

  return (

    designRating.value >= 1 &&

    designRating.value <= 5 &&

    applicabilityRating.value >= 1 &&

    applicabilityRating.value <= 5 &&

    creativityRating.value >= 1 &&

    creativityRating.value <= 5

  )

})





// --------------------------------

// Submit rating

// --------------------------------

const submitRating = () => {

  successMessage.value = ''

  errorMessage.value = ''



  if (!isAuthenticated.value) {

    errorMessage.value =

      'Please sign in before submitting a rating.'



    return

  }



  if (!ratingComplete.value) {

    errorMessage.value =

      'Please rate Design, Applicability and Creativity before submitting.'



    return

  }



  const ratingRecord = {

    designId: DESIGN_ID,



    userId:

      currentUser.value.id,



    userEmail:

      currentUser.value.email,



    design:

      designRating.value,



    applicability:

      applicabilityRating.value,



    creativity:

      creativityRating.value,



    updatedAt:

      new Date().toISOString(),

  }





  const existingIndex =

    ratings.value.findIndex(

      (rating) =>

        rating.designId === DESIGN_ID &&

        rating.userId ===

          currentUser.value.id,

    )





  if (existingIndex >= 0) {

    ratings.value[existingIndex] =

      ratingRecord



    successMessage.value =

      'Your rating has been updated successfully.'

  } else {

    ratings.value.push(

      ratingRecord,

    )



    successMessage.value =

      'Thank you. Your rating has been submitted successfully.'

  }





  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(ratings.value),

  )

}





// --------------------------------

// Sign in

// --------------------------------

const goToLogin = () => {

  router.push({

    name: 'login',



    query: {

      redirect: '/design-challenge',

    },

  })

}





// --------------------------------

// Star helpers

// --------------------------------

const setDesignRating = (star) => {

  designRating.value = star

}





const setApplicabilityRating = (star) => {

  applicabilityRating.value = star

}





const setCreativityRating = (star) => {

  creativityRating.value = star

}





// --------------------------------

// Initial page load

// --------------------------------

onMounted(() => {

  loadRatings()



  loadCurrentUserRating()

})

</script>





<template>

  <div>

    <AppNavbar />



    <main class="rating-page">



      <!-- =================================

           PAGE HEADER

      ================================== -->

      <section class="challenge-header">

        <div class="container">

          <p class="eyebrow">

            GREEN MELBOURNE DESIGN CHALLENGE

          </p>



          <h1>

            Finalist Design 1:

            Spiral Garden

          </h1>



          <p class="intro">

            Explore the finalist concept and

            contribute your community rating.

          </p>

        </div>

      </section>





      <div class="container">



        <!-- =================================

             DESIGN IMAGES

        ================================== -->

        <section class="design-gallery">



          <div class="design-image image-one">

            <div class="image-overlay">

              <span>

                Spiral Garden

              </span>

            </div>

          </div>



          <div class="design-image image-two">

            <div class="image-overlay">

              <span>

                Native Planting Concept

              </span>

            </div>

          </div>



        </section>





        <!-- =================================

             CATEGORY TAGS

        ================================== -->

        <section class="category-row">

          <span class="category-label">

            Category

          </span>



          <span class="category-badge">

            Pollinator

          </span>



          <span class="category-badge">

            Tree Planting

          </span>

        </section>





        <!-- =================================

             PUBLIC RATING

        ================================== -->

        <section class="public-rating-card">



          <div>

            <p class="section-label">

              COMMUNITY SCORE

            </p>



            <h2>

              Public Rating

            </h2>



            <p class="rating-description">

              Aggregated rating from community

              members for this finalist design.

            </p>

          </div>





          <div class="public-score">



            <div

              class="public-stars"

              aria-label="Public rating"

            >

              <span

                v-for="star in 5"

                :key="star"

                class="public-star"

                :class="{

                  filled:

                    publicStarFilled(star),

                }"

              >

                ★

              </span>

            </div>



            <div class="score-line">

              <strong>

                {{ formattedPublicRating }} / 5

              </strong>



              <span>

                ({{ ratingCount }}

                {{

                  ratingCount === 1

                    ? 'rating'

                    : 'ratings'

                }})

              </span>

            </div>



          </div>



        </section>





        <!-- =================================

             CATEGORY AVERAGES

        ================================== -->

        <section

          v-if="ratingCount > 0"

          class="average-grid"

        >

          <article class="average-card">

            <span>Design</span>



            <strong>

              {{ averageDesign.toFixed(1) }}

            </strong>

          </article>



          <article class="average-card">

            <span>Applicability</span>



            <strong>

              {{

                averageApplicability.toFixed(1)

              }}

            </strong>

          </article>



          <article class="average-card">

            <span>Creativity</span>



            <strong>

              {{

                averageCreativity.toFixed(1)

              }}

            </strong>

          </article>

        </section>





        <!-- =================================

             USER RATING

        ================================== -->

        <section class="your-rating-card">



          <div class="rating-heading">

            <div>

              <p class="section-label">

                HAVE YOUR SAY

              </p>



              <h2>

                Your Rating

              </h2>

            </div>



            <span

              v-if="isAuthenticated"

              class="signed-in-badge"

            >

              Signed in

            </span>

          </div>





          <!-- ---------------------------------

               DESIGN

          ---------------------------------- -->

          <div class="rating-row">



            <div>

              <h3>

                Design

              </h3>



              <p>

                Consider the overall visual

                design and quality of the concept.

              </p>

            </div>



            <div

              class="interactive-stars"

              role="radiogroup"

              aria-label="Design rating"

              @mouseleave="hoverDesign = 0"

            >

              <button

                v-for="star in 5"

                :key="star"

                type="button"

                class="star-button"

                :class="{

                  selected:

                    star <=

                    (

                      hoverDesign ||

                      designRating

                    ),

                }"

                :aria-label="

                  `Rate Design ${star} out of 5`

                "

                @mouseenter="

                  hoverDesign = star

                "

                @focus="

                  hoverDesign = star

                "

                @blur="

                  hoverDesign = 0

                "

                @click="

                  setDesignRating(star)

                "

              >

                ★

              </button>

            </div>



          </div>





          <!-- ---------------------------------

               APPLICABILITY

          ---------------------------------- -->

          <div class="rating-row">



            <div>

              <h3>

                Applicability

              </h3>



              <p>

                Consider how practical the

                concept would be for Melbourne.

              </p>

            </div>



            <div

              class="interactive-stars"

              role="radiogroup"

              aria-label="Applicability rating"

              @mouseleave="

                hoverApplicability = 0

              "

            >

              <button

                v-for="star in 5"

                :key="star"

                type="button"

                class="star-button"

                :class="{

                  selected:

                    star <=

                    (

                      hoverApplicability ||

                      applicabilityRating

                    ),

                }"

                :aria-label="

                  `Rate Applicability ${star} out of 5`

                "

                @mouseenter="

                  hoverApplicability = star

                "

                @focus="

                  hoverApplicability = star

                "

                @blur="

                  hoverApplicability = 0

                "

                @click="

                  setApplicabilityRating(star)

                "

              >

                ★

              </button>

            </div>



          </div>





          <!-- ---------------------------------

               CREATIVITY

          ---------------------------------- -->

          <div class="rating-row">



            <div>

              <h3>

                Creativity

              </h3>



              <p>

                Consider originality and the

                creative approach to urban

                greening.

              </p>

            </div>



            <div

              class="interactive-stars"

              role="radiogroup"

              aria-label="Creativity rating"

              @mouseleave="

                hoverCreativity = 0

              "

            >

              <button

                v-for="star in 5"

                :key="star"

                type="button"

                class="star-button"

                :class="{

                  selected:

                    star <=

                    (

                      hoverCreativity ||

                      creativityRating

                    ),

                }"

                :aria-label="

                  `Rate Creativity ${star} out of 5`

                "

                @mouseenter="

                  hoverCreativity = star

                "

                @focus="

                  hoverCreativity = star

                "

                @blur="

                  hoverCreativity = 0

                "

                @click="

                  setCreativityRating(star)

                "

              >

                ★

              </button>

            </div>



          </div>





          <!-- =================================

               MESSAGES

          ================================== -->

          <div

            v-if="errorMessage"

            class="alert alert-danger mt-4"

            role="alert"

          >

            {{ errorMessage }}

          </div>





          <div

            v-if="successMessage"

            class="alert alert-success mt-4"

            role="status"

          >

            {{ successMessage }}

          </div>





          <!-- =================================

               ACTIONS

          ================================== -->

          <div class="rating-actions">



            <div

              v-if="!isAuthenticated"

              class="login-message"

            >

              <p>

                You can view the public rating

                without an account. Sign in to

                submit your own rating.

              </p>



              <button

                type="button"

                class="btn login-btn"

                @click="goToLogin"

              >

                Sign In to Rate

              </button>

            </div>





            <button

              v-else

              type="button"

              class="btn submit-btn"

              :disabled="!ratingComplete"

              @click="submitRating"

            >

              Submit Rating

            </button>



          </div>



        </section>





        <!-- =================================

             NEXT DESIGN

        ================================== -->

        <section class="next-design">

          <div>

            <p class="section-label">

              DESIGN CHALLENGE

            </p>



            <h2>

              Explore the next finalist

            </h2>

          </div>



          <button

            type="button"

            class="next-button"

            aria-label="Next finalist design"

          >

            →

          </button>

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



</style>