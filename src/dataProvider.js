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

export async function getPrCommentsList(user, repo, prNumber) {
  const fetchResult = await fetch(`https://api.github.com/repos/${user}/${repo}/pulls/${prNumber}/comments?access_token=${token}`);
  const promise = fetchResult.json();
  const promiseValue = await promise.then(value => value);
  const commentsList = await promiseValue;

  return commentsList;
}

export async function getPrReviewsList(user, repo, prNumber) {
  const fetchResult = await fetch(`https://api.github.com/repos/${user}/${repo}/pulls/${prNumber}/reviews?access_token=${token}`);
  const promise = fetchResult.json();
  const promiseValue = await promise.then(value => value);
  const commentsList = await promiseValue;

  return commentsList;
}

export default { getPrs, getPrCommentsList, getPrReviewsList };
