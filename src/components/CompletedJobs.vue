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
          {{ row.detailsShowing ? 'Less' : 'More'}}
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

function translateDate(value) {
  return ((value == null) ? '' : moment(value).zone(0).format('DD-MM-YYYY HH:mm:ss'));
}

export default {
  name: 'completed-jobs',
  data() {
    return {
      fields: [
        { key: 'id', label: 'Job ID' },
        { key: 'work-order-id', label: 'Work Order ID' },
        { key: 'date-requested', label: 'Date Requested', sortable: true, class: 'text-center', formatter: translateDate },
        { key: 'completed', label: 'Date Completed', sortable: true, class: 'text-center', formatter: translateDate },
        { key: 'cancelled', label: 'Date Cancelled', sortable: true, class: 'text-center', formatter: translateDate },
        { key: 'requested-by', label: 'Requested by' },
        { key: 'project-and-costcode', label: 'Aker Project (Costcode)' },
        { key: 'process', label: 'Process' },
        { key: 'process-modules', label: 'Process Modules' },
        { key: 'priority', label: 'Priority', sortable: true },
        { key: 'batch-size', label: '# samples' },
        { key: 'details', label: '' },
      ],
      isBusy: false,
      currentPage: 1,
      perPage: 8,
      totalCompletedJobs: 0,
      sortBy: 'date-requested',
      sortDesc: false,
      items: [],
      detailedItems: {
        barcode: 'Barcode',
        'work-plan-comment': 'Comment',
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
      return axios({
        url: `${process.env.WORK_ORDER_URL}/api/v1/jobs`
              + '?filter[status]=concluded'
              + `&page[number]=${ctx.currentPage}`
              + `&page[size]=${ctx.perPage}`,
        method: 'GET',
      })
        .then((response) => {
          const items = response.data.data.map((item) => {
            const formattedItem = Object.assign(
              { selected: false, _rowVariant: this.jobPriority(item) }, item, item.attributes,
            );
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
    toggleSelectedJob(item, index, event) {
      this.items.forEach((itemInArray) => {
        if (itemInArray.id === item.id) item.selected = event;
      });
    },
    jobPriority(item) {
      return item.attributes.priority === 'high' ? 'danger' : '';
    },
  },
  computed: {
    jobsSelected() {
      return this.items.some(item => item.selected);
    },
  },
};
</script>
