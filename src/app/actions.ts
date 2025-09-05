
'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
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

        const photosDir = join(process.cwd(), 'public', 'photos');
        await mkdir(photosDir, { recursive: true });

        const fileName = `${Date.now()}.jpg`;
        const filePath = join(photosDir, fileName);
        
        await writeFile(filePath, processedBuffer);
        
        console.log('Image saved to:', filePath);
        return { filePath: `/photos/${fileName}` };
    } catch (error) {
        console.error('Failed to save image:', error);
        return { filePath: null };
    }
}

    