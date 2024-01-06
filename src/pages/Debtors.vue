<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
        >
          <md-button @click="isDialogOpen = true">+ Add Debtors</md-button>
          <md-dialog :md-active.sync="isDialogOpen">
            <md-dialog-title>Create Debtors</md-dialog-title>
            <md-dialog-content style="width: 500px">
              <md-field>
                <label>Name</label>
                <md-input v-model="name"></md-input>
              </md-field>

              <md-field>
                <label>Email</label>
                <md-input v-model="email" type="email"></md-input>
              </md-field>
            </md-dialog-content>

            <md-dialog-actions>
              <md-button class="md-primary" @click="submitForm"
                >Submit</md-button
              >
              <md-button @click="isDialogOpen = false">Cancel</md-button>
            </md-dialog-actions>
          </md-dialog>
          <md-card>
            <md-card-header data-background-color="orange">
              Debtors Management
            </md-card-header>
            <md-card-content>
              <SimpleTable :data="debtorsList"></SimpleTable>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleTable from "../components/Tables/SimpleTable.vue";
import { supabase } from "../../supabaseClient";

export default {
  name: "Debtors",
  data() {
    return {
      debtorsList: [],
      isDialogOpen: false,
      name: "",
      email: "",
    };
  },
  components: {
    SimpleTable,
  },
  beforeMount() {
    this.getDebtors();
  },
  methods: {
    async getDebtors() {
      const { data, error } = await supabase
        .from("debtor")
        .select("*, users(name, email, verified)");
      if (error) {
        alert(error.message);
      } else {
        this.debtorsList = data;
      }
    },

    async createDebtor(user_id) {
      const { data, error } = await supabase
        .from("debtor")
        .insert([{ user_id: user_id, total: 0 }])
        .select();
      if (error) {
        alert(error.message);
      } else {
        this.initTransactions(data[0].id);
      }
    },

    async initTransactions(debtor_id) {
      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            debtor_id: debtor_id,
            amount: 0,
            merchant: "Setup Debtor",
            transaction_date: "2023-01-01",
          },
        ])
        .select();
      if (error) {
        alert(error.message);
      } else {
        this.$notify({
          message: "Debtor created successfully",
          type: "success",
          horizontalAlign: "right",
          verticalAlign: "top",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },

    async submitForm() {
      if (this.email == "" || this.name == "") {
        alert("Please fill in all the fields");
      } else {
        const { data, error } = await supabase
          .from("users")
          .insert([{ name: this.name, email: this.email }])
          .select();
        if (error) {
          alert(error.message);
        } else {
          this.createDebtor(data[0].id);
        }
      }
    },
  },
};
</script>
