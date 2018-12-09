import { getIssues } from '../providers/dataProvider';
import { textualValue } from '../providers/dataVisualizer';

export async function readmeIssues(username, projectName, divId) {
  const issues = await getIssues(username, projectName);

  const readmeMentionedIssues = issues.filter(issue => issue.title.match(/README/i) || issue.body.match(/README/i));

  const proportion = `${readmeMentionedIssues.length} / ${issues.length}`;

  textualValue(`${proportion} issues mention README`, divId);
}

export default { readmeIssues };
