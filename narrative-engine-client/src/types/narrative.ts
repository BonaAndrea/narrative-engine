// TypeScript types for Narrative Engine

export type VariableValue = string | number | boolean;

export type EffectType = 'SET_VARIABLE' | 'ADD_FLAG' | 'REMOVE_FLAG' | 'ADD_VALUE';
export interface Effect {
    type: EffectType;
    target: string; // variable or flag name
    value?: VariableValue;
}

export type ConditionType = 'HAS_FLAG' | 'VARIABLE_EQUALS' | 'VARIABLE_GT' | 'NOT';
export interface Condition {
    type: ConditionType;
    target: string;
    value?: VariableValue;
}

export type SceneContentType = 'paragraph' | 'dialogue' | 'image';
export interface SceneContent {
    id: string;
    type: SceneContentType;
    text?: string;
    speaker?: string;
    assetKey?: string;
}

export interface Choice {
    id: string;
    text: string;
    targetSceneId: string;
    conditions?: Condition[];
    effects: Effect[];
    sortOrder: number;
}

export interface Scene {
    id: string;
    storyId: string;
    title: string;
    content: SceneContent[];
    choices: Choice[];
    backgroundAsset?: string;
    musicAsset?: string;
}

export interface Story {
    id: string;
    title: string;
    description: string;
    startSceneId: string;
    published: boolean;
    createdAt: string; // ISO date
}

export interface SaveSlot {
    id: string;
    slotName: string;
    storyId: string;
    currentSceneId: string;
    variables: Record<string, VariableValue>;
    flags: string[];
    choiceHistory: string[]; // list of choice ids or descriptions
    visitedScenes: string[]; // list of scene ids
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
}
