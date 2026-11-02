<script setup>
import wedding from '../data/wedding'
</script>

<template>
  <section id="couple" class="couple-section wedding-section">
    <div class="section-inner couple-editorial">
      <div class="couple-editorial-heading reveal">
        <span class="section-kicker" lang="ta">மணமக்கள் · TWO SOULS, ONE LOVE</span>
        <h2>From friendship,<br /><i>with all our hearts</i></h2>
        <span class="ornament-rule" aria-hidden="true">✦ &nbsp; ♥ &nbsp; ✦</span>
        <p>From strangers to best friends, from best friends to forever. With our families beside us, we can’t wait to begin this next chapter together.</p>
      </div>

      <article class="editorial-portrait editorial-portrait--bride reveal">
        <div v-tilt class="portrait-frame portrait-frame--bride">
          <img :src="wedding.bridePhoto" :alt="`${wedding.brideName}, the bride`" fetchpriority="high" />
          <span class="portrait-caption">The bride</span>
        </div>
        <div class="editorial-name">
          <span class="section-kicker">Daughter of {{ wedding.brideParents }}</span>
          <h3>{{ wedding.brideName }}</h3>
        </div>
      </article>

      <div class="couple-floral-seal reveal" aria-hidden="true">
        <span>❁</span>
        <i>♥</i>
        <span>❁</span>
      </div>

      <article class="editorial-portrait editorial-portrait--groom reveal">
        <div v-tilt class="portrait-frame portrait-frame--groom">
          <img :src="wedding.groomPhoto" :alt="`${wedding.groomName}, the groom`" fetchpriority="high" />
          <span class="portrait-caption">The groom</span>
        </div>
        <div class="editorial-name">
          <span class="section-kicker">Son of {{ wedding.groomParents }}</span>
          <h3>{{ wedding.groomName }}</h3>
        </div>
      </article>

      <blockquote class="couple-quote reveal">
        “We found our person in each other—and now forever feels like home.”
      </blockquote>
    </div>
  </section>
</template>
