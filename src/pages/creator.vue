<template>
  <div id="creator">
    <creator-form 
      :content="content" 
      :amountsData="amountsData"
      @reloadClients="$emit('reloadClients')"
    ></creator-form>
  </div>
</template>

<script>
import CreatorForm from '../components/CreatorForm'

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
  padding: 30px 20px;
  min-height: 100vh;
  height: fit-content;
  background-color: #edf5ff96;
}
</style>