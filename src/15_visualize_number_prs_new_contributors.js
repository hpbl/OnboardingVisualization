/* eslint-disable no-await-in-loop */

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

async function numberPrsNewContributorsAccepted(user, repo, callback) {
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

  const div = '<div> visualization </div>';
  callback(div);
}

// numberPrsNewContributorsAccepted('ambujraj', 'hacktoberfest2018', div => div);
numberPrsNewContributorsAccepted('CMU-Perceptual-Computing-Lab', 'openpose', div => div);
