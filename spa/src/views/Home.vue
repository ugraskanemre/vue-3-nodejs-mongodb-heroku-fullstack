<template>
  <appHeader />
  <div class="container-fluid">
    <div class="row mt-5">
      <div class="col-md-3" v-for="item in this.tickers" :key="item.id">
        <coinCard
          :title="item.title"
          :icon="item.icon"
          :coin="item.coin"
          :symbol="item.symbol"
          :allItems="this.tickers"
        ></coinCard>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-md-3 table-responsive">
        <table class="table table-striped table-light border">
          <thead>
            <tr>
              <th scope="col">Currency</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticker in tickers" :key="ticker._id">
              <td>1 {{ ticker.symbol }}</td>
              <td>{{ ticker.price }} BTC</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import CoinCard from "../components/CoinCard.vue";
import { mapGetters } from "vuex";

export default {
  name: "HomePage",
  components: {
    CoinCard,
  },
  data() {
    return {
      isLoading: false,
      tickers: [],
    };
  },
  created() {
    this.getTickerPrices();
  },
  computed: {
    ...mapGetters(["_getCurrentUser"]),
  },
  methods: {
    onLogout() {
      this.$store.commit("logoutUser");
      this.$router.push({ name: "LoginPage" });
    },
    async getTickerPrices() {
      this.isLoading = true;
      this.$appAxios
        .get("/tickers", {
          headers: {
            Authorization: `Bearer ${this._getCurrentUser.tokens.access_token}`,
          },
        })
        .then((tickers_response) => {
          if (tickers_response?.data?.length > 0) this.tickers = tickers_response.data;
        })
        .catch((err) => {
          if (!err.response) {
            console.log("err.response :>> ", err.response);
            var errorStatus = "Error: Network Error";
            alert(errorStatus);
          } else {
            if (err.response.status == 403) this.onLogout();
          }
          this.isLoading = false;
        })
        .finally(() => {
          //this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.table > :not(:first-child) {
  border-top: 0;
}
</style>
