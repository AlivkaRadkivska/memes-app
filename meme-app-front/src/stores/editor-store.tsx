import { create } from 'zustand';

export type EditorMode =
  | 'select'
  | 'crop'
  | 'text'
  | 'image'
  | 'emoji'
  | 'draw'
  | 'filter';
export type TextAlign = 'left' | 'center' | 'right';
export type ObjectType = 'image' | 'text' | 'emoji' | 'drawing';

export interface EditorObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  draggable?: boolean;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  [key: string]: number | string | boolean | undefined | object;
}

export interface CropConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextOptions {
  fontSize: number;
  fontFamily: string;
  fill: string;
  align: TextAlign;
}

export interface EditorState {
  // Mode and selection
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;

  // Objects management
  objects: EditorObject[];
  addObject: (object: EditorObject) => void;
  updateObject: (id: string, changes: Partial<EditorObject>) => void;
  removeObject: (id: string) => void;

  // Selection management
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;

  // Text options
  textOptions: TextOptions;
  setTextOptions: (options: Partial<TextOptions>) => void;

  // Crop functionality
  isCropping: boolean;
  setIsCropping: (cropping: boolean) => void;
  cropConfig: CropConfig | null;
  setCropConfig: (config: CropConfig | null) => void;

  // History management
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  history: any;
  currentHistoryIndex: number;
  addHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Canvas settings
  canvasWidth: number;
  canvasHeight: number;
  setCanvasSize: (width?: number, height?: number) => void;

  // Clear all objects
  clearObjects: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Mode and selection
  mode: 'select',
  setMode: (mode) => set({ mode }),

  // Objects management
  objects: [],
  addObject: (object) => {
    set((state) => ({
      objects: [...state.objects, object],
      selectedObjectId: object.id,
    }));
    get().addHistory();
  },
  updateObject: (id, changes) => {
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, ...changes } : obj
      ),
    }));
    get().addHistory();
  },
  removeObject: (id) => {
    set((state) => ({
      objects: state.objects.filter((obj) => obj.id !== id),
      selectedObjectId:
        state.selectedObjectId === id ? null : state.selectedObjectId,
    }));
    get().addHistory();
  },

  // Selection management
  selectedObjectId: null,
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),

  // Text options
  textOptions: {
    fontSize: 24,
    fontFamily: 'Arial',
    fill: '#000000',
    align: 'left' as TextAlign,
  },
  setTextOptions: (options) =>
    set((state) => ({
      textOptions: {
        ...state.textOptions,
        ...options,
      },
    })),

  // Crop functionality
  isCropping: false,
  setIsCropping: (cropping) => set({ isCropping: cropping }),
  cropConfig: null,
  setCropConfig: (config) => set({ cropConfig: config }),

  // History management
  history: [],
  currentHistoryIndex: -1,
  addHistory: () => {
    const state = get();
    const historyCopy = [...state.history].slice(
      0,
      state.currentHistoryIndex + 1
    );
    const newHistory = [
      ...historyCopy,
      { objects: JSON.parse(JSON.stringify(state.objects)) },
    ];
    set({
      history: newHistory,
      currentHistoryIndex: newHistory.length - 1,
    });
  },
  undo: () => {
    const { currentHistoryIndex, history } = get();
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const historyState = history[newIndex];
      set({
        currentHistoryIndex: newIndex,
        objects: historyState.objects,
      });
    }
  },
  redo: () => {
    const { currentHistoryIndex, history } = get();
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      const historyState = history[newIndex];
      set({
        currentHistoryIndex: newIndex,
        objects: historyState.objects,
      });
    }
  },

  // Canvas settings
  canvasWidth: 0,
  canvasHeight: 0,
  setCanvasSize: (width, height) =>
    set({
      canvasWidth: width ? width : 0,
      canvasHeight: height ? height : 0,
    }),

  // Clear all objects
  clearObjects: () => {
    set({ objects: [], canvasHeight: 0, canvasWidth: 0 });
    get().addHistory();
  },
}));
