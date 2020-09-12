<template>
  <div class="pdf-content">
    <link
      rel="stylesheet"
      href="https://cdn.materialdesignicons.com/5.3.45/css/materialdesignicons.min.css"
    />
    <div style="min-width: 200px"></div>
    <div class="pdf-content__left">
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

      <b-field class="price-field" label="Total HT" label-position="on-border">
        <b-tag type="is-info is-light" size="is-large">{{ totalWithoutTaxes }} €</b-tag>
      </b-field>

      <b-field class="price-field" label="TVA" label-position="on-border">
        <b-tag type="is-info is-light" size="is-large">{{ taxeAmount }} €</b-tag>
        <p class="control">
          <b-dropdown v-model="TVAPercent">
              <template #trigger>
                <button class="button is-info">
                  {{ TVAPercent }} %
                </button>
              </template>
              <b-dropdown-item
                v-for="percent in possibleTvaPercents"
                aria-role="listitem"
                :key="percent"
                :value="percent"
              >{{ percent }} %</b-dropdown-item>
            </b-dropdown>
        </p>
      </b-field>

    </div>

    <div class="pdf-content__right">
      <custom-field
        v-for="(field, index) in currentFields"
        :key="field.type + index"
        :field="field"
      ></custom-field>


      <div class="pdf-content__right__config">
        <b-dropdown aria-role="list" class="pdf-content__right__plus">
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

        <b-tag type="is-warning is-light" size="is-large" v-if="totalWithoutTaxes">Total : {{ totalWithoutTaxes }} € HT</b-tag>

      </div>
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
      currentFields: [
        { type: 'text' }
      ],
      possibleTvaPercents: [10, 20],
      TVAPercent: 10
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
    totalWithoutTaxes() {
      return this.currentFields.reduce((acc, currentField) => {
        if (currentField.amount) {
          acc += currentField.amount
        }
        return acc
      }, 0)
    },
    taxeAmount() {
      return this.totalWithoutTaxes * (this.TVAPercent / 100)
    }
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

    &__config {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
  }

  &__left {
    position: fixed;
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
</style>
