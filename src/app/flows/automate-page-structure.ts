'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatePageStructureInputSchema = z.object({
  websiteName: z.string().describe('The name of the website.'),
  sections: z.string().describe('Sections to include in the website (e.g., hero, features, pricing, contact).'),
  colorPreferences: z.string().describe('Color preferences for the website.'),
  contentStyle: z.enum(['professional', 'casual', 'techy', 'playful']).describe('Content style for the website.'),
  theme: z.string().describe('overall theme of the website'),
});

export type AutomatePageStructureInput = z.infer<typeof AutomatePageStructureInputSchema>;

const AutomatePageStructureOutputSchema = z.object({
  html: z.string().describe('Generated HTML structure for the website.'),
  css: z.string().describe('Generated CSS styles for the website.'),
});

export type AutomatePageStructureOutput = z.infer<typeof AutomatePageStructureOutputSchema>;

export async function automatePageStructure(input: AutomatePageStructureInput): Promise<AutomatePageStructureOutput> {
  return automatePageStructureFlow(input);
}

const automatePageStructurePrompt = ai.definePrompt({
  name: 'automatePageStructurePrompt',
  input: {schema: AutomatePageStructureInputSchema},
  output: {schema: AutomatePageStructureOutputSchema},
  prompt: `You are an expert web developer who specializes in creating semantic HTML and modular CSS.

  Based on the user's input, generate a well-structured HTML page and corresponding CSS styles.
  Ensure the HTML is semantic and the CSS is modular for easy maintainability.

  Website Name: {{{websiteName}}}
  Sections: {{{sections}}}
  Color Preferences: {{{colorPreferences}}}
  Content Style: {{{contentStyle}}}
  Theme: {{{theme}}}

  Instructions:
  1.  Create a basic HTML structure with the specified sections.
  2.  Use semantic HTML5 tags (e.g., <header>, <nav>, <main>, <article>, <footer>) where appropriate.
  3.  Generate CSS classes that are modular and reusable.
  4.  Incorporate the specified color preferences into the CSS.
  5.  Consider the content style when generating both HTML and CSS, tailoring the design to match the desired tone (professional, casual, techy, playful).
  6.  Ensure code is clean and readable.
  7. add futuristic visual effects, gradient animated backgrounds, neon border glow and smooth transitions.

  Output:
  Provide the complete HTML and CSS code.
  `,
});

const automatePageStructureFlow = ai.defineFlow(
  {
    name: 'automatePageStructureFlow',
    inputSchema: AutomatePageStructureInputSchema,
    outputSchema: AutomatePageStructureOutputSchema,
  },
  async input => {
    const {output} = await automatePageStructurePrompt(input);
    return output!;
  }
);