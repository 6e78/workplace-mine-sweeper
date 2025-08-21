<template>
  <div>
    <NavigationBar />
    <Home />
    <About />
    <Skills />
    <Experience />
    <Projects />
    <Education />
    <Contact />
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue';
import Home from './components/Home.vue';
import About from './components/About.vue';
import Skills from './components/Skills.vue';
import Experience from './components/Experience.vue';
import Projects from './components/Projects.vue';
import Education from './components/Education.vue';
import Contact from './components/Contact.vue';

export default {
  name: 'App',
  components: {
    NavigationBar,
    Home,
    About,
    Skills,
    Experience,
    Projects,
    Education,
    Contact
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>