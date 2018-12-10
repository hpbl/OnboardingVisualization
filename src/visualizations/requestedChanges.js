import { getReviewsForPrs } from '../providers/dataProvider';
import { overlappingHistogram } from '../providers/dataVisualizer';

export async function requestedChanges(user, repo, size, divId) {
  const prs = await getReviewsForPrs(user, repo);

  const data = {};

  // filtering prs
  for (let i = 0; i < prs.length; i += 1) {
    if (prs[i].numberOfChanges) {
      if (prs[i].reviewStatus === 'APPROVED_AFTER_CHANGE') {
        if (data[prs[i].numberOfChanges]) {
          data[prs[i].numberOfChanges][1] += 1;
        } else {
          data[prs[i].numberOfChanges] = [0, 1];
        }
      } else if (data[prs[i].numberOfChanges]) {
        data[prs[i].numberOfChanges][0] += 1;
      } else {
        data[prs[i].numberOfChanges] = [1, 0];
      }
    }
  }

  const keys = Object.keys(data);

  const filteredData = [];
  for (let i = 0; i < keys.length; i += 1) {
    filteredData.push({
      name: keys[i],
      count: data[keys[i]],
    });
  }
  overlappingHistogram(filteredData, size, divId);
}

export default { requestedChanges };
