<script setup>
import AppNavbar from '../components/AppNavbar.vue'

import wildflowerGardenImage from '../assets/challenge/wildflower-garden.png'
import communityGardenImage from '../assets/challenge/community-garden.png'
</script>

<template>
  <div>
    <AppNavbar />

    <main class="programs-page">
      <section class="programs-hero">
        <div class="container hero-content">
          <p class="section-label">OUR PROGRAMS</p>
          <h1>Programs that connect people, plants and place</h1>
          <p class="intro-text">
            Our programs are designed to be practical, community-oriented and locally
            relevant. Each one supports a different aspect of urban greening:
            participation, public knowledge, design thinking and environmental action.
          </p>
        </div>
      </section>

      <section class="programs-grid-section">
        <div class="container">
          <div class="programs-grid">
            <article class="program-card">
              <img
                :src="communityGardenImage"
                alt="Urban community garden with public seating and planting beds"
              />
              <div class="program-body">
                <p class="card-tag">COMMUNITY DESIGN</p>
                <h2>Green Melbourne Design Challenge</h2>
                <p>
                  This program invites creative proposals for greener public spaces.
                  Finalist entries are displayed to the public, community ratings are
                  collected and strong concepts may help inform future local urban
                  greening directions.
                </p>
              </div>
            </article>

            <article class="program-card blue-accent">
              <img
                :src="wildflowerGardenImage"
                alt="Wildflower planting area with urban skyline"
              />
              <div class="program-body">
                <p class="card-tag blue-tag">PLANT EDUCATION</p>
                <h2>Plant Finder and Native Plants</h2>
                <p>
                  The Plant Finder helps users explore plants that can grow in Melbourne
                  and Victoria. It supports basic plant discovery, encourages interest in
                  native species and gives users a clearer starting point for local
                  planting decisions.
                </p>
              </div>
            </article>

            <article class="program-card">
              <div class="program-body text-only">
                <p class="card-tag">VOLUNTEER ENGAGEMENT</p>
                <h2>Community Greening and Volunteering</h2>
                <p>
                  We encourage public participation through volunteer-oriented activities
                  connected to greening, education and community care. The emphasis is on
                  meaningful local involvement rather than passive browsing.
                </p>
              </div>
            </article>

            <article class="program-card blue-accent">
              <div class="program-body text-only">
                <p class="card-tag blue-tag">DIGITAL ACCESS</p>
                <h2>Melbourne Green Map</h2>
                <p>
                  Our map interface brings together accessible location-based information.
                  By presenting green locations in a simple interactive format, the site
                  supports exploration, navigation and local awareness.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="summary-section">
        <div class="container summary-box">
          <div>
            <p class="section-label">PROGRAM OUTCOME</p>
            <h2>A small organisation can still deliver public value</h2>
            <p>
              When community participation, plant knowledge and design communication are
              brought together clearly, a website becomes more than a brochure. It
              becomes a useful civic tool: one that informs, invites and supports better
              environmental choices.
            </p>
          </div>

          <RouterLink to="/design-challenge" class="summary-button">
            Explore Design Challenge
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.programs-page {
  min-height: calc(100vh - 75px);
  background: #f5f8f3;
}

.programs-hero {
  padding: 72px 0 46px;
  background: linear-gradient(180deg, #eef5ee 0%, #f5f8f3 100%);
  text-align: center;
}

.hero-content {
  max-width: 860px;
}

.section-label {
  margin-bottom: 10px;
  color: #4f7c43;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.programs-hero h1 {
  margin-bottom: 14px;
  color: #203b29;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 2.8rem;
  font-weight: 700;
}

.intro-text {
  margin: 0 auto;
  color: #657268;
  line-height: 1.8;
  font-size: 1.03rem;
}

.programs-grid-section {
  padding: 32px 0 64px;
}

.programs-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.program-card {
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #dfe8dc;
  border-radius: 18px;
  box-shadow: 0 10px 26px rgba(34, 66, 45, 0.06);
}

.blue-accent {
  border-color: #d8e6ee;
  background: linear-gradient(180deg, #ffffff 0%, #f4f9fc 100%);
}

.program-card img {
  width: 100%;
  height: 240px;
  display: block;
  object-fit: cover;
}

.program-body {
  padding: 28px;
}

.program-body.text-only {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-tag {
  margin-bottom: 10px;
  color: #4f7c43;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.blue-tag {
  color: #2b6d8f;
}

.program-body h2 {
  margin-bottom: 12px;
  color: #223d2c;
  font-size: 1.55rem;
  font-weight: 700;
}

.program-body p {
  margin: 0;
  color: #667269;
  line-height: 1.8;
}

.summary-section {
  padding-bottom: 72px;
}

.summary-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 30px 34px;
  background: #ffffff;
  border: 1px solid #dfe8dc;
  border-left: 6px solid #2b6d8f;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(35, 66, 45, 0.06);
}

.summary-box h2 {
  margin-bottom: 10px;
  color: #203b29;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 2rem;
}

.summary-box p {
  margin: 0;
  color: #667269;
  line-height: 1.8;
}

.summary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 220px;
  padding: 14px 20px;
  border-radius: 12px;
  background: #2b6d8f;
  color: #ffffff;
  text-decoration: none;
  font-weight: 700;
}

.summary-button:hover {
  background: #245b77;
  color: #ffffff;
}

@media (max-width: 991px) {
  .programs-grid {
    grid-template-columns: 1fr;
  }

  .summary-box {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .programs-hero {
    padding: 52px 0 36px;
  }

  .programs-hero h1 {
    font-size: 2rem;
  }

  .program-body,
  .summary-box {
    padding: 22px;
  }
}
</style>