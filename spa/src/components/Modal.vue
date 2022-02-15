<template>
  <transition name="modal-animation">
    <div v-show="modalActive" class="modal">
      <transition name="modal-animation-inner">
        <div v-show="modalActive" class="modal-inner">
          <i @click="close" class="fa-solid fa-circle-xmark close-card"></i>

          <slot>
            <!-- Modal Content -->
          </slot>

          <span
            class="error-span"
            style="margin-left: 40px; position: absolute"
            v-if="!this.validForm"
            >Lütfen üstteki tüm alanları doldurunuz.</span
          >

          <div class="modal-footer">
            <button
              type="button"
              style="min-width: 80px"
              class="btn btn-outline-secondary"
              data-bs-dismiss="modal"
              @click="close"
            >
              Cancel
            </button>
            <button
              type="button"
              style="min-width: 80px"
              @click="onSubmit"
              class="btn btn-outline-primary uppercase"
            >
              <span v-if="!isLoadingWatch"> {{ actionType }}</span>
              <span v-if="isLoadingWatch">
                {{ actionType }}
                <i class="fa-solid fa-spinner fa-spin"></i>
              </span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import useValidate from "@vuelidate/core";
import coinCard from "../components/CoinCard";
import { required, minValue } from "@vuelidate/validators";
import { mapGetters } from "vuex";
export default {
  components: {
    coinCard,
  },
  props: [
    "modalActive",
    "actionType",
    "allItems",
    "fromQuantity",
    "toQuantity",
    "fromItemPrice",
    "toItemPrice",
    "totalAmount",
    "remainingAmount",
    "comission",
    "comissionAmount",
    "fromExchange",
    "fromExchangeSymbol",
    "toExchange",
    "toExchangeSymbol",
  ],
  setup(props, { emit }) {
    const close = () => {
      emit("close");
    };
    return { close };
  },
  created() {},
  data() {
    return {
      validForm: true,
      isLoading: false,
      formData: {
        side: null,
        fromExchange: null,
        fromExchangeSymbol: null,
        fromItemPrice: null,
        fromQuantity: null,

        toExchange: null,
        toExchangeSymbol: null,
        toItemPrice: null,
        toQuantity: null,

        comission: null,
        comissionAmount: null,

        totalAmount: null,
        remainingAmount: null,
      },
    };
  },
  computed: {
    isLoadingWatch() {
      return this.isLoading ? true : false;
    },
    ...mapGetters(["_getCurrentUser"]),
  },
  methods: {
    onLogout() {
      this.$store.commit("logoutUser");
      this.$router.push({ name: "LoginPage" });
    },
    resetModalFunc() {
      console.log("resetModal :>> ");
      this.formData.side = null;
      this.formData.fromQuantity = null;
      this.formData.toQuantity = null;
      this.formData.fromItemPrice = null;
      this.formData.toItemPrice = null;
      this.formData.totalAmount = null;
      this.formData.remainingAmount = null;
      this.formData.comission = null;
      this.formData.comissionAmount = null;
      this.formData.toExchange = null;
      this.formData.toExchangeSymbol = null;
      this.formData.fromExchange = null;
      this.formData.fromExchangeSymbol = null;
      this.$emit("close");
    },
    onSubmit() {
      this.formData.side = this.actionType.toUpperCase();
      this.formData.fromQuantity = parseFloat(this.fromQuantity).toFixed(8);
      this.formData.toQuantity = parseFloat(this.toQuantity).toFixed(8);
      this.formData.fromItemPrice = this.fromItemPrice;
      this.formData.toItemPrice = this.toItemPrice;
      this.formData.comission = this.comission;
      this.formData.comissionAmount = this.comissionAmount;
      this.formData.toExchange = this.allItems.filter(
        (item) => item.symbol == this.toExchangeSymbol
      )[0]?.title;
      this.formData.toExchangeSymbol = this.toExchangeSymbol;
      this.formData.fromExchange = this.fromExchange;
      this.formData.fromExchangeSymbol = this.fromExchangeSymbol;
      this.formData.totalAmount = this.totalAmount;
      this.formData.remainingAmount = this.remainingAmount;

      console.log("----------------------------------------- :>> ");
      console.log("side                    :>> ", this.formData.side);
      console.log("fromExchange            :>> ", this.formData.fromExchange);
      console.log("fromExchangeSymbol      :>> ", this.formData.fromExchangeSymbol);
      console.log("fromItemPrice           :>> ", this.formData.fromItemPrice);
      console.log("fromQuantity            :>> ", this.formData.fromQuantity);

      console.log("toExchange              :>> ", this.formData.toExchange);
      console.log("toExchangeSymbol        :>> ", this.formData.toExchangeSymbol);
      console.log("toItemPrice             :>> ", this.formData.toItemPrice);
      console.log("toQuantity              :>> ", this.formData.toQuantity);

      console.log("comission               :>> ", this.formData.comission);
      console.log("comissionAmount         :>> ", this.formData.comissionAmount);

      console.log("totalAmount             :>> ", this.formData.totalAmount);
      console.log("remainingAmount         :>> ", this.formData.remainingAmount);
      console.log("----------------------------------------- :>> ");

      if (
        this.formData.quantity <= 0 ||
        this.formData.side == null ||
        this.formData.toExchange == null ||
        this.formData.toExchangeSymbol == null ||
        this.formData.fromExchange == null ||
        this.formData.fromExchangeSymbol == null ||
        this.formData.price <= 0 ||
        this.formData.comission == null ||
        this.formData.comissionAmount == null
      ) {
        this.validForm = false;
        return;
      } else {
        this.isLoading = true;
        this.validForm = true;

        this.$appAxios({
          url: "/tickers/order",
          method: "POST",
          headers: {
            Authorization: `Bearer ${this._getCurrentUser.tokens.access_token}`,
            ContentType: "Application-Json",
          },
          data: { ...this.formData },
        })
          .then((order_response) => {
            if (order_response?.data) {
              console.log("response :>> ", order_response);
              this.resetModalFunc();

              this.$toast.success(`Success Transaction :)`);
              setTimeout(this.$toast.clear, 3000);
            }
          })
          .catch((err) => {
            if (!err.response) {
              var errorStatus = "Error: Network Error";
              this.resetModalFunc();
              this.$toast.error(errorStatus);
              setTimeout(this.$toast.clear, 3000);
            } else {
              if (err.response.status == 403) this.onLogout();
            }

            const self = this;
            setTimeout(function () {
              self.isLoading = false;
            }, 2000);
          })
          .finally(() => {});
      }
      console.log("validForm 2             :>> ", this.validForm);
    },
  },
};
</script>

<style lang="scss" scoped>
.error-span {
  font-size: 11px;
  color: red;
  font-weight: 600;
}

.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}

.modal-animation-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-animation-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-animation-inner-leave-to {
  transform: scale(0.8);
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(141 139 139 / 70%);

  .modal-inner {
    position: relative;
    max-width: 640px;
    width: 80%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.3rem;

    .close-card {
      position: absolute;
      top: -7px;
      right: -5px;
      font-size: 22px;
      cursor: pointer;
      z-index: 999;

      &:hover {
        color: red;
      }
    }
  }
}
</style>
