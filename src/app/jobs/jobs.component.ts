import {ActivatedRoute} from '@angular/router';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';

import {ErrorService} from '../core/services/error.service';
import {Job} from '../core/models/job';
import {PipelinesService} from '../core/services/pipelines.service';
import {SegmentService} from '../core/services/segment.service';
import {StartJobComponent} from './start-job/start-job.component';
import {BaseApplication} from '../core/classes/base-application';
import {animations} from '../core/animations';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
  animations: animations
})
export class JobsComponent extends BaseApplication implements OnInit, OnDestroy {

  /**
   * List of jobs to pass to the job list
   * @type {Array}
   */
  jobs: Array<Job> = [];

  /**
   * List of jobs filtered from the shown jobs
   */
  filteredJobs: Array<Job> = [];

  /**
   * Holds the filter text (input)
   */
  filterText = '';

  /**
   * Latest job used in the header display
   */
  lastJob: Job;

  /**
   * Loading indicator
   * @type {boolean}
   */
  loadingJobs = false;

  /**
   * App id of jobs to see
   */
  appId: string;

  /**
   * Refresh Interval
   */
  interval: any;

  /**
   * Indicator for data loaded and display initialized
   */
  isInitialized = false;

  /**
   * Holds repo full name
   */
  repoFullName: string;

  /**
   * Holds vcs type
   */
  vcsType: string;

  /**
   * Flag to toggle vcs type icon feature
   */
  vcsTypeIconFeature: boolean;

  /**
   * Holds the subject, used to debounce
   */
  filterSubject = new Subject<string>();

  /**
   * Build the component and inject services if needed
   * @param pipelines
   * @param errorHandler
   * @param route
   * @param segment
   * @param dialog
   */
  constructor(
    protected pipelines: PipelinesService,
    protected errorHandler: ErrorService,
    private route: ActivatedRoute,
    private segment: SegmentService,
    private dialog: MdDialog) {
    super(errorHandler, pipelines);
  }

  /**
   * Open Dialog to informs the user about the different
   * ways how to start a Pipelines job
   */
  startJob() {
    let dialogRef: MdDialogRef<StartJobComponent>;
    dialogRef = this.dialog.open(StartJobComponent);
    if (dialogRef) {
      dialogRef.componentInstance.appId = this.appId;
    }
    // Track button click
    this.segment.trackEvent('ClickStartJobButton', {appId: this.appId});
  }

  /**
   * Initialize, and set up the refresh
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.appId = params['app'];
      this._appId = params['app'];
      this.interval = setInterval(() => {
        this.getJobs();
      }, 10000);

      // run right away
      this.getJobs();
    });

    this.filterSubject
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(filterText => {
        this.filterText = filterText;
        this.filter();
      });

    // Get GitHub Status and VCS Info
    this.getInfo().then(info => {
      this.repoFullName = info.repo_name;
      this.vcsType = info.repo_type;
    }).catch(e => this.errorHandler.apiError(e));
  }

  /**
   * Clear the refresh if needed on destroy
   */
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /**
   * Clears the filter text applied
   */
  clearFilter() {
    this.filterText = '';
    this.filter();
  }

  /**
   * Filter the jobs with the text entered
   */
  filter() {
    if (this.filterText === '' || !this.filterText) {
      this.filteredJobs = this.jobs;
    } else {
      this.filteredJobs = this.jobs ? this.jobs.filter(job => {
          const filterTextLowerCase = this.filterText.toLowerCase();
          const trigger = this.getTriggerTypeFromFilterText(filterTextLowerCase);
          const status = this.getStatusFromFilterText(filterTextLowerCase);
          let filterByStatusMatch = false;
          let filterByTriggerMatch = false;
          let filterByPRNameMatch = false;
          // Construct the PR #Nmuber string if PR Number is available
          const pullRequest = (job.metadata && job.metadata.pull_request) ?
            `pr ${job.metadata.pull_request.toLowerCase()}` : '';

          // Case 1 : Check if a pull request matches with the text shown i.e, PR #Number
          if (job.isPullRequest) {
            if (pullRequest !== '' && pullRequest.indexOf(filterTextLowerCase) > -1) {
              filterByPRNameMatch = true;
            }
          }

          // Case 2 : Check if the user is searching for 'success' or 'failed' jobs
          if (status !== '') {
            if (((status === 'success' && job.isSucceeded)  || (status === 'failure' && job.isFailed))) {
              filterByStatusMatch = true;
            }
          }

          // Case 3 : Check if the user is searching for any trigger type
          if (trigger !== '') {
            if (job.trigger && job.trigger.toLowerCase().indexOf(trigger) > -1) {
              filterByTriggerMatch = true;
            }
          }

          // Case 1 : Check if the input matches with any branch name or if a pull request check if it matches with
          //          the text shown i.e, PR #Number
          // Case 2 : Check if the user is searching for 'success' or 'failed' jobs
          // Case 3 : Check if the user is searching for any trigger type
          return ((job.branch.toLowerCase().indexOf(filterTextLowerCase) > -1 || filterByPRNameMatch) || // Case 1
            (job.status.toLowerCase().indexOf(filterTextLowerCase) > -1 || filterByStatusMatch) || // Case 2
            filterByTriggerMatch); // Case 3
            }) : [];
    }
  }

  /**
   * Get the trigger type by the input text
   * @param filterText
   * @returns {any}
   */
  getTriggerTypeFromFilterText(filterText) {
    switch (filterText) {
      case 'pr':
      case 'pull request':
      case 'pull':
        return 'pull_request';
      case 'branch':
      case 'push':
        return 'push';
      case 'manual':
        return'manual';
      default:
        return '';
    }
  }

  /**
   * Get the status by the input text
   * @param filterText
   * @returns {any}
   */
  getStatusFromFilterText(filterText) {
    switch (filterText) {
      case 'pass':
      case 'passed':
      case 'success':
      case 'succeeded':
        return 'success';
      case 'fail':
      case 'failed':
      case 'error':
      case 'errored':
        return 'failure';
      default:
        return '';
    }
  }


  /**
   * Load the job list
   */
  getJobs() {
    this.loadingJobs = true;

    // Get Jobs to be listed
    this.pipelines.getJobsByAppId(this.appId)
      .then(jobs => {
        // Assign the returned jobs if the initial jobs array is empty.
        // This is to avoid the reversal of the list as
        // every new order is inserted using unshift.
        if (this.jobs.length === 0) {
          this.jobs = jobs;
        } else {
          jobs.forEach(newJob => {
            // Find if the new job is an existing one
            const oldJob = this.jobs.find(job => job.job_id === newJob.job_id);
            if (oldJob) {
              Object.assign(oldJob, newJob);
            } else {
              // Append/insert the new record at the top of the list.
              this.jobs.unshift(newJob);
            }
          });
        }
      })
      .then(() => this.lastJob = this.jobs[0])
      .catch(e =>
        this.errorHandler
          .apiError(e)
          .reportError(e, 'FailedToGetJobs', {component: 'jobs', appId: this.appId}, 'error')
          .showError('Homepage', '/auth/tokens')
      )
      .then(() => {
          this.loadingJobs = false;
          this.filter();
          // One time binding for tracking display initialization of card that
          // contains job data
          if (!this.isInitialized) {
            this.isInitialized = true;
          }
        }
      );
  }
}
