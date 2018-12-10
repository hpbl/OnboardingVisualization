import { getIssues } from '../providers/dataProvider';
import { textualValue, issuesList } from '../providers/dataVisualizer';

export async function readmeIssues(username, projectName, divId) {
  const issues = await getIssues(username, projectName);

  const readmeREGEX = /README/i;
  const readmeMentionedIssues = issues.filter((issue) => {
    const mentionsREADME = issue.title.match(readmeREGEX) || issue.body.match(readmeREGEX);
    return mentionsREADME;
  });

  const proportion = `${readmeMentionedIssues.length} / ${issues.length}`;
  textualValue(`<strong>${proportion}</strong> issues mention README`, divId);

  const sortedIssues = readmeMentionedIssues
    .sort((issueA, issueB) => issueA.number - issueB.number);

  issuesList(sortedIssues, divId);
}

export default { readmeIssues };
