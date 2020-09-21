<template lang="pug">
  .pdf-content
    p {{ content.content.paper.type }}
    img(
      src="@/assets/drita_infos.jpg"
    )
    section(v-for="section in sectionsDevidedFields" class="pdf-item")
      b-table(
        :data="section"
        bordered
        style="max-width: 780px"
      )
        b-table-column(field="content" label="Description" width="405" v-slot="props" header-class="table-head")
          div( v-html="props.row.content")

        b-table-column(field="unitValue" label="Unité" width="125" v-slot="props" header-class="table-head")
          template(v-if="props.row.unit === 'Ensemble'")
            | {{ props.row.unit }}
          template(v-else)
            | {{ props.row.unitValue }} {{ props.row.unit }}

        b-table-column(field="unitPrice" label="Prix unitaire" width="125" v-slot="props" header-class="table-head")
          | {{ props.row.unitPrice }}

        b-table-column(field="amount" label="Prix HT" width="125" v-slot="props" header-class="table-head")
          | {{ props.row.amount }}

    .html2pdf__page-break

    section
      b-table.price-table(
        :data="this.amountFields"
        bordered
        style="max-width: 780px"
      )
        b-table-column(field="key" width="405" v-slot="props" header-class="table-head")
          | {{props.row.key}}

        b-table-column(field="value" width="405" v-slot="props" header-class="table-head")
          | {{props.row.value}}

</template>

<script>

import _ from 'lodash'

export default {
  name: 'PdfContent',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  computed: {
    sectionsDevidedFields() {
      if (this.content.content.paper.fields) {
        return this.chunkArray(this.content.content.paper.fields)
      }
      return []
    },
    amountFields() {
      return [
        {key: 'htPrice', value: this.content.content.amounts.totalWithoutTaxes},
        {key: 'taxeAmount', value: this.content.content.amounts.taxeAmount},
        {key: 'totalAmount', value: this.content.content.amounts.totalAmount}
      ]
    }
  },
  methods: {
    chunkArray(myArray){
      var results = [];

      const cloneArray = _.cloneDeep(myArray);
      
      while (cloneArray.length) {
          const arrayToReduce = _.cloneDeep(cloneArray)
          const chunkSize = arrayToReduce.reduce((acc, currentField) => {
            const newEl = document.createElement('div')
            newEl.innerHTML = currentField.content
            const elLength = newEl.textContent.length
            acc.lengthSize += elLength
            if (acc.lengthSize < 1400) {
              acc.size++
            }
            return acc
          }, {lengthSize: 0, size: 0});

          results.push(cloneArray.splice(0, chunkSize.size));
      }
      
      return results;
    }   
  }
}
</script>

<style lang="scss" scoped>

.pdf-content {
  width: 100%;
  background-color: white;
  display: none;

}

.pdf-item {
  margin-bottom: 10px;
}

</style>
