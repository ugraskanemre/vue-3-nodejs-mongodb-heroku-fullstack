<template>
  <div class="root">
    <h2>Register</h2>
    <p>
      <input
        type="text"
        placeholder="Name"
        v-model="userData.name"
        :class="{ 'is-invalid-input': v$.userData.name.$error }"
      />
      <span v-if="v$.userData.name.$error" class="error-span">
        {{ v$.userData.name.$errors[0].$message }}
      </span>
    </p>
    <p>
      <input
        type="text"
        placeholder="Surname"
        v-model="userData.surname"
        :class="{ 'is-invalid-input': v$.userData.surname.$error }"
      />
      <span v-if="v$.userData.surname.$error" class="error-span">
        {{ v$.userData.surname.$errors[0].$message }}
      </span>
    </p>
    <p>
      <input
        type="text"
        placeholder="Email"
        v-model="userData.email"
        v-on:change="checkUniqueEmail"
        :class="{ 'is-invalid-input': v$.userData.email.$error }"
      />
      <span
        v-if="
          v$.userData.email.$error || (this.userData.email != '' && !this.isEmailTaken)
        "
        class="error-span"
      >
        {{
          v$.userData.email.$errors.length > 0
            ? v$.userData.email.$errors[0].$message
            : this.isEmailTakedMessage
        }}
      </span>
    </p>
    <p>
      <input
        type="password"
        placeholder="Password"
        v-model="userData.password"
        :class="{ 'is-invalid-input': v$.userData.password.$error }"
      />
      <span v-if="v$.userData.password.$error" class="error-span">
        {{ v$.userData.password.$errors[0].$message }}
      </span>
      <span class="error-span" id="errorMessage"></span>
    </p>

    <div class="row" style="justify-content: space-between; padding: 10px">
      <button
        @click="$router.push('/login')"
        style="max-width: 120px"
        class="btn btn-outline-secondary"
      >
        Login
      </button>

      <button class="btn btn-primary" @click="submitForm" style="max-width: 120px">
        <span v-if="!isLoading">Register</span>
        <span v-if="isLoading">Register <i class="fa-solid fa-spinner fa-spin"></i></span>
      </button>
    </div>
  </div>
</template>
<script>
import useValidate from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import CryptoJS from "crypto-js";

export default {
  name: "Register",
  data() {
    return {
      v$: useValidate(),
      isLoading: false,
      isEmailTaken: true,
      isEmailTakedMessage: "This e-mail address has already been taken",
      userData: {
        name: "",
        surname: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    submitForm() {
      this.v$.$validate();
      if (!this.v$.$error) {
        this.isLoading = true;
        const key = this.$store.getters._saltKey;
        const cryptedPassword = CryptoJS.HmacSHA1(this.userData.password, key).toString();
        //console.log(this.isLoading);
        //const decryptedPassword = CryptoJS.AES.decrypt(cryptedPassword, key).toString(CryptoJS.enc.Utf8);
        console.log(this.userData);
        this.$appAxios
          .post("/users/signup", { ...this.userData })
          .then((registered_user_response) => {
            console.log(registered_user_response);
            if (registered_user_response != null) {
              //this.$store.commit("setUser", registered_user_response?.data);

              const self = this;
              setTimeout(function () {
                self.$router.push({ name: "LoginPage" });
              }, 2000);
            }
          })
          .catch((err) => {
            if (!err.response) {
              var errorStatus = "Error: Network Error";
              document.getElementById("errorMessage").innerHTML = errorStatus;
            } else {
              document.getElementById("errorMessage").innerHTML =
                err.response.data.message;
            }
            this.isLoading = false;
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    checkUniqueEmail() {
      if (this.userData.email == "") return;
      this.$appAxios
        .get(`/users/check-email/${this.userData.email}`)
        .then((r) => {
          this.isEmailTaken = r.data.status;
        })
        .catch((err) => {
          if (!err.response) {
            var errorStatus = "Error: Network Error";
            document.getElementById("errorMessage").innerHTML = errorStatus;
          } else {
            document.getElementById("errorMessage").innerHTML = err.response.data.message;
          }
          this.isLoading = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  validations() {
    return {
      userData: {
        name: { required, minLength: minLength(3) },
        surname: { required, minLength: minLength(2) },
        email: { required, email, isUnique: helpers.withAsync(this.isEmailTaken) },
        password: { required, minLength: minLength(6) },
      },
    };
  },
};
</script>

<style lang="css">
.root {
  width: 450px;
  margin: 0 auto;
  background-color: #fff;
  margin-top: 150px;
}

input {
  border: none;
  outline: none;
  border-bottom: 1px solid #ddd;
  font-size: 1em;
  margin: 10px 0 5px 0;
  width: 100%;
  background-color: #ddd;
  padding: 8px;
  border-radius: 5px;
}

.is-invalid-input {
  border: solid 1px red;
  border-radius: 5px;
}

button {
  background-color: #3498db;
  padding: 10px 20px;
  margin-top: 10px;
  border: none;
  color: white;
}

.error-span {
  font-size: 11px;
  color: red;
  font-weight: 600;
}
</style>
