import * as d3 from 'd3';
import { colors } from './colorPalette';
// sections :: [{name: String, count: Int, color: String}]
export function donutChart(sections, size, divId) {
  // console.log('CHAMOU dataVisualizer');
  const width = size;
  const height = size;

  const radius = 4 * size / 10;
  const innerRadius = 2 * size / 10;

  const numberTextSize = size / 10;
  const nameTextSize = size / 40;

  const arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(innerRadius);

  const pie = d3.pie()
    .sort(null)
    .value(d => d.count);

  const svg = d3.select('div')
    .attr('id', divId)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const g = svg.selectAll('.arc')
    .data(pie(sections))
    .enter()
    .append('g');

  g.append('path')
    .attr('d', arc)
    .style('fill', d => d.data.color);

  const gTexts = svg.selectAll('.arc2')
    .data(pie(sections))
    .enter()
    .append('g')
    .attr('class', 'arc');

  gTexts.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .style('text-anchor', 'middle')
    .style('font-size', `${numberTextSize}px`)
    .attr('font-family', 'consolas')
    .text(d => d.data.count);

  gTexts.append('text')
    .attr('transform', (d) => {
      const dAux = arc.centroid(d);
      dAux[1] += (numberTextSize / 2);
      return `translate(${dAux})`;
    })
    .style('text-anchor', 'middle')
    .style('font-size', `${nameTextSize}px`)
    .attr('font-family', 'consolas')
    .text(d => d.data.name);
}

// data :: [{name: Int, count: [biggerSet: Int, smallerSet: Int]}]
export function overlappingHistogram(data, size, divId) {
  // Adjusting data
  const numberOfData = [...Array(Math.max(...data.map(x => x.name)) + 1).keys()];
  numberOfData.shift();
  // Canvas dimensions
  const margin = 50;
  const width = size.width - margin - margin;
  const height = size.height - margin - margin;
  // Canvas settings
  const canvas = d3.select(`#${divId}`)
    .append('svg')
    .attr('width', size.width)
    .attr('height', size.height)
    .append('g')
    .attr('transform', `translate(${margin},${margin})`);

  // x scale
  const x = d3.scaleBand()
    .domain(numberOfData)
    .range([0, width])
    .padding(0.1);

  canvas.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // y scale
  const y = d3.scaleLinear()
    .domain([0, Math.max(...data.map(i => i.count[0]))])
    .range([height, 0]);

  canvas.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y));

  // Bigger bar
  canvas.selectAll('.biggerBar')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.count[0]))
    .attr('fill', colors.pink)
    .attr('width', () => x.bandwidth())
    .attr('height', d => height - y(d.count[0]));

  // Smaller bar
  canvas.selectAll('.smallerBar')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.count[1]))
    .attr('fill', colors.green)
    .attr('width', () => x.bandwidth())
    .attr('height', d => height - y(d.count[1]));
}

export default { donutChart, overlappingHistogram };
