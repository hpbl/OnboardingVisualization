import { getRepo, getPrs } from '../providers/dataProvider';
import { donutChart } from '../providers/dataVisualizer';
import { colors } from '../colorPalette';

function prFromGhostForks(pr) {
  return pr.head.repo === null;
}

function getContributingForks(prs) {
  const knownUniqueForks = [];
  const unknownForks = [];

  for (let i = 0; i < prs.length; i += 1) {
    const pr = prs[i];
    const forkName = pr.head.label.split(':')[0];

    if (prFromGhostForks(pr)) {
      unknownForks.push(forkName);
    } else if (pr.head.repo.fork === true && knownUniqueForks.indexOf(forkName) === -1) {
      knownUniqueForks.push(forkName);
    }
  }

  return { knownUniqueForks, unknownForks };
}

function prIsFromFork(pr) {
  return (pr.head.repo === null || pr.head.repo.fork === true);
}

export async function forksResultedInPR(user, repo, divId) {
  const repoData = await getRepo(user, repo);
  const prsData = await getPrs(user, repo);

  const numberPRsFromForks = prsData.filter(prIsFromFork).length;

  const prsFromForksdata = [
    { name: 'PRs from forks', count: numberPRsFromForks, color: colors.blue },
    { name: 'Own PRs', count: prsData.length - numberPRsFromForks, color: colors.purple },
  ];
  donutChart(prsFromForksdata, 500, divId);

  const totalForks = repoData.forks + prsData.filter(prFromGhostForks).length;
  const { knownUniqueForks, unknownForks } = getContributingForks(prsData);
  const contributingUniqueForks = knownUniqueForks.length;
  const unknownContributingForks = unknownForks.length;
  const nonContributingForks = totalForks - (contributingUniqueForks + unknownContributingForks);

  const contributingForksData = [
    { name: 'Unique Forks with contributions', count: contributingUniqueForks, color: colors.green },
    { name: 'Forks without contributions', count: nonContributingForks, color: colors.pink },
    { name: 'Deleted forks with contributions', count: unknownContributingForks, color: colors.white },
  ];
  donutChart(contributingForksData, 500, divId);
}

export default { forksResultedInPR };