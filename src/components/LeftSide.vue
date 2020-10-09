<template lang="pug">
  .pdf-content__left
    b-field.document-type(label="Type de document")
      b-select(placeholder="Type de document" v-model="currentPaper.type")
        option(v-for="type in possibleTypes" :value="type.key" :key="type.key")
          | {{ type.value }}
      p.control
        span.button.is-static n° {{ currentPaper.documentNumber }}

    template(v-if="currentPaper.type === 'invoice'")
      b-tag(type="is-info" v-if="this.currentPaper.linkedQuotePaperId") {{ currentPaperLinkedQuotePaper.documentNumber }}
      b-button.is-info(v-else @click="isQuoteSelectionModalOpen = true") Lier cette facture à un devis

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

    b-field( label="Date")
      b-datepicker(
        v-model="currentPaper.creationDate"
        placeholder="Selectionner une date"
        icon="calendar-today"
      )
    div.price-container
      b-field.price-field( label="Total HT")
        b-tag(type="is-info is-light" size="is-large") {{ amountsData.totalWithoutTaxes }} €


      b-field.price-field(label="TVA")
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
        b-tag(type="is-info is-light" size="is-large") {{ amountsData.taxeAmount }} €

      b-field.price-field(label="Total TTC")
        b-tag(type="is-warning is-light" size="is-large") {{ amountsData.totalAmount }} €

    b-button.is-success.pdf-btn(v-if="isNewPaper" @click="createPaper" ) Créer
    b-button.is-success.pdf-btn(v-else @click="updatePaper" )  Mettre à jour

    b-modal(
      v-model="isQuoteSelectionModalOpen"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    )
      template(#default="props")
        quote-selection-modal(
          @selectQuote="linkCurrentPaperToQuote(props)" 
          @close="closeQuoteSelectionModal(props)" 
        )


</template>

<script>

import CustomField from "./CustomField";
import QuoteSelectionModal from "@/components/QuoteSelectionModal"

export default {
  name: "LeftSide",
  components: {
    CustomField,
    QuoteSelectionModal
  },
  data() {
    return {
      possibleTvaPercents: [10, 20],
      possibleTypes: [
        {
          key: "invoice",
          value: 'Facture'
        },
        {
          key: "quote",
          value: 'Devis'
        }
      ],
      isClientModalOpen: false,
      isQuoteSelectionModalOpen: false,
      currentPaperLinkedQuotePaper: {}
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
    },
    clients: {
      type: Array,
      default: () => {return []}
    }
  },
  methods: {
    openClientModal() {
      this.$emit('openClientModal')
    },
    async createPaper() {
      await this.$http.post('/paper/createPaper', this.currentPaper) 
      document.title = `${this.translatedCurrentPaperType} n°${this.currentPaper.documentNumber} ${this.selectedClient.fullName}`
      this.$router.push({name: 'tableView'})
    },
    async updatePaper() {
      await this.$http.post('/paper/updatePaper', this.currentPaper)
      document.title = `${this.translatedCurrentPaperType} n°${this.currentPaper.documentNumber} ${this.selectedClient.fullName}`
      this.$router.push({name: 'tableView'})
    },
    async getLastDocumentNumberByType() {
      const lastNumber = await this.$http.get(`/paper/getLastNumberOfType/${this.currentPaper.type}`)
      this.$set(this.currentPaper, 'documentNumber', lastNumber.data.documentNumber + 1)
    },
    linkCurrentPaperToQuote(quote, props) {
      this.currentPaperLinkedQuotePaper = quote
      this.currentPaper.linkedQuotePaperId = quote._id
      props.close()
    },
    closeQuoteSelectionModal(props) {
      props.close()
    }
  },
  computed: {
    isNewPaper() {
      return !this.currentPaper._id
    },
    selectedClient() {
      return this.clients.find(client => client._id === this.currentPaper.clientId)
    },
    translatedCurrentPaperType() {
      return this.possibleTypes.find(type => type.key === this.currentPaper.type).value.toUpperCase()
    }
  },
  created() {
    if (!this.currentPaper.documentNumber) {
      this.getLastDocumentNumberByType()
    }
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
  box-shadow: 0 0 20px 5px rgba($color: gray, $alpha: 0.2);
  padding: 20px;
  border-radius: 0 20px 20px 0;
  height: 100vh;
  top: 0;
  left: 0;

  .field {
    max-width: 150px;
    margin-bottom: 20px 0;
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

.price-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.price-field {
  margin: 10px 0 !important;

  &::v-deep {
    .label {
      text-align: right;
    }
  }

  &:nth-of-type(2) {
    transform: translateX(-20px);
  }

  .tag {
    min-width: 100px;
    justify-content: flex-end;
  }
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

.pdf-btn {
  left: 50%;
  transform: translate(-50%, 100%);
}
</style>
