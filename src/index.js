// Use a Node.js core library
import * as d3 from 'd3';
import 'babel-polyfill';

import changeH1Color from './teste';
import numberPrsNewContributorsAccepted from './newContributorsPRs';
import releaseFrequency from './releaseFrequency';

// Log the parts object to our browser's console
d3.select('body').style('background-color', 'lightblue');
changeH1Color();

// User input
const username = 'd3';
const projectName = 'd3';

// Number of PRs oppened by new contributors
numberPrsNewContributorsAccepted(
  username,
  projectName,
  500,
  'firstPRs',
);

// Number of PRs oppened by new contributors
releaseFrequency(
  username,
  projectName,
  500,
  'releaseFrequency',
);
