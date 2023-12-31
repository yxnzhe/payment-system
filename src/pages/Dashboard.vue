<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>payments</md-icon>
          </template>

          <template slot="content">
            <p class="category">Total Receivable</p>
            <h3 class="title">
              <small>RM</small>
              {{ parseFloat(totalReceivable).toFixed(2) }}
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">Total amount receivable from debtors</div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="blue">
          <template slot="header">
            <md-icon>groups</md-icon>
          </template>

          <template slot="content">
            <p class="category">Debtors</p>
            <h3 class="title">{{ debtorCount }}</h3>
          </template>

          <template slot="footer">
            <div class="stats">Debtors with outstanding amount</div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-40"
      >
        <stats-card data-background-color="green">
          <template slot="header">
            <md-icon>refresh</md-icon>
          </template>

          <template slot="content">
            <p class="category">Last Updated</p>
            <h3 class="title">{{ lastUpdateTime }}</h3>
          </template>

          <template slot="footer">
            <div class="stats">
              *If the information displayed is not up to date, please refresh
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
      >
        <md-card>
          <md-card-header data-background-color="red">
            <div class="md-layout">
              <div class="md-layout-item">
                <h4 class="title">Debtors Summary</h4>
              </div>
              <div class="md-layout-item" style="text-align: right">
                <md-button
                  class="md-primary md-raised"
                  @click="showDebtorDialog = true"
                  >+ Add Transactions</md-button
                >
                <md-dialog :md-active.sync="showDebtorDialog">
                  <md-dialog-title>Add Transactions</md-dialog-title>
                  <md-dialog-content style="width: 500px">
                    <md-radio
                      v-model="debtorForm.type"
                      value="Transaction"
                      @change="resetMerchant"
                      >Transaction</md-radio
                    >
                    <md-radio
                      v-model="debtorForm.type"
                      value="Payment"
                      @change="setMerchantToPayment"
                      >Payment</md-radio
                    >
                    <md-field>
                      <label>Debtors Name</label>
                      <md-select v-model="debtorForm.debtorId">
                        <md-option
                          v-for="debtor in debtorsList"
                          :key="debtor.id"
                          :value="debtor.id"
                          >{{ debtor.users.name }}</md-option
                        >
                      </md-select>
                      <span class="md-error">Debtor is required</span>
                    </md-field>

                    <md-field>
                      <label>Merchant</label>
                      <md-input
                        v-model="debtorForm.merchant"
                        required
                      ></md-input>
                    </md-field>

                    <md-field>
                      <label>Amount</label>
                      <span class="md-prefix">RM</span>
                      <md-input
                        v-model="debtorForm.amount"
                        type="number"
                        required
                      ></md-input>
                      <span class="md-error">Amount is required</span>
                    </md-field>

                    <md-field v-if="debtorForm.type == 'Payment'">
                      <label>Payment Receipt</label>
                      <md-file @change="handleFileChange" />
                    </md-field>

                    <md-field>
                      <label>Date</label>
                      <md-input
                        v-model="debtorForm.transactionDate"
                        type="date"
                        required
                      ></md-input>
                      <span class="md-error">Date is required</span>
                    </md-field>
                  </md-dialog-content>

                  <md-dialog-actions>
                    <md-button
                      class="md-primary"
                      @click="submitTransactionsForm"
                      >Submit</md-button
                    >
                    <md-button @click="showDebtorDialog = false"
                      >Cancel</md-button
                    >
                  </md-dialog-actions>
                </md-dialog>
              </div>
            </div>
          </md-card-header>
          <md-card-content>
            <ordered-table
              :data="debtorsList"
              table-header-color="black"
            ></ordered-table>
          </md-card-content>
        </md-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Payment Received</h4>
          </md-card-header>
          <md-card-content>
            <ordered-table
              :data="paymentList"
              table-header-color="black"
            ></ordered-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { StatsCard, OrderedTable } from "@/components";
import { supabase, storage } from "../../supabaseClient";
import axios from "axios";

export default {
  components: {
    StatsCard,
    OrderedTable,
  },
  data() {
    return {
      lastUpdateTime: new Date().toLocaleString(),
      debtorCount: 0,
      totalReceivable: 0,
      debtorsList: [],
      paymentList: [],
      showPaymentDialog: false,
      showDebtorDialog: false,
      debtorForm: {
        debtorId: null,
        merchant: null,
        amount: 0.0,
        transactionDate: new Date().toISOString().split("T")[0],
        document: null,
        type: "Transaction",
      },
      apiKey: // TODO: Add API Key
        "",
    };
  },
  beforeMount() {
    this.getDebtors();
    this.getPayment();
  },
  methods: {
    resetMerchant() {
      this.debtorForm.merchant = null;
    },

    setMerchantToPayment() {
      this.debtorForm.merchant = "Payment";
    },

    async getDebtors() {
      const { data, error } = await supabase
        .from("debtor")
        .select("*, users(name)")
        .order("total", { ascending: false });
      if (error) {
        alert(error.message);
      } else {
        for (let i = 0; i < data.length; i++) {
          this.totalReceivable += data[i].total;
          if (data[i].total > 0) {
            this.debtorCount++;
          }
          const appendedData = {
            ...data[i],
            type: "Debtor",
          };
          this.debtorsList.push(appendedData);
        }
      }
    },

    async getPayment() {
      const { data, error } = await supabase
        .from("payment")
        .select("*, debtor(users(name))")
        .order("created_at", { ascending: false });
      if (error) {
        alert(error.message);
      } else {
        for (let i = 0; i < data.length; i++) {
          const appendedData = {
            ...data[i],
            type: "Payment",
          };
          this.paymentList.push(appendedData);
        }
      }
    },

    async submitTransactionsForm() {
      if (
        this.debtorForm.debtorId == null ||
        this.debtorForm.merchant == null ||
        this.debtorForm.amount == null ||
        this.debtorForm.transactionDate == null
      ) {
        alert("Please fill in all the fields");
      } else {
        if (this.debtorForm.type == "Payment") {
          this.debtorForm.amount = this.debtorForm.amount * -1;
        }
        const { data, error } = await supabase
          .from("transactions")
          .insert([
            {
              debtor_id: this.debtorForm.debtorId,
              merchant: this.debtorForm.merchant,
              amount: this.debtorForm.amount,
              transaction_date: this.debtorForm.transactionDate,
            },
          ])
          .select();
        if (error) {
          alert(error.message);
        } else {
          this.updateTotalAmount(
            this.debtorForm.amount,
            this.debtorForm.debtorId
          );
        }
      }
    },

    async updateTotalAmount(subtotal, debtor_id) {
      const { data: debtorData, error: debtorError } = await supabase
        .from("debtor")
        .select("total")
        .eq("id", debtor_id);

      const currentTotal = Number(debtorData[0]?.total) || 0;

      const newTotal = currentTotal + parseFloat(subtotal);

      const { data, error } = await supabase
        .from("debtor")
        .update({ total: newTotal, last_update: new Date().toLocaleString() })
        .eq("id", debtor_id)
        .select();

      if (error) {
        alert(error.message);
      } else {
        if (this.debtorForm.type === "Payment") {
          if (this.debtorForm.document) {
            await this.uploadFile(
              this.debtorForm.document,
              this.debtorForm.debtorId
            );
          } else {
            this.createPayment(debtor_id, null, this.debtorForm.amount);
          }
        } else {
          this.$notify({
            message: "Transactions created successfully",
            type: "success",
            horizontalAlign: "right",
            verticalAlign: "top",
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    },

    async uploadFile(file, debtor_id) {
      const formData = new FormData();
      formData.append("file", file);

      const { data, error } = await supabase.storage
        .from("documents")
        .upload(`debtor-${debtor_id}/payment-proof_${Date.now()}`, formData, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        alert(error.message);
      } else {
        const fileURL = supabase.storage
          .from("documents")
          .getPublicUrl(data.path);
        this.createPayment(
          debtor_id,
          fileURL.data.publicUrl,
          this.debtorForm.amount
        );
      }
    },

    async createPayment(debtor_id, filepath, amount) {
      const { data, error } = await supabase
        .from("payment")
        .insert([
          {
            debtor_id: debtor_id,
            payment_proof: filepath,
            total: amount,
          },
        ])
        .select();
      if (error) {
        alert(error.message);
      } else {
        this.sendPaymentEmail(debtor_id, amount);
        this.$notify({
          message: "Transactions created successfully",
          type: "success",
          horizontalAlign: "right",
          verticalAlign: "top",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },

    handleFileChange(event) {
      const fileInput = event.target;
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        this.debtorForm.document = file;
      }
    },

    async sendPaymentEmail(debtor_id, amount) {
      const { data, error } = await supabase
        .from("debtor")
        .select("users(name, email)")
        .eq("id", debtor_id);
      if (error) {
        alert(error.message);
      } else {
        const debtorInfo = data[0].users;

        await axios({
          method: "POST",
          url: "https://api.sendinblue.com/v3/smtp/email",
          headers: {
            "api-key": this.apiKey,
            "content-type": "application/json",
          },
          data: {
            sender: {
              name: "", // TODO: Add Sender Name
              email: "noreply@payment-system.com",
            },
            to: [
              {
                name: debtorInfo.name,
                email: debtorInfo.email,
              },
            ],
            subject: "Payment Received from " + debtorInfo.name,
            htmlContent: `
              <!DOCTYPE html>
              <html lang="en">

              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Received Email</title>
              </head>

              <body style="font-family: Arial, sans-serif;">

                <p>Dear ${debtorInfo.name},</p>

                <p>I hope this email finds you well. I am writing to inform you that we have successfully received your recent payment of <strong>RM ${parseFloat(
                  amount * -1
                ).toFixed(2)}</strong>, dated ${
              this.debtorForm.transactionDate
            }. We greatly appreciate your prompt attention to settling your outstanding balance.</p>

                <p>If you have any questions or concerns regarding the payment or if there is anything else we can assist you with, please do not hesitate to reach out to me on WhatsApp.</p>

                <p>Thank you once again for your timely payment.</p>

                <p>
                  Best Regards, <br> TODO: Add Sender Name
                </p>

              </body>

              </html>
            `,
          },
        });
      }
    },
  },
};
</script>
