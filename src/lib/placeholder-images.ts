import data from './placeholder-images.json';

export type ImagePlaceHolder = {
    name: string;
    id: string;
    description: string;
    imageUrl: string;
    imageHint: string;
};

export const placeholderImages: ImagePlaceHolder[] = data.placeholderImages;