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

export async function getReviewsForPrs(user, repo) {
  const prs = await getPrs(user, repo);
  console.log(prs);
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
  }

  return prs;
}


export default { getPrs, getReviewsForPrs };
