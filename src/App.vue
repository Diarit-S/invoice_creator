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
    <img src="@/assets/drita_infos.jpg" style="visibility: hidden" ref="test"/>
    </div>
  </div>
</template>

<script>
import PdfContent from './components/PdfContent'
import CreatorForm from './components/CreatorForm'

import html2pdf from 'html2pdf.js'

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
      const element = this.$refs.elementToExport.$el
      window.scrollTo(0, 0)
      element.style.display = 'block'
      await html2pdf().set({
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        image: { type: 'jpeg', quality: 1 },
      }).from(element).save()
      element.style.display = 'none'
    },
    hydrateTable(content) {
      this.content = content
      const element = this.$refs.elementToExport.$el
      element.style.display === 'block' ? element.style.display = 'none' : element.style.display = 'block'
    }
  },
  computed: {
    pdfTemplate() {
      return {
        content: [
          this.ok,
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ '*', 'auto', 100, '*' ],

              body: [
                [ 'First', 'Second', 'Third', 'The last one' ],
                [ { text: 'Value 1', fillColor: '#000111'}, 'Value 2', 'Value 3', 'Value 4' ],
                [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
              ]
            }
          }
        ]
      }
    }
  },
  mounted() {
    pdfMake.createPdf(this.pdfTemplate).open();
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
