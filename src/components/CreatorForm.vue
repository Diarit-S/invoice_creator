<template lang="pug">
  div.pdf-content
    div(style="min-width: 375px")

    left-side(
      :currentPaper="content.currentPaper"
      :amountsData="amountsData"
      :clients="content.clients"
      :currentPaperLinkedQuotePaper="currentPaperLinkedQuotePaper"
      @openClientModal="openClientModal"
      @openEditClientModal="openEditClientModal"
      @openQuoteSelectionModal="isQuoteSelectionModalOpen = true"
      @openQuoteCopyModal="isQuoteCopyModalOpen = true"
      @applyAdvancedPaymentPercent="applyAdvancedPaymentPercent($event)"
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
      .pdf-content__right__advanced-payments(
        v-if="content.previousLinkedPapers.length"
      )
        .payment(
          v-for="paper in content.previousLinkedPapers"
          @click="togglePaymentHide(paper)"
          :class="{'hidden-payment': paper.isHidden}"
        )
          span Acompte reçu : Facture n°{{ paper.documentNumber }} 
          span {{ totalWithoutTaxes(paper) | priceFormat }} HT

      .pdf-content__right__config
        b-button.is-info(icon-left="plus-circle-outline" @click="createNewField")

        b-dropdown(
          aria-role="list"
          @change="createNewFieldWidhTemplate"
          v-if="isModelDropdownEnable"
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

    //- Edit client modal   
    b-modal(
      v-model="isEditClientModalOpen"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    )
      template(#default="props")
        client-modal(
          :newClient="selectedClientCopy()"
          isUpdate
          @updateClient="updateClient(props, $event)" 
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

    b-modal(
      v-model="isQuoteCopyModalOpen"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    )
      //- isQuoteCopyModalOpen refers to the same modal (quoteSelectionModal)
      //- But the purpose of this modal is to copy the quote fields
      //- So here, we pass a boolean prop to the component to specify that is for copying
      template(#default="props")
        quote-selection-modal(
          isQuoteCopy
          @copyQuote="handleCopyingQuoteSelection(props, $event)" 
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

import { dateFormat } from '@/filters/dateFormat'



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
      isEditClientModalOpen: false,
      isFieldTemplateModalOpen: false,
      newClient: {
        fullName: '',
        address: '',
        zipCodeAndCity: '',
        workAddress: "Identique à l'adresse client",
      },
      newTemplate: {},
      fieldTemplates: [],
      drag: false,
      isQuoteSelectionModalOpen: false,
      isQuoteCopyModalOpen: false,
      currentPaperLinkedQuotePaper: {},
      //-- This data is made to reload dropdown component
      isModelDropdownEnable: true
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
    },
    selectedClient() {
      return this.content.clients.find(client => client._id === this.content.currentPaper.clientId)
    },
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
    async updateClient(props, clientWithUpdates) {
      await this.$http.post('/client/updateClient', clientWithUpdates) 
      this.$emit('reloadClients')
      props.close()
    },
    closeClientModal(props) {
      props.close()
    },
    openClientModal() {
      this.isClientModalOpen = true
    },
    openEditClientModal() {
      this.isEditClientModalOpen = true
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
      this.isModelDropdownEnable = false
      setTimeout(() => {
        this.isModelDropdownEnable = true
      }, 10);
    },
    isFieldAlreadyTemplate(field) {
      return this.fieldTemplates.some(template => template.template === field.content) || !field.content
    },
    linkCurrentPaperToQuote(props, quote) {
      this.currentPaperLinkedQuotePaper = quote
      this.$set(this.content.currentPaper, 'linkedQuotePaperId', quote._id)
      //- Extact the client from the quote and set it on the current paper
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
      //- LinkedQuotePaper is a property on a paper (an invoice paper)
      //- This property is an ID of quote paper that refers to
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
    },
    togglePaymentHide(paper) {
      //- This method would hide or show a linked advanced payment on final price 
      paper.isHidden ? this.$set(paper, 'isHidden', false) : this.$set(paper, 'isHidden', true)
    },
    async handleCopyingQuoteSelection(modal, quote) {
      const selectedQuote = await this.$http.get(`/paper/getPaperById/${quote._id}`)
      if (selectedQuote) {
        console.log('selectedQuote', selectedQuote)
        this.copyPaperFields(selectedQuote.data)
      }
      modal.close()
    },
    copyPaperFields(paper) {
      this.$set(this.content.currentPaper, 'fields', paper.fields)
    },
    applyAdvancedPaymentPercent(percent) {
      const advancePaymentAmount = this.currentPaperLinkedQuotePaper.amount * percent / 100
      const content = `<p><strong>Facture d&apos;acompte</strong></p><p><br></p><p>Les travaux sont d&eacute;crits sur le devis n&deg; ${this.currentPaperLinkedQuotePaper.documentNumber} dat&eacute; du ${dateFormat(this.currentPaperLinkedQuotePaper.creationDate)}.&nbsp;</p><p><br></p><p>Le montant du devis est de ${priceFormat(this.currentPaperLinkedQuotePaper.amount)} HT.&nbsp;</p><p><br></p><p>L&apos;acompte demand&eacute; est de ${percent}% du montant du devis, soit <strong>${priceFormat(advancePaymentAmount)} HT</strong></p>`
      this.$set(this.content.currentPaper, 'fields', [{content, unit: 'U', unitPrice: advancePaymentAmount}])
      // this.content.currentPaper.fields.push({content, unit: 'U', unitPrice: advancePaymentAmount});
    },
    selectedClientCopy() {
      return _.cloneDeep(this.selectedClient)
    }
  },
  async created() {
    this.getFieldTemplates()
    /* 
      If current paper is an invoice and it's linked to a quote
      We need To get some informations from this quote and hydrate currentPaperLinkedQuotePaper
    */
    if (this.content.currentPaper.linkedQuotePaperId) {
      await this.hydrateCurrentPaperLinkedQuotePaper()
      await this.searchPreviousLinkedPapers()
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
        cursor: pointer;
        background-color: lightgrey;
        padding: 7px;
        border-radius: 5px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
      }
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

.ghost {
  opacity: 0.5;
}

.flip-list-move {
  transition: transform 0.5s;
}

.drag-icon {
  cursor: move;
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

.hidden-payment {
  opacity: 0.5;
}
</style>
