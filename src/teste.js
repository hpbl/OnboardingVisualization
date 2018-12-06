// Use a Node.js core library
import * as d3 from 'd3';

// Log the parts object to our browser's console
function changeH1Color() {
  d3.select('h1').style('background-color', 'lightgreen');
}

export default changeH1Color;
