/* eslint-disable no-await-in-loop */
import { colors } from '../colorPalette';
import { getPrs } from '../providers/dataProvider';
import { donutChart } from '../providers/dataVisualizer';

async function numberPrsNewContributorsAccepted(user, repo, size, divId) {
  const prs = await getPrs(user, repo);

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

  const data = [
    {
      name: 'Accepted PRs', count: acceptedPrs, color: colors.green,
    },
    {
      name: 'Not accepted PRs', count: notAcceptedPrs, color: colors.pink,
    },
  ];
  donutChart(data, size, divId);
}

export default numberPrsNewContributorsAccepted;
