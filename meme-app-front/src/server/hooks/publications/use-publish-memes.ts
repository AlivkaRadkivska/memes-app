import { queryKeys } from '@/server/queryKeys';
import { publishMemes } from '@/server/services/publication-service';
import { CommonError } from '@/server/types/common';
import { Publication, PublishMemesPayload } from '@/server/types/publication';
import { usePhotoStore } from '@/stores/photo-store';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function usePublishMemes(
  options?: UseMutationOptions<
    Publication,
    AxiosError<CommonError>,
    PublishMemesPayload
  >
) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { clearPhotos } = usePhotoStore();

  const { mutate: publish, isPending } = useMutation({
    mutationFn: (data) => publishMemes(data),
    onMutate: () => {
      toast('Публікується...');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.getPublications() });
      toast('Опубліковано!');
      clearPhotos();
      router.push('/');
    },
    onError: (err) => {
      console.error('API Error:', err);
      const errorMessage =
        err.response?.data.message.join(' ') || 'Щось пішло не так...';
      toast(errorMessage);
    },
    ...options,
  });

  return {
    publish,
    isPublishing: isPending,
  };
}
