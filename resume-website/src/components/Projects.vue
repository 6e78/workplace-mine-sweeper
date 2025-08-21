<template>
  <section id="projects" class="py-5 bg-light">
    <div class="container">
      <h2 class="text-center mb-4">Projects</h2>
      <div class="row">
        <div class="col-md-4 mb-3" v-for="project in projects" :key="project.name">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ project.name }}</h5>
              <p class="card-text">{{ project.description }}</p>
              <a :href="project.link" class="btn btn-primary" target="_blank">View Project</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Projects',
  data() {
    return {
      projects: [
        {
          name: 'Project One',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          link: '#'
        },
        {
          name: 'Project Two',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          link: '#'
        },
        {
          name: 'Project Three',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          link: '#'
        }
      ]
    }
  }
}
</script>

<style scoped>
</style>
