<template>
  <section id="education" class="py-5">
    <div class="container">
      <h2 class="text-center mb-4">Education</h2>
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card mb-3" v-for="edu in education" :key="edu.degree">
            <div class="card-body">
              <h5 class="card-title">{{ edu.degree }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ edu.school }} | {{ edu.period }}</h6>
              <p class="card-text">{{ edu.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Education',
  data() {
    return {
      education: [
        {
          degree: 'Master of Science in Computer Science',
          school: 'University of Example',
          period: '2020 - 2022',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed ante justo. Integer laoreet libero id mauris eleifend, sed eleifend ex fringilla.'
        },
        {
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of Example',
          period: '2016 - 2020',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed ante justo. Integer laoreet libero id mauris eleifend, sed eleifend ex fringilla.'
        }
      ]
    }
  }
}
</script>

<style scoped>
</style>
