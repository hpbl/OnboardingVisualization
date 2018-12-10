/* eslint-disable no-await-in-loop */

import { getReleases, getRepo } from '../providers/dataProvider';
import { timeline, textualValue } from '../providers/dataVisualizer';

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

  const repoExistingTime = releaseDates[0].day - repoCreatedDate;
  const daysRepoExisting = repoExistingTime / (1000 * 60 * 60 * 24);
  const numberOfReleases = releaseDates.length;
  let daysReleaseFrequency = daysRepoExisting / numberOfReleases;

  let releaseFrequencyStr = '';
  if (numberOfReleases === 0) {
    releaseFrequencyStr = 'We hope to see you releasing soon!';
  } else if (daysReleaseFrequency < 1) {
    let hoursReleaseFrequency = daysReleaseFrequency * 24;
    hoursReleaseFrequency = Math.round(hoursReleaseFrequency);
    if (hoursReleaseFrequency === 1) {
      releaseFrequencyStr = 'A release occurs <strong>every hour</strong>';
    } else {
      releaseFrequencyStr = `A release occurs every <strong>${hoursReleaseFrequency} hours</strong>`;
    }
  } else {
    daysReleaseFrequency = Math.round(daysReleaseFrequency);
    if (daysReleaseFrequency === 1) {
      releaseFrequencyStr = 'A release occurs <strong>everyday<strong>';
    } else {
      releaseFrequencyStr = `A release occurs every <strong>${daysReleaseFrequency} days<strong>`;
    }
  }

  textualValue(releaseFrequencyStr, divId);

  timeline(releaseDates, divId, repoCreatedDate);
}

export default releaseFrequency;
