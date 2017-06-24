<template>
<div id="clients">
  <b-card id="main-content-card">
    <div class="row">
      <b-form-fieldset horizontal label="Filter" class="col-6" :label-size="2">
        <b-form-input v-model="filter" placeholder="Type to search" />
      </b-form-fieldset>
    </div>

    <!-- Main table element -->
    <b-table striped hover :items="clients" :fields="fields" :filter="filter">
      <template slot="name" scope="item">
        {{ item.item.email }}
      </template>
      <template slot="team" scope="item">
        {{ item.item.team }}
      </template>
      <template slot="program" scope="item">
        {{ item.item.email }}
      </template>
      <template slot="memberStart" scope="item">
        {{ item.item.memberStart }}
      </template>
      <template slot="lastLogin" scope="item">
        {{ item.item.lastLogin }}
      </template>
      <template slot="actions" scope="item">
        <b-btn size="sm" v-b-modal="'client-preview-modal'" @click="handleDetails(item.item)">Details</b-btn>
      </template>
    </b-table>

    <b-modal id="client-preview-modal" title="Client preview">
      {{ details }}
      <footer slot="modal-footer">
        <b-btn variant="secondary" @click="handleClose('client-preview-modal')">Close</b-btn>
        <b-btn variant="primary" @click="handleClose('client-preview-modal')">OK</b-btn>
      </footer>
    </b-modal>
  </b-card>
</div>
</template>

<script>
import api from '@/../utils/api';

export default {
  name: 'clients',
  data() {
    return {
      clients: [],
      details: {},
      filter: null,
      fields: {
        name: {
          label: 'Client Name',
          sortable: true
        },
        team: {
          label: 'Team',
          sortable: true
        },
        program: {
          label: 'Current program',
          sortable: true
        },
        memberStart: {
          label: 'Member Start Date',
          sortable: true
        },
        lastLogin: {
          label: 'Last Login',
          sortable: true
        },
        actions: {
          label: 'Actions'
        }
      }
    };
  },
  mounted() {
    // this function is called before the setUserInfo acton can be completed (from App.vue), so user object is not set yet.  Set timetout as a workaround.
    setTimeout(this.updateClients, 100);
  },
  methods: {
    updateClients() {
      var clients = this.$store.state.user.clients;
      var query = '?';

      for (var i = 0; i < clients.length; i++) {
        query += 'email=' + clients[i];

        if (i < (clients.length - 1)) {
          query += '&';
        }
      }

      api.get('/users' + query)
        .then((response) => {
          if (response.status === 200) {
            this.clients = [];

            response.data.users.forEach((current) => {
              this.clients.push(current);
            });
          } else {
            alert(response.data);
          }
        })
        .catch((error) => {
          console.log('API error retrieving users: ', error);
        });
    },
    updateActivePrograms() {
      var query = {
        client: {
          $in: this.$state.user.clients
        },
        active: true
      };

      api.get('/training/programs', query)
        .then((response) => {
          if (response.status === 200) {
            this.clients = [];

            response.data.users.forEach((current) => {
              this.clients.push(current);
            });
          } else {
            alert(response.data);
          }
        })
        .catch((error) => {
          console.log('API error retrieving programs: ', error);
        });
    },
    handleDetails(item) {
      this.details = item;
    },
    handleClose(modalId) {
      this.$root.$emit('hide::modal', modalId);
    }
  }
};
</script>

<style scoped>
button {
  cursor: pointer;
}
</style>
