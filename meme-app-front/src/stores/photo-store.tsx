import { create } from 'zustand';

export interface Photo {
  id: string;
  file: File;
  preview: string;
  name: string;
  edited?: boolean;
}

interface PhotoState {
  photos: Photo[];
  addPhotos: (photos: Photo[]) => void;
  updatePhoto: (id: string, preview: string) => void;
  removePhoto: (id: string) => void;
  getPhoto: (id: string) => Photo | undefined;
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  addPhotos: (newPhotos) =>
    set((state) => ({
      photos: [...state.photos, ...newPhotos],
    })),
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
