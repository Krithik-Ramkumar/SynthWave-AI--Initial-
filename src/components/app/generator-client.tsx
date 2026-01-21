'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { placeholderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { generateWebsiteAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Code, Copy, Download, Pilcrow, RefreshCw, Type, Wand2 } from 'lucide-react';

const formSchema = z.object({
  websiteName: z.string().min(2, 'Website name must be at least 2 characters.'),
  sections: z.string().min(10, 'Please describe the sections you want (e.g., hero, features, contact).'),
  colorPreferences: z.string().min(5, 'Please describe your color preferences (e.g., dark theme with blue accents).'),
  contentStyle: z.enum(['professional', 'casual', 'techy', 'playful']),
  template: z.string().optional().default('template-startup'),
});

type GeneratedCode = { html: string; css: string; js: string };

export default function GeneratorClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const { toast } = useToast();
  const { copy } = useCopyToClipboard();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      websiteName: '',
      sections: 'Hero, Features, About Us, Contact Form',
      colorPreferences: 'Futuristic purple and black theme with cyan accents',
      contentStyle: 'techy',
      template: 'template-startup',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setGeneratedCode(null);
    try {
      const result = await generateWebsiteAction(values);
      if (result?.html && result?.css) {
        setGeneratedCode(result);
        toast({
          title: 'Website Generated!',
          description: 'Your website is ready to be previewed.',
        });
      } else {
        throw new Error('AI failed to return complete code.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const iframeSrcDoc = generatedCode
    ? `
    <html>
      <head>
        <style>${generatedCode.css}</style>
      </head>
      <body>
        ${generatedCode.html}
        ${generatedCode.js ? `<script>${generatedCode.js}</script>` : ''}
      </body>
    </html>`
    : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-full min-h-[calc(100vh-2rem)] gap-4 p-4">
      {/* Left Panel: Controls */}
      <Card className="bg-card/30 backdrop-blur-lg border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-2xl">Website Generator</CardTitle>
              <CardDescription>Describe your vision and let AI build it.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1. Choose a Template</FormLabel>
                    <Carousel
                      opts={{
                        align: 'start',
                      }}
                      className="w-full"
                    >
                      <CarouselContent>
                        {placeholderImages.map((template: typeof placeholderImages[number], index: number) => (
                          <CarouselItem key={index} className="md:basis-1/2">
                            <div className="p-1">
                              <Card
                                className={cn(
                                  'cursor-pointer transition-all border-2',
                                  field.value === template.id
                                    ? 'border-primary shadow-[0_0_15px_-2px_theme(colors.primary)]'
                                    : 'border-transparent hover:border-primary/50'
                                )}
                                onClick={() => form.setValue('template', template.id)}
                              >
                                <CardContent className="flex aspect-[3/2] items-center justify-center p-0 relative overflow-hidden rounded-lg">
                                  <Image
                                    src={template.imageUrl}
                                    alt={template.name as string}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={template.imageHint}
                                  />
                                  <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                                    <h4 className="font-bold text-white text-lg">{template.name}</h4>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>2. Customize Your Site</FormLabel>
                <FormField
                  control={form.control}
                  name="websiteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="e.g., Nova Solutions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sections"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Describe the sections of your website..." {...field} />
                      </FormControl>
                       <FormDescription className="flex items-center gap-1">
                        <Pilcrow className="w-3 h-3" />
                        <span>List the pages or sections you want.</span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="colorPreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="e.g., Dark, neon blue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contentStyle"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a content style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="techy">Techy</SelectItem>
                            <SelectItem value="playful">Playful</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="w-full font-bold text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_theme(colors.primary),0_0_5px_theme(colors.primary)] hover:shadow-[0_0_30px_theme(colors.primary),0_0_10px_theme(colors.primary)]"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-5 w-5" />
                    Generate Website
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Right Panel: Preview */}
      <Card className="bg-card/30 backdrop-blur-lg border-primary/20 shadow-lg flex flex-col">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Live Preview</CardTitle>
            <CardDescription>Your generated website will appear here.</CardDescription>
          </div>
           {generatedCode && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => copy(generatedCode.html, "HTML code copied.")}><Copy className="w-4 h-4" /> <span className="sr-only">Copy HTML</span></Button>
              <Button variant="ghost" size="icon" onClick={() => copy(generatedCode.css, "CSS code copied.")}><Code className="w-4 h-4" /><span className="sr-only">Copy CSS</span></Button>
              <Button variant="outline" size="sm" onClick={() => toast({ title: "Coming Soon!", description: "Zip download is not yet implemented." })}><Download className="mr-2 w-4 h-4"/>Export</Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="w-full h-full bg-background rounded-md border border-border">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-primary">
                <Bot className="w-16 h-16 animate-pulse" />
                <p className="font-headline text-2xl animate-pulse">Generating your universe...</p>
                <Skeleton className="w-full h-4/5" />
              </div>
            ) : generatedCode ? (
              <iframe
                srcDoc={iframeSrcDoc}
                title="Website Preview"
                className="w-full h-full rounded-md"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                <Bot className="w-16 h-16" />
                <h3 className="font-headline text-2xl">Your Future Website Awaits</h3>
                <p className="max-w-xs text-center">Fill out the form to generate your AI-powered website. The preview will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}