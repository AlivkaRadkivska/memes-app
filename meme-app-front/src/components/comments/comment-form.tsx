import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-context';
import useAddComment from '@/server/hooks/comments/use-add-comment';
import { Paperclip, Send } from 'lucide-react';
import { useRef, useState } from 'react';
import PhotoCard from '../photos/photo-card';

interface CommentFormProps {
  publicationId: string;
}

export function CommentForm({ publicationId }: CommentFormProps) {
  const { isAuthenticated } = useAuth();
  const { addComment, isPending } = useAddComment({ publicationId });

  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedImage({ file, preview: URL.createObjectURL(file) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addComment({
      picture: selectedImage?.file || null,
      publication: publicationId,
      text,
    });

    setText('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-b py-3 px-1 flex gap-3">
      <Textarea
        placeholder="Ваша експертна думка про цю публікацію"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[80px] resize-none focus-visible:ring-primary/30 italic"
        disabled={!isAuthenticated}
      />
      {selectedImage && (
        <PhotoCard
          width={14}
          height={28}
          photo={{ ...selectedImage }}
          onDelete={() => setSelectedImage(null)}
        />
      )}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
        disabled={!isAuthenticated}
      />
      <div className="flex flex-col items-center justify-end gap-2 m-0">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={!isAuthenticated}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button
          type="submit"
          size="icon"
          disabled={!text.trim() || isPending || !isAuthenticated}
          className="transition-all"
        >
          <Send />
        </Button>
      </div>
    </form>
  );
}
