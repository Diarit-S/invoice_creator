<template lang="pug">
  div.pdf-content
    div(style="min-width: 375px")

    left-side(
      :currentPaper="content.currentPaper"
      :amountsData="amountsData"
      :clients="content.clients"
      :currentPaperLinkedQuotePaper="currentPaperLinkedQuotePaper"
      @openClientModal="openClientModal"
      @openQuoteSelectionModal="isQuoteSelectionModalOpen = true"
    )

    .pdf-content__right
      draggable(
        class="list-group"
        tag="div"
        handle=".drag"
        v-model="content.currentPaper.fields"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      )
        transition-group(type="transition" :name="!drag ? 'flip-list' : null")
          custom-field.list-group-item(
            v-for="(field, index) in content.currentPaper.fields"
            :key="'field' + index"
            :field="field"
            @copy:field='copyField(field, index)'
            @delete:field='deleteField(field, index)'
            :drag="drag"
          )
            template(#drag)
              b-icon.drag-icon.drag(
                icon="drag-horizontal"
                type="is-dark"
              )
            template(#templateBtn)
              div(@click="saveAsTemplate(field.content)" v-if="!isFieldAlreadyTemplate(field)")
                b-icon.save-icon(
                  icon="content-save-edit-outline" 
                  type="is-dark"
                )

      //- If current doc is an invoice and is linked to a quote that already has linked advanced payments invoices
      .pdf-content__right__advanced-payments(v-if="content.previousLinkedPapers.length")
        .payment(
          v-for="paper in content.previousLinkedPapers"
        ) 
          span Acompte reçu : Facture n°{{ paper.documentNumber }} 
          span {{ totalWithoutTaxes(paper) | priceFormat }} HT


      .pdf-content__right__config
        b-button.is-info(icon-left="plus-circle-outline" @click="createNewField")

        b-dropdown(
          aria-role="list"
          @change="createNewFieldWidhTemplate"
        )
          template(#trigger)
            button.button.is-info Model
          b-dropdown-item(
            v-for="template in fieldTemplates"
            aria-role="listitem"
            :key="template._id"
            :value="template.template"
          ) {{ template.name }}

    b-modal(
      v-model="isClientModalOpen"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    )
      template(#default="props")
        client-modal(
          :newClient="newClient"
          @createClient="createClient(props)" 
          @close="closeClientModal(props)" 
        )

    b-modal(
      v-model="isFieldTemplateModalOpen"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    )
      template(#default="props")
        field-template-modal(
          :newTemplate="newTemplate" 
          @createTemplate="confirmTemplateCreation(props)"
          @closeTemplateModal="closeTemplateModal(props)"
        )

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
          @selectQuote="linkCurrentPaperToQuote(props, $event)" 
          @close="closeQuoteSelectionModal(props)" 
          :clients="content.clients"
        )

</template>

<script>

import CustomField from "./CustomField";

import LeftSide from "./LeftSide";

import ClientModal from './ClientModal'
import FieldTemplateModal from './FieldTemplateModal'

import _ from 'lodash'

import Draggable from 'vuedraggable'

import QuoteSelectionModal from "@/components/QuoteSelectionModal"

import { priceFormat } from '@/filters/priceFilters.js'



export default {
  name: "CreatorForm",
  components: {
    CustomField,
    LeftSide,
    ClientModal,
    Draggable,
    FieldTemplateModal,
    QuoteSelectionModal
  },
  filters: {priceFormat},
  data() {
    return {
      isClientModalOpen: false,
      isFieldTemplateModalOpen: false,
      newClient: {
        fullName: '',
        address: '',
        zipCodeAndCity: '',
        workAddress: "Identique à l'adresse client",
      },
      newTemplate: {},
      fieldTemplates: [],
      test: 'aaa',
      drag: false,
      isQuoteSelectionModalOpen: false,
      currentPaperLinkedQuotePaper: {}
    }
  },
  props: {
    content: {
      type: Object,
      required: true,
    },
    amountsData: {
      type: Object,
      required: true
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      }
    }
  },
  methods: {
    createNewField() {
      this.content.currentPaper.fields.push({unit: 'm²'});
    },
    async createClient(props) {
      const newClient = await this.$http.post('/client/createClient', this.newClient) 
      props.close()
      this.content.clients.push(newClient.data)
    },
    closeClientModal(props) {
      props.close()
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
    copyField(field, index) {
      this.content.currentPaper.fields.splice(index + 1, 0, _.cloneDeep(field))
    },
    deleteField(field, index) {
      console.log(index)
      this.content.currentPaper.fields.splice(index, 1)
    },
    async saveAsTemplate(template) {
      this.newTemplate = {template}
      this.isFieldTemplateModalOpen = true
    },
    async confirmTemplateCreation(props) {
      const newTemplate = await this.$http.post('/fieldTemplate/createTemplate', this.newTemplate)
      props.close()
      this.fieldTemplates.push(newTemplate.data)
    },
    closeTemplateModal(props) {
      props.close()
    },
    async getFieldTemplates() {
      const templates = await this.$http.get('/fieldTemplate')
      this.fieldTemplates = templates.data
    },
    createNewFieldWidhTemplate(content) {
      this.content.currentPaper.fields.push({content, unit: 'm²'});
    },
    isFieldAlreadyTemplate(field) {
      return this.fieldTemplates.some(template => template.template === field.content) || !field.content
    },
    linkCurrentPaperToQuote(props, quote) {
      this.currentPaperLinkedQuotePaper = quote
      this.$set(this.content.currentPaper, 'linkedQuotePaperId', quote._id)
      if (!this.content.currentPaper.clientId.length) {
        this.$set(this.content.currentPaper, 'clientId', quote.clientId)
      }
      this.searchPreviousLinkedPapers()
      props.close()
    },
    async searchPreviousLinkedPapers() {
      /*
        - Here we are searching for invoices that are linked to the same quote than current paper is linked to
        - So we process an API call, with current paper 'linkedQuotePaperId' as param
        - Call each documents with 'linkedQuotePaperId' equals to currentPaper.linkedQuotePaperId
      */
      const previousLinkedPapers = await this.$http.get(`/paper/getLinkedPapers/${this.content.currentPaper.linkedQuotePaperId}`)
      this.content.previousLinkedPapers = previousLinkedPapers.data.filter(paper => paper.isAdvanceInvoice)
    },
    closeQuoteSelectionModal(props) {
      props.close()
    },
    async hydrateCurrentPaperLinkedQuotePaper() {
      const linkedQuote = await this.$http.get(`/paper/getPaperById/${this.content.currentPaper.linkedQuotePaperId}`)
      const {documentNumber, clientId, creationDate} = linkedQuote.data
      this.currentPaperLinkedQuotePaper = {documentNumber, clientId, creationDate}
    },
    totalWithoutTaxes(paper) {
      return parseFloat(paper.fields.reduce((acc, currentField) => {
        if (currentField.amount) {
          acc += currentField.amount
        }
        return acc
      }, 0).toFixed(2))
    }
  },
  async created() {
    this.getLastDocumentNumberByType()
    this.getFieldTemplates()
    //- this.getLastDocumentNumber
    //- Create a watch for document type and recall getLastDocumentNumber
    /* 
      If current paper is an invoice and it's linked to a quote
      We need To get some informations from this quote and hydrate currentPaperLinkedQuotePaper
    */
    if (this.content.currentPaper.linkedQuotePaperId) {
      await this.hydrateCurrentPaperLinkedQuotePaper()
      await this.searchPreviousLinkedPapers()
    }
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
    max-width: 70%;
    transition: all 1s ease-in-out;

    &__config {
      display: flex;
      justify-content: flex-start;
      margin-top: 10px;
      margin-left: 35px;
      >* {
        margin-right: 10px;
      }
    }

    &__advanced-payments {
      margin-top: 10px;
      margin-left: 35px;
      width: 450px;

      .payment {
        background-color: lightgrey;
        padding: 7px;
        border-radius: 5px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
      }
    }
  }

  // &__left {
  //   position: fixed;
  //   min-width: 400px;
  //   max-width: 400px;
  //   box-shadow: 0 0 20px rgba($color: gray, $alpha: 0.4);
  //   padding: 20px;
  //   min-height: 80vh;


  //  .field {
  //    max-width: 150px;
  //    margin: 30px 0;
  //  }
  // }
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

.ghost {
  opacity: 0.5;
}

.flip-list-move {
  transition: transform 0.5s;
}

.drag-icon {
  cursor: grab;
  transition: transform 0.15s ease-in-out;
  &:hover {
    transform: translateY(-3px)
  }
}

.save-icon {
  cursor: pointer;
  transition: transform 0.15s ease-in-out;
  &:hover {
    transform: translateY(-3px)
  }
}
</style>
