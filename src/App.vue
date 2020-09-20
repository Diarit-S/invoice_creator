<template>
  <div id="app">
    <div ref="container">
    <pdf-content :content="content" slot='pdf-content' ref="elementToExport"></pdf-content>
    <creator-form 
      :content="content" 
      @generateReport="generateReport"
      @hydrateTable="hydrateTable"
    ></creator-form>
    <b-button size="is-medium" style="position:fixed; bottom: 50px" @click="generateReport" type="is-info" icon-left="file-pdf-outline">
      PDF
    </b-button>

    </div>
  </div>
</template>

<script>
import PdfContent from './components/PdfContent'
import CreatorForm from './components/CreatorForm'

import html2pdf from 'html2pdf.js'

export default {
  name: 'App',
  data() {
    return {
      content: {
        content: {
          paper: {
            fields: []
          },
          amounts: {}
        },
        clients: []
      }
    }
  },
  components: {
    PdfContent,
    CreatorForm
  },
  methods: {
    async generateReport(content) {
      console.log(content)
      this.content = await content
      const element = this.$refs.elementToExport.$el
      window.scrollTo(0, 0)
      element.style.display = 'block'
      await html2pdf().set({
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }).from(element).save()
      element.style.display = 'none'
    },
    hydrateTable(content) {
      this.content = content
      const element = this.$refs.elementToExport.$el
      element.style.display === 'block' ? element.style.display = 'none' : element.style.display = 'block'
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
