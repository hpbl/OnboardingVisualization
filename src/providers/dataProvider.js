/* eslint-disable no-await-in-loop */

const token = '43aae801c5a8102a0468a7ce5398fac958611e6c';

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


export default { getPrs, getRepo, getIssues };
