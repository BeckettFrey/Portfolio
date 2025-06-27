import GitActivity from './GitActivityPanel';
import { CorePage } from '@layout';

export const revalidate = 86400; // Revalidate every 24 hours

export const metadata = {
  title: "Git Activity | Beckett Frey",
  description: "View Beckett Frey's recent GitHub activity and contributions.",
};

const GitActivityPage = () => {
    return (
        <CorePage header="Git Activity">
            <GitActivity />
        </CorePage>
    );
};

export default GitActivityPage;