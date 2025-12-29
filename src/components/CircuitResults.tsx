import { Circuit } from '../lib/types';
import { CITIES } from '../lib/data';
import { ChevronLeft, Eye, Save, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface CircuitResultsProps {
  circuits: Circuit[];
  onSelectCircuit: (circuit: Circuit) => void;
  onSaveCircuit: (circuit: Circuit) => void;
  onBack: () => void;
}

export function CircuitResults({ circuits, onSelectCircuit, onSaveCircuit, onBack }: CircuitResultsProps) {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #16161d 100%)' }}>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-[#16161d]/80 border-b border-white/10 sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-8 py-8">
          <h1 className="gradient-text text-3xl mb-2">Generated Circuits</h1>
          <p className="text-[#a1a1b0]">
            {circuits.length} academically-optimized {circuits.length === 1 ? 'circuit' : 'circuits'}{' '}
            generated
          </p>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {circuits.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-20 text-center"
          >
            <h3 className="text-[#e8e8ee] text-xl mb-2">No circuits found</h3>
            <p className="text-[#a1a1b0] mb-8">
              Unable to generate circuits with the current criteria. Please try adjusting your constraints
              or learning goals.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 inline-flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Form
            </motion.button>
          </motion.div>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 glass rounded-2xl p-5 flex items-start gap-3"
            >
              <TrendingUp className="w-5 h-5 text-[#8b5cf6] flex-shrink-0 mt-0.5" />
              <p className="text-[#a1a1b0] text-sm">
                These circuits have been ranked by academic value, not travel convenience. The scoring
                prioritizes learning outcomes and pedagogical progression.
              </p>
            </motion.div>

            <div className="space-y-6">
              {circuits.map((circuit, index) => {
                const cities = circuit.cities
                  .map(id => CITIES.find(c => c.id === id))
                  .filter(Boolean);

                return (
                  <motion.div
                    key={circuit.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="glass glass-hover rounded-3xl overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-[#6366f1]/10 to-[#8b5cf6]/10 px-8 py-6 border-b border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                            <span className="text-xl">#{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-[#e8e8ee] text-xl mb-2">{circuit.name}</h3>
                            <p className="text-[#a1a1b0]">
                              Year {circuit.academic_year} · {circuit.duration} days ·{' '}
                              {circuit.cities.length} cities
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-[#e8e8ee] text-4xl font-bold">{circuit.score.total}</span>
                            <span className="text-[#6b6b7a]">/100</span>
                          </div>
                          <div className="text-[#a1a1b0] text-sm">Academic Score</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="mb-6">
                        <h4 className="text-[#e8e8ee] mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
                          Circuit Route
                        </h4>
                        <div className="flex items-center gap-3 flex-wrap">
                          {cities.map((city, idx) => (
                            <div key={city?.id} className="flex items-center gap-3">
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                className="bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 backdrop-blur-xl border border-[#8b5cf6]/30 text-[#e8e8ee] px-6 py-3 rounded-2xl"
                              >
                                {city?.city}
                              </motion.div>
                              {idx < cities.length - 1 && (
                                <div className="text-[#6b6b7a] text-2xl">→</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6 p-6 bg-[#1c1c24] rounded-2xl border border-white/5">
                        <h4 className="text-[#e8e8ee] mb-3">Academic Justification</h4>
                        <p className="text-[#a1a1b0] leading-relaxed">
                          {circuit.academic_justification}
                        </p>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-[#e8e8ee] mb-3">Learning Focus</h4>
                        <div className="flex flex-wrap gap-2">
                          {circuit.learning_goals.map((goal, idx) => (
                            <motion.span
                              key={goal}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 + idx * 0.05 }}
                              className="bg-[#10b981]/10 text-[#34d399] px-4 py-2 rounded-xl text-sm border border-[#10b981]/30 backdrop-blur-xl"
                            >
                              {goal}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-6 p-6 bg-[#1c1c24] rounded-2xl border border-white/5">
                        {[
                          { label: 'Academic Match', value: circuit.score.academic_match, color: '#10b981' },
                          { label: 'Travel Efficiency', value: circuit.score.travel_efficiency, color: '#6366f1' },
                          { label: 'Pedagogical Flow', value: circuit.score.pedagogical_progression, color: '#8b5cf6' },
                          { label: 'Preference Match', value: circuit.score.user_preference, color: '#f59e0b' }
                        ].map((metric, idx) => (
                          <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                          >
                            <div className="text-[#a1a1b0] text-sm mb-2">{metric.label}</div>
                            <div className="flex items-baseline gap-1">
                              <div className="text-[#e8e8ee] text-2xl font-semibold">{metric.value}</div>
                              <div className="text-[#6b6b7a] text-sm">/100</div>
                            </div>
                            <div className="mt-2 w-full bg-[#25252f] rounded-full h-1.5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                                className="h-full rounded-full"
                                style={{ background: metric.color }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onSelectCircuit(circuit)}
                          className="flex-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-5 h-5" />
                          View Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onSaveCircuit(circuit)}
                          className="px-8 py-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-2xl text-[#34d399] hover:bg-[#10b981]/20 transition-all duration-300 flex items-center gap-2 backdrop-blur-xl"
                        >
                          <Save className="w-5 h-5" />
                          Save
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="px-8 py-4 bg-[#1c1c24] border border-white/10 rounded-2xl text-[#e8e8ee] hover:border-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Form
              </motion.button>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
