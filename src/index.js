// Use a Node.js core library
import * as d3 from 'd3';
import 'babel-polyfill';

import changeH1Color from './teste';
import numberPrsNewContributorsAccepted from './newContributorsPRs';

// Log the parts object to our browser's console
d3.select('body').style('background-color', 'lightblue');
changeH1Color();

// User input
const username = 'CMU-Perceptual-Computing-Lab';
const projectName = 'openpose';

// Number of PRs oppened by new contributors
numberPrsNewContributorsAccepted(
  username,
  projectName,
  500,
  'firstPRs',
);
