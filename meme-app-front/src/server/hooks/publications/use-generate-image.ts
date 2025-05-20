import { base64ToFile } from '@/helpers/file-utils';
import { queryKeys } from '@/server/queryKeys';
import { generateAiImage } from '@/server/services/publication-service';
import { AiImageResponse } from '@/server/types/publication';
import { usePhotoStore } from '@/stores/photo-store';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { v4 as uuid } from 'uuid';

export default function useGenerateImage(
  options?: UseMutationOptions<
    AiImageResponse,
    AxiosError<{ error: string }>,
    string
  >
) {
  const queryClient = useQueryClient();
  const { addPhotos } = usePhotoStore();

  const { mutate: generateImage, isPending } = useMutation({
    mutationFn: (data) => generateAiImage(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.generateAiImage() });
      const file = base64ToFile(data.base64, uuid(), 'image/png');

      addPhotos([
        {
          id: uuid(),
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          width: 0,
          height: 0,
          edited: false,
          ai: true,
        },
      ]);
    },
    onError: (err) => {
      console.error('API Error:', err);
    },
    ...options,
  });

  return {
    generateImage,
    isLoading: isPending,
  };
}
