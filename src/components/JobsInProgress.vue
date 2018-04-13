<template>
  <div>
    <h2>Jobs in progress ({{ totalStartedJobs }})</h2>
    <p>
      These jobs have been started
    </p>
    <b-row>
      <b-col md="8" class="my-1">
        <b-pagination :total-rows="totalStartedJobs" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
      <b-col md="4" class="my-1">
        <b-form-group horizontal label="Per page" class="mb-0">
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-group>
      </b-col>
    </b-row>
    <b-table id="jobs-in-progress-table"
             show-empty
             stacked="md"
             small
             :items="startedJobsProvider"
             :fields="fields"
             striped
             hover
             :busy.sync="isBusy"
             ref="qjt"
             :perPage="perPage"
             :current-page="currentPage"
    >
      <template slot="index" slot-scope="row">{{ row.index + 1 }}</template>
      <template slot="details" slot-scope="row">
        <b-button size="sm" @click.stop="row.toggleDetails">
          {{ row.detailsShowing ? 'Hide' : 'Show '}} Details
        </b-button>
      </template>
      <template slot="selected" slot-scope="row">
        <b-checkbox v-model="row.value" @change="toggleSelectedJob(row.item, row.index, $event)"></b-checkbox>
      </template>
      <template slot="row-details" slot-scope="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
          </ul>
        </b-card>
      </template>
    </b-table>

    <b-button variant="primary" @click="refreshTable()">
        Refresh
    </b-button>
    <div class="float-right">
      <b-button variant="danger" @click="cancelJobs()" :disabled="!jobsSelected">
          Cancel jobs
      </b-button>
      <b-button variant="success" @click="finishJobs()" :disabled="!jobsSelected">
          Finish jobs
      </b-button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

const moment = require('moment');

export default {
  name: 'started-jobs',
  data() {
    return {
      fields: [
        { key: 'index', label: '', sortable: true },
        { key: 'id', label: 'ID', sortable: true },
        { key: 'woNum', label: 'WO', sortable: true },
        { key: 'dateRequested', label: 'Date requested', sortable: true, class: 'text-center' },
        { key: 'startDate', label: 'Date started', sortable: true, class: 'text-center' },
        { key: 'requestedBy', label: 'Requested by', sortable: true },
        { key: 'product', label: 'Product', sortable: true },
        { key: 'productOptions', label: 'Product options', sortable: true },
        { key: 'batchSize', label: 'Batch size', sortable: true },
        { key: 'details', label: '' },
        { key: 'selected', label: '' },
      ],
      isBusy: false,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      totalStartedJobs: 0,
      sortBy: 'dateRequested',
      items: [],
    };
  },
  methods: {
    refreshTable() {
      this.$root.$emit('bv::refresh::table', 'jobs-in-progress-table');
    },
    refreshCompletedJobsTable() {
      this.$root.$emit('bv::refresh::table', 'jobs-completed-table');
    },
    startedJobsProvider(ctx) {
      this.isBusy = true;
      return axios({
        url: 'http://localhost:3000/'
              + 'jobs'
              + '?startDate_gte=1'
              + '&completedDate'
              + '&cancelledDate'
              + `&_page=${ctx.currentPage}`
              + `&_limit=${ctx.perPage}`,
        method: 'GET',
      })
        .then((response) => {
          const items = response.data.map(item => Object.assign({ selected: false }, item));
          this.items = items;
          if (response.headers['x-total-count']) {
            this.totalStartedJobs = parseInt(response.headers['x-total-count'], 10);
          }
          this.isBusy = false;
          return items;
        }).catch(() => {
          this.isBusy = false;
          return [];
        });
    },
    cancelJobs() {
      this.items.forEach((item) => {
        if (item.selected) {
          axios({
            method: 'patch',
            url: `http://localhost:3000/jobs/${item.id}`,
            data: {
              cancelledDate: moment().format('lll'),
            },
          })
            .then(() => {
              this.refreshTable();
              this.refreshCompletedJobsTable();
            }).catch((error) => {
              console.log(error);
            });
        }
      });
    },
    finishJobs() {
      this.items.forEach((item) => {
        if (item.selected) {
          axios({
            method: 'patch',
            url: `http://localhost:3000/jobs/${item.id}`,
            data: {
              completedDate: moment().format('lll'),
            },
          })
            .then(() => {
              this.refreshTable();
              this.refreshCompletedJobsTable();
            }).catch((error) => {
              console.log(error);
            });
        }
      });
    },
    toggleSelectedJob(item, index, event) {
      this.items.forEach((itemInArray) => {
        if (itemInArray.id === item.id) item.selected = event;
      });
    },
  },
  computed: {
    jobsSelected() {
      return this.items.some(item => item.selected);
    },
  },
};
</script>
