<template>
  <div id="app" class="container d-flex flex-column justify-content-center align-items-center mt-5">
    <img
      :src="`${serverAddress}/employees.jpg`"
      class="mx-auto d-block my-3"
      width="300"
      alt="picture of employees"
    />
    <div class="alert alert-danger" role="alert" v-if="offline">Du bist offline...</div>
    <h1>AHHHHHHHHHH ICH KANN NICHT MEHR</h1>
    <ButtonGet @get="fetchData"></ButtonGet>
    <button class="btn btn-primary" @click="subscribe()">Subscribe</button>

    <CardView :employees="employees" :offline="offline" @del="delEmployee"></CardView>
  </div>
</template>

<script>
import axios from 'axios';

import ButtonGet from '@/components/ButtonGet.vue';
import CardView from '@/components/CardView.vue';

export default {
  name: 'app',
  components: {
    ButtonGet,
    CardView,
  },
  data() {
    return {
      serverAddress: process.env.VUE_APP_SERVER,
      employees: [],
      offline: null,
    };
  },
  created() {
    window.addEventListener('online', () => (this.offline = false));
    window.addEventListener('offline', () => (this.offline = true));
    document.addEventListener('swUpdated', this.updateAvailable, { once: true });
  },
  methods: {
    async fetchData() {
      console.log('fetchData called');
      try {
        const { data } = await axios({
          url: `${process.env.VUE_APP_SERVER}/employees`,
          method: 'GET',
        });
        this.employees = data;
      } catch (error) {
        console.error(error);
      }
    },
    async delEmployee(e) {
      console.log('delEmployee called');
      try {
        await axios({
          url: `${process.env.VUE_APP_SERVER}/employees/${e.id}`,
          method: 'delete',
        });
        this.fetchData();
      } catch (error) {
        console.error(error);
      }
    },
    updateAvailable() {
      if (confirm(`New content is available!. Click OK to refresh`)) {
        window.location.reload();
      }
    },

    async subscribe() {
      if (!('serviceWorker' in navigator)) {
        console.log('no service worker!');
        return;
      }
      const publicVapidKey =
        'BIJ4lktTyLUPz9ls-cbJB1vwDOG_wM1QPPaQHY31qvEV7uPDumqT7AISzsUwX10YZm1ZF6v8e0NujLHOstrVMFU';
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(publicVapidKey),
      });
      await axios.post('/subscribe', subscription);
    },

    urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },
  },
};
</script>

<style></style>
