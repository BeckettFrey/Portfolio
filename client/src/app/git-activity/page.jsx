import GitActivity from '@/components/GitActivityPanel';
import { CorePage } from '@layout';

export const revalidate = 1000 * 60 * 60 * 24; // 1 day

export const metadata = {
  title: "Git Activity | Beckett Frey",
  description: "View my recent GitHub activity and contributions.",
};

const GitActivityPage = () => {
    return (
        <CorePage header="Git Activity">
            <GitActivity />
            <footer style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9em', color: '#888', textDecoration: 'underline' }}>
                Data fetched from{' '}
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: '#888', textDecoration: 'underline' }}>
                    GitHub
                </a>
            </footer>
        </CorePage>
    );
};

export default GitActivityPage;