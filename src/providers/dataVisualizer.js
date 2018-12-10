import * as d3 from 'd3';
import { colors } from '../colorPalette';

// sections :: [{name: String, count: Int, color: String}]
export function donutChart(sections, size, divId) {
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

  const svg = d3.select(`#${divId}`)
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


export function textualValue(text, divId) {
  d3.select(`#${divId}`)
    .append('h1')
    .text(text);
}

export function timeline(dateData, divId, initialDate) {
  const width = 1000;
  const height = 400;
  const padding = 100;

  // create an svg container
  const vis = d3.select(`#${divId}`)
    .append('svg:svg')
    .attr('width', width)
    .attr('height', height);

  // define the x scale (horizontal)
  const mindate = initialDate;
  const maxdate = new Date();

  const scale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, Math.max(...dateData.map(d => d.count))]);

  const x = d3.scaleLinear()
    .domain([mindate, maxdate]) // values between for month of january
    .range([padding, width - padding]); // map these the the chart width = total

  const y = d3.scaleLinear()
    .domain([0, 0])
    .range([height - padding, height - padding]);
  // draw x axis with labels and move to the bottom of the chart area
  vis.append('g')
    .attr('class', 'xaxis') // give it a class so it can be used to select only xaxis labels  below
    .attr('transform', `translate(0,${height - padding})`)
    .call(d3.axisBottom(x)
      .tickFormat(d3.timeFormat('%B/%Y')))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-65)');

  vis.append('g')
    .selectAll('circle')
    .data(dateData)
    .enter()
    .append('circle')
    .attr('r', d => scale(d.count))
    .attr('cx', d => x(d.day))
    .attr('cy', y(0))
    .attr('opacity', 0.7)
    .attr('fill', colors.purple);
}

export function densityPlot(sections, size, divId) {
  const width = size * 3;
  const height = size;
  const margin = {
    top: height / 25,
    right: 3 * width / 50,
    bottom: height / 15,
    left: width / 12,
  };

  const axisDomain = {
    x: [0, Math.max(...sections.map(d => d.data.length - 1))],
    y: [0, Math.max(...sections.map(d => Math.max(...d.data.map(dd => dd.length))))],
  };

  const x = d3.scaleLinear()
    .domain(axisDomain.x)
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain(axisDomain.y)
    .range([height - margin.bottom, margin.top]);

  const svg = d3.select('div')
    .attr('id', divId)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g');

  const formatAxis = d3.format('d');

  svg.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x)
      .tickFormat(formatAxis))
    .append('text')
    .attr('x', (width + margin.left + margin.right) / 2)
    .attr('y', 4 * margin.bottom / 5)
    .attr('fill', '#000000')
    .attr('text-anchor', 'end')
    .attr('font-weight', 'bold')
    .text('Time (in days)');

  svg.append('g')
    .attr('class', 'axis axis--y')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y)
      .tickFormat(formatAxis))
    .append('text')
    .attr('y', 4 * margin.left / 5)
    .attr('transform', 'rotate(10)')
    .attr('fill', '#000000')
    .attr('text-anchor', 'end')
    .attr('font-weight', 'bold')
    .text('Number of PRs');

  for (let i = 0; i < sections.length; i += 1) {
    const currentData = sections[i].data.map((d, j) => [j, d.length]);
    const currentColor = sections[i].color;

    svg.append('path')
      .datum(currentData)
      .attr('fill', 'none')
      .attr('stroke', currentColor)
      .attr('stroke-width', 3)
      .attr('stroke-linejoin', 'round')
      .attr('d', d3.line()
        .curve(d3.curveCatmullRom)
        .x(d => x(d[0]))
        .y(d => y(d[1])));

    const currentDataWithNonZeros = currentData.filter(d => d[1] > 0);
    svg.append('g')
      .selectAll('circle')
      .data(currentDataWithNonZeros)
      .enter()
      .append('circle')
      .attr('r', 4)
      .style('opacity', 0.4)
      .attr('cx', d => x(d[0]))
      .attr('cy', d => y(d[1]));
  }
}

export default {
  donutChart,
  timeline,
  textualValue,
  densityPlot,
};
