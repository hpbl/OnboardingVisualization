/* eslint-disable no-await-in-loop */

// Use a Node.js core library
import * as d3 from 'd3';

const token = '43aae801c5a8102a0468a7ce5398fac958611e6c';

async function getPrs(user, repo) {
  let prsList = [];
  let page = 1;
  let promiseValue = [0];
  while (promiseValue.length !== 0) {
    const fetchResult = await fetch(`https://api.github.com/repos/${user}/${repo}/pulls?access_token=${token}&page=${page}&per_page=100&state=all&sort=created_at`);
    const promise = fetchResult.json();
    promiseValue = await promise.then(value => value);

    console.log(`page: ${page}, ${promiseValue.length}`);
    prsList = prsList.concat(promiseValue);
    page += 1;
  }

  return prsList;
}

function numberPrsNewContributorsAcceptedDonutChart(
  notAcceptedPrs, acceptedPrs, size,
) {
  const data = [
    {
      name: 'Accepted PRs', count: acceptedPrs, color: '#00ff85',
    },
    {
      name: 'Not accepted PRs', count: notAcceptedPrs, color: '#e90052',
    },
  ];

  const width = size;
  const height = size;

  const radius = 4 * size / 10;
  const innerRadius = size / 10;

  const numberTextSize = size / 10;
  const nameTextSize = size / 40;

  const arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(innerRadius);

  const pie = d3.pie()
    .sort(null)
    .value(d => d.count);

  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const g = svg.selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g');

  g.append('path')
    .attr('d', arc)
    .style('fill', d => d.data.color);

  const gTexts = svg.selectAll('.arc2')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'arc');

  gTexts.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('dy', `.${numberTextSize}em`)
    .style('text-anchor', 'middle')
    .style('font-size', `${numberTextSize}px`)
    .attr('font-family', 'consolas')
    .text(d => d.data.count);

  gTexts.append('text')
    .attr('transform', (d) => {
      const dAux = arc.centroid(d);
      dAux[1] += numberTextSize;
      return `translate(${dAux})`;
    })
    .attr('dy', `.${numberTextSize}em`)
    .style('text-anchor', 'middle')
    .style('font-size', `${nameTextSize}px`)
    .attr('font-family', 'consolas')
    .text(d => d.data.name);

  d3.select('body')
    .append('div')
    .node()
    .appendChild(svg.node());

  return svg;
}

async function numberPrsNewContributorsAccepted(user, repo, size, callback) {
  const prs = await getPrs(user, repo);
  // console.log(prs);

  // get first PR of each user in the repo:
  const firstPrs = {};
  for (let i = 0; i < prs.length; i += 1) {
    const pr = prs[i];
    const prLogin = pr.user.login;
    if (firstPrs[prLogin] === undefined) {
      firstPrs[prLogin] = pr;
    }
  }
  const firstPrsValues = Object.values(firstPrs);
  const prsNewContributorsCount = firstPrsValues.length;

  // check if those PRs were accepted or not:
  let acceptedFirstPrs = [];
  for (let i = 0; i < prsNewContributorsCount; i += 1) {
    const pr = firstPrsValues[i];
    if (pr.merged_at !== null) {
      acceptedFirstPrs = acceptedFirstPrs.concat(pr);
    }
  }
  const acceptedPrsNewContributorsCount = acceptedFirstPrs.length;

  const notAcceptedPrs = prsNewContributorsCount - acceptedPrsNewContributorsCount;
  const acceptedPrs = acceptedPrsNewContributorsCount;

  // console.log(`notAcceptedPrs: ${notAcceptedPrs}`);
  // console.log(`acceptedPrs: ${acceptedPrs}`);

  const donutChart = numberPrsNewContributorsAcceptedDonutChart(
    notAcceptedPrs, acceptedPrs, size,
  );

  callback(donutChart);
}

export default numberPrsNewContributorsAccepted;
