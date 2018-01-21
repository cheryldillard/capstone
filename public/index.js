/* global Vue, VueRouter, axios, themeSetup */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "",
      prescriptions: [],
      currentPrescription: {},
      numberFilter: "",
      dosageFilter: "",
      regimenFilter: "",
      showHomeHeader: true
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
    },
    edit: function(prescription) {
      console.log("hello i want to edit", prescription.id);
      router.push("/prescriptions/" + prescription.id + "/edit");
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
      errors: [],
      showHomeHeader: true
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
          var showHomeHeader = false;
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
      medicationId: "",
      conflicts: "",
      errors: [],
      medications: [],
      selectedMedicationId: 1,
      medicationWarning: null,
      medicationDuplicateMessage: null
    };
  },
  created: function() {
    axios.get("/medications").then(
      function(response) {
        this.medications = response.data;
        console.log(this.medications);
      }.bind(this)
    );
    axios.get("/prescriptions").then(
      function(response) {
        this.prescriptions = response.data;
        console.log("prescriptions are:", this.prescriptions);
      }.bind(this)
    );
  },

  methods: {
    submit: function() {
      var params = {
        inputNumber: this.number,
        inputDosage: this.dosage,
        inputRegimen: this.regimen,
        inputMedicationId: this.selectedMedicationId
      };
      console.log("new prescription params:", params);
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
  },
  watch: {
    selectedMedicationId: function() {
      this.medicationWarning = null;
      this.medicationDuplicateMessage = null;
      console.log(
        "you are trying to add medication id",
        this.selectedMedicationId
      );
      this.prescriptions.forEach(
        function(prescription) {
          // Look for conflicts
          prescription.medication.conflicts.forEach(
            function(conflict) {
              if (this.selectedMedicationId === conflict.id) {
                console.log(
                  "houston we have a problem",
                  prescription.medication
                );
                this.medicationWarning =
                  " This prescription has counteractions with " +
                  prescription.medication.name +
                  ".  Check with your doctor or pharmacist immediately on how to take these combined medications.";
              }
            }.bind(this)
          );

          // Look for duplicates
          // console.log(prescription.medication)
          if (prescription.medication.id === this.selectedMedicationId) {
            console.log("THIS IS A DUPLICATE!!!");
            this.medicationDuplicateMessage =
              "This medication is a duplicate of an older prescription.  Check with your doctor or pharmacist on which one you should take.";
          }
        }.bind(this)
      );
    }
  }
};

var PrescriptionsShowPage = {
  template: "#prescriptions-show-page",
  data: function() {
    return {
      prescription: { medication: {} },
      fdaResults: {}
    };
  },
  created: function() {
    axios.get("/prescriptions/" + this.$route.params.id).then(
      function(response) {
        this.prescription = response.data;
        console.log("The prescription is", this.prescription);

        var searchTerms = this.prescription.medication.name;
        axios.get("/fda_search?search=" + searchTerms).then(
          function(response) {
            // console.log("fda search for", searchTerms, response.data);
            this.fdaResults = response.data.results[0];
            console.log("fdaResults", this.fdaResults);
          }.bind(this)
        );
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
  created: function() {
    var jwt = localStorage.getItem("jwt");
    console.log("jwt", jwt);
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});
