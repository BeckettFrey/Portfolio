import CorePage from '@/layout/CorePage';
import BooksGrid from './BookGrid';
import { recommendations } from './config';

export const metadata = {
  title: 'Books | Beckett Frey',
  description: 'Explore Beckett Frey\'s book recommendations.',
};

export default function Page() {
  return (
    <CorePage header="Books">
      <BooksGrid books={recommendations} />
    </CorePage>
  );
}