import 'babel-polyfill';

import numberPrsNewContributorsAccepted from './visualizations/newContributorsPRs';
import { forksResultedInPR } from './visualizations/forksPRs';
import { readmeIssues } from './visualizations/readmeIssues';
import releaseFrequency from './visualizations/releaseFrequency';
import timeAcceptReviewPrs from './visualizations/timeAcceptReviewPRs';

// User input
const urlParams = new URLSearchParams(window.location.search);

const username = urlParams.get('user');
const projectName = urlParams.get('repo');

// const username = 'CMU-Perceptual-Computing-Lab';
// const projectName = 'openpose';

// Number of forks that resulted in PRs
forksResultedInPR(username, projectName, 'forksPRs');

// Number of PRs oppened by new contributors
numberPrsNewContributorsAccepted(username, projectName, 500, 'firstPRs');

// Issues related to README
readmeIssues(username, projectName, 'readmeIssues');

// Number of PRs oppened by new contributors
releaseFrequency(username, projectName, 500, 'releaseFrequency');

// Time to accept and review PRs
timeAcceptReviewPrs(
  username,
  projectName,
  500,
  'timeAcceptReviewPRs',
);
