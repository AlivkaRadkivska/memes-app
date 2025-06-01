import { create } from 'zustand';

export interface Photo {
  id: string;
  file: File;
  preview: string;
  name: string;
  width: number;
  height: number;
  edited: boolean;
  ai: boolean;
}

interface PhotoState {
  photos: Photo[];
  addPhotos: (photos: Photo[]) => void;
  updatePhoto: (id: string, file: File, preview: string) => void;
  removePhoto: (id: string) => void;
  getPhoto: (id: string) => Photo | undefined;
  clearPhotos: () => void;
}

const getPhotoMeta = async (
  url: string
): Promise<{ naturalHeight: number; naturalWidth: number }> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  addPhotos: async (newPhotos) => {
    const updatedPhotos = await Promise.all(
      newPhotos.map(async (photo) => {
        const res = await getPhotoMeta(photo.preview);
        return {
          ...photo,
          height: res.naturalHeight,
          width: res.naturalWidth,
        };
      })
    );

    set((state) => ({
      photos: [...state.photos, ...updatedPhotos],
    }));
  },
  updatePhoto: async (id, file, preview) => {
    const res = await getPhotoMeta(preview);

    set((state) => {
      const updatedPhotos = state.photos.map((photo) =>
        photo.id === id
          ? {
              ...photo,
              file,
              preview,
              height: res.naturalHeight,
              width: res.naturalWidth,
            }
          : photo
      );

      return { photos: [...updatedPhotos] };
    });
  },
  removePhoto: (id) =>
    set((state) => {
      const toRemove = state.photos.find((p) => p.id === id);
      if (toRemove) {
        URL.revokeObjectURL(toRemove.preview);
      }
      return {
        photos: state.photos.filter((photo) => photo.id !== id),
      };
    }),
  getPhoto: (id) => get().photos.find((photo) => photo.id === id),
  clearPhotos: () => set(() => ({ photos: [] })),
}));
