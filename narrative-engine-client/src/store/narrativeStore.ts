import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Story, Scene, Choice, VariableValue, Effect } from '../types/narrative';

export interface NarrativeStore {
    currentStory: Story | null;
    currentScene: Scene | null;
    variables: Record<string, VariableValue>;
    flags: Set<string>;
    visitedScenes: Set<string>;
    choiceHistory: string[];
    isLoading: boolean;
    error: string | null;

    setStory: (story: Story) => void;
    setScene: (scene: Scene) => void;
    makeChoice: (choice: Choice) => void;
    applyEffect: (effect: Effect) => void;
    addVisitedScene: (sceneId: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetStory: () => void;
}

export const useNarrativeStore = create<NarrativeStore>()(
    immer((set, get) => ({
        currentStory: null,
        currentScene: null,
        variables: {},
        flags: new Set<string>(),
        visitedScenes: new Set<string>(),
        choiceHistory: [],
        isLoading: false,
        error: null,

        setStory: (story: Story) =>
            set((state) => {
                state.currentStory = story;
                state.currentScene = null;
                state.variables = {};
                state.flags = new Set<string>();
                state.visitedScenes = new Set<string>();
                state.choiceHistory = [];
                state.error = null;
            }),

        setScene: (scene: Scene) =>
            set((state) => {
                state.currentScene = scene;
                state.visitedScenes.add(scene.id);
            }),

        makeChoice: (choice: Choice) => {
            choice.effects.forEach(effect => get().applyEffect(effect));
            set((state) => {
                state.choiceHistory.push(choice.id);
            });
        },

        applyEffect: (effect: Effect) =>
            set((state) => {
                switch (effect.type) {
                    case 'SET_VARIABLE':
                        if (effect.value !== undefined)
                            state.variables[effect.target] = effect.value;
                        break;
                    case 'ADD_FLAG':
                        state.flags.add(effect.target);
                        break;
                    case 'REMOVE_FLAG':
                        state.flags.delete(effect.target);
                        break;
                    case 'ADD_VALUE': {
                        const current = state.variables[effect.target];
                        if (typeof current === 'number' && typeof effect.value === 'number')
                            state.variables[effect.target] = current + effect.value;
                        else if (current === undefined && typeof effect.value === 'number')
                            state.variables[effect.target] = effect.value;
                        break;
                    }
                }
            }),

        addVisitedScene: (sceneId: string) =>
            set((state) => { state.visitedScenes.add(sceneId); }),

        setLoading: (loading: boolean) =>
            set((state) => { state.isLoading = loading; }),

        setError: (error: string | null) =>
            set((state) => { state.error = error; }),

        resetStory: () =>
            set((state) => {
                state.currentStory = null;
                state.currentScene = null;
                state.variables = {};
                state.flags = new Set<string>();
                state.visitedScenes = new Set<string>();
                state.choiceHistory = [];
                state.isLoading = false;
                state.error = null;
            }),
    }))
);