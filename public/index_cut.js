/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Welcome to your Personal Prescription Manager!",
      prescriptions: [],
      currentPrescription: {},
      numberFilter: "",
      dosageFilter: "",
      regimenFilter: ""
    };
  },

  created: function() {
    axios.get("prescriptions").then(
      function(response) {
        this.prescriptions = response.data;
      }.bind(this)
    );
  },

  methods: {
    setCurrentPrescription: function(inputPrescription) {
      this.currentPrescription = inputPrescription;
    }
  },

  // isValidPrescription: function(inputPrescription) {
  //   var validNumber = inputPrescription.number
  //     .toLowerCase()
  //     .includes(this.nameFilter.toLowerCase());
  //   var validPrice = inputProduct.price
  //     .toLowerCase()
  //     .includes(this.priceFilter.toLowerCase());
  //   return validName && validPrice;
  // }
  // },

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
      dosage: "",
      regimen: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        inputNumber: this.number,
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

var PrescriptionIndexPage = {
  template: "#prescriptions-index-page",
  data: function() {
    return {
      prescriptions: []
    };
  },
  created: function() {
    axios.get("/prescriptions").then(
      function(response) {
        this.prescriptions = response.data;
        console.log(response.data);
      }.bind(this)
    );
  },

  methods: {},
  computed: {}
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/prescriptions/new", component: PrescriptionsNewPage },
    // { path: "/prescriptions/edit", component: PrescriptionsEditPage },
    { path: "/prescriptions/:id", component: PrescriptionsShowPage },
    { path: "/prescriptions/", component: PrescriptionIndexPage },
    // { path: "/sample", component: SamplePage },
    { path: "/signup", component: SignupPage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage }
  ]
});

// console.log("hello");

var app = new Vue({
  el: "#app",
  router: router,
  mounted: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});
