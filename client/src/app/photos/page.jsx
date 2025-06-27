import PhotosClient from './PhotosClient';
import { photosConfig } from './config';

export const metadata = {
  title: "Photos | Beckett Frey",
  description: "View photos and images from my life and work.",
};

const Page = () => {
    return (
        <PhotosClient photos={photosConfig} />
    );
};

export default Page;  