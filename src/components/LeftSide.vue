<template lang="pug">
  .pdf-content__left
    .configuration
      .date-and-type
        b-field.document-type()
          b-select(placeholder="Type de document" v-model="currentPaper.type")
            option(v-for="type in possibleTypes" :value="type.key" :key="type.key")
              | {{ type.value }}
          p.control
            span.button.is-static n° {{ currentPaper.documentNumber }}

        b-field()
          b-datepicker(
            v-model="currentPaper.creationDate"
            placeholder="Selectionner une date"
            icon="calendar-today"
          )

      div(
        v-if="currentPaper.type === 'invoice'"
        style="margin-bottom: 1rem"
      )
        div(
          v-if="currentPaper.linkedQuotePaperId"
          style="display: flex; align-items: center; margin-bottom: 1rem"
        )
          b-tag(
            v-if="currentPaperLinkedQuotePaper.clientId"
            type="is-info" 
          ) Lié à : Devis° {{ currentPaperLinkedQuotePaper.documentNumber }} {{ clients.find(client => client._id === currentPaperLinkedQuotePaper.clientId).fullName }}
          b-checkbox(
            type="is-info"
            v-model="currentPaper.isAdvanceInvoice"
            style="margin-left: 1rem"
          ) Acompte
        b-button.is-info(
          v-else 
          size="is-small"
          @click="$emit('openQuoteSelectionModal')"
          style="margin-bottom: 1rem"
        ) Lier cette facture à un devis

        div(style="display: flex")
          //- The field for advance payment percentage
          b-field(
            v-if="currentPaper.isAdvanceInvoice"
          )
            b-numberinput(
              :controls="false" 
              v-model="currentPaperAdvancedPaymentPercent"
              step="0.01"
              size="is-small"
            )
            p.controls
              b-button.button.is-success(@click="$emit('applyAdvancedPaymentPercent', currentPaperAdvancedPaymentPercent)" size="is-small")
                b-icon(
                  size="is-small"
                  icon="check"
                )

          //- @TODO Display this button below conditionnaly (if there is no advance payment custom field)
          b-button.is-info(
            @click="$emit('openQuoteCopyModal')"
            size="is-small"
            :style="currentPaper.isAdvanceInvoice ? {marginLeft: '1rem'} : {}"
          ) Copier un devis

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

        div(style="display: flex")
          v-select(
            :options="clientsForSelection"
            @input="selectClient"
            style="min-width: 200px"
          )
          div.update-client-button(v-if="selectedClient" @click="openEditClientModal")
            b-icon.client-plus-icon(
              icon="pencil" 
              type="is-info"
            )
          

        template(v-if="selectedClient")
          b-tag(style="margin: 0.3rem 0;" size="is-medium") {{ selectedClient.address }}
          b-tag(style="margin: 0.1rem 0;" size="is-medium") {{ selectedClient.zipCodeAndCity }}
          b-tag(style="margin: 0.1rem 0;" size="is-medium") {{ 'Chantier: ' + selectedClient.workAddress }}

      div.price-container
        b-field.price-field( label="Total HT")
          b-tag(type="is-warning is-light" size="is-large") {{ amountsData.totalWithoutTaxes }} €


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
          b-tag(type="is-warning is-light" size="is-large") {{ amountsData.taxeAmount }} €

        b-field.price-field(label="Total TTC")
          b-tag(type="is-info is-light" size="is-large") {{ amountsData.totalAmount }} €

    div.end-buttons
      b-button(
        v-if="currentPaper.clientId && currentClientEmail"
        tag="router-link" 
        :to="{name: 'sendEmail', params: {email: currentClientEmail, docType: currentPaper.type, clientName: selectedClient.fullName, clientAddress: currentClientWorkAddress, familiar: false}}" 
        target="_blank"
        type="is-info is-light"
      ) Envoyer email
      b-button.is-success(v-if="isNewPaper" @click="createPaper" ) Créer
      b-button.is-success(v-else @click="updatePaper" )  Mettre à jour
      
    
</template>

<script>

import CustomField from "./CustomField";

export default {
  name: "LeftSide",
  components: {
    CustomField
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
      currentPaperAdvancedPaymentPercent: null
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
    },
    currentPaperLinkedQuotePaper: {
      type: Object,
      required: true
    }
  },
  methods: {
    openClientModal() {
      this.$emit('openClientModal')
    },
    openEditClientModal() {
      this.$emit('openEditClientModal')
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
    selectClient(client) {
      this.currentPaper.clientId = client.code
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
    },
    clientsForSelection() {
      return this.clients.map(client => {
        return {
          label: client.fullName, 
          code: client._id
        }
      })
    },
    currentClientEmail() {
      return this.clients.find(client => {
        return client._id === this.currentPaper.clientId
      }).email
    },
    currentClientWorkAddress() {
      return this.selectedClient.workAddress === "Identique à l'adresse client" ? this.selectedClient.address : this.selectedClient.workAddress
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
  box-shadow: 0 0 20px 5px rgba(128, 128, 128, 0.2);
  background-color: #ffffff66;
  padding: 20px;
  border-radius: 10px;
  height: 80vh;
  top: 50%;
  left: 20px;
  transform: translateY(calc(-50% - 12px));
  display: flex;
  flex-direction: column;
  justify-content: space-between;

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
    max-width: 320px !important;

    .field-body {
      width: 100%;
    }
    .field.has-addons {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }
  }
}

.price-container {
  padding: 0.1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-radius: 5px;
  background-color: #edf5ff96;
  border: 1px solid #0000001f;
}

.price-field {
  margin: 10px 0 !important;

  &:not(:last-child) {
    .tag {
      border: 2px solid #00000013;
    }
  }

  &:last-child {
    .tag {
      box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.109);
    }
  }

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



.update-client-button {
  cursor: pointer;
  margin-left: 8px;
}


.client-modal-container {
  border-radius: 6px;
  background-color: white; 
  padding: 20px;
  max-width: 500px;
  margin: auto;
}

.end-buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .is-success {
    margin-top: 0.5rem;
  }

  >* {
    // margin: 0.5rem;
    width: 100%;
  } 
}

.date-and-type {
  display: flex;
  justify-content: space-between;
}
</style>
