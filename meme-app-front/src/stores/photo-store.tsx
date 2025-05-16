import { create } from 'zustand';

export interface Photo {
  id: string;
  file: File;
  preview: string;
  name: string;
  width: number;
  height: number;
  edited?: boolean;
}

interface PhotoState {
  photos: Photo[];
  addPhotos: (photos: Photo[]) => void;
  updatePhoto: (id: string, preview: string) => void;
  removePhoto: (id: string) => void;
  getPhoto: (id: string) => Photo | undefined;
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
  addPhotos: (newPhotos) =>
    set((state) => {
      newPhotos.forEach(async (photo) => {
        const res = await getPhotoMeta(photo.preview);
        photo.height = res.naturalHeight;
        photo.width = res.naturalWidth;
      });

      return { photos: [...state.photos, ...newPhotos] };
    }),
  updatePhoto: (id, preview) =>
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.id === id ? { ...photo, preview, edited: true } : photo
      ),
    })),
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
}));
