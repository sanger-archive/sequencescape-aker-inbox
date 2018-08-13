<template>
  <div>
    <h2>Queued jobs ({{ totalQueuedJobs }})</h2>
    <p>
      These jobs can be reprioritised (ordered by request date by default)
    </p>
    <b-row>
      <b-col md="12" class="my-1">
        <b-pagination :total-rows="totalQueuedJobs" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>
    <b-table id="jobs-queued-table"
             show-empty
             stacked="md"
             small
             :items="queuedJobsProvider"
             :fields="fields"
             striped
             hover
             :busy.sync="isBusy"
             ref="qjt"
             :perPage="perPage"
             :current-page="currentPage"
             :sortBy="sortBy"
             no-local-sorting
             no-sort-reset
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
            <li v-for="(label, key) in detailedItems" :key="key">
              <div v-if="key == 'input-set-uuid'">
                <a v-bind:href="createSetLink(row.item[key])" target="_blank">{{ label }}</a>
              </div>
              <div v-else>
                <strong>{{ label }}:</strong> {{ row.item[key] }}
              </div>
            </li>
          </ul>
        </b-card>
      </template>
    </b-table>

    <b-button variant="primary" @click="refreshTable()">
        Refresh
    </b-button>
    <div class="float-right">
      <b-button variant="success" @click="startJobs()" :disabled="!jobsSelected">
          Start jobs
      </b-button>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import sortable from '../mixins/sortable';
import setLinkable from '../mixins/set-linkable';

axios.defaults.headers.common['Content-type'] = 'application/vnd.api+json';

const moment = require('moment');

function translateDate(value) {
  return ((value == null) ? '' : moment(value).utcOffset(0).format('DD-MM-YYYY HH:mm:ss'));
}

export default {
  name: 'queued-jobs',
  mixins: [sortable, setLinkable],
  data() {
    return {
      fields: [
        { key: 'id', label: 'Job ID' },
        { key: 'work-order-id', label: 'Work Order ID' },
        { key: 'date-requested', label: 'Date Requested', sortable: true, class: 'text-center', formatter: translateDate },
        { key: 'requested-by', label: 'Requested by' },
        { key: 'project-and-costcode', label: 'Aker Project (Costcode)' },
        { key: 'process', label: 'Process' },
        { key: 'process-modules', label: 'Process Modules' },
        { key: 'priority', label: 'Priority', sortable: true },
        { key: 'batch-size', label: '# samples' },
        { key: 'details', label: '' },
        { key: 'selected', label: '' },
      ],
      isBusy: false,
      currentPage: 1,
      perPage: 8,
      totalQueuedJobs: 0,
      sortBy: 'date-requested',
      sortDesc: false,
      items: [],
      detailedItems: {
        barcode: 'Barcode',
        'work-plan-comment': 'Comment',
        'input-set-uuid': 'View Input Set',
      },
    };
  },
  methods: {
    refreshTable() {
      this.$root.$emit('bv::refresh::table', 'jobs-queued-table');
    },
    refreshStartedJobsTable() {
      this.$root.$emit('bv::refresh::table', 'jobs-in-progress-table');
    },
    refreshCompletedJobsTable() {
      this.$root.$emit('bv::refresh::table', 'jobs-completed-table');
    },
    queuedJobsProvider(ctx) {
      return axios({
        url: `${process.env.AKER_URL}/work/api/v1/jobs`
              + '?filter[status]=queued'
              + `&page[number]=${ctx.currentPage}`
              + `&page[size]=${ctx.perPage}`
              + `&${this.sortValue(ctx)}`,
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
            this.totalQueuedJobs = response.data.meta['record-count'];
          }
          this.isBusy = false;
          return items;
        }).catch(() => {
          this.isBusy = false;
          return [];
        });
    },
    startJobs() {
      this.items.forEach((item) => {
        if (item.selected) {
          axios({
            method: 'PUT',
            url: `${process.env.SS_URL}/aker/jobs/${item.uuid}/start`,
          })
            .then(() => {
              this.refreshTable();
              this.refreshStartedJobsTable();
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
