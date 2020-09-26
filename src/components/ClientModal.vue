<template lang="pug">
  form(action="" style="width: 400px")
    .modal-card(style="width: auto")
      header.modal-card-head
        p.modal-card-title Ajouter un client
        button.delete(
          type="button"
          @click="$emit('close')"
        )
      section.modal-card-body
        b-field(label="Nom et Prénom" label-position="on-border" autocomplete="off")
          b-input(v-model="newClient.fullName" autocomplete="off")
        b-field(label="Adresse" label-position="on-border" autocomplete="off")
          b-input(v-model="newClient.address" autocomplete="off")
        b-field(label="Code postale et ville" label-position="on-border" autocomplete="off")
          b-input(v-model="newClient.zipCodeAndCity" autocomplete="off")
        b-field(label="Addresse chantier" label-position="on-border" autocomplete="off")
          b-input(v-model="newClient.workAddress" autocomplete="off")

      footer.modal-card-foot
        b-button.is-info.button(type="button" @click="$emit('createClient')") Valider
          
</template>

<script>
export default {
  name: 'clientModal',
  props: {
    newClient: {
      type: Object,
      required: true
    }
  }
}
</script>