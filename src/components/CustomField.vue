<template>
  <div>
      <template v-if="field.type === 'text'">
        <b-field label="Texte">
            <b-input maxlength="200" type="textarea"></b-input>
        </b-field>
      </template>
  </div>
</template>

<script>

export default {
  name: 'CustomField',
  data() {
    return {
    }
  },
  props: {
    field: {
      type: Object,
      required: true
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
