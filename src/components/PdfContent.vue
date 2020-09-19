<template lang="pug">
  div.pdf-content
    p {{ content.content.paper.type }}
    b-table(
      :data="content.content.paper.fields"
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
</template>

<script>
export default {
  name: 'PdfContent',
  props: {
    content: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
