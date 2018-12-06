/* eslint-disable no-await-in-loop */

const token = '43aae801c5a8102a0468a7ce5398fac958611e6c';

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

async function numberPrsNewContributorsAccepted(user, repo, callback) {
  const repoData = await getRepo(user, repo);
  console.log(repoData);

  const prsData = await getPrs(user, repo);
  console.log(prsData);

  const div = '<div> visualization </div>';
  callback(div);
}

numberPrsNewContributorsAccepted('ambujraj', 'hacktoberfest2018', div => div);
