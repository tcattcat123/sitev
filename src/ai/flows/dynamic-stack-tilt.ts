
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TiltControlledGravityInputSchema = z.object({
  tiltLR: z.number().optional().describe('Left-right tilt in degrees.'),
  tiltFB: z.number().optional().describe('Front-back tilt in degrees.'),
  hasDeviceOrientation: z.boolean().describe('Whether the device orientation is available.'),
});
export type TiltControlledGravityInput = z.infer<typeof TiltControlledGravityInputSchema>;

const TiltControlledGravityOutputSchema = z.object({
  gravityX: z.number().describe('X component of gravity (-1 to 1).'),
  gravityY: z.number().describe('Y component of gravity (-1 to 1).'),
  shouldResimulate: z.boolean().describe('Indicates if the simulation should be re-simulated.'),
});
export type TiltControlledGravityOutput = z.infer<typeof TiltControlledGravityOutputSchema>;

export async function getTiltControlledGravity(input: TiltControlledGravityInput): Promise<TiltControlledGravityOutput> {
  return tiltControlledGravityFlow(input);
}

const tiltControlledGravityPrompt = ai.definePrompt({
  name: 'tiltControlledGravityPrompt',
  input: {schema: TiltControlledGravityInputSchema},
  output: {schema: TiltControlledGravityOutputSchema},
  prompt: `You are a physics simulation controller. Based on the device orientation data provided, you will output the appropriate gravity values for a 2D physics engine.

  If device orientation is available, use the tiltLR and tiltFB values to calculate gravityX and gravityY, respectively.  Gravity values should be normalized to a range between -1 and 1. A positive tiltLR (right) should result in positive gravityX. A positive tiltFB (forward) should result in positive gravityY. The tilt values are in degrees. A 90 degree tilt should correspond to a gravity value of 1.

  If device orientation is not available, set shouldResimulate to true, indicating that the simulation should be re-simulated automatically with random gravity.

  Here's the device orientation data:
  Has Device Orientation: {{{hasDeviceOrientation}}}
  Tilt Left-Right (gamma): {{{tiltLR}}}
  Tilt Front-Back (beta): {{{tiltFB}}}

  Consider the following when deciding whether to enable re-simulation:
  - Re-simulation should occur if device orientation data is unavailable.
  - If re-simulation is enabled, gravityX and gravityY can be set to random values between -0.5 and 0.5.
  `,
});

const tiltControlledGravityFlow = ai.defineFlow(
  {
    name: 'tiltControlledGravityFlow',
    inputSchema: TiltControlledGravityInputSchema,
    outputSchema: TiltControlledGravityOutputSchema,
  },
  async input => {
    if (input.hasDeviceOrientation) {
      const gravityX = Math.sin((input.tiltLR! * Math.PI) / 180);
      const gravityY = Math.sin((input.tiltFB! * Math.PI) / 180);
      return {
        gravityX: Math.max(-1, Math.min(1, gravityX)),
        gravityY: Math.max(-1, Math.min(1, gravityY)),
        shouldResimulate: false,
      };
    }
    
    // Fallback for no device orientation
    return {
      gravityX: 0,
      gravityY: 1,
      shouldResimulate: false,
    };
  }
);
