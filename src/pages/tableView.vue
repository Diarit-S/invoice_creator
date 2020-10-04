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
    //- section(v-for="section in sectionsDevidedFields" class="pdf-item")
    b-table(
      :data="content.currentPaper.fields"
      bordered
      style="max-width: 795px; margin-top: 10px"
    )
      b-table-column(field="content" label="Description" width="397" v-slot="props" header-class="table-head")
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

    //- .html2pdf__page-break

    section.under-table-section
      img(
        src="@/assets/cachet.jpg"
        style="height: 100px; margin: 15px;"
      )

      b-table.price-table(
        :data="this.amountFields"
        bordered
        style="max-width: 300px;"
      )
        b-table-column(field="key" width="100" v-slot="props" header-class="table-head")
          | {{ props.row.key }}

        b-table-column(field="value" width="200" v-slot="props" header-class="table-head" cell-class="right-bottom")
          | {{ props.row.value | priceFormat }}
</template>

<script>
import moment from 'moment'
// import _ from 'lodash'

import { priceFormat } from '@/filters/priceFilters.js'


export default {
  name: 'TableView',
   data() {
    return {
      documentTypes: {
        quote: 'Devis',
        invoice: 'Facture'
      },
    }
  },
  filters: {priceFormat},
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
  computed: {
    creationDate() {
      return moment(this.content.currentPaper.creationDate).format('L')
    },
    currentClient() {
      return this.content.clients.find(client => {
        return client._id === this.content.currentPaper.clientId
      }) || {}
    },
    // sectionsDevidedFields() {
    //   if (this.content.currentPaper.fields) {
    //     return this.chunkArray(this.content.currentPaper.fields)
    //   }
    //   return []
    // },
    amountFields() {
      return [
        {key: 'Prix HT', value: this.amountsData.totalWithoutTaxes},
        {key: `TVA ${this.content.currentPaper.TVAPercent} %`, value: this.amountsData.taxeAmount},
        {key: 'Prix TTC', value: this.amountsData.totalAmount}
      ]
    }
  },
  methods: {
    // chunkArray(myArray){
    //   var results = [];

    //   const cloneArray = _.cloneDeep(myArray);
      
    //   while (cloneArray.length) {
    //       const arrayToReduce = _.cloneDeep(cloneArray)
    //       const chunkSize = arrayToReduce.reduce((acc, currentField) => {
    //         const newEl = document.createElement('div')
    //         newEl.innerHTML = currentField.content
    //         const elLength = newEl.textContent.length
    //         acc.lengthSize += elLength
    //         if (acc.lengthSize < 1400 && acc.size <=10) {
    //           acc.size++
    //         }
    //         return acc
    //       }, {lengthSize: 0, size: 0});

    //       results.push(cloneArray.splice(0, chunkSize.size));
    //   }
      
    //   return results;
    // }
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

</style>