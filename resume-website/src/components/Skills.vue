<template>
  <section id="skills" class="py-5 bg-light">
    <div class="container">
      <h2 class="text-center mb-4">Skills</h2>
      <div class="row">
        <div class="col-md-4 mb-3" v-for="skill in skills" :key="skill.name">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ skill.name }}</h5>
              <p class="card-text">{{ skill.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Skills',
  data() {
    return {
      skills: [
        { name: 'HTML', description: 'Hypertext Markup Language' },
        { name: 'CSS', description: 'Cascading Style Sheets' },
        { name: 'JavaScript', description: 'Programming Language' },
        { name: 'Vue.js', description: 'JavaScript Framework' },
        { name: 'Bootstrap', description: 'CSS Framework' },
        { name: 'Git', description: 'Version Control' },
      ]
    }
  }
}
</script>

<style scoped>
</style>
