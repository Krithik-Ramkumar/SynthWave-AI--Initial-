'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestThemeCustomizationsInputSchema = z.object({
  websiteName: z.string().describe('The name of the website.'),
  websiteDescription: z.string().describe('A description of the website and its purpose.'),
  brandingPreferences: z.string().describe('The user\'s branding preferences, including desired style and color schemes.'),
  contentStyle: z.string().describe('The desired style for the website content (e.g., professional, casual, techy, playful).'),
});
export type SuggestThemeCustomizationsInput = z.infer<typeof SuggestThemeCustomizationsInputSchema>;

const SuggestThemeCustomizationsOutputSchema = z.object({
  colorPalette: z.string().describe('A suggested color palette for the website.'),
  typography: z.string().describe('Suggested typography for the website, including headline and body fonts.'),
  iconography: z.string().describe('Suggestions for iconography to use on the website.'),
  visualEffects: z.string().describe('Suggested visual effects to enhance the website\'s UI.'),
  overallTheme: z.string().describe('An overall theme suggestion based on the input.'),
});
export type SuggestThemeCustomizationsOutput = z.infer<typeof SuggestThemeCustomizationsOutputSchema>;

export async function suggestThemeCustomizations(input: SuggestThemeCustomizationsInput): Promise<SuggestThemeCustomizationsOutput> {
  return suggestThemeCustomizationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestThemeCustomizationsPrompt',
  input: {schema: SuggestThemeCustomizationsInputSchema},
  output: {schema: SuggestThemeCustomizationsOutputSchema},
  prompt: `You are an AI theme customization expert. You will suggest theme customizations based on user input and branding preferences for a website.

  Website Name: {{{websiteName}}}
  Website Description: {{{websiteDescription}}}
  Branding Preferences: {{{brandingPreferences}}}
  Content Style: {{{contentStyle}}}

  Based on the information above, suggest the following:

  - colorPalette: A color palette for the website.
  - typography: Typography for the website, including headline and body fonts.
  - iconography: Iconography to use on the website.
  - visualEffects: Visual effects to enhance the website\'s UI.
  - overallTheme: The overall theme of the website.

  Make sure the suggestions align with the branding preferences and content style. The output should be concise and easy to understand.
  The website should be futuristic and use a purple and black theme.
  The colorPalette should contain hex codes.
  The typography should contain the font names.
  `,
});

const suggestThemeCustomizationsFlow = ai.defineFlow(
  {
    name: 'suggestThemeCustomizationsFlow',
    inputSchema: SuggestThemeCustomizationsInputSchema,
    outputSchema: SuggestThemeCustomizationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);