<template lang="pug">
  div.document-selector

    b-table(
      :data="tableData"
      :debounce-search="500"
    )
      b-table-column(
        field="documentNumber" 
        label="Numero"
        width="100" 
        v-slot="props" 
        searchable
        sortable
      )
        | {{ props.row.documentNumber }}

      b-table-column(
        field="client" 
        label="Client"
        width="300" 
        v-slot="props" 
        searchable
      )
        | {{ props.row.client }}

      b-table-column(
        field="creationDate" 
        label="Date"
        width="397" 
        v-slot="props" 
        searchable
        sortable
        :custom-search="searchOnDate"
      )
        | {{ creationDate(props.row.creationDate) }}

      b-table-column(
        width="100" 
        v-slot="props" 
      )
        b-button.is-info(
          @click="editDocument(props.row._id)"
          size="is-small"
        ) Modifier
</template>

<script>
import moment from 'moment'

export default {
  name: 'DocumentSelector',
  data() {
    return {
      documents: [],
      documentLabels: {
        quote: 'Devis',
        invoice: 'Facture'
      },
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
      return creationDate => moment(creationDate).format('LL')
    },
    tableData() {
      return this.documents.map(document => {
        return {
          _id: document._id,
          client: this.clientNameFromClientId(document.clientId),
          creationDate: document.creationDate,
          documentNumber: document.documentNumber
        }
      })
    }
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
    },
    clientNameFromClientId(clientId) {
      return this.content.clients.find(client => client._id === clientId).fullName
    },
    searchOnDate(a, b) {
      console.log(a, b)
      return this.creationDate(a.creationDate).search(b) >= 0
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