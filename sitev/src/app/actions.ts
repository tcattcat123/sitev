
'use server';

import { put } from '@vercel/blob';
import sharp from 'sharp';

export async function saveImage(dataUri: string): Promise<{ filePath: string | null }> {
    try {
        const base64Data = dataUri.split(';base64,').pop();
        if (!base64Data) {
            throw new Error('Invalid data URI');
        }

        const buffer = Buffer.from(base64Data, 'base64');
        
        // Use sharp to process the image, e.g., compress it
        const processedBuffer = await sharp(buffer)
            .jpeg({ quality: 80 }) // Compress JPEG to 80% quality
            .toBuffer();

        const fileName = `${Date.now()}.jpg`;
        
        // Upload to Vercel Blob Storage
        const blob = await put(fileName, processedBuffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        
        console.log('Image uploaded to Vercel Blob:', blob.url);
        return { filePath: blob.url };
    } catch (error) {
        console.error('Failed to upload image to Vercel Blob:', error);
        return { filePath: null };
    }
}

    