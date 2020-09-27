<template lang="pug">
  div.custom-field
    div.custom-field__infos
      b-field.custom-field__infos__content
        template(#label)
          .content-field-label
            div(@click="copyField")
              b-icon.copy-icon(
                icon="content-copy" 
                type="is-dark"
              )
            div()
              slot(name="drag")
            div(@click="saveAsFieldTemplate")
              b-icon.save-icon(
                icon="content-save-edit-outline" 
                type="is-dark"
              )
        editor(v-model="field.content" :init="tinyConfig")

      b-field(
        label="Unité"
        label-position="on-border"
        class="custom-field__infos__unit"
        :grouped="false"
      )
        b-numberinput(:controls="false" v-model="field.unitValue" step="0.01")
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
        b-numberinput(:controls="false" v-model="field.unitPrice" step="0.01")

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
          this.$set(this.field, "unitValue", 1);
        }
        if (value === "Ensemble") {
          this.$set(this.field, "unitValue", 1);
        }
        this.$set(this.field, "unit", value);
      },
    },
    calculatedFieldPrice() {
      if (this.field.unitValue * this.field.unitPrice) {
        return parseFloat((this.field.unitValue * this.field.unitPrice).toFixed(2));
      } else {
        return this.field.unitPrice;
      }
    }
  },
  methods: {
    onInitialized(editor) {
      console.log(editor);
    },
    copyField() {
      this.$emit('copy:field')
    },
    saveAsFieldTemplate() {
      this.$emit('saveAsTemplate')
    }
  },
  watch: {
    "field.unitPrice": function(newValue) {
      console.log(newValue)
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

  &__infos {
    display: flex;
    align-items: flex-end;

    &__content {
      margin: 15px 0;
    }

    .field {
      margin-bottom: 0 !important;
    }

    &__unit {
      max-width: 175px;
      margin: 10px;
    }

    &__ht-price {
      max-width: 175px;
      margin: 10px;
    }
  }

  &::v-deep {
    .label {
      margin-left: 0 !important;
    }

    .input {
      text-align: right;
    }
  }

  .content-field-label {
    display: flex;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;

    * {
      margin-right: 10px;
    }
  }

  &:hover {
    .content-field-label {
      opacity: 1;
    }
  }
}


.copy-icon {
  cursor: pointer;
  transition: transform 0.15s ease-in-out;
  &:hover {
    transform: translateY(-3px)
  }
}

.save-icon {
  cursor: pointer;
  transition: transform 0.15s ease-in-out;
  margin-left: 15px;
  &:hover {
    transform: translateY(-3px)
  }
}
</style>
