'use client';
import { useState } from "react";
import PhotoGrid from "@/components/PhotoGrid";
import { CorePage } from "@layout";
import type { PhotoItem } from "@/components/PhotoGrid/types";

const PhotosClient = () => {
    const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

    return (
        <CorePage header="Photos" showHomeButton={!selectedPhoto}>
            <PhotoGrid selectedPhoto={selectedPhoto} setSelectedPhoto ={setSelectedPhoto} />
        </CorePage>
    );
};

export default PhotosClient;