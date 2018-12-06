/* eslint-disable no-await-in-loop */

// Use a Node.js core library
import * as d3 from 'd3';
import 'babel-polyfill';

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
  prsNewContributorsCount, acceptedPrsNewContributorsCount,
) {
  // data = [
  //   {name: 'prsNewContributorsCount', value: prsNewContributorsCount},
  //   {name: 'acceptedPrsNewContributorsCount', value: acceptedPrsNewContributorsCount}
  // ]

  const data = [
    {
      name: 'cats', count: prsNewContributorsCount, percentage: 2, color: '#000000',
    },
    {
      name: 'dogs', count: acceptedPrsNewContributorsCount, percentage: 8, color: '#f8b70a',
    },
  ];

  const width = 540;
  const height = 540;
  const radius = 200;

  const arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(100);

  const pie = d3.pie()
    .sort(null)
    .value(d => d.count);

  const svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

  const g = svg.selectAll('.arc')
    .data(pie(data))
    .enter().append('g');

  g.append('path')
    .attr('d', arc)
    .style('fill', d => d.data.color);

  g.append('text')
    .attr('transform', (d) => {
      const dAux = arc.centroid(d);
      dAux[0] *= 1.5; // multiply by a constant factor
      dAux[1] *= 1.5; // multiply by a constant factor
      return `translate(${dAux})`;
    })
    .attr('dy', '.50em')
    .style('text-anchor', 'middle')
    .text((d) => {
      if (d.data.percentage < 8) {
        return '';
      }
      return `${d.data.percentage}%`;
    });

  return svg;
}

async function numberPrsNewContributorsAccepted(user, repo, callback) {
  console.log('eae');
  const prs = await getPrs(user, repo);
  console.log(prs);

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

  console.log(`prsNewContributorsCount: ${prsNewContributorsCount}`);
  console.log(`acceptedPrsNewContributorsCount: ${acceptedPrsNewContributorsCount}`);

  const donutChart = numberPrsNewContributorsAcceptedDonutChart(
    prsNewContributorsCount, acceptedPrsNewContributorsCount,
  );

  const div = d3.select('body').append('div').append(donutChart);
  callback(div);
}

export default numberPrsNewContributorsAccepted;
