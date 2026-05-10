import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNarrativeStore } from '../store/narrativeStore';

export default function EndingPage() {
    const navigate = useNavigate();
    const store = useNarrativeStore();

    const choiceCount = store.choiceHistory.length;
    const flagsArray = Array.from(store.flags);
    const visitedCount = store.visitedScenes.size;

    return (
        <motion.div
            className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
        >
            <motion.div
                className="max-w-xl w-full text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
            >
                {/* Titolo */}
                <p className="text-gray-500 text-sm uppercase tracking-widest mb-4">Fine del percorso</p>
                <h1 className="text-4xl font-serif font-bold mb-2">{store.currentStory?.title}</h1>
                <div className="w-12 h-px bg-gray-700 mx-auto my-6" />

                {/* Statistiche */}
                <motion.div
                    className="bg-gray-900 rounded-xl p-6 mb-8 text-left space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <p className="text-gray-400 text-sm uppercase tracking-wide mb-4">Il tuo percorso</p>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Scene visitate</span>
                        <span className="text-white font-medium">{visitedCount}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Scelte effettuate</span>
                        <span className="text-white font-medium">{choiceCount}</span>
                    </div>

                    {flagsArray.length > 0 && (
                        <div className="pt-2 border-t border-gray-800">
                            <p className="text-gray-500 text-sm mb-2">Flags raccolti</p>
                            <div className="flex flex-wrap gap-2">
                                {flagsArray.map((flag) => (
                                    <span key={flag} className="px-2 py-1 bg-gray-800 rounded text-xs text-amber-400">
                    {flag}
                  </span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Bottoni */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                >
                    <button
                        onClick={() => navigate('/stories')}
                        className="px-6 py-3 border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition"
                    >
                        Torna alla libreria
                    </button>
                    <button
                        onClick={() => {
                            const storyId = store.currentStory?.id;
                            store.resetStory();
                            navigate(`/play/${storyId}`);
                        }}
                        className="px-6 py-3 border border-amber-700 text-amber-400 rounded-lg hover:bg-amber-900/20 transition"
                    >
                        Ricomincia
                    </button>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}