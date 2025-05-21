'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-context';
import { Comment } from '@/server/types/comment';
import { Paperclip, Send } from 'lucide-react';
import { useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import PhotoCard from '../photos/photo-card';

interface CommentFormProps {
  publicationId: string;
  onCommentAdd: (comment: Comment) => void;
}

export function CommentForm({ publicationId, onCommentAdd }: CommentFormProps) {
  const { isAuthenticated } = useAuth();

  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    name: string;
    preview: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setSelectedImage({ name: file.name, preview });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) return;

    setIsSubmitting(true);

    const newComment: Comment = {
      id: uuid(),
      text: text.trim(),
      picture: selectedImage?.preview || null,
      publication: publicationId,
      createdAt: new Date(),
      user: {
        id: '',
        username: '',
        email: '',
      },
    };

    onCommentAdd(newComment);

    setText('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border-b py-3 flex gap-3">
      <Textarea
        placeholder="Ваша експертна думка про цю публікацію"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[80px] resize-none focus-visible:ring-primary/30 italic"
        disabled={!isAuthenticated}
      />
      {selectedImage && (
        <PhotoCard
          mini
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
          disabled={!text.trim() || isSubmitting || !isAuthenticated}
          className="transition-all"
        >
          <Send />
        </Button>
      </div>
    </form>
  );
}
