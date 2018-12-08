// Use a Node.js core library
import * as d3 from 'd3';
import 'babel-polyfill';

import { getReviewsForPrs } from './dataProvider';

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
// prsWithChangeRequested(username, projectName);
async function x() {
  const y = await getReviewsForPrs(username, projectName);
  console.log(y);
}
x();
