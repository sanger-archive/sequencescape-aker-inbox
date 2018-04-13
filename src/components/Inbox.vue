<template>
  <div>
    <nav-bar></nav-bar>

    <b-container fluid class="ct">
      <b-row>
        <b-col md="10" offset-md="1">
          <h1>DNA pipeline backlog</h1>
          <hr>
          <queued-jobs></queued-jobs>
          <hr>
          <jobs-in-progress></jobs-in-progress>
          <hr>
          <completed-jobs></completed-jobs>
        </b-col>
      </b-row>

    </b-container>
  </div>
</template>

<script>
import NavBar from './NavBar';
import CompletedJobs from './CompletedJobs';
import JobsInProgress from './JobsInProgress';
import QueuedJobs from './QueuedJobs';

export default {
  name: 'app-container',
  components: {
    NavBar,
    CompletedJobs,
    JobsInProgress,
    QueuedJobs,
  },
  beforeCreate() {
    document.body.className = 'inbox';
  },
};
</script>

<style scoped>
.ct {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
