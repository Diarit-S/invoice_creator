<template lang="pug">
  div
    p Redirection
</template>

<script>
export default {
  methods: {
    redirect() {
      window.open(`mailto:${this.$route.params.email}?subject=${this.mailSubject}&body=${this.mailBody}`, '_blank')
    }
  },
  computed: {
    mailSubject() {
      return this.$route.params.docType === 'quote' ? 'Devis' : 'Facture' 
    },
    mailBodyDocType() {
      return this.$route.params.docType === 'quote' ? 'le devis' : 'la facture' 
    },
    secondMailBodyDocType() {
      return this.$route.params.docType === 'quote' ? 'ce devis' : 'cette facture' 
    },
    mailBody() {
      return `Bonjour%2C+${encodeURI(this.$route.params.clientName)}%0D%0A%0D%0AVous+trouverez+ci-joint+${encodeURI(this.mailBodyDocType)}+concernant+les+travaux+au+${encodeURI(this.$route.params.clientAddress)}%0D%0A%0D%0ANous+restons+%C3%A0+votre+disposition+pour+r%C3%A9pondre+%C3%A0+toutes+questions+%0D%0Aconcernant+${encodeURI(this.secondMailBodyDocType)}+ou+pour+tous+renseignements+compl%C3%A9mentaires.%0D%0A%0D%0ACordialement%0D%0A%0D%0AMr+Salihaj`
    },
  },
  mounted() {
    this.redirect();
  }
}
</script>