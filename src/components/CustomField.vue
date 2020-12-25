<template lang="pug">
  div.custom-field
    .link-icon(v-if="field.linkedToPreviousField")
      b-icon(
        icon="ethernet-cable" 
        type="is-info"
        size="is-medium"
      )
    div.custom-field__infos
      div.drag-icon
        slot(name="drag")
      b-field.custom-field__infos__content
        template(#label)
          .content-field-label
            div(@click="copyField")
              b-icon.copy-icon(
                icon="content-copy" 
                type="is-dark"
              )
            div(@click="linkToPreviousField")
              b-icon.cable-icon(
                icon="cable-data" 
                type="is-dark"
              )
            slot(name="templateBtn")
            div.delete-icon-container(@click="deleteField")
              b-icon.delete-icon(
                icon="close-circle-outline" 
                type="is-danger"
              )
        editor.editor(
          ref="editor"
          v-model="field.content"
          :init="tinyConfig"
        )

      b-field.custom-field__infos__unit(
        label="Unité"
        label-position="on-border"
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

      b-field.custom-field__infos__ht-price(
        label="Prix unitaire"
        label-position="on-border"
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
      required: true
    },
    drag: {
      type: Boolean,
      default: false
    }
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
    },
    deleteField() {
      this.$emit('delete:field')
    },
    linkToPreviousField() {
      this.field.linkedToPreviousField ? 
      this.$set(this.field, 'linkedToPreviousField', false) :
      this.$set(this.field, 'linkedToPreviousField', true)
    },
    initSpellChecker() {
      const editor = this.$refs.editor.element
      editor.setAttribute("spellcheck", true)
    }
  },
  mounted() {
    this.initSpellChecker() 
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
  position: relative;
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
      box-shadow: 0px 0px 30px -10px rgba(0, 0, 0, 0.32);
    }

    &__ht-price {
      max-width: 175px;
      margin: 10px;
      box-shadow: 0px 0px 30px -10px rgba(0, 0, 0, 0.32);
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

  .drag-icon {
    align-self: flex-start;
    margin-top: 30px;
    margin-right: 5px;
    opacity: 0;
  }

  &:hover {
    .content-field-label {
      opacity: 1;
      transition: opacity 0.2s ease-in-out;
    }
    .drag-icon {
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
.cable-icon {
  cursor: pointer;
  transition: transform 0.15s ease-in-out;
  &:hover {
    transform: translateY(-3px)
  }
}

.delete-icon-container {
  margin-left: auto;
  margin-right: 0 !important;
}

.delete-icon {
  margin: 0;
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

.no-pointer {
  pointer-events: none;
}

.link-icon {
  position: absolute;
  top: 5px;
  left: 30%;
}
</style>
