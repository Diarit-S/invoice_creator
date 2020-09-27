<template lang="pug">
  div.pdf-content
    div(style="min-width: 375px")

    left-side(
      :currentPaper="content.currentPaper"
      :amountsData="amountsData"
      :clients="content.clients"
      @openClientModal="openClientModal"
    )

    .pdf-content__right
      draggable(
        v-model="content.currentPaper.fields" 
        handle=".drag"
        v-bind="dragOptions"
      )
        transition-group(type="transition" name="flip-list")
          custom-field.list-complete-item(
            v-for="(field, index) in content.currentPaper.fields"
            :key="'field' + index"
            :field="field"
            @copy:field='copyField(field, index)'
          )
            template(#drag)
              b-icon.drag-icon.drag(
                icon="drag-horizontal" 
                type="is-dark"
              )

      .pdf-content__right__config
        b-button.is-info(size="is-medium" icon-left="plus-circle-outline" @click="createNewField")

    b-modal(
      v-model="isClientModalOpen"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    )
      template(#default="props")
        client-modal(:newClient="newClient" @createClient="createClient(props)")
</template>

<script>

import CustomField from "./CustomField";

import LeftSide from "./LeftSide";

import ClientModal from './ClientModal'

import _ from 'lodash'

import Draggable from 'vuedraggable'


export default {
  name: "CreatorForm",
  components: {
    CustomField,
    LeftSide,
    ClientModal,
    Draggable
  },
  data() {
    return {
      isClientModalOpen: false,
      newClient: {
        fullName: '',
        address: '',
        zipCodeAndCity: '',
        workAddress: "Identique à l'adresse client",
      }
    }
  },
  props: {
    content: {
      type: Object,
      required: true,
    },
    amountsData: {
      type: Object,
      required: true
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    createNewField() {
      this.content.currentPaper.fields.push({unit: 'm²'});
    },
    async getClients() {
      const clients = await this.$http.get('/client/')
      this.content.clients = clients.data
    },
    async createClient(props) {
      const newClient = await this.$http.post('/client/createClient', this.newClient) 
      props.close()
      this.content.clients.push(newClient.data)
    },
    async createPaper() {
      const newPaper = await this.$http.post('/paper/createPaper', this.content.currentPaper) 
      console.log(newPaper)
    },
    async getLastDocumentNumber() {
      const lastDocumentNumber = await this.$http.get(`/paper/getLastNumber/${this.content.currentPaper.type}`)
      //- .data ....
      this.content.currentPaper.documentNumber = lastDocumentNumber
    },
    async getLastDocumentNumberByType() {
      const lastNumber = await this.$http.get(`/paper/getLastNumberOfType/${this.content.currentPaper.type}`)
      console.log(lastNumber)
    },
    openClientModal() {
      this.isClientModalOpen = true
    },
    copyField(field, index) {
      this.content.currentPaper.fields.splice(index + 1, 0, _.cloneDeep(field))
    }
  },
  created() {
    this.getClients()
    this.getLastDocumentNumberByType()
    //- this.getLastDocumentNumber
    //- Create a watch for document type and recall getLastDocumentNumber
  },
  watch: {
    'content.currentPaper.type': function() {
      this.getLastDocumentNumberByType()
    }
  }
};
</script>

<style lang="scss" scoped>
.pdf-content {
  display: flex;
  justify-content: space-between;

  &__right {
    padding-left: 50px;
    min-width: 70%;
    max-width: 70%;
    transition: all 1s ease-in-out;

    &__config {
      display: flex;
      justify-content: flex-start;
      margin-top: 10px;
    }
  }

  &__left {
    position: fixed;
    min-width: 400px;
    max-width: 400px;
    box-shadow: 0 0 20px rgba($color: gray, $alpha: 0.4);
    padding: 20px;
    border-radius: 10px;
    min-height: 80vh;


   .field {
     max-width: 150px;
     margin: 30px 0;
   }
  }
}

.document-type {
  &::v-deep {
    .field.has-addons {
      display: flex;
      align-items: center;

      .document-number {
        margin-left: 10px;
      }
    }
  }
}

.client {
  &::v-deep {
    .field.has-addons {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
}

.price-field {
  margin: 30px 0;
}

.client-field-label {
  display: flex;
  align-items: center;

  .client-plus-icon {
    cursor: pointer;
    margin-left: 8px;
  }
}

.client-modal-container {
  border-radius: 6px;
  background-color: white; 
  padding: 20px;
  max-width: 500px;
  margin: auto;
}

.ghost {
  opacity: 0.5;
}

// .list-complete-item {
//   transition: all 1s;
//   display: inline-block;
// }
// .list-complete-enter, .list-complete-leave-to
// /* .list-complete-leave-active below version 2.1.8 */ {
//   opacity: 0;
//   transform: translateX(-30px);
// }
// .list-complete-leave-active {
//   position: absolute;
// }

.flip-list-move {
  transition: transform 0.5s;
}

.drag-icon {
  cursor: pointer;
  transition: transform 0.15s ease-in-out;
  &:hover {
    transform: translateY(-3px)
  }
}

</style>
