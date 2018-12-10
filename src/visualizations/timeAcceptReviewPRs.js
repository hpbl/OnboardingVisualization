/* eslint-disable no-await-in-loop */

// Use a Node.js core library
// import * as d3 from 'd3';

import { getPrs, getPrReviewsList } from '../providers/dataProvider';
import { densityPlot } from '../providers/dataVisualizer';

function getPrStart(pr) {
  const startStr = pr.created_at;
  const start = new Date(startStr);

  return start;
}

async function getPrReviewStart(user, repo, prNumber) {
  const reviewsList = await getPrReviewsList(user, repo, prNumber);
  if (reviewsList.length === 0) {
    return null;
  }

  const reviewStartStr = reviewsList[0].submitted_at;
  const reviewStart = new Date(reviewStartStr);

  return reviewStart;
}

function getPrAcceptanceDate(pr) {
  const acceptanceDateStr = pr.merged_at;
  if (acceptanceDateStr === null) {
    return null;
  }
  const acceptanceDate = new Date(acceptanceDateStr);

  return acceptanceDate;
}

function getPrClosureDate(pr) {
  const closureDateStr = pr.closed_at;
  if (closureDateStr === null) {
    return null;
  }
  const closureDate = new Date(closureDateStr);

  return closureDate;
}

async function timeAcceptReviewPrs(user, repo, size, divId) {
  // Get PRs list from repository
  const prs = await getPrs(user, repo);

  // Get review beginning duration and acceptance duration of each PR
  let acceptReviewPrList = [];
  for (let i = 0; i < prs.length; i += 1) {
    const pr = prs[i];
    const creationDate = getPrStart(prs[i]);
    const reviewStart = await getPrReviewStart(user, repo, pr.number);
    const acceptanceDate = getPrAcceptanceDate(prs[i]);
    const closureDate = getPrClosureDate(prs[i]);

    let daysForFirstReview = null;
    let daysForAcceptance = null;
    let daysForClosure = null;
    if (reviewStart !== null) {
      daysForFirstReview = Math.ceil((reviewStart - creationDate) / 86400000);
    }
    if (acceptanceDate !== null) {
      daysForAcceptance = Math.ceil((acceptanceDate - creationDate) / 86400000);
    }
    if (closureDate !== null) {
      daysForClosure = Math.ceil((closureDate - creationDate) / 86400000);
    }

    if (daysForFirstReview !== null || daysForClosure !== null) {
      let daysForReview = null;
      if (daysForFirstReview === null) {
        daysForReview = daysForClosure;
      } else {
        daysForReview = daysForFirstReview;
      }

      const acceptReviewPr = {
        pr, daysForAcceptance, daysForReview,
      };

      acceptReviewPrList = acceptReviewPrList.concat(acceptReviewPr);
    }
  }

  // Group PRs by its acceptance duration
  const maxAcceptanceDays = Math.max(...acceptReviewPrList.map(d => d.daysForAcceptance));
  const acceptancePerQuantityList = Array(maxAcceptanceDays + 1).fill([]);
  for (let i = 0; i < acceptReviewPrList.length; i += 1) {
    const currentPr = acceptReviewPrList[i].pr;
    const days = acceptReviewPrList[i].daysForAcceptance;
    if (days !== null) {
      acceptancePerQuantityList[days] = acceptancePerQuantityList[days].concat([currentPr]);
    }
  }

  // Group PRs by its review beginning duration
  const maxReviewDays = Math.max(...acceptReviewPrList.map(d => d.daysForReview));
  const reviewPerQuantityList = Array(maxReviewDays + 1).fill([]);
  for (let i = 0; i < acceptReviewPrList.length; i += 1) {
    const currentPr = acceptReviewPrList[i].pr;
    const days = acceptReviewPrList[i].daysForReview;
    if (days !== null) {
      reviewPerQuantityList[days] = reviewPerQuantityList[days].concat([currentPr]);
    }
  }

  const sections = [
    { data: acceptancePerQuantityList, color: '#FF0000' },
    { data: reviewPerQuantityList, color: '#00BB00' },
  ];

  densityPlot(sections, size, divId);
}

export default timeAcceptReviewPrs;
