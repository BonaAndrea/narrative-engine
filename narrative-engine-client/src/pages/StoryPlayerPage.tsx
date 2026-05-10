import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useNarrativeStore } from '../store/narrativeStore';
import { storyService, apiClient } from '../services/api';
import type { Scene, SceneContent, Choice } from '../types/narrative';
import { AnimatePresence, motion } from 'framer-motion';
import useSaveSystem from '../hooks/useSaveSystem';

const TEMP_USER_ID = '00000000-0000-0000-0000-000000000001';

export default function StoryPlayerPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const [currentSceneId, setCurrentSceneId] = useState<string>('');
  const [showSavePanel, setShowSavePanel] = useState(false);
  const store = useNarrativeStore();

  const { saves, isSaving, isLoadingSaves, saveGame, loadGame, deleteSave } =
      useSaveSystem(storyId!, TEMP_USER_ID);

  const { data: story, isLoading: storyLoading, isError: storyError } = useQuery({
    queryKey: ['story', storyId],
    queryFn: () => storyService.getStory(storyId!),
    enabled: !!storyId,
  });

  useEffect(() => {
    if (story) {
      store.setStory(story);
      setCurrentSceneId(story.startSceneId);
    }
  }, [story]);

  const { data: sceneData, isLoading: sceneLoading } = useQuery({
    queryKey: ['scene', currentSceneId],
    queryFn: () =>
        apiClient
            .get(`/api/stories/${storyId}/scenes/${currentSceneId}`)
            .then((r) => r.data as Scene)
            .catch((err) => {
              if (err.response?.status === 404) return null;
              throw err;
            }),
    enabled: !!currentSceneId,
    retry: false,
  });
  
  useEffect(() => {
    if (sceneData) store.setScene(sceneData);
  }, [sceneData]);

  const parsedContent: SceneContent[] = (() => {
    try {
      return sceneData?.content
          ? JSON.parse(sceneData.content as unknown as string)
          : [];
    } catch { return []; }
  })();

  const contentVariants = {
    initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: 20, filter: 'blur(4px)' },
  };

  const blocksContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const blockVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const choicesContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const choiceVariant = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  const handleChoice = (choice: Choice) => {
    const parsedChoice = {
      ...choice,
      effects: typeof choice.effects === 'string'
          ? JSON.parse(choice.effects)
          : choice.effects,
    };
    store.makeChoice(parsedChoice);
    setCurrentSceneId(choice.targetSceneId);
  };

  if (storyLoading) {
    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin border-t-2 border-white rounded-full w-8 h-8" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
    );
  }

  if (storyError) {
    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
          <p className="text-red-400">Error loading story.</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">

        {/* Top bar */}
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex justify-between items-center">
          <span className="text-gray-400 text-sm">{store.currentStory?.title}</span>
          <div className="flex gap-2">
            <button
                onClick={() => saveGame('Autosave').catch(console.error)}
                disabled={isSaving}
                className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-gray-800 transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
                onClick={() => setShowSavePanel(true)}
                className="px-3 py-1 text-sm border border-gray-700 rounded hover:bg-gray-800 transition"
            >
              Saves
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            {sceneLoading && (
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="animate-spin border-t-2 border-gray-500 rounded-full w-4 h-4" />
                  <span className="text-sm">Loading scene...</span>
                </div>
            )}
            <AnimatePresence>
              {sceneData && (
                  <motion.div
                      key={sceneData.id}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={contentVariants}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="pb-6"
                  >
                    <motion.p className="text-gray-500 text-sm uppercase tracking-widest mb-6">
                      {sceneData.title}
                    </motion.p>
                    <motion.div initial="hidden" animate="visible" variants={blocksContainer}>
                      {parsedContent.map((block) => {
                        if (block.type === 'paragraph') {
                          return (
                              <motion.p key={block.id} variants={blockVariant} className="text-gray-200 text-lg leading-relaxed mb-4">
                                {block.text}
                              </motion.p>
                          );
                        }
                        if (block.type === 'dialogue') {
                          return (
                              <motion.div key={block.id} variants={blockVariant} className="mb-4">
                                {block.speaker && (
                                    <span className="text-amber-400 font-semibold text-sm uppercase tracking-wide">
                              {block.speaker}
                            </span>
                                )}
                                <p className="text-gray-200 italic mt-1">{block.text}</p>
                              </motion.div>
                          );
                        }
                        return (
                            <motion.div key={block.id} variants={blockVariant} className="bg-gray-800 rounded-lg h-48 mb-4 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">Image placeholder</span>
                            </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Choices area */}
        <div className="border-t border-gray-800 p-6">
          <div className="max-w-3xl mx-auto w-full">
            {!sceneLoading && !sceneData && currentSceneId && (
                <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                  <p className="text-gray-500 text-sm mb-6">Il percorso si conclude qui...</p>
                  <button
                      onClick={() => navigate('/ending')}
                      className="px-6 py-3 border border-amber-700 text-amber-400 rounded-lg hover:bg-amber-900/20 transition"
                  >
                    Vedi il finale
                  </button>
                </motion.div>
            )}
            {sceneData?.choices && sceneData.choices.length > 0 && (
                <>
                  <p className="text-gray-500 text-sm mb-4">Choose your path:</p>
                  <motion.div initial="hidden" animate="visible" variants={choicesContainer}>
                    {sceneData.choices.map((choice) => (
                        <motion.button
                            key={choice.id}
                            onClick={() => handleChoice(choice)}
                            variants={choiceVariant}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full text-left p-4 border border-gray-700 rounded-lg mb-3 hover:border-gray-400 hover:bg-gray-900 transition"
                        >
                          {choice.text}
                        </motion.button>
                    ))}
                  </motion.div>
                </>
            )}
          </div>
        </div>

        {/* Save Panel Overlay */}
        {showSavePanel && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md relative">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Save Slots</h2>
                  <button
                      onClick={() => setShowSavePanel(false)}
                      className="text-gray-400 hover:text-white transition"
                  >
                    ✕
                  </button>
                </div>
                {isLoadingSaves ? (
                    <p className="text-gray-400 text-sm">Loading saves...</p>
                ) : saves.length === 0 ? (
                    <p className="text-gray-500 text-sm">No saves yet.</p>
                ) : (
                    <div className="space-y-3 mb-4">
                      {saves.map((save) => (
                          <div key={save.id} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                            <div>
                              <p className="text-white text-sm font-medium">{save.slotName}</p>
                              <p className="text-gray-500 text-xs">{new Date(save.updatedAt).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                  onClick={() => loadGame(save).then(s => {
                                    setCurrentSceneId(s.currentSceneId);
                                    setShowSavePanel(false);
                                  })}
                                  className="px-3 py-1 text-xs border border-gray-600 rounded hover:bg-gray-700 transition"
                              >
                                Load
                              </button>
                              <button
                                  onClick={() => deleteSave(save.id)}
                                  className="px-3 py-1 text-xs border border-red-900 text-red-400 rounded hover:bg-red-900/30 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
                <button
                    onClick={() => saveGame('Save ' + new Date().toLocaleString()).catch(console.error)}
                    disabled={isSaving}
                    className="w-full py-2 border border-gray-600 rounded-lg text-sm hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : '+ New Save'}
                </button>
              </div>
            </div>
        )}

      </div>
  );
}