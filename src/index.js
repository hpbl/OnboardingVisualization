// Use a Node.js core library
import * as d3 from 'd3';

import changeH1Color from './teste';
import numberPrsNewContributorsAccepted from './15_visualize_number_prs_new_contributors';

// Log the parts object to our browser's console
d3.select('body').style('background-color', 'lightblue');

console.log(d3.version);
console.log('testando');

changeH1Color();
numberPrsNewContributorsAccepted('CMU-Perceptual-Computing-Lab', 'openpose', div => d3.select('body').append(div));
