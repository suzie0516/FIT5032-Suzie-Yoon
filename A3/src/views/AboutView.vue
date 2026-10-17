<script setup>
import AppNavbar from '../components/AppNavbar.vue'

import spiralGardenImage from '../assets/challenge/spiral-garden.png'
import geometricPondImage from '../assets/challenge/geometric-pond.png'
import wildflowerGardenImage from '../assets/challenge/wildflower-garden.png'
</script>

<template>
  <div>
    <AppNavbar />

    <main class="about-page">
      <section class="hero-section">
        <div class="container hero-grid">
          <div class="hero-copy">
            <p class="section-label">ABOUT US</p>
            <h1>Pots & Plants Melbourne</h1>
            <p class="hero-text">
              Pots & Plants Melbourne is a community-focused not-for-profit initiative
              that connects plant knowledge, neighbourhood participation and small-scale
              urban greening. Our work brings together practical action and public
              education: we help residents discover suitable plants, support greener
              local spaces and create opportunities for people to contribute to the city.
            </p>
            <p class="hero-text">
              We aim to make environmental participation clear, local and useful.
              Instead of treating sustainability as an abstract idea, we focus on
              visible outcomes: better planting choices, stronger community engagement
              and design concepts that can inform future urban improvement.
            </p>
          </div>

          <div class="hero-card">
            <img
              :src="spiralGardenImage"
              alt="Concept image of a spiral riverside garden"
            />
          </div>
        </div>
      </section>

      <section class="content-section">
        <div class="container">
          <div class="section-heading">
            <p class="section-label blue-label">WHAT WE DO</p>
            <h2>Our work combines education, participation and design</h2>
            <p>
              We organise programs that are useful for residents, visually engaging
              for visitors and practical enough to support future city-making decisions.
            </p>
          </div>

          <div class="feature-grid">
            <article class="feature-card">
              <div class="accent-dot green"></div>
              <h3>Community Design Challenge</h3>
              <p>
                Our Green Melbourne Design Challenge invites participants to propose
                greener public-space ideas. Selected finalist concepts are shared with
                the community, and winning ideas may inform future urban greening and
                public-space improvement projects.
              </p>
            </article>

            <article class="feature-card blue-card">
              <div class="accent-dot blue"></div>
              <h3>Plant Finder and Native Plant Education</h3>
              <p>
                We help users search plant information relevant to Melbourne and Victoria.
                This includes native plants, planting suitability and practical growing
                information so that residents can make better-informed choices.
              </p>
            </article>

            <article class="feature-card">
              <div class="accent-dot green"></div>
              <h3>Volunteer and Community Action</h3>
              <p>
                We support volunteer participation through local greening activities,
                community planting support and educational engagement. These activities
                strengthen both neighbourhood connection and environmental awareness.
              </p>
            </article>

            <article class="feature-card blue-card">
              <div class="accent-dot blue"></div>
              <h3>Green Map and Public Information</h3>
              <p>
                Our Melbourne Green Map helps visitors explore location-based green
                information in an accessible format. The goal is not only to display
                places, but to support discovery, awareness and local use.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section class="impact-section">
        <div class="container">
          <div class="section-heading">
            <p class="section-label">WHY IT MATTERS</p>
            <h2>Practical benefits, not decorative claims</h2>
          </div>

          <div class="impact-grid">
            <div class="impact-copy">
              <p>
                Good environmental communication should be concrete. It should show
                people what they can do, why it matters and how local action connects
                to broader urban improvement. Our platform therefore emphasises clarity,
                participation and relevance.
              </p>
              <p>
                The result is a website that does more than present attractive imagery.
                It offers information, invites participation and demonstrates how
                community ideas can contribute to greener urban futures.
              </p>
            </div>

            <div class="image-stack">
              <img
                :src="geometricPondImage"
                alt="Geometric pond garden concept"
              />
              <img
                :src="wildflowerGardenImage"
                alt="Wildflower garden with Melbourne skyline"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.about-page {
  min-height: calc(100vh - 75px);
  background: #f5f8f3;
}

.hero-section {
  padding: 72px 0 56px;
  background: linear-gradient(180deg, #f5f8f3 0%, #eef5ee 100%);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: 36px;
  align-items: center;
}

.section-label {
  margin-bottom: 10px;
  color: #4f7c43;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.blue-label {
  color: #2b6d8f;
}

.hero-copy h1 {
  margin-bottom: 16px;
  color: #1f3d2b;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 3rem;
  font-weight: 700;
}

.hero-text {
  margin-bottom: 16px;
  color: #5f6d63;
  line-height: 1.8;
  font-size: 1.02rem;
}

.hero-card img,
.image-stack img {
  width: 100%;
  display: block;
  border-radius: 18px;
  object-fit: cover;
  box-shadow: 0 12px 28px rgba(32, 63, 45, 0.12);
}

.content-section,
.impact-section {
  padding: 64px 0;
}

.section-heading {
  max-width: 820px;
  margin: 0 auto 32px;
  text-align: center;
}

.section-heading h2 {
  margin-bottom: 12px;
  color: #203b29;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 2.2rem;
  font-weight: 700;
}

.section-heading p {
  margin: 0;
  color: #667269;
  line-height: 1.8;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.feature-card {
  padding: 28px;
  background: #ffffff;
  border: 1px solid #dce6d9;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(35, 66, 45, 0.06);
}

.blue-card {
  background: linear-gradient(180deg, #ffffff 0%, #f3f8fb 100%);
  border-color: #d8e6ee;
}

.feature-card h3 {
  margin: 0 0 12px;
  color: #24402d;
  font-size: 1.3rem;
  font-weight: 700;
}

.feature-card p {
  margin: 0;
  color: #667269;
  line-height: 1.8;
}

.accent-dot {
  width: 14px;
  height: 14px;
  margin-bottom: 14px;
  border-radius: 50%;
}

.accent-dot.green {
  background: #4f7c43;
}

.accent-dot.blue {
  background: #2b6d8f;
}

.impact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: start;
}

.impact-copy {
  padding: 30px;
  background: #ffffff;
  border: 1px solid #dfe8dc;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(35, 66, 45, 0.06);
}

.impact-copy p {
  margin: 0 0 14px;
  color: #5f6d63;
  line-height: 1.9;
}

.image-stack {
  display: grid;
  gap: 18px;
}

@media (max-width: 991px) {
  .hero-grid,
  .impact-grid,
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .hero-copy h1 {
    font-size: 2.4rem;
  }
}

@media (max-width: 576px) {
  .hero-section,
  .content-section,
  .impact-section {
    padding: 48px 0;
  }

  .hero-copy h1 {
    font-size: 2rem;
  }

  .section-heading h2 {
    font-size: 1.8rem;
  }

  .feature-card,
  .impact-copy {
    padding: 22px;
  }
}
</style>