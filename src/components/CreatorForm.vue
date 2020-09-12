<template>
  <div class="pdf-content">
    <link
      rel="stylesheet"
      href="https://cdn.materialdesignicons.com/5.3.45/css/materialdesignicons.min.css"
    />
    <div class="left-side">
      <b-field class="document-type" label="Type de document">
        <b-select placeholder="Type de document" v-model="content.title">
          <option v-for="type in utilDatas.types" :value="type" :key="type">
            {{ type }}
          </option>
        </b-select>
        <span class="document-number"
          >N° {{ utilDatas[content.title].number }}</span
        >
      </b-field>
      <b-field class="client" label="Client">
        <b-select placeholder="Client" v-model="content.clientId">
          <option
            v-for="(client, index) in clients"
            :value="index"
            :key="client.fullName + index"
          >
            {{ client.fullName }}
          </option>
        </b-select>
        <p>
          {{ content.clientId >= 0 ? clients[content.clientId].address : "" }}
        </p>
      </b-field>
    </div>

    <div class="pdf-content__right">
      <custom-field
        v-for="(field, index) in currentFields"
        :key="field.type + index"
        :field="field"
      ></custom-field>

      <b-dropdown aria-role="list">
        <button class="button is-info" slot="trigger">
          <b-icon icon="plus-circle-outline"></b-icon>
        </button>

        <b-dropdown-item
          v-for="field in possibleFields"
          aria-role="listitem"
          :key="field"
          @click="createNewField(field)"
          >{{ field }}</b-dropdown-item
        >
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import utilDatas from "@/utils/utilDatas.json";
import clients from "@/utils/clientDataBase.json";

import CustomField from "./CustomField";

export default {
  name: "CreatorForm",
  components: {
    CustomField,
  },
  data() {
    return {
      possibleFields: ["text", "title", "info"],
      currentFields: [],
    };
  },
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
  computed: {
    utilDatas() {
      return utilDatas;
    },
    clients() {
      return clients;
    },
  },
  methods: {
    createNewField(fieldType) {
      this.currentFields.push({ type: fieldType });
    },
  },
};
</script>

<style lang="scss" scoped>
.pdf-content {
  display: flex;
  justify-content: space-between;

  &__right {
    padding-left: 50px;
    min-width: 80%;
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
</style>