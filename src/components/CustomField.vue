<template lang="pug">
  div.custom-field
    div.custom-field__infos
      b-field.custom-field__infos__content(label="Texte")
        editor(v-model="field.content" :init="tinyConfig")

      b-field(
        label="Unité"
        label-position="on-border"
        class="custom-field__infos__unit"
      )
        b-input(type="text" v-model="field.unitValue")
        p.control
          b-dropdown(v-model="unitFormat")
            template(#trigger)
              button.button.is-info {{ unitFormat === "Ensemble" ? "Ens" : unitFormat }}
            b-dropdown-item(
              v-for="unit in possibleUnits"
              aria-role="listitem"
              :key="unit"
              :value="unit"
            ) {{ unit }}

      b-field(
        label="Prix unitaire"
        label-position="on-border"
        class="custom-field__infos__ht-price"
      )
        b-input(type="number" step="0.1" v-model="field.unitPrice")

    div.custom-field__price
      b-tag(
        type="is-info is-light" 
        size="is-large" 
        v-if="calculatedFieldPrice"
      ) {{ calculatedFieldPrice }} € HT
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
      possibleUnits: ["m²", "mL", "U", "Ensemble"],
    };
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
        return this.field.unit || "m²";
      },
      set(value) {
        if (this.field.unit === "Ensemble") {
          this.$set(this.field, "unitValue", "");
        }
        if (value === "Ensemble") {
          this.$set(this.field, "unitValue", "Ensemble");
        }
        this.$set(this.field, "unit", value);
      },
    },
    calculatedFieldPrice() {
      if (this.field.unitValue * this.field.unitPrice) {
        return this.field.unitValue * this.field.unitPrice;
      } else {
        return this.field.unitPrice;
      }
    },
  },
  methods: {
    onInitialized(editor) {
      console.log(editor);
    },
  },
  watch: {
    "field.unitPrice": function() {
      this.$set(this.field, "amount", this.calculatedFieldPrice);
    },
    "field.unitValue": function() {
      this.$set(this.field, "amount", this.calculatedFieldPrice);
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-field {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;

  &__infos {
    display: flex;
    align-items: flex-end;

    .field {
      margin-bottom: 0 !important;
      margin-right: 10px;
    }

    &__unit {
      max-width: 175px;
    }

    &__ht-price {
      max-width: 175px;
    }
  }
}
</style>
