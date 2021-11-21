<template>
  <v-main>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="8" class="">
          <div>
            <v-alert
              v-if="errorMsg"
              dismissible
              color="red"
              border="left"
              elevation="2"
              colored-border
              icon="mdi-account-remove"
              transition="scale-transition"
              @click="errorMsg = null"
            >
              {{ errorMsg }}
            </v-alert>
          </div>

          <v-card class="evelation-12 card">
            <v-window v-model="step">
              <!--SignIn-->
              <ProgressBar :loading="loading" />
              <v-window-item :value="1">
                <v-row class="">
                  <v-col cols="12" md="8" class="pt-6 pb-6">
                    <v-card-text>
                      <v-form
                        class="signup-form-form"
                        @submit.prevent="doSignin"
                      >
                        <h1
                          class="text-center display-1 mb-10"
                          :class="`${bgColor}--text`"
                        >
                          Sign in
                        </h1>
                        <v-text-field
                          id="username"
                          v-model="username"
                          :rules="rules.usage"
                          label="Username"
                          name="Username"
                          append-icon="person"
                          type="text"
                          :color="bgColor"
                          clearable
                          required
                        />
                        <v-text-field
                          id="password"
                          v-model="password"
                          :rules="rules.usage"
                          label="Password"
                          name="Password"
                          append-icon="lock"
                          type="password"
                          :color="bgColor"
                          clearable
                          required
                        />
                        <!-- <div class="text-center">
                          <a
                            href="#"
                            class="mt-3 overline no-text-decoration"
                            :class="`${bgColor}--text`"
                            @click="step = 3"
                          >
                            Forgot your password?
                          </a>
                        </div> -->
                        <div class="text-center mt-6">
                          <v-btn type="submit" large :color="bgColor" dark
                            >Sign In</v-btn
                          >
                        </div>
                      </v-form>
                      <v-dialog v-model="terms" width="70%">
                        <v-card>
                          <v-card-title class="title"> Terms </v-card-title>
                          <v-card-text v-for="n in 5" :key="n">
                            {{ content }}
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn text color="purple" @click="terms = false">
                              Ok
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-card-text>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    class="darken-2 vcenter"
                    :class="`${bgColor}`"
                  >
                    <div>
                      <v-card-text :class="`${fgColor}--text`">
                        <h1 class="text-center headline mb-3">
                          Welcome
                        </h1>
                        <!-- <h4 class="text-center headline mb-3">New user?</h4> -->
                        <h5 class="text-center overline mb-3">
                          Please Sign Up to continue
                        </h5>
                      </v-card-text>
                      <div class="text-center mb-6">
                        <v-btn
                          dark
                          outlined
                          @click="
                            step = 2;
                            errorMsg = null;
                          "
                          >Sign Up</v-btn
                        >
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-window-item>
              <!--SignUp-->
              <v-window-item :value="2">
                <v-row class="fill-height">
                  <v-col
                    cols="12"
                    md="4"
                    class="darken-2 vcenter"
                    :class="`${bgColor}`"
                  >
                    <div>
                      <v-card-text :class="`${fgColor}--text`">
                        <h1 class="text-center headline mb-3">
                          Already a user?
                        </h1>
                        <h5 class="text-center overline mb-3">
                          Please Sign In
                        </h5>
                      </v-card-text>
                      <div class="text-center mb-6">
                        <v-btn
                          dark
                          outlined
                          @click="
                            step = 1;
                            errorMsg = null;
                          "
                          >Sign In</v-btn
                        >
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="8" class="pt-6 pb-6">
                    <v-card-text>
                      <h1
                        class="text-center display-1 mb-10"
                        :class="`${bgColor}--text`"
                      >
                        Sign Up
                      </h1>
                      <v-form
                        class="signup-form-form"
                        @submit.prevent="doSignup"
                      >
                        <v-text-field
                          id="username"
                          v-model="username"
                          label="Username"
                          name="username"
                          append-icon="person"
                          type="text"
                          :rules="rules.username"
                          clearable
                        />
                        <v-slider
                          v-model="age"
                          :rules="rules.age"
                          :color="bgColor"
                          label="Age"
                          hint="Be honest"
                          min="1"
                          max="100"
                          thumb-label
                        ></v-slider>
                        <v-text-field
                          id="email"
                          v-model="email"
                          label="Email"
                          name="email"
                          append-icon="email"
                          type="email"
                          :rules="rules.email"
                          clearable
                        />
                        <v-text-field
                          id="password"
                          v-model="password"
                          label="Password"
                          name="password"
                          append-icon="lock"
                          type="password"
                          counter
                          hint="Must contain uppercase and symbol. Must be more than 10 characters"
                          :rules="rules.password"
                          clearable
                        />
                        <v-select
                          v-model="platformUsage"
                          :items="usage"
                          :rules="rules.usage"
                          color="pink"
                          label="Platform usage?"
                          required
                        ></v-select>
                        <v-checkbox v-model="acceptedTerms" color="green">
                          <template v-slot:label>
                            <div @click.stop="">
                              Do you accept the
                              <a href="#" @click.prevent="terms = true"
                                >terms</a
                              >
                              and
                              <a href="#" @click.prevent="terms = true"
                                >conditions?</a
                              >
                            </div>
                          </template>
                        </v-checkbox>
                        <div class="text-center mt-6">
                          <v-btn
                            type="submit"
                            :disabled="!signUpformIsValid"
                            large
                            :color="bgColor"
                            dark
                          >
                            Sign Up</v-btn
                          >
                        </div>
                      </v-form>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-window-item>
              <!--PW Rest-->
              <v-window-item :value="3">
                <v-row class="fill-height">
                  <v-col
                    cols="12"
                    md="4"
                    class="darken-2 vcenter"
                    :class="`${bgColor}`"
                  >
                    <div>
                      <v-card-text :class="`${fgColor}--text`">
                        <h1 class="text-center headline mb-3">
                          Already a user?
                        </h1>
                        <h5 class="text-center overline mb-3">
                          Please Sign In
                        </h5>
                      </v-card-text>
                      <div class="text-center mb-6">
                        <v-btn dark outlined @click="step = 1">Sign In</v-btn>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="8" class="pt-6 pb-6">
                    <v-card-text>
                      <v-form class="signup-form-form">
                        <h1
                          class="text-center display-1 mb-10"
                          :class="`${bgColor}--text`"
                        >
                          Reset Password
                        </h1>
                        <v-text-field
                          id="login"
                          :rules="rules.usage"
                          label="Username / email"
                          name="login"
                          append-icon="person / email"
                          type="text"
                          :color="bgColor"
                          class="v-input__icon--double"
                          required
                        />
                        <div class="text-center mt-6">
                          <v-btn large :color="bgColor" dark
                            >Reset Password</v-btn
                          >
                        </div>
                      </v-form>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <SnackBar />
    <Footer />
  </v-main>
</template>

<script>
const pageTitle = "Login";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import SnackBar from "@/components/SnackBar";
import { mapGetters, mapActions } from "vuex";
export default {
  name: pageTitle,
  title: pageTitle,
  data: () => ({
    loading: false,
    step: 1,
    username: "",
    email: "",
    password: "",
    errorMsg: null,
    terms: false,
    platformUsage: "",
    acceptedTerms: false,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.",
    age: 0,
    usage: ["Personal", "Business"],
    rules: {
      age: [
        (val) => val < 70 || "Wow! Congratulations on living life to the max!",
      ],
      usage: [(val) => (val || "").length > 0 || "This field is required"],
      username: [(val) => (val || "").length > 0 || "This field is required"],
      email: [(val) => (val || "").length > 0 || "This field is required"],
      password: [
        (val) =>
          (val || "").length > 0 ||
          "Come on! You want to create an account without a password?",
      ],
    },
  }),
  created: function () {},
  mounted() {
    this.logout();
  },
  beforeRouteEnter(to, from, next) {
    console.log(this);
    if (to.query.redirectFrom && to.query.message) {
      next((vm) => {
        const msg =
          "Sorry, you don't have access to that page because you're not logged in";
        vm.errorMsg = msg;
      });
    } else {
      next();
    }
  },
  components: { Footer, ProgressBar, SnackBar },
  props: {
    source: {
      type: String,
      default: "",
    },
    bgColor: {
      type: String,
      default: "indigo",
    },
    fgColor: {
      type: String,
      default: "white",
    },
  },
  watch: {},
  methods: {
    ...mapActions(["login", "register", "logout"]),
    doSignin() {
      const formStatus = this.checkForm();
      if (formStatus.res) {
        this.loading = true;
        this.errorMsg = null;
        this.login({
          username: this.username,
          password: this.password,
        })
          .then((resp) => {
            if (this.isLoggedIn) {
              console.log(resp);
              this.goToDashBoard();
            } else {
              //   this.showError(resp);
            }
          })
          .catch((error) => {
            console.log(error);
            this.errorMsg = error;
          })
          .finally(() => (this.loading = false));
      }
    },
    goToDashBoard() {
      this.$router.push(`/dashboard/${this.username}`);
    },
    go() {
      this.$router.push(`/login`);
    },
    checkForm() {
      let msg = "";
      let proceed = true;
      if (!this.username) {
        proceed = false;
        // this.toastedObj.icon = "user";
        msg = "Please enter your username!";
      } else if (!this.password) {
        proceed = false;
        msg = "Please enter your password";
      }
      console.log(msg);
      return { res: proceed, message: msg };
    },
    doSignup() {
      const formStatus = this.checkForm();
      if (formStatus.res) {
        this.loading = true;
        this.errorMsg = null;
        this.register({
          username: this.username,
          email: this.email,
          password: this.password,
          age: this.age,
          usage: this.platformUsage,
        })
          .then(() => this.step = 1)
          .catch((error) => {
            console.log("reg");
            console.log(error);
            this.errorMsg = error;
          })
          .finally(() => (this.loading = false));
      }
    },
  },
  computed: {
    ...mapGetters(["isLoggedIn", "getLoggedInProfile"]),
    signUpformIsValid() {
      return (
        this.username &&
        this.email &&
        this.password &&
        this.age &&
        this.platformUsage &&
        this.acceptedTerms
      );
    },
  },
};
</script>

<style scoped>
.v-application--wrap {
  min-height: 90vh !important;
}
.v-input__icon--double .v-input__icon {
  margin-left: -4.25rem !important;
}
a.no-text-decoration {
  text-decoration: none;
}
#signinup-form {
  max-width: 75rem;
}
.signup-form-form {
  max-width: 23rem;
  margin: 0 auto;
}
.card {
  overflow: hidden;
}
.vcenter {
  display: flex;
  align-items: center;
  justify-content: center;
}
.v-btn--disabled {
  color: rgb(36 3 3 / 30%) !important;
  background-color: rgb(78 54 54 / 12%) !important;
}
</style>