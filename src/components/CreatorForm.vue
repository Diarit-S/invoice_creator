<template>
  <div class="pdf-content">
    <!-- <input type="text" name="Numero Devis" id="number" v-model="content.title"> -->
    <b-field class="document-type" label="Type de document">
      <b-select placeholder="Type de document" v-model="content.title">
        <option
            v-for="type in utilDatas.types"
            :value="type"
            :key="type">
            {{ type }}
        </option>
      </b-select>
      <span class="document-number">N° {{ utilDatas[content.title].number }}</span>
    </b-field>
    
  </div>
</template>

<script>
import utilDatas from '@/utils/utilDatas.json'


export default {
  name: 'CreatorForm',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  computed: {
      utilDatas() {
          return utilDatas
      }
  }
}
</script>

<style lang="scss" scoped>
.document-type {
  &::v-deep{
    .field.has-addons {
      display: flex;
      align-items: center;

      .document-number {
        margin-left: 10px;
      }
    }
  }
}


</style>
