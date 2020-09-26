<template>
  <div id="app">
    <creator-form 
      :content="content" 
      @generatePdf="generatePdf"
    ></creator-form>
    <img src="@/assets/drita_infos.jpg" style="visibility: hidden" ref="test"/>
  </div>
</template>

<script>
import CreatorForm from './components/CreatorForm'

export default {
  name: 'App',
  data() {
    return {
      content: {
        currentPaper: {
          type: 'quote',
          fields: [
            {unit: 'm²'}
          ],
          TVAPercent: 10,
          documentNumber: 0,
          clientId: '5f5e301e972a0900171c8fd2',
          creationDate: new Date()
        },
        clients: []
      },
    }
  },
  components: {
    CreatorForm
  },
  methods: {
    generatePdf() {
      console.log(this.content)
      // const doc = new jsPDF()
      // doc.text("Hello world!", 10, 10)
      // doc.addImage(this.$refs.imaaage, "JPEG", 10, 10, 100, 50)
      // doc.save("testaa.pdf")
    }
  },
  computed: {
    currentClient() {
      return this.content.clients.find(client => {
        return client._id === this.content.content.paper.clientId
      }) || {}
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
