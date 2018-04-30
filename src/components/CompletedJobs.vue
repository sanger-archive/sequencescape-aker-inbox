<template>
  <div>
    <h2>Completed jobs ({{ totalCompletedJobs }})</h2>
    <p>
      These jobs have been completed or cancelled
    </p>
    <b-row>
      <b-col md="8" class="my-1">
        <b-pagination :total-rows="totalCompletedJobs" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
      <b-col md="4" class="my-1">
        <b-form-group horizontal label="Per page" class="mb-0">
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-group>
      </b-col>
    </b-row>
    <b-table id="jobs-completed-table"
             show-empty
             stacked="md"
             small
             :items="completedJobsProvider"
             :fields="fields"
             striped
             hover
             :busy.sync="isBusy"
             ref="qjt"
             :perPage="perPage"
             :current-page="currentPage"
             :detailedItems="detailedItems"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             no-provider-sorting
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
            <li v-for="(label, key) in detailedItems" :key="key"><strong>{{ label }}</strong>: {{ row.item[key] }}</li>
          </ul>
        </b-card>
      </template>
    </b-table>

    <b-button variant="primary" @click="refreshTable()">
        Refresh
    </b-button>
  </div>
</template>

<script>
import axios from 'axios';

axios.defaults.headers.common['Content-type'] = 'application/vnd.api+json';


const moment = require('moment');

export default {
  name: 'completed-jobs',
  data() {
    return {
      fields: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'work-order-id', label: 'WO', sortable: true },
        { key: 'date-requested', label: 'Date requested', sortable: true, class: 'text-center', formatter: value => moment(value).zone(0).format('DD-MM-YYYY HH:mm:ss') },
        { key: 'completed', label: 'Date completed', sortable: true, class: 'text-center' },
        { key: 'cancelled', label: 'Date cancelled', sortable: true, class: 'text-center' },
        { key: 'requested-by', label: 'Requested by', sortable: true },
        { key: 'project', label: 'SS Study', sortable: true },
        { key: 'product', label: 'Product', sortable: true },
        { key: 'product-options', label: 'Product options', sortable: true },
        { key: 'batch-size', label: '# samples', sortable: true },
        { key: 'details', label: '' },
        { key: 'selected', label: '' },
      ],
      isBusy: false,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      totalCompletedJobs: 0,
      sortBy: 'date-requested',
      sortDesc: false,
      items: [],
      detailedItems: {
        'desired-date': 'Desired Date',
        barcode: 'Barcode',
        comment: 'Comment',
        started: 'Start Date',
      },
    };
  },
  methods: {
    refreshTable() {
      this.$root.$emit('bv::refresh::table', 'jobs-completed-table');
    },
    refreshCompletedJobsTable() {
      this.$root.$emit('bv::refresh::table', 'completed-jobs-table');
    },
    completedJobsProvider(ctx) {
      this.isBusy = true;
      return axios({
        url: `${process.env.WORK_ORDER_URL}/api/v1/jobs`
              + '?filter[status]=concluded'
              + `&page[number]=${ctx.currentPage}`
              + `&page[size]=${ctx.perPage}`,
        method: 'GET',
      })
        .then((response) => {
          const items = response.data.data.map((item) => {
            const formattedItem = Object.assign({ selected: false }, item, item.attributes);
            delete formattedItem.attributes;
            return formattedItem;
          });
          this.items = items;
          if (response.data.meta['record-count']) {
            this.totalCompletedJobs = response.data.meta['record-count'];
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
            method: 'put',
            url: `/jobs/${item.id}/cancel`,
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
            method: 'put',
            url: `/jobs/${item.id}/complete`,
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
