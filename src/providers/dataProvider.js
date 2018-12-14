/* eslint-disable no-await-in-loop */

const token = '21ca3e689e43e2ec61a923646f8ed4b4ca7ad919';

export async function isValidRepo(user, repo) {
  const fetchResult = await fetch(`https://api.github.com/repos/${user}/${repo}?access_token=${token}`);

  return fetchResult.ok;
}

async function paginate(baseURL) {
  let prsList = [];
  let page = 1;
  let promiseValue = [0];
  while (promiseValue.length !== 0) {
    const fetchResult = await fetch(`${baseURL}&page=${page}`);
    const promise = fetchResult.json();
    promiseValue = await promise.then(value => value);

    prsList = prsList.concat(promiseValue);
    page += 1;
  }

  return prsList;
}


export async function getPrs(user, repo) {
  const baseURL = `https://api.github.com/repos/${user}/${repo}/pulls?access_token=${token}&per_page=100&state=all&sort=created_at`;
  return paginate(baseURL);
}


export async function getRepo(user, repo) {
  const fetchResult = await fetch(`https://api.github.com/repos/${user}/${repo}?access_token=${token}`);
  const promise = fetchResult.json();
  const promiseValue = await promise.then(value => value);

  return promiseValue;
}


export async function getIssues(user, repo) {
  const requestParameters = `?state=all&per_page=100&access_token=${token}`;
  const baseURL = `https://api.github.com/repos/${user}/${repo}/issues${requestParameters}`;
  const issuesAndPRs = await paginate(baseURL);
  return issuesAndPRs.filter(pr => !pr.pull_request);
}

export async function getPrReviewsList(user, repo, prNumber) {
  const fetchResult = await fetch(`https://api.github.com/repos/${user}/${repo}/pulls/${prNumber}/reviews?access_token=${token}`);
  const promise = fetchResult.json();
  const promiseValue = await promise.then(value => value);
  const commentsList = await promiseValue;

  return commentsList;
}

export async function getReleases(user, repo) {
  let releasesList = [];
  let page = 1;
  let promiseValue = [0];
  while (promiseValue.length !== 0) {
    const fetchResult = await fetch(`https://api.github.com/repos/${user}/${repo}/releases?access_token=${token}&page=${page}&per_page=100&state=all&sort=published_at`);
    const promise = fetchResult.json();
    promiseValue = await promise.then(value => value);

    releasesList = releasesList.concat(promiseValue);
    page += 1;
  }

  return releasesList;
}

// Possible values for status:
// 'APPROVED', 'APPROVED_AFTER_CHANGE', 'CHANGES_REQUESTED', 'PENDING'
function prReviewState(pr) {
  let status = '';
  for (let i = 0; i < pr.review.length; i += 1) {
    if (status === 'CHANGES_REQUESTED' && (pr.review[i].state === 'APPROVED' || pr.margedAt)) status = 'APPROVED_AFTER_CHANGE';
    if (status === '' && (pr.review[i].state === 'APPROVED' || pr.review[i].state === 'CHANGES_REQUESTED')) status = pr.review[i].state;
  }

  if (status === '') status = 'PENDING';

  return status;
}

function numberOfChanges(pr) {
  let changes = 0;
  for (let i = 0; i < pr.review.length; i += 1) {
    if (pr.review[i].state === 'CHANGES_REQUESTED') changes += 1;
  }

  return changes;
}

export async function getReviewsForPrs(user, repo) {
  const prs = await getPrs(user, repo);
  for (let i = 0; i < prs.length; i += 1) {
    prs[i].review = [];
    let page = 1;
    let promiseValue = [0];
    while (promiseValue.length !== 0) {
      const fetchResult = await fetch(`https://api.github.com/repos/${user}/${repo}/pulls/${prs[i].number}/reviews?access_token=${token}&page=${page}&per_page=100`);
      const promise = fetchResult.json();
      promiseValue = await promise.then(value => value);

      prs[i].review = prs[i].review.concat(promiseValue);
      page += 1;
    }

    if (prs[i].review) prs[i].reviewStatus = prReviewState(prs[i]);
    if (prs[i].review) {
      prs[i].numberOfChanges = numberOfChanges(prs[i]);
    } else {
      prs[i].numberOfChanges = undefined;
    }
  }

  return prs;
}


export default {
  getReviewsForPrs, isValidRepo, getPrs, getRepo, getIssues, getPrReviewsList, getReleases,
};
