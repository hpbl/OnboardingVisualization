/* eslint-disable no-await-in-loop */

const token = '7bcf525661ad1aa9f62d7308ba76d487ac3bbd77';

async function getRepo(user, repo) {
  const fetchResult = await fetch(`https://api.github.com/repos/${user}/${repo}?access_token=${token}`);
  const promise = fetchResult.json();
  const promiseValue = await promise.then(value => value);

  return promiseValue;
}

async function getPrs(user, repo) {
  let prsList = [];
  let page = 1;
  let promiseValue = [0];
  while (promiseValue.length !== 0) {
    const fetchResult = await fetch(`https://api.github.com/repos/${user}/${repo}/pulls?access_token=${token}&page=${page}&per_page=100&state=all`);
    const promise = fetchResult.json();
    promiseValue = await promise.then(value => value);

    console.log(`page: ${page}, ${promiseValue.length}`);
    prsList = prsList.concat(promiseValue);
    page += 1;
  }

  return prsList;
}

const knownForks = [];

function prIsFromFork(pr) {
  // verifica se o pr veio de um fork deletado ou um ativo e o fork não foi contado ainda
  const response = (pr.head.repo === null || pr.head.repo.fork === true)
    && knownForks.indexOf(pr.head.label) === -1;
  knownForks.push(pr.head.label);
  return response;
}

function prFromGhostForks(pr) {
  return pr.head.repo === null;
}

function prFromForkWithoutGhost(pr) {
  // verifica se o pr veio de um fork ativo e o fork não foi contado ainda
  const response = pr.head.repo != null && pr.head.repo.fork === true
    && knownForks.indexOf(pr.head.label) === -1;
  knownForks.push(pr.head.label);
  return response;
}

async function forksResultedInPR(user, repo, callback) {
  const repoData = await getRepo(user, repo);
  console.log(repoData);

  const prsData = await getPrs(user, repo);
  console.log(prsData);

  // total de forks ativos + os pr de forks deletados
  const totalForks = repoData.forks + prsData.filter(prFromGhostForks).length;
  console.log(`actual forks: ${totalForks}`);
  console.log(`number of prs: ${prsData.length}`);
  console.log(`ghost forks: ${prsData.filter(prFromGhostForks).length}`);
  console.log(`prs from fork:${prsData.filter(prIsFromFork).length}`);
  const numberPRsByFork = prsData.filter(prIsFromFork).length;

  // dados de pr sem forks deletados
  const totalForksWithoutGhosts = repoData.forks;
  const numberPRsByForkWithoutGhosts = prsData.filter(prFromForkWithoutGhost).length;
  console.log(`${numberPRsByFork}${totalForksWithoutGhosts}${numberPRsByForkWithoutGhosts}`);
  const div = '<div> visualization </div>';
  callback(div);
}

// forksResultedInPR('ambujraj', 'hacktoberfest2018', div => div);
forksResultedInPR('CMU-Perceptual-Computing-Lab', 'openpose', div => div);
