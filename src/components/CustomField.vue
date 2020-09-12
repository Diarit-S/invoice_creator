<template>
  <div class="custom-field">
    
    <template v-if="field.type === 'text'">

      <b-field label="Texte">
        <editor v-model="field.content" :init="tinyConfig"></editor>
      </b-field>

      <b-field label="Unité" label-position="on-border">
        <b-input type="search"></b-input>
        <p class="control">
          <b-dropdown v-model="unitFormat">
            <template #trigger>
              <button class="button is-info">
                {{ unitFormat }}
              </button>
            </template>
            <b-dropdown-item
              v-for="unit in possibleUnits"
              aria-role="listitem"
              :key="unit"
              :value="unit"
            >{{ unit }}</b-dropdown-item>
          </b-dropdown>
        </p>
      </b-field>

    </template>

  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
import TinyConfig from "@/utils/tinyConfig";

export default {
  name: "CustomField",
  components: {
    Editor,
  },
  data() {
    return {
      possibleUnits: ["mœ", "mL", "classique"],
    }
  },
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tinyConfig() {
      return TinyConfig;
    },
    unitFormat: {
      get() {
        return this.field.unit || "mœ"
      },
      set(value) {
        this.$set(this.field, 'unit', value)
      },
    },
  },
  methods: {
    onInitialized(editor) {
      console.log(editor);
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-field {
  display: flex;
  align-items: flex-end;
}
</style>
