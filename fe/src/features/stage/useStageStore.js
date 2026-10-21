import { create } from 'zustand';
import { CHARACTERS_MASTER, getCharacterById } from '../../data/master/charactersMaster';
import { STAGE_CONFIG_MASTER } from '../../data/master/stageConfigMaster';

const createDefaultScene = (index = 1) => ({
  id: `scene-${Date.now()}-${index}`,
  title: `Adegan ${index}`,
  background: 'kelir-blencong-default',
  durationMs: 5000,
  audioAssetId: 1, // Gamelan Srepeg Mataram
  characters: [
    {
      instanceId: `inst-${Date.now()}-1`,
      characterId: 1,
      name: 'Raden Gatotkaca',
      slug: 'gatotkaca',
      x: 0.28,
      y: 0.68,
      scale: 1.0,
      pose: 'default',
      facing: 'right',
      dialogue: 'Duh Rama Paduka, kulo sumadya ngurbanaken jiwa raga kangge Pandawa!',
      accentColor: '#eab308',
    },
    {
      instanceId: `inst-${Date.now()}-2`,
      characterId: 3,
      name: 'Adipati Karna',
      slug: 'karna',
      x: 0.74,
      y: 0.68,
      scale: 1.0,
      pose: 'perang',
      facing: 'left',
      dialogue: 'Majua Gatotkaca, pusaka Kunta Wijayandanu wus cumawis ing gandewa!',
      accentColor: '#f97316',
    },
  ],
});

export const useStageStore = create((set, get) => ({
  // Metadata Proyek Pertunjukan
  metadata: {
    id: null,
    title: 'Gugurnya Sang Senopati Udara',
    description: 'Interpretasi kisah kepahlawanan Raden Gatotkaca di medan laga Kurusetra.',
    storyId: 1,
    visibility: 'public',
  },

  // Adegan & Timeline
  scenes: [createDefaultScene(1)],
  activeSceneIndex: 0,
  selectedInstanceId: null,

  // Mode Pratinjau (Preview Engine)
  isPlayingPreview: false,
  previewSceneIndex: 0,
  isTheaterMode: false,

  // Undo Stack
  undoStack: [],

  // ============ METADATA ACTIONS ============
  setMetadata: (updates) =>
    set((state) => ({
      metadata: { ...state.metadata, ...updates },
    })),

  // ============ SCENE ACTIONS ============
  setActiveSceneIndex: (index) =>
    set((state) => {
      const validIndex = Math.max(0, Math.min(state.scenes.length - 1, index));
      return {
        activeSceneIndex: validIndex,
        selectedInstanceId: null,
      };
    }),

  addScene: () =>
    set((state) => {
      const nextIndex = state.scenes.length + 1;
      const newScene = createDefaultScene(nextIndex);
      return {
        scenes: [...state.scenes, newScene],
        activeSceneIndex: state.scenes.length,
        selectedInstanceId: null,
      };
    }),

  duplicateScene: (index) =>
    set((state) => {
      const sceneToClone = state.scenes[index];
      if (!sceneToClone) return state;

      const cloned = {
        ...sceneToClone,
        id: `scene-${Date.now()}`,
        title: `${sceneToClone.title} (Salinan)`,
        characters: sceneToClone.characters.map((c) => ({
          ...c,
          instanceId: `inst-${Date.now()}-${Math.random()}`,
        })),
      };

      const newScenes = [...state.scenes];
      newScenes.splice(index + 1, 0, cloned);

      return {
        scenes: newScenes,
        activeSceneIndex: index + 1,
      };
    }),

  removeScene: (index) =>
    set((state) => {
      if (state.scenes.length <= 1) return state; // Minimal 1 scene sesuai SRS T-02
      const newScenes = state.scenes.filter((_, i) => i !== index);
      const newActive = Math.min(state.activeSceneIndex, newScenes.length - 1);
      return {
        scenes: newScenes,
        activeSceneIndex: newActive,
        selectedInstanceId: null,
      };
    }),

  reorderScene: (fromIndex, toIndex) =>
    set((state) => {
      if (toIndex < 0 || toIndex >= state.scenes.length) return state;
      const updated = [...state.scenes];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return {
        scenes: updated,
        activeSceneIndex: toIndex,
      };
    }),

  updateActiveScene: (updates) =>
    set((state) => {
      const updatedScenes = [...state.scenes];
      const current = updatedScenes[state.activeSceneIndex];
      if (!current) return state;

      updatedScenes[state.activeSceneIndex] = {
        ...current,
        ...updates,
      };
      return { scenes: updatedScenes };
    }),

  updateAllScenes: (updates) =>
    set((state) => ({
      scenes: state.scenes.map((sc) => ({ ...sc, ...updates })),
    })),

  // ============ CHARACTER IN-SCENE ACTIONS ============
  setSelectedInstanceId: (instanceId) => set({ selectedInstanceId: instanceId }),

  addCharacterToActiveScene: (characterParam) =>
    set((state) => {
      const currentScene = state.scenes[state.activeSceneIndex];
      if (!currentScene) return state;

      let newInstance = null;

      // Jika custom puppet dari unggahan pengguna
      if (typeof characterParam === 'object' && characterParam?.customImageUrl) {
        newInstance = {
          instanceId: `inst-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          characterId: null,
          name: characterParam.name || 'Wayang Koleksi Dalang',
          slug: 'custom',
          customImageUrl: characterParam.customImageUrl,
          x: 0.50,
          y: 0.68,
          scale: 1.0,
          pose: 'default',
          facing: 'right',
          dialogue: 'Sugeng rawuh ing pagelaran wayang kelir digital.',
          accentColor: '#d4af37',
        };
      } else {
        const charData = getCharacterById(characterParam);
        if (!charData) return state;

        newInstance = {
          instanceId: `inst-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          characterId: charData.id,
          name: charData.name,
          slug: charData.slug,
          x: 0.50,
          y: 0.68,
          scale: charData.defaultScale || 1.0,
          pose: 'default',
          facing: 'right',
          dialogue: `Sugeng rawuh, kulo ${charData.name}.`,
          accentColor: charData.accentColor || '#f59e0b',
        };
      }

      const updatedScenes = [...state.scenes];
      updatedScenes[state.activeSceneIndex] = {
        ...currentScene,
        characters: [...currentScene.characters, newInstance],
      };

      return {
        scenes: updatedScenes,
        selectedInstanceId: newInstance.instanceId,
      };
    }),

  removeCharacterFromActiveScene: (instanceId) =>
    set((state) => {
      const currentScene = state.scenes[state.activeSceneIndex];
      if (!currentScene) return state;

      const updatedScenes = [...state.scenes];
      updatedScenes[state.activeSceneIndex] = {
        ...currentScene,
        characters: currentScene.characters.filter((c) => c.instanceId !== instanceId),
      };

      return {
        scenes: updatedScenes,
        selectedInstanceId: null,
      };
    }),

  updateCharacter: (instanceId, updates) =>
    set((state) => {
      const currentScene = state.scenes[state.activeSceneIndex];
      if (!currentScene) return state;

      const updatedCharacters = currentScene.characters.map((char) => {
        if (char.instanceId !== instanceId) return char;

        // Normalisasi koordinat agar tetap 0.0 - 1.0 (SRS Bab 6.1)
        let newX = updates.x !== undefined ? updates.x : char.x;
        let newY = updates.y !== undefined ? updates.y : char.y;

        if (updates.x !== undefined) {
          newX = Math.max(
            STAGE_CONFIG_MASTER.coordinateBounds.minX,
            Math.min(STAGE_CONFIG_MASTER.coordinateBounds.maxX, updates.x)
          );
        }
        if (updates.y !== undefined) {
          newY = Math.max(
            STAGE_CONFIG_MASTER.coordinateBounds.minY,
            Math.min(STAGE_CONFIG_MASTER.coordinateBounds.maxY, updates.y)
          );
        }

        return {
          ...char,
          ...updates,
          x: Number(newX.toFixed(3)),
          y: Number(newY.toFixed(3)),
        };
      });

      const updatedScenes = [...state.scenes];
      updatedScenes[state.activeSceneIndex] = {
        ...currentScene,
        characters: updatedCharacters,
      };

      return { scenes: updatedScenes };
    }),

  // ============ PREVIEW & PLAYBACK ENGINE (FR-08) ============
  startPreview: () =>
    set({
      isPlayingPreview: true,
      previewSceneIndex: 0,
      isTheaterMode: true,
      selectedInstanceId: null,
    }),

  stopPreview: () =>
    set({
      isPlayingPreview: false,
      previewSceneIndex: 0,
      isTheaterMode: false,
    }),

  setPreviewSceneIndex: (index) => set({ previewSceneIndex: index }),

  // ============ SERIALIZATION & PERSISTENCE (SRS Bab 6.1) ============
  exportSceneData: () => {
    const { scenes } = get();
    return {
      schemaVersion: 1,
      scenes: scenes.map((scene) => ({
        id: scene.id,
        title: scene.title,
        background: scene.background,
        durationMs: scene.durationMs || 5000,
        audioAssetIds: scene.audioAssetId ? [scene.audioAssetId] : [1],
        characters: scene.characters.map((c) => ({
          characterId: c.characterId,
          x: c.x,
          y: c.y,
          scale: c.scale,
          pose: c.pose,
          facing: c.facing,
          dialogue: c.dialogue,
        })),
      })),
    };
  },

  loadPerformanceFromData: (perf) => {
    if (!perf || !perf.scene_data) return;

    const sceneData = typeof perf.scene_data === 'string'
      ? JSON.parse(perf.scene_data)
      : perf.scene_data;

    const importedScenes = (sceneData.scenes || []).map((sc, sIdx) => ({
      id: sc.id || `scene-${sIdx + 1}`,
      title: sc.title || `Adegan ${sIdx + 1}`,
      background: sc.background || 'kelir-blencong-default',
      durationMs: sc.durationMs || 5000,
      audioAssetId: sc.audioAssetIds?.[0] || 1,
      characters: (sc.characters || []).map((ch, cIdx) => {
        const masterChar = getCharacterById(ch.characterId) || CHARACTERS_MASTER[0];
        return {
          instanceId: `inst-loaded-${sIdx}-${cIdx}-${Date.now()}`,
          characterId: ch.characterId,
          name: masterChar.name,
          slug: masterChar.slug,
          x: ch.x,
          y: ch.y,
          scale: ch.scale || 1.0,
          pose: ch.pose || 'default',
          facing: ch.facing || 'right',
          dialogue: ch.dialogue || '',
          accentColor: masterChar.accentColor || '#f59e0b',
        };
      }),
    }));

    set({
      metadata: {
        id: perf.id || null,
        title: perf.title || 'Lakon Wayang',
        description: perf.description || '',
        storyId: perf.story_id || null,
        visibility: perf.visibility || 'public',
      },
      scenes: importedScenes.length > 0 ? importedScenes : [createDefaultScene(1)],
      activeSceneIndex: 0,
      selectedInstanceId: null,
      isPlayingPreview: false,
    });
  },

  resetStudio: () =>
    set({
      metadata: {
        id: null,
        title: 'Karya Pertunjukan Baru',
        description: 'Interpretasi baru adegan wayang.',
        storyId: null,
        visibility: 'private',
      },
      scenes: [createDefaultScene(1)],
      activeSceneIndex: 0,
      selectedInstanceId: null,
      isPlayingPreview: false,
    }),
}));
