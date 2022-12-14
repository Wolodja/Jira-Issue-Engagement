import ForgeUI, {Table, Head, Row, Cell, render, ProjectPage, Fragment, Text, IssuePanel, useProductContext, useState} from '@forge/ui';
import api, {route} from '@forge/api';

const fetchNumberOfComments = async function (issueKey) {
    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/comment`);
    const data = await response.json();
    return data.total;
}

const fetchIssueWithNumberOfComments = async function (projectKey) {
    const jql = `project in (${projectKey})`;
    const response = await api.asApp().requestJira(route`/rest/api/3/search?jql=${jql}&fields=summary,comment`);
    const data = await response.json();
    let issuesWithNumberOfComments = [];
    for (const issue of data.issues){
        issuesWithNumberOfComments.push({
            "key": issue.key,
            "summary": issue.fields.summary,
            "numComments": issue.fields.comment.comments.length
        });
    }
    return issuesWithNumberOfComments;
}

const EngagementPanel = () => {
    const {platformContext: {issueKey}} = useProductContext();

    const [numComments] = useState(fetchNumberOfComments(issueKey));
    return (
        <Fragment>
            <Text>Engagement score: {numComments}</Text>
        </Fragment>
    );
};

export const panel = render(
    <IssuePanel>
        <EngagementPanel/>
    </IssuePanel>
);

const EngagementOverview = () => {
    const {platformContext: {projectKey}} = useProductContext();
   const [issues] = useState(fetchIssueWithNumberOfComments(projectKey));
   console.log(JSON.stringify(issues));
    return (
        <Table>
            <Head>
                <Cell><Text>Issue Key</Text></Cell>
                <Cell><Text>Summary</Text></Cell>
                <Cell><Text>Engagement Score</Text></Cell>
            </Head>
            {issues.map(issue => (
                <Row>
                    <Cell><Text>{issue.key}</Text></Cell>
                    <Cell><Text>{issue.summary}</Text></Cell>
                    <Cell><Text>{issue.numComments}</Text></Cell>
                </Row>
            ))}
        </Table>
    )
}

export const engagementOverview = render(
    <ProjectPage>
        <EngagementOverview />
    </ProjectPage>
);
