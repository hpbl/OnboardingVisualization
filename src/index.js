// Use a Node.js core library
import * as d3 from 'd3';
import 'babel-polyfill';

import { requestedChanges } from './requestedChanges';

import changeH1Color from './teste';
import numberPrsNewContributorsAccepted from './newContributorsPRs';
// import prsWithChangeRequested from './requestedChanges';

// Log the parts object to our browser's console
d3.select('body').style('background-color', 'lightblue');
changeH1Color();

// User input
const username = 'hpbl';
const projectName = 'OnboardingVisualization';

// Number of PRs oppened by new contributors
numberPrsNewContributorsAccepted(
  username,
  projectName,
  500,
  'firstPRs',
);
requestedChanges(
  username,
  projectName,
  { height: 500, width: 500 },
  'changeRequest',
);
// async function x() {
//   console.log('alo');
//   const y = await requestedChanges(username, projectName, 500, 'dale');
//   console.log(y);
// }
