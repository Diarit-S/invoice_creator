<template lang="pug">
  div.pdf-content
    div(style="min-width: 375px")

    left-side(
      :currentPaper="currentPaper"
      :amountsData="amountsData"
      @openClientModal="openClientModal"
      @generateReport="generateReport"
      @hydrateTable="hydrateTable"
    )

    .pdf-content__right
      custom-field(
        v-for="(field, index) in currentPaper.fields"
        :key="'field' + index"
        :field="field"
      )

      .pdf-content__right__config
        b-button.is-info(size="is-medium" icon-left="plus-circle-outline" @click="createNewField")

    b-modal(v-model="isClientModalOpen" style="z-index: 1000")
      .client-modal-container
        b-field(label="Nom et Prénom" label-position="on-border" autocomplete="off")
          b-input(v-model="newClient.fullName" autocomplete="off")
        b-field(label="Adresse" label-position="on-border" autocomplete="off")
          b-input(v-model="newClient.address" autocomplete="off")
        b-field(label="Code postale et ville" label-position="on-border" autocomplete="off")
          b-input(v-model="newClient.zipCodeAndCity" autocomplete="off")
        b-field(label="Addresse chantier" label-position="on-border" autocomplete="off")
          b-input(v-model="newClient.workAddress" autocomplete="off")

        b-button(
          size="is-small" 
          @click="createClient" 
          type="is-info"
        ) Valider
</template>

<script>

import CustomField from "./CustomField";

import LeftSide from "./LeftSide";

import clients from "@/utils/clients.json";

export default {
  name: "CreatorForm",
  components: {
    CustomField,
    LeftSide
  },
  data() {
    return {
      currentPaper: {
        type: 'quote',
        fields: [
          {unit: 'm²'}
        ],
        TVAPercent: 10,
        documentNumber: 1,
        clientId: '5f5e301e972a0900171c8fd2',
        creationDate: new Date()
      },
      isClientModalOpen: false,
      newClient: {
        fullName: '',
        address: '',
        zipCodeAndCity: '',
        workAddress: "Identique à l'adresse client",
      }
    }
  },
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
  computed: {
    totalWithoutTaxes() {
      return parseFloat(this.currentPaper.fields.reduce((acc, currentField) => {
        if (currentField.amount) {
          acc += currentField.amount
        }
        return acc
      }, 0).toFixed(2))
    },
    taxeAmount() {
      return parseFloat((this.totalWithoutTaxes * (this.currentPaper.TVAPercent / 100)).toFixed(2))
    },
    totalAmount() {
      return parseFloat((this.totalWithoutTaxes + this.taxeAmount).toFixed(2))
    },
    amountsData() {
      return {
        totalWithoutTaxes: this.totalWithoutTaxes,
        taxeAmount: this.taxeAmount,
        totalAmount: this.totalAmount
      }
    },
    fullPdfContent() {
      return {
        paper: this.currentPaper,
        amounts: this.amountsData
      }
    },
    clientsToAdd() {
      return clients
    }
  },
  methods: {
    createNewField() {
      this.currentPaper.fields.push({unit: 'm²'});
    },
    async getClients() {
      const clients = await this.$http.get('/client/')
      this.clients = clients.data
    },
    async createClient() {
      const newClient = await this.$http.post('/client/createClient', this.newClient) 
      console.log(newClient)
    },
    async createPaper() {
      const newPaper = await this.$http.post('/paper/createPaper', this.currentPaper) 
      console.log(newPaper)
    },
    handleDocumentSave() {
      console.log(this.currentPaper.fields)
    },
    async getLastDocumentNumber() {
      const lastDocumentNumber = await this.$http.get(`/paper/getLastNumber/${this.currentPaper.type}`)
      //- .data ....
      this.currentPaper.documentNumber = lastDocumentNumber
    },
    async getLastDocumentNumberByType() {
      const lastNumber = await this.$http.get(`/paper/getLastNumberOfType/${this.currentPaper.type}`)
      console.log(lastNumber)
    },
    openClientModal() {
      this.isClientModalOpen = true
    },
    generateReport(clients) {
      this.$emit('generateReport', {content: this.fullPdfContent, clients})
    },
    hydrateTable(clients) {
      this.$emit('hydrateTable', {content: this.fullPdfContent, clients})
    }
  },
  created() {
    this.getClients()
    this.getLastDocumentNumberByType()
    //- this.getLastDocumentNumber
    //- Create a watch for document type and recall getLastDocumentNumber
  },
  watch: {
    'currentPaper.type': function() {
      this.getLastDocumentNumberByType()
    }
  }
};
</script>

<style lang="scss" scoped>
.pdf-content {
  display: flex;
  justify-content: space-between;

  &__right {
    padding-left: 50px;
    min-width: 70%;
    max-width: 70%

    &__config {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
  }

  &__left {
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

</style>
