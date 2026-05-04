import React, { useMemo, useState } from 'react';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const DAILY_FREE_USES = 3;
const MAX_WORDS = 1500;

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const humanizeText = (text: string) =>
  text
    .replace(/\btherefore\b/gi, 'so')
    .replace(/\bhowever\b/gi, 'still')
    .replace(/\bin conclusion\b/gi, 'to wrap up')
    .replace(/\butilize\b/gi, 'use')
    .replace(/\bmoreover\b/gi, 'also');

const calculateAiScore = (text: string) => {
  const roboticPatterns = [/\btherefore\b/gi, /\bmoreover\b/gi, /\bthus\b/gi, /\bfurthermore\b/gi];
  const matches = roboticPatterns.reduce((sum, pattern) => sum + (text.match(pattern)?.length ?? 0), 0);
  const density = text.length ? (matches * 140) / text.length : 0;
  return Math.max(8, Math.min(95, Math.round(38 + density * 100)));
};

const Home: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [humanizedText, setHumanizedText] = useState('');
  const [aiScore, setAiScore] = useState(0);
  const [error, setError] = useState('');

  const wordCount = useMemo(() => countWords(inputText), [inputText]);

  const usage = useMemo(() => {
    const today = getTodayKey();
    const saved = localStorage.getItem('humanizer_usage');
    if (!saved) return { date: today, count: 0 };
    const parsed = JSON.parse(saved) as { date: string; count: number };
    return parsed.date === today ? parsed : { date: today, count: 0 };
  }, [humanizedText]);

  const freeUsesLeft = Math.max(0, DAILY_FREE_USES - usage.count);

  const onHumanize = () => {
    setError('');

    if (!inputText.trim()) return setError('Please paste text to humanize.');
    if (wordCount > MAX_WORDS) return setError(`Please keep text under ${MAX_WORDS} words.`);
    if (freeUsesLeft <= 0) return setError('Daily free limit reached. Please come back tomorrow.');

    const result = humanizeText(inputText);
    const score = calculateAiScore(result);
    const nextUsage = { date: getTodayKey(), count: usage.count + 1 };

    localStorage.setItem('humanizer_usage', JSON.stringify(nextUsage));
    setHumanizedText(result);
    setAiScore(score);
  };

  return (
    <div className="py-10 md:py-14 max-w-5xl mx-auto">
      <SEO
        title="AI Content Humanizer Tool - Convert AI Text to Human Tone"
        description="Humanize AI-generated content in one click. Compare before and after text, track AI detection score, and use 3 free humanizations daily."
      />

      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">AI Content Humanizer</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Make AI-written text feel natural, clear, and human in seconds.
        </p>
      </section>

      <Card className="border shadow-sm mb-6">
        <CardHeader>
          <CardTitle>Humanize Your Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your AI text here (up to 1500 words)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={12}
            className="resize-none"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <span className={wordCount > MAX_WORDS ? 'text-red-500' : 'text-muted-foreground'}>
              {wordCount}/{MAX_WORDS} words
            </span>
            <span className="text-muted-foreground">Free uses left today: {freeUsesLeft}</span>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button onClick={onHumanize} className="w-full sm:w-auto px-8">
            Humanize Now
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <Card>
          <CardHeader><CardTitle>Before</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap min-h-44">{inputText || 'Your original text will appear here.'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>After</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap min-h-44">{humanizedText || 'Humanized text will appear here after you click “Humanize Now”.'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>AI Detection Score</CardTitle></CardHeader>
        <CardContent>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${aiScore}%` }} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Estimated AI likelihood: <span className="font-semibold text-foreground">{aiScore}%</span></p>
        </CardContent>
      </Card>

      <aside className="border rounded-lg p-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Ad space</p>
        <p>This section is intentionally reserved for AdSense units.</p>
      </aside>
    </div>
  );
};

export default Home;
