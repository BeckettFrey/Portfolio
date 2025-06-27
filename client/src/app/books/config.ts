import { Audiobook } from '@/app/books/BookGrid/types';

export const recommendations: Audiobook[] = [
  {
    title: 'The Martian',
    author: 'Andy Weir',
    image: 'https://covers.openlibrary.org/b/isbn/9780553418026-L.jpg',
    link: 'https://www.audible.com/pd/The-Martian-Audiobook/B00B5HZGUG',
  },
  {
    title: "Can't Hurt Me",
    author: 'David Goggins',
    image: 'https://covers.openlibrary.org/b/isbn/9781544512280-L.jpg',
    link: 'https://www.audible.com/pd/Can-t-Hurt-Me-Audiobook/B07KKPGDZF', // verified :contentReference[oaicite:2]{index=2}
  },
  {
    title: 'Lonesome Dove',
    author: 'Larry McMurtry',
    image: 'https://covers.openlibrary.org/b/isbn/9781439195260-L.jpg',
    link: 'https://www.audible.com/pd/Lonesome-Dove-Audiobook/B09NLB3KND', // verified :contentReference[oaicite:3]{index=3}
  },
  {
    title: 'Piranesi',
    author: 'Susanna Clarke',
    image: 'https://covers.openlibrary.org/b/isbn/163557563X-L.jpg',
    link: 'https://www.audible.com/pd/Piranesi-Audiobook/1526622416', // verified :contentReference[oaicite:4]{index=4}
  },
  {
    title: 'The Daily Stoic',
    author: 'Ryan Holiday',
    image: 'https://covers.openlibrary.org/b/isbn/9780735211735-L.jpg',
    link: 'https://www.audible.com/pd/The-Daily-Stoic-Audiobook/B0F9LMYQ7C', // verified :contentReference[oaicite:5]{index=5}
  },
];
