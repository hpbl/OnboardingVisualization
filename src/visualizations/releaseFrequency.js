/* eslint-disable no-await-in-loop */

import { getReleases, getRepo } from '../dataProvider';
import { timeline } from '../providers/dataVisualizer';

// date format to year-month-day
function formatDate(date) {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`;
  const day = `${d.getDate()}`;
  const year = d.getFullYear();

  return [year, month, day].join('-');
}

async function releaseFrequency(user, repo, size, divId) {
  const repoData = await getRepo(user, repo);
  // get releases
  const releases = await getReleases(user, repo);
  // start empty object
  let releaseDates = {};
  // add dates to object counting them
  for (let i = 0; i < releases.length; i += 1) {
    const dateObj = new Date(releases[i].published_at);
    const date = formatDate(dateObj);
    if (!(date in releaseDates)) {
      releaseDates[date] = { day: new Date(date), count: 1 };
    } else {
      releaseDates[date].count += 1;
    }
  }
  // object to array, it will be used in draw function
  releaseDates = Object.values(releaseDates);
  // passing initial date = repo created
  const repoCreatedDate = new Date(repoData.created_at);
  timeline(releaseDates, divId, repoCreatedDate);
}

export default releaseFrequency;
