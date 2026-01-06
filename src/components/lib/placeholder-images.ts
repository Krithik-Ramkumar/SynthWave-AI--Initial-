import data from './placeholder-images.json';

export type ImagePlaceHolder = {
    id: string;
    description: string;
    imageUrl: string;
    imageHint: string;
};

export const placeholderImages: ImagePlaceHolder[] = data.placeholderImages;