import { useState } from 'react';
import { Circuit } from '../lib/types';
import { CITIES } from '../lib/data';
import { ChevronLeft, ArrowUp, ArrowDown, X, RefreshCw, AlertTriangle, Save } from 'lucide-react';
import { motion } from 'motion/react';

interface CircuitCustomizeProps {
  circuit: Circuit;
  onBack: () => void;
  onSave: (updatedCircuit: Circuit) => void;
}

export function CircuitCustomize({ circuit, onBack, onSave }: CircuitCustomizeProps) {
  const [editedCircuit, setEditedCircuit] = useState<Circuit>(circuit);
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleRemoveCity = (cityId: string) => {
    const newCities = editedCircuit.cities.filter(id => id !== cityId);
    
    if (newCities.length < 2) {
      alert('Circuit must have at least 2 cities');
      return;
    }

    const newWarnings = [...warnings];
    const city = CITIES.find(c => c.id === cityId);
    
    if (city) {
      const affectedGoals = city.learning_focus.filter(goal =>
        editedCircuit.learning_goals.includes(goal)
      );
      
      if (affectedGoals.length > 0) {
        newWarnings.push(
          `Removing ${city.city} may reduce coverage of: ${affectedGoals.join(', ')}`
        );
      }
    }

    setEditedCircuit({
      ...editedCircuit,
      cities: newCities,
      updated_at: new Date().toISOString()
    });
    setWarnings(newWarnings);
  };

  const handleMoveCity = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= editedCircuit.cities.length) return;

    const newCities = [...editedCircuit.cities];
    const [movedCity] = newCities.splice(fromIndex, 1);
    newCities.splice(toIndex, 0, movedCity);

    setEditedCircuit({
      ...editedCircuit,
      cities: newCities,
      updated_at: new Date().toISOString()
    });

    setWarnings([...warnings, 'City order changed - review travel efficiency']);
  };

  const handleSave = () => {
    if (editedCircuit.cities.length < 2) {
      alert('Circuit must have at least 2 cities');
      return;
    }

    onSave(editedCircuit);
  };

  const cities = editedCircuit.cities.map(id => CITIES.find(c => c.id === id)).filter(Boolean);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #16161d 100%)' }}>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-[#16161d]/80 border-b border-white/10 sticky top-0 z-10"
      >
        <div className="max-w-6xl mx-auto px-8 py-6">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={onBack}
            className="text-[#a1a1b0] hover:text-[#e8e8ee] mb-4 flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </motion.button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="gradient-text text-3xl mb-2">Customize Circuit</h1>
              <p className="text-[#a1a1b0]">{editedCircuit.name}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="bg-gradient-to-r from-[#10b981] to-[#34d399] text-white px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        {warnings.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 glass rounded-2xl p-6 border-l-4 border-[#fbbf24]"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-[#fbbf24] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-[#fbbf24] mb-3">Warnings</h3>
                <ul className="text-[#a1a1b0] text-sm space-y-2">
                  {warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setWarnings([])}
                className="text-[#a1a1b0] hover:text-[#e8e8ee]"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-3xl p-8"
            >
              <h2 className="text-[#e8e8ee] text-2xl mb-3">Circuit Cities</h2>
              <p className="text-[#a1a1b0] text-sm mb-6">
                Reorder cities or remove cities that don't fit your requirements
              </p>

              <div className="space-y-3">
                {cities.map((city, index) => city && (
                  <motion.div
                    key={city.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="glass-hover rounded-2xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white flex items-center justify-center flex-shrink-0 text-xl">
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-[#e8e8ee] text-lg mb-1">
                          {city.city}, {city.state}
                        </h3>
                        <p className="text-[#a1a1b0] text-sm mb-3">
                          {city.region} · {city.suggested_days} days suggested
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {city.learning_focus.slice(0, 3).map(focus => (
                            <span
                              key={focus}
                              className="bg-[#6b6b7a]/20 text-[#a1a1b0] px-3 py-1 rounded-lg text-xs border border-[#6b6b7a]/30"
                            >
                              {focus}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleMoveCity(index, index - 1)}
                          disabled={index === 0}
                          className="p-2 bg-[#1c1c24] hover:bg-[#25252f] rounded-xl disabled:opacity-30 disabled:cursor-not-allowed border border-white/10"
                        >
                          <ArrowUp className="w-4 h-4 text-[#e8e8ee]" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleMoveCity(index, index + 1)}
                          disabled={index === cities.length - 1}
                          className="p-2 bg-[#1c1c24] hover:bg-[#25252f] rounded-xl disabled:opacity-30 disabled:cursor-not-allowed border border-white/10"
                        >
                          <ArrowDown className="w-4 h-4 text-[#e8e8ee]" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveCity(city.id)}
                          className="p-2 bg-[#ef4444]/10 hover:bg-[#ef4444]/20 rounded-xl text-[#f87171] border border-[#ef4444]/30"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {city.risk_notes && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                        <p className="text-[#fbbf24] text-sm">{city.risk_notes}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-3xl p-8"
            >
              <h2 className="text-[#e8e8ee] text-2xl mb-4">Academic Emphasis</h2>
              <p className="text-[#a1a1b0] text-sm mb-6">
                Adjust the focus of learning goals for this circuit
              </p>

              <div className="space-y-3">
                {editedCircuit.learning_goals.map((goal, index) => (
                  <motion.div 
                    key={goal}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-4 glass-hover rounded-xl"
                  >
                    <span className="text-[#e8e8ee]">{goal}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        if (editedCircuit.learning_goals.length <= 1) {
                          alert('Circuit must have at least one learning goal');
                          return;
                        }
                        setEditedCircuit({
                          ...editedCircuit,
                          learning_goals: editedCircuit.learning_goals.filter(g => g !== goal),
                          updated_at: new Date().toISOString()
                        });
                        setWarnings([...warnings, `Removed learning goal: ${goal}`]);
                      }}
                      className="p-2 bg-[#ef4444]/10 hover:bg-[#ef4444]/20 rounded-lg text-[#f87171]"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-3xl p-8"
            >
              <h2 className="text-[#e8e8ee] text-2xl mb-6">Circuit Summary</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#a1a1b0]">Total Cities</span>
                  <span className="text-[#e8e8ee] font-semibold">{editedCircuit.cities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a1a1b0]">Duration</span>
                  <span className="text-[#e8e8ee] font-semibold">{editedCircuit.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a1a1b0]">Academic Year</span>
                  <span className="text-[#e8e8ee] font-semibold">Year {editedCircuit.academic_year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a1a1b0]">Learning Goals</span>
                  <span className="text-[#e8e8ee] font-semibold">{editedCircuit.learning_goals.length}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-[#a1a1b0] text-sm mb-3">Regions Covered</div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(cities.map(c => c?.region))).map(region => (
                    <span
                      key={region}
                      className="bg-[#6366f1]/10 text-[#8b5cf6] px-3 py-1.5 rounded-xl text-xs border border-[#6366f1]/30"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-3xl p-8"
            >
              <h2 className="text-[#e8e8ee] text-xl mb-6">Quick Actions</h2>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEditedCircuit(circuit);
                  setWarnings([]);
                }}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1c1c24] border border-white/10 rounded-2xl text-[#e8e8ee] hover:border-white/20 transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Changes
              </motion.button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
