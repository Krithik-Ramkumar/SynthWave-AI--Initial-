'use server';

import { z } from 'zod';
import { suggestThemeCustomizations } from '@/app/flows/suggest-theme-customizations';
import { automatePageStructure } from '@/app/flows/automate-page-structure';

// ...rest of the file remains the same

const formSchema = z.object({
  websiteName: z.string(),
  sections: z.string(),
  colorPreferences: z.string(),
  contentStyle: z.enum(['professional', 'casual', 'techy', 'playful']),
  template: z.string().optional(),
});

export async function generateWebsiteAction(values: z.infer<typeof formSchema>) {
  try {
    const themeSuggestions = await suggestThemeCustomizations({
      websiteName: values.websiteName,
      websiteDescription: `Using a ${values.template || 'custom'} template, create a website with these sections: ${values.sections}`,
      brandingPreferences: values.colorPreferences,
      contentStyle: values.contentStyle,
    });

    const pageStructure = await automatePageStructure({
      websiteName: values.websiteName,
      sections: values.sections,
      colorPreferences: themeSuggestions.colorPalette,
      contentStyle: values.contentStyle,
      theme: themeSuggestions.overallTheme,
    });
    
    // automatePageStructure only returns html and css, so we'll add an empty js property
    return { ...pageStructure, js: '' };

  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate website from AI. Please try again.');
  }
}