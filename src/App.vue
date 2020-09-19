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
    <creator-form :content="content" @generateReport="generateReport"></creator-form>
    <b-button size="is-medium" style="position:fixed; bottom: 50px" @click="generateReport" type="is-info" icon-left="file-pdf-outline">
      PDF
    </b-button>
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
        content: {
          paper: {},
          amounts: {}
        },
        clients: []
      }
    }
  },
  components: {
    VueHtml2pdf,
    PdfContent,
    CreatorForm
  },
  methods: {
    async generateReport(content) {
      console.log(content)
      this.content = await content
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
  margin-top: 10px;
  padding: 20px;
}
</style>
