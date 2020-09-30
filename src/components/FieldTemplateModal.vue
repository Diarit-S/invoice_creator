<template lang="pug">
  form(action="" style="width: 400px")
    .modal-card(style="width: auto")
      header.modal-card-head
        p.modal-card-title Enregistrer un nouveau model
        button.delete(
          type="button"
          @click="$emit('closeTemplateModal')"
        )
      section.modal-card-body
        b-field(label="Nom du model" label-position="on-border" autocomplete="off")
          b-input(v-model="newTemplate.name" autocomplete="off")

      footer.modal-card-foot
        b-button.is-info.button(type="button" @click="$emit('createTemplate')") Valider
          
</template>

<script>
export default {
  name: 'fieldTemplateModal',
  props: {
    newTemplate: {
      type: Object,
      required: true
    }
  }
}
</script>