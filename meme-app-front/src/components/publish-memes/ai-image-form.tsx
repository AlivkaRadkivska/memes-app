import useGenerateImage from '@/server/hooks/publications/use-generate-image';
import { Bot, LoaderCircle } from 'lucide-react';
import { SyntheticEvent, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function AiImageForm({ isDisabled }: { isDisabled: boolean }) {
  const { generateImage, isLoading } = useGenerateImage();
  const [prompt, setPrompt] = useState('');

  const handleGenerateImage = (e: SyntheticEvent) => {
    e.preventDefault();
    generateImage(prompt);
  };
  return (
    <form className="flex gap-1 p-2 w-full flex-col items-center justify-center py-6 bg-muted/30 rounded-lg border border-dashed mt-auto">
      {isLoading ? (
        <LoaderCircle className="w-12 h-12 text-muted-foreground mb-3 animate-spin duration-1000" />
      ) : (
        <Bot className="w-12 h-12 text-muted-foreground mb-3" />
      )}
      <p className="text-xl font-medium">Додати зображення згенероване Ai</p>
      <p className="text-muted-foreground mb-2">Gemini, якщо точніше</p>
      <div className="w-full flex gap-2 justify-center items-center mt-4">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading || isDisabled}
          placeholder="Опишіть бажане зображення..."
          className="max-w-96"
        />
        <Button
          onClick={!isDisabled ? handleGenerateImage : undefined}
          disabled={isLoading || isDisabled}
        >
          Згенерувати
        </Button>
      </div>
    </form>
  );
}
