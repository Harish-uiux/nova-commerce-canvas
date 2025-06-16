import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Code, Loader2, Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isWordPressQuestion, getWordPressPrompt } from '@/utils/isWordPressQuestion';
import { getGeminiModel } from '@/lib/gemini';

export default function WordPressAI() {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async () => {
    if (!input.trim()) return;

    if (!isWordPressQuestion(input)) {
      setError('This AI tool only answers WordPress-related questions. Please ask about WordPress themes, plugins, development, or functionality.');
      setAnswer('');
      return;
    }

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const model = getGeminiModel();
      const wordpressPrompt = getWordPressPrompt(input);
      
      const result = await model.generateContent(wordpressPrompt);
      const response = await result.response;
      const answerText = response.text();

      setAnswer(answerText);
    } catch (err) {
      console.error('Gemini API Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while generating the response');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAsk();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Code className="h-8 w-8 text-blue-600" />
          WordPress AI Assistant
        </h1>
        <p className="text-muted-foreground">
          Get expert WordPress development help powered by AI
        </p>
        <Badge variant="secondary" className="text-xs">
          Supports themes, plugins, hooks, WooCommerce, Elementor & more
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ask Your WordPress Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: How do I create a custom WordPress hook? or How to add a custom field to WooCommerce products?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={4}
            className="min-h-[100px]"
          />
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Press Ctrl+Enter to submit
            </p>
            <Button onClick={handleAsk} disabled={loading || !input.trim()}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Ask
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {answer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                {answer}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">What I can help with:</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• WordPress theme development</li>
                <li>• Plugin creation and customization</li>
                <li>• Hooks, filters, and actions</li>
                <li>• WooCommerce development</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Advanced topics:</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Elementor widget development</li>
                <li>• Custom post types and fields</li>
                <li>• WordPress REST API</li>
                <li>• Performance optimization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
