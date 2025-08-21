<template>
  <section id="experience" class="py-5">
    <div class="container">
      <h2 class="text-center mb-4">Experience</h2>
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card mb-3" v-for="job in jobs" :key="job.title">
            <div class="card-body">
              <h5 class="card-title">{{ job.title }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ job.company }} | {{ job.period }}</h6>
              <p class="card-text">{{ job.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Experience',
  data() {
    return {
      jobs: [
        {
          title: 'Software Engineer',
          company: 'Tech Company',
          period: '2022 - Present',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed ante justo. Integer laoreet libero id mauris eleifend, sed eleifend ex fringilla.'
        },
        {
          title: 'Junior Developer',
          company: 'Another Company',
          period: '2020 - 2022',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed ante justo. Integer laoreet libero id mauris eleifend, sed eleifend ex fringilla.'
        }
      ]
    }
  }
}
</script>

<style scoped>
</style>
