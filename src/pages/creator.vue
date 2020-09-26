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
import CreatorForm from '../components/CreatorForm'

// import { jsPDF } from 'jspdf'
// import 'jspdf-autotable'

export default {
  name: 'Creator',
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
      // console.log(this.content)
      // const doc = new jsPDF()
      // doc.text("Hello world!", 10, 10)
      // doc.addImage(this.$refs.test, "JPEG", 10, 10, 100, 50)
      // doc.autoTable({
      //   head: [['<p>Name</p>', 'Email', 'Country']],
      //   body: [
      //     ['David', 'david@example.com', 'Sweden'],
      //     ['Castille', 'castille@example.com', 'Spain']
      //   ],
      // })
      // doc.save("testaa.pdf")
      // doc.html(document.body, {
      //   callback: function (doc) {
      //     doc.save();
      //   },
      //   x: 10,
      //   y: 10
      // })
    }
  },
  computed: {
    currentClient() {
      return this.content.clients.find(client => {
        return client._id === this.content.content.paper.clientId
      }) || {}
    },
    tableFields() {
      return this.content.currentPaper.fields
    }
  }
}
</script>