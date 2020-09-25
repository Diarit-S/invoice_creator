<template>
  <div id="app">
    <img src="./assets/drita_infos.jpg" ref="imaaage" alt="">
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
    <img src="@/assets/drita_infos.jpg" style="visibility: hidden" ref="test"/>
    </div>
  </div>
</template>

<script>
import PdfContent from './components/PdfContent'
import CreatorForm from './components/CreatorForm'

import { jsPDF } from "jspdf";

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
      },
      ok: 'testttt'
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
    },
    hydrateTable(content) {
      this.content = content
      const element = this.$refs.elementToExport.$el
      element.style.display === 'block' ? element.style.display = 'none' : element.style.display = 'block'
    }
  },
  computed: {
  },
  mounted() {
    const doc = new jsPDF()
    doc.text("Hello world!", 10, 10)
    doc.addImage(this.$refs.imaaage, "JPEG", 10, 10, 100, 50)
    doc.save("testaa.pdf")
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
