import { useEffect, useState } from 'react';
import { useNarrativeStore } from '../store/narrativeStore';
import { saveService } from '../services/api';
import type { SaveSlot } from '../types/narrative';

// Hook to manage save slots for a given story/user
export default function useSaveSystem(storyId: string, userId: string) {
  const store = useNarrativeStore();

  const [saves, setSaves] = useState<SaveSlot[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoadingSaves, setIsLoadingSaves] = useState<boolean>(true);

  // Load saves on mount / when userId changes
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoadingSaves(true);
      try {
        const data = await saveService.getSaves(userId);
        if (!mounted) return;
        setSaves(data);
      } catch (e) {
        console.error('Failed to load saves', e);
        if (mounted) setSaves([]);
      } finally {
        if (mounted) setIsLoadingSaves(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [userId]);

  // Create a new save slot from current store state
  const saveGame = async (slotName: string) => {
    setIsSaving(true);
    try {
      const currentScene = store.currentScene;
      const variables = store.variables ?? {};
      const flagsSet = store.flags ?? new Set<string>();
      const visitedSet = store.visitedScenes ?? new Set<string>();
      const choiceHistory = store.choiceHistory ?? [];
      
      const flagsArray = Array.from(flagsSet);
      const visitedArray = Array.from(visitedSet);

      // Prepare payload; backend expects JSON strings for blobs
      const payload: any = {
        id: undefined,
        userId,
        storyId,
        slotName,
        currentSceneId: currentScene?.id ?? '',
        variables: JSON.stringify(variables),
        flags: JSON.stringify(flagsArray),
        choiceHistory: JSON.stringify(choiceHistory),
        visitedScenes: JSON.stringify(visitedArray),
      };

      const created = await saveService.createSave(payload as Partial<SaveSlot>);

      // Add to local state
      setSaves((prev) => [created, ...prev]);

      return created;
    } catch (err) {
      console.error('Failed to save game', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Load a save; returns the save so caller can set current scene id
  const loadGame = async (save: SaveSlot) => {
    try {
      // Optionally refresh from server to get latest
      // const refreshed = (await saveService.getSaves(userId)).find(s => s.id === save.id) ?? save;
      // For now return the provided save so the caller can react (setCurrentSceneId)

      // If desired, convert serialized fields back to objects before returning
      return save;
    } catch (err) {
      console.error('Failed to load save', err);
      throw err;
    }
  };

  // Delete a save and remove from local state
  const deleteSave = async (saveId: string) => {
    try {
      await saveService.deleteSave(saveId);
      setSaves((prev) => prev.filter((s) => s.id !== saveId));
    } catch (err) {
      console.error('Failed to delete save', err);
      throw err;
    }
  };

  return { saves, isSaving, isLoadingSaves, saveGame, loadGame, deleteSave } as const;
}
