'use client';

import { useState } from "react";
import PhotoGrid from "@/app/photos/PhotoGrid";
import { CorePage } from "@layout";
import type { PhotoItem } from "@/app/photos/PhotoGrid/types";

const PhotosClient = (config: { photos: PhotoItem[] }) => {
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

    return (
        <CorePage header="Photos" showHomeButton={!selectedPhoto}>
            <PhotoGrid selectedPhoto={selectedPhoto} setSelectedPhoto ={setSelectedPhoto} config={config.photos} />
        </CorePage>
    );
};

export default PhotosClient;