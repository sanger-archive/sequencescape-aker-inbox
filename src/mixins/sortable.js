const sortable = {
  data() {
    return {
      sortFields: {
        'date-requested': 'work_order.dispatch-date',
        priority: 'work_plan.priority',
        completed: 'completed',
        cancelled: 'cancelled',
        started: 'started',
      },
    };
  },
  methods: {
    sortValue(ctx) {
      const direction = (ctx.sortDesc === true) ? '-' : '';
      return `sort=${direction}${this.sortFields[ctx.sortBy]}`;
    },
  },
};

export default sortable;
