<template lang="pug">
  div.pdf-content
    link(
      rel="stylesheet"
      href="https://cdn.materialdesignicons.com/5.3.45/css/materialdesignicons.min.css"
    )
    div(style="min-width: 200px")
    .pdf-content__left
      b-field.document-type(label="Type de document")
        b-select(placeholder="Type de document" v-model="currentPaper.type")
          option(v-for="type in possibleTypes" :value="type.key" :key="type.key")
            | {{ type.value }}
        //- span.document-number N° {{ utilDatas[content.type].number }}

      b-field.client(label="Client")
        template(#label)
          .client-field-label
            span Clients
            div(@click="openClientModal")
              b-icon.client-plus-icon(
                icon="plus-circle-outline" 
                size="is-small" 
                type="is-info"
              )
        b-select(placeholder="Client" v-model="content.clientId")
          option(
            v-for="(client, index) in clients"
            :value="index"
            :key="client.fullName + index"
          ) {{ client.fullName }}
        p {{ content.clientId >= 0 ? clients[content.clientId].address : "" }}

      b-field.price-field( label="Total HT" label-position="on-border")
        b-tag(type="is-info is-light" size="is-large") {{ totalWithoutTaxes }} €

      b-field.price-field( label="Date" label-position="on-border")
        b-datepicker(
          v-model="currentPaper.creationDate"
          placeholder="Selectionner une date"
          icon="calendar-today"
        )

      b-field.price-field(label="TVA" label-position="on-border")
        b-tag(type="is-info is-light" size="is-large") {{ taxeAmount }} €
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
        b-tag(type="is-warning is-light" size="is-large") {{ totalAmount }} €

      b-button(@click="createPaper") Create

    .pdf-content__right
      custom-field(
        v-for="(field, index) in currentPaper.fields"
        :key="'field' + index"
        :field="field"
      )

      .pdf-content__right__config
        b-button.is-info(size="is-medium" icon-left="plus-circle-outline" @click="createNewField")
        b-tag(type="is-warning is-light" size="is-large" v-if="totalWithoutTaxes")
          | Total : {{ totalWithoutTaxes }} € HT

    b-modal(v-model="isClientModalOpen")
      .client-modal-container
        b-field(label="Nom et Prénom" label-position="on-border" autocomplete="off")
          b-input(v-model="newClient.fullName" autocomplete="off")
        b-field(label="Adresse" label-position="on-border" autocomplete="off")
          b-input(v-model="newClient.address" autocomplete="off")
        b-field(label="Code postale et ville" label-position="on-border" autocomplete="off")
          b-input(v-model="newClient.zipCodeAndCity" autocomplete="off")

        b-button(
          size="is-small" 
          @click="createClient" 
          type="is-info"
        ) Valider

    b-button.save-button(
      size="is-medium" 
      @click="handleDocumentSave" 
      type="is-success" 
      icon-left="content-save-all-outline"
    ) Enregistrer
</template>

<script>

import CustomField from "./CustomField";

export default {
  name: "CreatorForm",
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
      newClient: {
        fullName: '',
        address: '',
        zipCodeAndCity: ''
      },
      clients: [],
      currentPaper: {
        type: 'quote',
        fields: [
          {unit: 'm²'}
        ],
        TVAPercent: 10,
        documentNumber: 1,
        clientId: '5f5e301e972a0900171c8fd2'
      }
    };
  },
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
  computed: {
    totalWithoutTaxes() {
      return this.currentPaper.fields.reduce((acc, currentField) => {
        if (currentField.amount) {
          acc += currentField.amount
        }
        return acc
      }, 0)
    },
    taxeAmount() {
      return this.totalWithoutTaxes * (this.currentPaper.TVAPercent / 100)
    },
    totalAmount() {
      return this.totalWithoutTaxes + this.taxeAmount
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
    openClientModal() {
      this.isClientModalOpen = true
    },
    async createClient() {
      const { fullName, address, zipCodeAndCity } = this.newClient
      const newClient = await this.$http.post('/client/createClient', { fullName, address, zipCodeAndCity }) 
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
    min-width: 80%;

    &__config {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
  }

  &__left {
    position: fixed;
    min-width: 200px;
    max-width: 250px;
    border-right: 1px solid lightgray;

   .field {
     max-width: 150px;
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

.save-button {
  position: fixed; 
  bottom: 0px; 
  left: 50%;
  border-radius: 6px 6px 0 0;
}
</style>
