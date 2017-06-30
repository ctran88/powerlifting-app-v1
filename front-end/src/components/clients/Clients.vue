<template>
<div id="clients">
  <div class="row">
    <b-form-fieldset horizontal label="Filter" class="col-3 ml-auto" :label-size="2">
      <b-form-input v-model="filter" placeholder="Type to search" />
    </b-form-fieldset>
  </div>

  <!-- Main table element -->
  <b-table striped hover :items="clientList" :fields="fields" :filter="filter">
    <template slot="name" scope="item">
      {{ item.item.email }}
    </template>
    <template slot="team" scope="item">
      {{ item.item.team }}
    </template>
    <template slot="activeProgram" scope="item">
      {{ item.item._activeProgramName }}
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
</div>
</template>

<script>
import api from '@/../utils/api';

export default {
  name: 'clients',
  data() {
    return {
      clientList: [],
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
        activeProgram: {
          label: 'Active program',
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
    this.getProgramNames();
  },
  methods: {
    getProgramNames() {
      // deep copy state array to avoid mutating it directly with vm.$set
      this.clientList = JSON.parse(JSON.stringify(this.$store.state.user._clients));

      var programNames = [];
      var query = '?';

      // build query string
      for (var i = 0; i < this.clientList.length; i++) {
        if (this.clientList[i]._activeProgram) {
          query += '_id=' + this.clientList[i]._activeProgram + '&';
        }
      }

      // remove '&' if there is one at the end of the query string
      query = query.replace(/&$/, '');

      // get list of program names
      api.get('/training/programs' + query)
        .then((response) => {
          programNames = response.data.programs.map((el) => {
            return {
              _id: el._id,
              name: el.metadata.name
            }
          });

          // match program ids and assign program name
          for (var i = 0; i < this.clientList.length; i++) {
            for (var k = 0; k < programNames.length; k++) {
              if (this.clientList[i]._activeProgram === programNames[k]._id) {
                this.$set(this.clientList[i], '_activeProgramName', programNames[k].name);
              }
            }
          }
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
