<template>
  <div id="creator">
    <creator-form 
      :content="content" 
      :amountsData="amountsData"
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
    return {}
  },
  props: {
    content: {
      type: Object,
      required: true
    },
    amountsData: {
      type: Object,
      required: true
    }
  },
  components: {
    CreatorForm
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

<style lang="scss" scoped>

#creator {
  margin-top: 10px;
  padding: 20px;
}
</style>