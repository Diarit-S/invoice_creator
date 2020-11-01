<template lang="pug">
  div.pdf-content
    div.pdf-content__head
      img(
        src="@/assets/image010.png"
        style="height: 150px"
      )
      div.pdf-content__head__right-card
        .document-type 
          span {{ documentTypes[content.currentPaper.type] }}
          span n°{{ content.currentPaper.documentNumber }}
        .document-date 
          span Date
          span {{ creationDate }}
        .document-client
          span {{ currentClient.fullName }}
          span {{ currentClient.address }}
          span {{ currentClient.zipCodeAndCity }}
        .document-work-address(v-if="currentClient.workAddress !== defaultWorkAddress")
          span Adresse chantier : {{ currentClient.workAddress }}
    b-table(
      :data="content.currentPaper.fields"
      bordered
      style="max-width: 795px; margin-top: 10px"
      :row-class="(row, index) => removeBorderClass(row, index)"
    )
      b-table-column(
        field="content" 
        label="Description" 
        width="420" 
        v-slot="props" 
        header-class="table-head"
      )
        div( v-html="props.row.content")

      b-table-column(field="unitValue" label="Unité" width="125" v-slot="props" header-class="table-head" cell-class="right-bottom")
        template(v-if="props.row.unit === 'Ensemble'")
          | {{ props.row.unit }}
        template(v-else-if="props.row.unit === 'U'")
        template(v-else)
          | {{ props.row.unitValue }} {{ props.row.unit }}

      b-table-column(field="unitPrice" label="Prix unitaire" width="125" v-slot="props" header-class="table-head" cell-class="right-bottom")
        | {{ props.row.unitPrice | priceFormat }}

      b-table-column(field="amount" label="Prix HT" width="125" v-slot="props" header-class="table-head" cell-class="right-bottom")
        | {{ props.row.amount | priceFormat }}

    section.advanced-payments-section(v-if="this.content.previousLinkedPapers && this.content.previousLinkedPapers.length && notHiddenPreviousLinkedPapers.length")
      span Acompte(s) lié(s) :
      b-table.advanced-payments-table(
        :data="notHiddenPreviousLinkedPapers"
        bordered
        style="max-width: 795px"
      )
        b-table-column(field="key" width="125" v-slot="props")
          | Facture n°{{ props.row.documentNumber }} du {{ props.row.creationDate | dateFormat }}

        b-table-column(field="value" width="125" v-slot="props" style="max-width: 125px"  cell-class="right-bottom")
          | {{ totalWithoutTaxes(props.row) | priceFormat }}


    section.under-table-section
      img(
        src="@/assets/cachet.jpg"
        style="height: 100px; margin: 15px;"
      )

      b-table.price-table(
        :data="this.amountFields"
        bordered
        style="width: 250px;"
        :row-class="(row, index) => index === 2 && 'last-line'"
      )
        b-table-column(field="key" width="125" v-slot="props" header-class="table-head" style="max-width: 125px")
          | {{ props.row.key }}

        b-table-column(field="value" width="125" v-slot="props" header-class="table-head" cell-class="right-bottom" style="width: 125px")
          | {{ props.row.value | priceFormat }}
</template>

<script>
import moment from 'moment'
// import _ from 'lodash'

import { priceFormat } from '@/filters/priceFilters.js'
import { dateFormat } from '@/filters/dateFormat.js'


export default {
  name: 'TableView',
   data() {
    return {
      documentTypes: {
        quote: 'Devis',
        invoice: 'Facture'
      },
      defaultWorkAddress: "Identique à l'adresse client"
    }
  },
  filters: {priceFormat, dateFormat},
  props: {
    content: {
      type: Object,
      required: true
    },
    amountsData: {
      type: Object,
      required: true
    }
  },
  mounted() {
    setTimeout(() => {
      window.print()
    }, 500);
  },
  computed: {
    creationDate() {
      return moment(this.content.currentPaper.creationDate).format('L')
    },
    currentClient() {
      return this.content.clients.find(client => {
        return client._id === this.content.currentPaper.clientId
      }) || {}
    },
    amountFields() {
      return [
        {key: 'Prix HT', value: this.amountsData.totalWithoutTaxes},
        {key: `TVA ${this.content.currentPaper.TVAPercent} %`, value: this.amountsData.taxeAmount},
        {key: 'Prix TTC', value: this.amountsData.totalAmount}
      ]
    },
    notHiddenPreviousLinkedPapers() {
      return this.content.previousLinkedPapers.filter(paper => !paper.isHidden)
    }
  },
  methods: {
    totalWithoutTaxes(paper) {
      return parseFloat(paper.fields.reduce((acc, currentField) => {
        if (currentField.amount) {
          acc += currentField.amount
        }
        return acc
      }, 0).toFixed(2))
    },
    removeBorderClass(row, index) {
      const classesToApply = []
      if (row.linkedToPreviousField) {
        classesToApply.push(row.linkedToPreviousField && 'no-border-top')
      }
      if (this.content.currentPaper.fields[index + 1] && this.content.currentPaper.fields[index + 1].linkedToPreviousField) {
        classesToApply.push('no-border-bottom')
      }
      return classesToApply
    }
  }
}
</script>


<style lang="scss" scoped>
.pdf-content {
  margin: 10px;
  height: 500px;
  width: 795px;
  // border: 1px solid black;

    &__head {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;


    &__right-card {
      width: 300px;
      background-color: #EFEFEF;
      border-radius: 3px;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(0,0,0,.125);

      .document-type {
        font-weight: bold;
        display: flex;
        justify-content: space-between;
      }

      .document-date {
        font-weight: bold;
        display: flex;
        justify-content: space-between;
      }

      .document-client {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .document-work-address {
        font-size: 12px;
      }

      >* {
        position: relative;
        display: block;
        padding: 3px 10px;
      }

      >*:not(:last-child) {
        
        border-bottom: 1px solid rgba(0,0,0,.125);
      }
    }
  }
}

.under-table-section {
  display: flex;
  justify-content: flex-end;
}

.price-table {
  &::v-deep {
    td {
      width: 125px;
      min-width: 125px;
      max-width: 125px;
    }
    .last-line {
      background-color: #363630;
      color: white;
      font-weight: bold;

      td {
        border-width: 0;
      }
    }
  }
}

.advanced-payments-section {
  margin-top: 1rem;
}

.advanced-payments-table {
  &::v-deep {
    thead {
      display: none;
    }
    td:nth-of-type(2) {
      width: 125px;
      min-width: 125px;
      max-width: 125px;
    }
  }
}

::v-deep {
  .no-border-top {
    td:first-child {
      border-top: none;
    }
  }
  .no-border-bottom {
    td:first-child {
      border-bottom: none;
    }
  }
}



</style>