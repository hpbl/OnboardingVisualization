import * as d3 from 'd3';
import 'babel-polyfill';

import numberPrsNewContributorsAccepted from './visualizations/newContributorsPRs';
import { forksResultedInPR } from './visualizations/forksPRs';
import { readmeIssues } from './visualizations/readmeIssues';

// Log the parts object to our browser's console
d3.select('body').style('background-color', 'lightblue');

// User input
const username = 'CMU-Perceptual-Computing-Lab';
const projectName = 'openpose';

// Number of PRs oppened by new contributors
numberPrsNewContributorsAccepted(username, projectName, 500, 'firstPRs');

// Number of forks that resulted in PRs
forksResultedInPR(username, projectName, 'forksPRs');

// Issues related to README
readmeIssues(username, projectName, 'readmeIssues');
