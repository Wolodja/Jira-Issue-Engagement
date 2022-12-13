import ForgeUI, { render, Fragment, Text, IssuePanel } from '@forge/ui';

const EngagementPanel = () => {
  return (
    <Fragment>
      <Text>Hello world!</Text>
    </Fragment>
  );
};

export const panel = render(
  <IssuePanel>
    <EngagementPanel />
  </IssuePanel>
);
