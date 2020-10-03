<template lang="pug">
  div.document-selector
    .document-selector__document(
      v-for="document in documents" 
      :key="document._id"
      @click="editDocument(document._id)"
    )
      span {{ document.documentNumber }}
      span {{ document.clientId }}
      span {{ creationDate(document.creationDate) }}
</template>

<script>
import moment from 'moment'

export default {
  name: 'DocumentSelector',
  data() {
    return {
      documents: []
    }
  },
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    creationDate() {
      return creationDate => moment(creationDate).format('L')
    },
  },
  methods: {
    async getAllDocumentOfType() {
      const res = await this.$http.get(`/paper/getPapersOfType/${this.$route.params.type}`)
      this.documents = res.data
    },
    async editDocument(documentId) {
      const {data} = await this.$http.get(`/paper/getPaperById/${documentId}`)
      data.creationDate = new Date(moment(data.creationDate))
      this.content.currentPaper = data
      this.$router.push(`/`)
    }
  },
  mounted() {
    this.getAllDocumentOfType()
  }
}
</script>

<style lang="scss" scoped>

.document-selector {
  padding: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__document {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    transition: box-shadow 0.15s ease-in-out;
    cursor: pointer;

    &:hover {
      box-shadow: 3px 3px 8px 0 rgba(0, 0, 0, 0.15);
    }
  }
}

</style>