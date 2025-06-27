export type Audiobook = {
  title: string;
  author: string;
  image: string;
  link: string;
};

export type Props = {
  books: Audiobook[];
}
