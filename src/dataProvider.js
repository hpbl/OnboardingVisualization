/* eslint-disable no-await-in-loop */

const token = '43aae801c5a8102a0468a7ce5398fac958611e6c';

export async function getPrs(user, repo) {
  let prsList = [];
  let page = 1;
  let promiseValue = [0];
  while (promiseValue.length !== 0) {
    const fetchResult = await fetch(`https://api.github.com/repos/${user}/${repo}/pulls?access_token=${token}&page=${page}&per_page=100&state=all&sort=created_at`);
    const promise = fetchResult.json();
    promiseValue = await promise.then(value => value);

    prsList = prsList.concat(promiseValue);
    page += 1;
  }

  return prsList;
}

export async function getRepo(user, repo) {
  const fetchResult = await fetch(`https://api.github.com/repos/${user}/${repo}?access_token=${token}`);
  const promise = fetchResult.json();
  const promiseValue = await promise.then(value => value);

  return promiseValue;
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
  console.log(releasesList);
  return releasesList;
}

export default { getPrs, getReleases, getRepo };
