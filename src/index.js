// Use a Node.js core library
import * as d3 from 'd3';
import 'babel-polyfill';

import changeH1Color from './teste';
import numberPrsNewContributorsAccepted from './newContributorsPRs';
import timeAcceptReviewPrs from './timeAcceptReviewPRs';

// Log the parts object to our browser's console
d3.select('body').style('background-color', 'lightblue');
changeH1Color();

// User input
// const username = 'CMU-Perceptual-Computing-Lab';
// const projectName = 'openpose';
// const username = 'hpbl';
// const projectName = 'OnboardingVisualization';
const username = 'eriklindernoren';
const projectName = 'Keras-GAN';

// Number of PRs oppened by new contributors
numberPrsNewContributorsAccepted(
  username,
  projectName,
  500,
  'firstPRs',
);

timeAcceptReviewPrs(
  username,
  projectName,
  500,
  'timeAcceptReviewPRs',
);
