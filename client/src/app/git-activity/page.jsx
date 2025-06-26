import GitActivity from '@/components/GitActivityPanel';
import { CorePage } from '@layout';

export const revalidate = 86400000; // 24 hours in ms

export const metadata = {
  title: "Git Activity | Beckett Frey",
  description: "View my recent GitHub activity and contributions.",
};

const GitActivityPage = () => {
    return (
        <CorePage header="Git Activity">
            <GitActivity />
        </CorePage>
    );
};

export default GitActivityPage;