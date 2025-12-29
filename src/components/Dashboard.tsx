import { Circuit } from '../lib/types';
import { FileText, Copy, Trash2, Plus, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  circuits: Circuit[];
  onCreateNew: () => void;
  onViewCircuit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function Dashboard({ circuits, onCreateNew, onViewCircuit, onDuplicate, onDelete }: DashboardProps) {
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this circuit?')) {
      onDelete(id);
    }
  };

  const handleDuplicate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDuplicate(id);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #16161d 100%)' }}>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-xl bg-[#16161d]/80 border-b border-white/10 sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-8 py-8">
          <motion.h1 
            className="gradient-text text-4xl mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            ArchCircuit
          </motion.h1>
          <motion.p 
            className="text-[#a1a1b0]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Architecture Study Tour Circuit Builder
          </motion.p>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-[#e8e8ee] text-2xl mb-2">Saved Circuits</h2>
            <p className="text-[#a1a1b0]">
              {circuits.length} {circuits.length === 1 ? 'circuit' : 'circuits'} saved
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateNew}
            className="relative overflow-hidden bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 flex items-center gap-3 group"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>Create New Circuit</span>
          </motion.button>
        </motion.div>

        {circuits.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-3xl p-20 text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 hover:rotate-0 transition-transform duration-500">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-[#e8e8ee] text-xl mb-3">No circuits yet</h3>
            <p className="text-[#a1a1b0] mb-8 max-w-md mx-auto">
              Create your first academic study tour circuit to get started
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateNew}
              className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 inline-flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              Create New Circuit
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {circuits.map((circuit, index) => (
              <motion.div
                key={circuit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                onClick={() => onViewCircuit(circuit.id)}
                className="glass glass-hover rounded-2xl p-6 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-[#e8e8ee] mb-2 group-hover:text-[#8b5cf6] transition-colors duration-300">
                      {circuit.name}
                    </h3>
                    <p className="text-[#a1a1b0] text-sm">
                      Year {circuit.academic_year} · {circuit.duration} days
                    </p>
                  </div>
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className={`px-3 py-1.5 rounded-xl text-xs backdrop-blur-xl ${
                      circuit.status === 'Approved'
                        ? 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30'
                        : circuit.status === 'Exported'
                        ? 'bg-[#6366f1]/20 text-[#8b5cf6] border border-[#6366f1]/30'
                        : 'bg-[#6b6b7a]/20 text-[#a1a1b0] border border-[#6b6b7a]/30'
                    }`}
                  >
                    {circuit.status}
                  </motion.span>
                </div>

                <div className="mb-4 pb-4 border-b border-white/5">
                  <p className="text-[#a1a1b0] text-sm mb-2">Cities:</p>
                  <p className="text-[#e8e8ee] text-sm">
                    {circuit.cities.length} {circuit.cities.length === 1 ? 'city' : 'cities'}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-[#a1a1b0] text-sm mb-3">Learning Goals:</p>
                  <div className="flex flex-wrap gap-2">
                    {circuit.learning_goals.slice(0, 2).map(goal => (
                      <span
                        key={goal}
                        className="bg-[#6366f1]/10 text-[#8b5cf6] px-3 py-1.5 rounded-xl text-xs border border-[#6366f1]/20 backdrop-blur-xl"
                      >
                        {goal}
                      </span>
                    ))}
                    {circuit.learning_goals.length > 2 && (
                      <span className="text-[#a1a1b0] text-xs px-3 py-1.5">
                        +{circuit.learning_goals.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#a1a1b0] text-sm">Academic Score</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[#e8e8ee] text-2xl font-semibold">{circuit.score.total}</span>
                      <span className="text-[#6b6b7a] text-sm">/100</span>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-[#25252f] rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${circuit.score.total}%` }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/5">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleDuplicate(e, circuit.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25252f] hover:bg-[#2f2f3a] rounded-xl text-[#e8e8ee] transition-all duration-300 text-sm border border-white/5"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleDelete(e, circuit.id)}
                    className="px-4 py-2.5 bg-[#ef4444]/10 hover:bg-[#ef4444]/20 rounded-xl text-[#f87171] transition-all duration-300 border border-[#ef4444]/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <p className="text-[#6b6b7a] text-xs mt-4">
                  Created {new Date(circuit.created_at).toLocaleDateString('en-IN')}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
