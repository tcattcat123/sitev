
'use server';

import { put } from '@vercel/blob';

export async function saveImage(dataUri: string): Promise<{ filePath: string | null }> {
    try {
        const base64Data = dataUri.split(';base64,').pop();
        if (!base64Data) {
            throw new Error('Invalid data URI');
        }

        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `${Date.now()}.jpg`;

        const blob = await put(fileName, buffer, {
          access: 'public',
        });
        
        console.log('Image uploaded to Vercel Blob:', blob.url);
        return { filePath: blob.url };

    } catch (error) {
        console.error('Failed to upload image to Vercel Blob:', error);
        return { filePath: null };
    }
}
