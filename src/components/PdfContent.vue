<template lang="pug">
  .pdf-content
    p {{ content.content.paper.type }}
    section(v-for="section in sectionsDevidedFields" class="pdf-item")
      b-table(
        :data="section"
        bordered
        style="max-width: 780px"
      )
        b-table-column(field="content" label="Description" width="20" v-slot="props")
          div( v-html="props.row.content")

        b-table-column(field="unitValue" label="Unité" width="10" v-slot="props")
          template(v-if="props.row.unit === 'Ensemble'")
            | {{ props.row.unit }}
          template(v-else)
            | {{ props.row.unitValue }} {{ props.row.unit }}

        b-table-column(field="unitPrice" label="Prix unitaire" width="10" v-slot="props")
          | {{ props.row.unitPrice }}

        b-table-column(field="amount" label="Prix HT" width="10" v-slot="props")
          | {{ props.row.amount }}

    .html2pdf__page-break
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

<style scoped>

.pdf-content {
  width: 100%;
  background-color: white;
  display: none;
}

.pdf-item {
  margin-bottom: 10px;
}

</style>
