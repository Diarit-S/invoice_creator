<template lang="pug">
  div.pdf-content
    div(style="min-width: 375px")

    left-side(
      :currentPaper="content.currentPaper"
      :amountsData="amountsData"
      :clients="content.clients"
      @openClientModal="openClientModal"
      @generateReport="generateReport"
    )

    .pdf-content__right
      custom-field(
        v-for="(field, index) in content.currentPaper.fields"
        :key="'field' + index"
        :field="field"
      )

      .pdf-content__right__config
        b-button.is-info(size="is-medium" icon-left="plus-circle-outline" @click="createNewField")

    b-modal(
      v-model="isClientModalOpen"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    )
      template(#default="props")
        client-modal(:newClient="newClient" @createClient="createClient(props)")
</template>

<script>

import CustomField from "./CustomField";

import LeftSide from "./LeftSide";

import ClientModal from './ClientModal'


export default {
  name: "CreatorForm",
  components: {
    CustomField,
    LeftSide,
    ClientModal
  },
  data() {
    return {
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
      return parseFloat(this.content.currentPaper.fields.reduce((acc, currentField) => {
        if (currentField.amount) {
          acc += currentField.amount
        }
        return acc
      }, 0).toFixed(2))
    },
    taxeAmount() {
      return parseFloat((this.totalWithoutTaxes * (this.content.currentPaper.TVAPercent / 100)).toFixed(2))
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
    }
  },
  methods: {
    createNewField() {
      this.content.currentPaper.fields.push({unit: 'm²'});
    },
    async getClients() {
      const clients = await this.$http.get('/client/')
      this.content.clients = clients.data
    },
    async createClient(props) {
      const newClient = await this.$http.post('/client/createClient', this.newClient) 
      props.close()
      this.content.clients.push(newClient.data)
    },
    async createPaper() {
      const newPaper = await this.$http.post('/paper/createPaper', this.content.currentPaper) 
      console.log(newPaper)
    },
    async getLastDocumentNumber() {
      const lastDocumentNumber = await this.$http.get(`/paper/getLastNumber/${this.content.currentPaper.type}`)
      //- .data ....
      this.content.currentPaper.documentNumber = lastDocumentNumber
    },
    async getLastDocumentNumberByType() {
      const lastNumber = await this.$http.get(`/paper/getLastNumberOfType/${this.content.currentPaper.type}`)
      console.log(lastNumber)
    },
    openClientModal() {
      this.isClientModalOpen = true
    },
    generateReport() {
      this.$emit('generatePdf')
    }
  },
  created() {
    this.getClients()
    this.getLastDocumentNumberByType()
    //- this.getLastDocumentNumber
    //- Create a watch for document type and recall getLastDocumentNumber
  },
  watch: {
    'content.currentPaper.type': function() {
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
