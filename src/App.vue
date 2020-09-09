<template>
  <div id="app">
    <div ref="container">
        <!-- @progress="onProgress($event)"
        @hasStartedGeneration="hasStartedGeneration()"
        @hasGenerated="hasGenerated($event)" -->
      <vue-html2pdf
        :show-layout="false"
        :enable-download="false"
        :preview-modal="true"
        :paginate-elements-by-height="1400"
        filename="test"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="portrait"
        pdf-content-width="800px"
        ref="html2Pdf"
      >
        <template #pdf-content>
            <!-- PDF Content Here -->
            <pdf-content :content="content"></pdf-content>
            <!-- <p>{{content.title}}</p> -->
        </template>

    </vue-html2pdf>
    <creator-form :content="content"></creator-form>
    <button @click="generateReport">Download</button>  
    </div>
  </div>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'
import PdfContent from './components/PdfContent'
import CreatorForm from './components/CreatorForm'

export default {
  name: 'App',
  data() {
    return {
      content: {
        title: 'devis'
      }
    }
  },
  components: {
    VueHtml2pdf,
    PdfContent,
    CreatorForm
  },
  methods: {
    generateReport () {
      this.$refs.html2Pdf.generatePdf()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  padding: 50px;
}
</style>
