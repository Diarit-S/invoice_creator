<template lang="pug">
  .pdf-content__left
    b-field.document-type(label="Type de document")
      b-select(placeholder="Type de document" v-model="currentPaper.type")
        option(v-for="type in possibleTypes" :value="type.key" :key="type.key")
          | {{ type.value }}

    b-field.client
      template(#label)
        .client-field-label
          span Client
          div(@click="openClientModal")
            b-icon.client-plus-icon(
              icon="plus-circle-outline" 
              size="is-small" 
              type="is-info"
            )
      b-select(placeholder="Client" v-model="currentPaper.clientId")
        option(
          v-for="client in clients"
          :value="client._id"
          :key="client._id"
        ) {{ client.fullName }}
      p(v-if="selectedClient") {{ selectedClient.address }}

    b-field( label="Date" label-position="on-border")
      b-datepicker(
        v-model="currentPaper.creationDate"
        placeholder="Selectionner une date"
        icon="calendar-today"
      )
      
    b-field.price-field( label="Total HT" label-position="on-border")
      b-tag(type="is-info is-light" size="is-large") {{ amountsData.totalWithoutTaxes }} €


    b-field.price-field(label="TVA" label-position="on-border")
      b-tag(type="is-info is-light" size="is-large") {{ amountsData.taxeAmount }} €
      p.control
        b-dropdown(v-model="currentPaper.TVAPercent")
          template(#trigger)
            button(class="button is-info") {{ currentPaper.TVAPercent }} %
          b-dropdown-item(
            v-for="percent in possibleTvaPercents"
            aria-role="listitem"
            :key="percent"
            :value="percent"
          ) {{ percent }} %

    b-field.price-field(label="Total TTC" label-position="on-border")
      b-tag(type="is-warning is-light" size="is-large") {{ amountsData.totalAmount }} €

    b-button(@click="createPaper") Create


</template>

<script>

import CustomField from "./CustomField";

export default {
  name: "LeftSide",
  components: {
    CustomField,
  },
  data() {
    return {
      possibleTvaPercents: [10, 20],
      possibleTypes: [
        {
          key: "invoice",
          value: 'facture'
        },
        {
          key: "quote",
          value: 'devis'
        }
      ],
      isClientModalOpen: false,
      clients: [],
    };
  },
  props: {
    currentPaper: {
      type: Object,
      required: true
    },
    amountsData: {
      type: Object,
      required: true
    }
  },
  methods: {
    async getClients() {
      const clients = await this.$http.get('/client/')
      this.clients = clients.data
    },
    openClientModal() {
      this.$emit('openClientModal')
    },
    async createClient() {
      const { fullName, address, zipCodeAndCity } = this.newClient
      const newClient = await this.$http.post('/client/createClient', { fullName, address, zipCodeAndCity }) 
      console.log(newClient)
    },
    async createPaper() {
      this.$emit('generateReport', this.clients)
      // const newPaper = await this.$http.post('/paper/createPaper', this.currentPaper) 
      // console.log(newPaper)

    },
    async getLastDocumentNumberByType() {
      const lastNumber = await this.$http.get(`/paper/getLastNumberOfType/${this.currentPaper.type}`)
      console.log(lastNumber)
    }
  },
  computed: {
    selectedClient() {
      return this.clients.find(client => client._id === this.currentPaper.clientId)
    }
  },
  created() {
    this.getClients()
    this.getLastDocumentNumberByType()
  },
  watch: {
    'currentPaper.type': function() {
      this.getLastDocumentNumberByType()
    }
  }
};
</script>

<style lang="scss" scoped>

.pdf-content__left {
  position: fixed;
  min-width: 400px;
  max-width: 400px;
  box-shadow: 0 0 20px rgba($color: gray, $alpha: 0.4);
  padding: 20px;
  border-radius: 10px;
  min-height: 80vh;


  .field {
    max-width: 150px;
    margin: 30px 0;
  }
}

.document-type {
  &::v-deep {
    .field.has-addons {
      display: flex;
      align-items: center;

      .document-number {
        margin-left: 10px;
      }
    }
  }
}

.client {
  &::v-deep {
    .field.has-addons {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
}

.price-field {
  margin: 30px 0;
}

.client-field-label {
  display: flex;
  align-items: center;

  .client-plus-icon {
    cursor: pointer;
    margin-left: 8px;
  }
}

.client-modal-container {
  border-radius: 6px;
  background-color: white; 
  padding: 20px;
  max-width: 500px;
  margin: auto;
}

.save-button {
  position: fixed; 
  bottom: 0px; 
  left: 50%;
  border-radius: 6px 6px 0 0;
}
</style>
