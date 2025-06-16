
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Code, Loader2, Send, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isWordPressQuestion, getWordPressPrompt, getThemeGenerationPrompt } from '@/utils/isWordPressQuestion';
import { getGeminiModel } from '@/lib/gemini';
import { generateThemeZip } from '@/utils/themeGenerator';

export default function WordPressAI() {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [themeFiles, setThemeFiles] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isThemeGeneration, setIsThemeGeneration] = useState(false);

  const isThemeRequest = (input: string): boolean => {
    const themeKeywords = ['create theme', 'generate theme', 'build theme', 'make theme', 'theme for'];
    return themeKeywords.some(keyword => input.toLowerCase().includes(keyword));
  };

  const handleAsk = async () => {
    if (!input.trim()) return;

    const isTheme = isThemeRequest(input);
    
    if (!isTheme && !isWordPressQuestion(input)) {
      setError('This AI tool only answers WordPress-related questions. Please ask about WordPress themes, plugins, development, or functionality.');
      setAnswer('');
      setThemeFiles(null);
      return;
    }

    setLoading(true);
    setError('');
    setAnswer('');
    setThemeFiles(null);
    setIsThemeGeneration(isTheme);

    try {
      const model = getGeminiModel();
      const prompt = isTheme ? getThemeGenerationPrompt(input) : getWordPressPrompt(input);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const answerText = response.text();

      if (isTheme) {
        // Parse theme files from the response
        const files = parseThemeFiles(answerText);
        setThemeFiles(files);
      }

      setAnswer(answerText);
    } catch (err) {
      console.error('Gemini API Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while generating the response');
    } finally {
      setLoading(false);
    }
  };

  const parseThemeFiles = (response: string): Record<string, string> => {
    const files: Record<string, string> = {};
    const filePattern = /📄\s*([^\n]+)\n([\s\S]*?)(?=📄|$)/g;
    let match;

    while ((match = filePattern.exec(response)) !== null) {
      const fileName = match[1].trim();
      let content = match[2].trim();
      
      // Remove code block markers if present
      content = content.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
      
      if (fileName && content) {
        files[fileName] = content;
      }
    }

    return files;
  };

  const handleDownloadTheme = async () => {
    if (!themeFiles) return;
    
    try {
      const zipBlob = await generateThemeZip(themeFiles);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wordpress-theme.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
      setError('Failed to generate theme zip file');
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
          Get expert WordPress development help & generate complete themes powered by AI
        </p>
        <Badge variant="secondary" className="text-xs">
          Supports themes, plugins, hooks, WooCommerce, Elementor & theme generation
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ask Your WordPress Question or Generate a Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: Create a WordPress theme for a photography portfolio with dark mode support, or How do I create a custom WordPress hook?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={4}
            className="min-h-[100px]"
          />
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Press Ctrl+Enter to submit • Try: "Create a theme for a restaurant website"
            </p>
            <Button onClick={handleAsk} disabled={loading || !input.trim()}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isThemeGeneration ? 'Generating Theme...' : 'Thinking...'}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {isThemeRequest(input) ? 'Generate Theme' : 'Ask'}
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">
              {isThemeGeneration ? '🎨 Generated WordPress Theme' : '🧠 AI Response'}
            </CardTitle>
            {themeFiles && Object.keys(themeFiles).length > 0 && (
              <Button onClick={handleDownloadTheme} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download ZIP
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isThemeGeneration && themeFiles && Object.keys(themeFiles).length > 0 ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✅ Theme generated successfully! Found {Object.keys(themeFiles).length} files.
                  </p>
                </div>
                <div className="space-y-3">
                  {Object.entries(themeFiles).map(([fileName, content]) => (
                    <div key={fileName} className="border rounded-lg">
                      <div className="bg-muted px-4 py-2 border-b">
                        <span className="font-mono text-sm font-medium">📄 {fileName}</span>
                      </div>
                      <pre className="p-4 text-sm overflow-x-auto bg-background">
                        <code>{content}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  {answer}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">WordPress Development:</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• WordPress theme development</li>
                <li>• Plugin creation and customization</li>
                <li>• Hooks, filters, and actions</li>
                <li>• WooCommerce development</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Theme Generation:</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Complete theme structure</li>
                <li>• Modern WordPress standards</li>
                <li>• Downloadable ZIP files</li>
                <li>• Custom post types & fields</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
