<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/debtors">
        <md-icon>person</md-icon>
        <p>Debtors</p>
      </sidebar-link>
      <!-- <sidebar-link to="/transactions">
        <md-icon>content_paste</md-icon>
        <p>Transactions</p>
      </sidebar-link> -->
      <!-- <sidebar-link to="/typography">
        <md-icon>library_books</md-icon>
        <p>Typography</p>
      </sidebar-link> -->
      <!-- <sidebar-link to="/icons">
        <md-icon>bubble_chart</md-icon>
        <p>Icons</p>
      </sidebar-link> -->
      <!-- <sidebar-link to="/maps">
        <md-icon>location_on</md-icon>
        <p>Maps</p>
      </sidebar-link> -->
      <!-- <sidebar-link to="/notifications">
        <md-icon>notifications</md-icon>
        <p>Notifications</p>
      </sidebar-link> -->
      <!-- <sidebar-link to="/login-signup" class="active-pro">
        <md-icon>unarchive</md-icon>
        <p>Login/ Sign Up</p>
      </sidebar-link> -->
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content> </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu,
  },
  data() {
    return {
      sidebarBackground: "green",
      sidebarBackgroundImage: require("@/assets/img/sidebar-2.jpg"),
    };
  },
};
</script>
