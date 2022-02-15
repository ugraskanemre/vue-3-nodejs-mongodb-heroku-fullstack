<template>
  <div class="card text-center coin-card">
    <div class="card-header card-title" style="font-size: 18px">{{ this.title }}</div>
    <div
      class="card-body"
      style="min-height: 180px; justify-content: center; align-items: center"
    >
      <img
        :src="getImgUrl(this.icon)"
        class="img-fluid opacity-25"
        style="padding-top: 20px; min-height: 60px"
        width="30"
      />

      <p class="card-text" style="font-weight: bold; font-size: 30px">
        {{ this.coin }}
      </p>
    </div>
    <div
      class="card-footer"
      style="display: flex; justify-content: space-between; min-height: 60px"
    >
      <button
        type="button"
        class="btn btn-outline-primary btn-block"
        style="min-width: 100px"
        @click="
          toggleModal();
          toggleModalAction('Sell');
        "
      >
        SELL
      </button>

      <button
        type="button"
        class="btn btn-outline-primary btn-block"
        style="min-width: 100px"
        @click="
          toggleModal();
          toggleModalAction('Buy');
        "
      >
        BUY
      </button>
    </div>
  </div>
  <div class="home">
    <Modal
      @close="toggleModal(action)"
      :modalActive="modalActive"
      :actionType="actionType"
      :fromQuantity="this.cardData.fromQuantity"
      :fromExchangeSymbol="this.symbol"
      :fromExchange="this.title"
      :fromItemPrice="this.cardData.fromItemPrice"
      :toQuantity="this.cardData.toQuantity"
      :toExchangeSymbol="this.cardData.toItemSymbol"
      :toExchange="this.cardData.selectedItem"
      :toItemPrice="this.cardData.toItemPrice"
      :allItems="this.cardData.filteredItems"
      :totalAmount="this.cardData.totalAmount"
      :remainingAmount="this.cardData.remainingAmount"
      :comission="this.cardData.comission"
      :comissionAmount="this.cardData.comissionAmount"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ this.cardData.action + " " + this.title }}
          </h5>
        </div>
        <div class="modal-body">
          <form>
            <div class="row" style="margin: 30px 5px 30px 5px; justify-content: center">
              <div class="col-md-5 mb-3">
                <div class="input-group" style="border-bottom: solid 1px">
                  <input
                    placeholder="0.00"
                    type="number"
                    min="0"
                    step="0.01"
                    @change="toChange()"
                    v-model="cardData.fromQuantity"
                    class="form-control quantity-input"
                  />
                  <span class="input-group-text symbol-span">{{ this.symbol }}</span>
                </div>
              </div>
              <div class="col-md-1 mb-3" style="display: flex; align-items: center">
                <span v-if="this.cardData.action == 'Sell'">to</span>
                <span v-else-if="this.cardData.action == 'Buy'">from</span>
              </div>
              <div class="col-md-5 mb-3">
                <select
                  v-model="cardData.toItemSymbol"
                  v-bind:title="cardData.selectedItem"
                  class="form-select select-input"
                  @change="toChange()"
                >
                  <option
                    v-for="(item, index) in filterItems"
                    v-bind:value="item.symbol"
                    v-bind:title="item.title"
                    :disabled="item.symbol == this.symbol"
                    :class="{ disabled: item.symbol == this.symbol }"
                  >
                    {{ item.title }}
                  </option>
                </select>
              </div>
            </div>
            <div class="row" style="margin-left: 30px; justify-content: start">
              <div class="col-md-8 mb-3">
                <span style="font-size: 12px" v-if="this.cardData.toQuantity > 0"
                  ><strong>Total {{ this.cardData.toItemSymbol }} Quantity :</strong>
                  {{ this.cardData.toQuantity }}
                </span>
                <br />
                <span style="font-size: 12px" v-if="this.cardData.comissionAmount > 0"
                  ><strong
                    >Comission (%
                    {{ parseFloat(this.cardData.comission * 100).toFixed(2) }}) :</strong
                  >
                  {{ this.cardData.comissionAmount }} BTC
                </span>
                <br />
                <span style="font-size: 12px" v-if="this.cardData.totalAmount > 0"
                  ><strong>Total Amount :</strong> {{ this.cardData.totalAmount }} BTC
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "../components/Modal";
import { ref } from "vue";

export default {
  name: "coinCard",
  components: {
    Modal,
  },

  setup(props, { emit }) {
    const modalActive = ref(false);
    const actionType = "Buy";

    const toggleModal = () => {
      modalActive.value = !modalActive.value;
    };

    return { modalActive, toggleModal, actionType };
  },
  props: {
    allItems: {
      type: Array,
      required: true,
      default: () => [],
    },
    title: {
      type: String,
      required: true,
      default: () => "-",
    },
    icon: {
      type: String,
      required: true,
      default: () => "-",
    },
    symbol: {
      type: String,
      required: true,
      default: () => "-",
    },
    coin: {
      type: String,
      required: true,
      default: () => "0",
    },
  },
  data() {
    return {
      cardData: {
        action: null,
        coinName: null,
        filteredItems: null,
        fromQuantity: "0,00",
        toQuantity: "0,00",
        totalAmount: 0,
        remainingAmount: 0,
        comission: 0.0045,
        comissionAmount: 0,
        selectedItem: null,
        fromItemPrice: 0,
        toItemPrice: 0,
        toItemSymbol: null,
      },
    };
  },
  computed: {
    filterItems() {
      this.cardData.filteredItems = this.allItems.filter(
        (item) => item.symbol != this.symbol
      );
      return this.cardData.filteredItems;
    },
  },

  methods: {
    emitChange(e) {
      this.$emit("change", e.target.value);
    },
    toChange() {
      this.cardData.fromItemPrice = this.allItems.filter(
        (item) => item.symbol == this.symbol
      )[0]?.price;

      this.cardData.toItemPrice = this.cardData.filteredItems.filter(
        (item) => item.symbol == this.cardData.toItemSymbol
      )[0]?.price;

      this.cardData.totalAmount = parseFloat(
        this.cardData.fromItemPrice * this.cardData.fromQuantity
      ).toFixed(8);

      this.cardData.comissionAmount = parseFloat(
        this.cardData.totalAmount * this.cardData.comission
      ).toFixed(8);

      this.cardData.remainingAmount = parseFloat(
        this.cardData.totalAmount - this.cardData.comissionAmount
      ).toFixed(8);

      this.cardData.toQuantity = parseFloat(
        this.cardData.remainingAmount / this.cardData.toItemPrice
      ).toFixed(8);

      this.cardData.selectedItem = this.cardData.filteredItems.filter(
        (item) => item.symbol == this.cardData.toItemSymbol
      )[0]?.title;

      /* console.log("this.cardData.fromItemPrice    :>> ", this.cardData.fromItemPrice);
      console.log("this.cardData.toItemPrice      :>> ", this.cardData.toItemPrice);
      console.log("this.cardData.comissionAmount  :>> ", this.cardData.comissionAmount);
      console.log("this.cardData.totalAmount      :>> ", this.cardData.totalAmount);
      console.log("this.cardData.remainingAmount  :>> ", this.cardData.remainingAmount);
      console.log("this.cardData.fromQuantity     :>> ", this.cardData.fromQuantity);
      console.log("this.cardData.toQuantity       :>> ", this.cardData.toQuantity);*/
    },

    getImgUrl(name) {
      return require("../assets/icons/" + name + ".svg");
    },
    toggleModalAction(action) {
      this.actionType = action;
      this.cardData.action = action;
      this.cardData.quantity = "0,00";
    },
  },
};
</script>

<style lang="scss" scoped>
.input-group .form-control {
  margin: 0px !important;
}
.symbol-span {
  background: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0rem 0.25rem 0.25rem 0rem;
  border: none;
}
.disabled {
  font-size: 10px;
}
.quantity-input {
  border: none;
  border-right: 1px solid #b1b1b1;
  background-color: #e9ecef;
  min-height: 50px;
  border-radius: 0.25rem 0rem 0rem 0.25rem;
}
.select-input {
  border: none;
  background-color: #e9ecef;
  cursor: pointer;
  min-height: 50px;
  border-radius: 5px 0px 5px 0px 0px !important;
  border-bottom: solid 1px black;
}
.form-control:focus {
  box-shadow: inset 0 0 1px #000000;
}
.form-select:focus {
  box-shadow: inset 0 0 1px #000000;
}
.home {
  .modal-content {
    display: flex;
    flex-direction: column;
    border: none;
    border-radius: 0;
    h1,
    p {
      margin-bottom: 16px;
    }
    h1 {
      font-size: 32px;
    }
    p {
      font-size: 18px;
    }
  }
}

.coin-card {
  border-top-left-radius: 12px !important;
  border-top-right-radius: 12px !important;
}
.coin-card:hover {
  border: solid 1px blue;
  cursor: pointer;
  transition: 1.5s;
}
.coin-card:hover .card-header {
  background-color: blue;
  transition: 1.5s;
}

.coin-card:hover .card-title {
  transition: 0.2s;
  color: white;
  font-weight: 700;
}

.card-header {
  background-color: white;
  border-top-left-radius: 12px !important;
  border-top-right-radius: 12px !important;
}
.card-footer {
  background-color: white;
}
.is-invalid-input {
  border: solid 1px red;
  border-radius: 0px;
}
</style>
