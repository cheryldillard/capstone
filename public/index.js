/* global Vue, VueRouter, axios, themeSetup */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      // message: "Welcome to your Personal Prescription Manager!",
      prescriptions: [],
      currentPrescription: {},
      numberFilter: "",
      dosageFilter: "",
      regimenFilter: ""
    };
  },

  created: function() {
    axios.get("/prescriptions").then(
      function(response) {
        this.prescriptions = response.data;
        console.log(this.prescriptions);
      }.bind(this)
    );
  },

  mounted: function() {
    themeSetup();
  },
  methods: {
    setCurrentPrescription: function(inputPrescription) {
      this.currentPrescription = inputPrescription;
    }
  },

  computed: {}
};

var SignupPage = {
  template: "#signup-page",
  data: function() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        passwordConfirmation: this.passwordConfirmation
      };
      axios
        .post("/users", params)
        .then(function(response) {
          router.push("/login");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var LoginPage = {
  template: "#login-page",
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        auth: { email: this.email, password: this.password }
      };
      axios
        .post("/user_token", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    }
  }
};

var LogoutPage = {
  mounted: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/");
  }
};

var PrescriptionsNewPage = {
  template: "#prescriptions-new-page",
  data: function() {
    return {
      number: "",
      name: "",
      description: "",
      dosage: "",
      regimen: "",
      errors: []
    };
  },
  created: function() {
    axios.get("/medications/" + this.$route.params.id).then(
      function(response) {
        this.medication = response.data;
      }.bind(this)
    );
  },
  methods: {
    submit: function() {
      var params = {
        inputNumber: this.number,
        inputName: this.name,
        inputDescription: this.description,
        inputDosage: this.dosage,
        inputRegimen: this.regimen
      };
      axios
        .post("/prescriptions", params)
        .then(function(response) {
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
            router.push("/login");
          }.bind(this)
        );
    }
  }
};

var PrescriptionsShowPage = {
  template: "#prescriptions-show-page",
  data: function() {
    return {
      prescription: {
        number: "number",
        dosage: ["dosage"],
        regimen: ["regimen"]
      }
    };
  },
  created: function() {
    axios.get("/prescriptions/" + this.$route.params.id).then(
      function(response) {
        this.prescription = response.data;
      }.bind(this)
    );
  },
  methods: {},
  computed: {}
};

var MedicationsShowPage = {
  template: "#medications-show-page",
  data: function() {
    return {
      medication: {
        name: "name",
        description: ["description"]
      }
    };
  },
  created: function() {
    axios.get("/medications/" + this.$route.params.id).then(
      function(response) {
        this.medication = response.data;
      }.bind(this)
    );
  },

  methods: {},
  computed: {}
};

var PrescriptionsEditPage = {
  template: "#prescriptions-edit-page",
  data: function() {
    return {
      number: "",
      dosage: "",
      regimen: "",
      errors: []
    };
  },
  created: function() {
    axios.get("/prescriptions/" + this.$route.params.id).then(
      function(response) {
        this.number = response.data.number;
        this.dosage = response.data.dosage;
        this.regimen = response.data.regimen;
      }.bind(this)
    );
  },
  methods: {
    submit: function() {
      var params = {
        inputNumber: this.number,
        inputDosage: this.dosage,
        inputRegimen: this.regimen
      };
      axios
        .patch("/prescriptions/" + this.$route.params.id, params)
        .then(function(response) {
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
            router.push("/login");
          }.bind(this)
        );
    }
  }
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/prescriptions/new", component: PrescriptionsNewPage },
    { path: "/prescriptions/:id", component: PrescriptionsShowPage },
    { path: "/prescriptions/", component: HomePage },
    { path: "/prescriptions/:id/edit", component: PrescriptionsEditPage },
    { path: "/medications/:id", component: MedicationsShowPage },
    { path: "/signup", component: SignupPage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router,
  mounted: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});
