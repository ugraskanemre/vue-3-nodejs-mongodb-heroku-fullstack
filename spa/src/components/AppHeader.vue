<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-light shadow-sm">
    <div class="container-fluid">
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <span
              class="navbar-text text-black"
              style="font-weight: bold; font-size: 20px"
              v-if="_isAuthendicated"
            >
              Hello {{ this._getCurrentUser.name + " " + this._getCurrentUser.surname }}
            </span>
          </li>
        </ul>
        <span style="margin-right: 5px"
          ><a
            class="text-black"
            style="text-decoration: none; cursor: pointer"
            @click="onLogout()"
          >
            Sign Out
          </a></span
        >
        <span>
          <i
            @click="onLogout()"
            style="color: red; cursor: pointer"
            class="fa-solid fa-arrow-right-from-bracket pl-5"
          ></i>
        </span>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AppHeader",
  methods: {
    onLogout() { 
      this.$store.commit("logoutUser");
      this.$router.push({ name: "LoginPage" });
    },
  },
  computed: {
    ...mapGetters(["_isAuthendicated", "_getCurrentUser"]),
  },
};
</script>

<style>
.navbar{
  min-height: 80px;
}

</style>
