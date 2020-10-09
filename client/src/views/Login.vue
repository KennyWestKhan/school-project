<template>
  <v-main>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="8" class="">
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
                          label="Username"
                          name="Username"
                          append-icon="person"
                          type="text"
                          :color="bgColor"
                          clearable
                        />
                        <v-text-field
                          id="password"
                          v-model="password"
                          label="Password"
                          name="Password"
                          append-icon="lock"
                          type="password"
                          :color="bgColor"
                          clearable
                        />
                        <div class="text-center">
                          <a
                            href="#"
                            class="mt-3 overline no-text-decoration"
                            :class="`${bgColor}--text`"
                            @click="step = 3"
                          >
                            Forgot your password?
                          </a>
                        </div>
                        <div class="text-center mt-6">
                          <v-btn type="submit" large :color="bgColor" dark
                            >Sign In</v-btn
                          >
                        </div>
                      </v-form>
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
                          Welcome to Panoptes
                        </h1>
                        <!-- <h4 class="text-center headline mb-3">New user?</h4> -->
                        <h5 class="text-center overline mb-3">
                          Please Sign Up to continue
                        </h5>
                      </v-card-text>
                      <div class="text-center mb-6">
                        <v-btn dark outlined @click="step = 2">Sign Up</v-btn>
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
                        <v-btn dark outlined @click="step = 1">Sign In</v-btn>
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
                      <v-form class="signup-form-form" @submit.prevent="signup">
                        <v-text-field
                          id="username"
                          v-model="username"
                          label="Username"
                          name="username"
                          append-icon="person"
                          type="text"
                        />
                        <v-text-field
                          id="email"
                          v-model="email"
                          label="Email"
                          name="email"
                          append-icon="email"
                          type="email"
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
                        />
                        <div class="text-center mt-6">
                          <v-btn type="submit" large :color="bgColor" dark>
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
                          v-model="login"
                          label="Username / email"
                          name="login"
                          append-icon="person / email"
                          type="text"
                          :color="bgColor"
                          class="v-input__icon--double"
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
    <Footer />
  </v-main>
</template>

<script>
const pageTitle = "Login";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import { mapGetters, mapActions } from "vuex";
export default {
  name: pageTitle,
  title: pageTitle,
  data: () => ({
    loading: false,
    step: 1,
    username: "kenny",
    email: "",
    password: "1995",
  }),
  created() {},
  mounted() {
    this.logout();
  },
  components: { Footer, ProgressBar },
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
    async doSignin() {
      const formStatus = this.checkForm();
      if (formStatus.res) {
        this.loading = true;
        await this.login({
          username: this.username,
          password: this.password,
        })
          .then((resp) => {
            if (this.isLoggedIn) {
              console.log(resp);
              //   this.toastedObj.duration = "2000";
              //   this.toastedObj.icon = "thumbs-up";
              //   this.$toasted.success(resp, this.toastedObj);
              this.$router.push(`/dashboard/${this.username}`);
            } else {
              //   this.showError(resp);
            }
          })
          .catch((error) => {
            console.log(error);
            // this.showError(error);
          })
          .finally(() => (this.loading = false));
      }
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
    signup() {
      this.$auth
        .signup({
          data: {
            user: {
              username: this.username,
              email: this.email,
              password: this.password,
            },
          },
        })
        .catch((e) => {
          this.error = e + "";
        });
    },
  },
  computed: { ...mapGetters(["isLoggedIn", "getLoggedInProfile"]) },
};
</script>

<style scoped lang="scss">
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
</style>