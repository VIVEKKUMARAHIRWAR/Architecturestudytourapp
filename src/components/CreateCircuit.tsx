import { useState } from 'react';
import { CircuitFormData, AcademicYear, Semester, LearningGoal, Region, TravelMode } from '../lib/types';
import { LEARNING_GOALS_CONFIG } from '../lib/data';
import { AlertCircle, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreateCircuitProps {
  onGenerate: (formData: CircuitFormData) => void;
  onCancel: () => void;
}

export function CreateCircuit({ onGenerate, onCancel }: CreateCircuitProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CircuitFormData>({
    duration: 5,
    learning_goals: [],
    constraints: {
      regions: [],
      max_daily_travel_hours: 6,
      preferred_modes: ['Train', 'Road', 'Flight'],
      urban_rural_balance: 3,
      heritage_contemporary_balance: 3
    }
  });

  const handleNext = () => {
    if (step === 1 && !formData.academic_year) {
      alert('Please select an academic year to continue');
      return;
    }
    if (step === 2 && formData.learning_goals.length === 0) {
      alert('Please select at least one learning goal');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!formData.academic_year) {
      alert('Academic year is required');
      return;
    }
    if (formData.learning_goals.length === 0) {
      alert('Please select at least one learning goal');
      return;
    }
    onGenerate(formData);
  };

  const toggleLearningGoal = (goal: LearningGoal) => {
    const disabledReason = LEARNING_GOALS_CONFIG[goal].disabled_reason?.(formData.academic_year!);
    if (disabledReason) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      learning_goals: prev.learning_goals.includes(goal)
        ? prev.learning_goals.filter(g => g !== goal)
        : [...prev.learning_goals, goal]
    }));
  };

  const toggleRegion = (region: Region) => {
    setFormData(prev => ({
      ...prev,
      constraints: {
        ...prev.constraints,
        regions: prev.constraints.regions.includes(region)
          ? prev.constraints.regions.filter(r => r !== region)
          : [...prev.constraints.regions, region]
      }
    }));
  };

  const toggleTravelMode = (mode: TravelMode) => {
    setFormData(prev => ({
      ...prev,
      constraints: {
        ...prev.constraints,
        preferred_modes: prev.constraints.preferred_modes.includes(mode)
          ? prev.constraints.preferred_modes.filter(m => m !== mode)
          : [...prev.constraints.preferred_modes, mode]
      }
    }));
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #16161d 100%)' }}>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-[#16161d]/80 border-b border-white/10 sticky top-0 z-10"
      >
        <div className="max-w-4xl mx-auto px-8 py-8">
          <h1 className="text-[#e8e8ee] text-3xl mb-6">Create New Circuit</h1>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: s * 0.1 }}
                  className="relative flex-1"
                >
                  <div className={`h-2 rounded-full overflow-hidden ${
                    s <= step ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]' : 'bg-[#25252f]'
                  }`}>
                    {s === step && (
                      <motion.div
                        className="h-full bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      />
                    )}
                  </div>
                  <div className={`absolute -top-7 left-0 text-xs ${
                    s === step ? 'text-[#8b5cf6]' : s < step ? 'text-[#10b981]' : 'text-[#6b6b7a]'
                  }`}>
                    {s === 1 ? 'Basic Info' : s === 2 ? 'Learning Goals' : 'Constraints'}
                  </div>
                </motion.div>
                {s < 3 && <ChevronRight className="w-4 h-4 text-[#6b6b7a] flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-3xl p-8"
            >
              <h2 className="text-[#e8e8ee] text-2xl mb-8">Step 1: Basic Information</h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-[#e8e8ee] mb-4">
                    Academic Year <span className="text-[#ef4444]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map(year => (
                      <motion.button
                        key={year}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, academic_year: year as AcademicYear })}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                          formData.academic_year === year
                            ? 'border-[#8b5cf6] bg-[#8b5cf6]/10 shadow-[0_0_30px_rgba(139,92,246,0.3)]'
                            : 'border-white/10 bg-[#1c1c24] hover:border-white/20'
                        }`}
                      >
                        <div className="text-[#e8e8ee] text-xl mb-2">Year {year}</div>
                        <div className="text-[#a1a1b0] text-sm">
                          {year === 1 ? 'Principles' : year === 2 ? 'Systems' : 'Practice'}
                        </div>
                        {formData.academic_year === year && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-3 w-6 h-6 bg-[#8b5cf6] rounded-full flex items-center justify-center mx-auto"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#e8e8ee] mb-4">Semester (Optional)</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map(sem => (
                      <motion.button
                        key={sem}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            semester: formData.semester === sem ? undefined : (sem as Semester)
                          })
                        }
                        className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                          formData.semester === sem
                            ? 'border-[#8b5cf6] bg-[#8b5cf6]/10'
                            : 'border-white/10 bg-[#1c1c24] hover:border-white/20'
                        }`}
                      >
                        <span className="text-[#e8e8ee]">Semester {sem}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#e8e8ee] mb-4">
                    Trip Duration: <span className="text-[#8b5cf6]">{formData.duration} days</span>
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="3"
                      max="10"
                      value={formData.duration}
                      onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full h-2 bg-[#25252f] rounded-full appearance-none cursor-pointer accent-[#8b5cf6]"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((formData.duration - 3) / 7) * 100}%, #25252f ${((formData.duration - 3) / 7) * 100}%, #25252f 100%)`
                      }}
                    />
                    <div className="flex justify-between text-sm text-[#6b6b7a] mt-3">
                      <span>3 days</span>
                      <span>10 days</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#e8e8ee] mb-4">Starting City (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Delhi, Mumbai"
                    value={formData.starting_city || ''}
                    onChange={e => setFormData({ ...formData, starting_city: e.target.value || undefined })}
                    className="w-full px-6 py-4 bg-[#1c1c24] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent text-[#e8e8ee] placeholder:text-[#6b6b7a] transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-3xl p-8"
            >
              <h2 className="text-[#e8e8ee] text-2xl mb-2">Step 2: Learning Goals</h2>
              <p className="text-[#a1a1b0] mb-8">
                Select the learning objectives for this study tour. Some goals may be disabled based on the
                selected academic year.
              </p>

              <div className="space-y-4">
                {Object.entries(LEARNING_GOALS_CONFIG).map(([goal, config]) => {
                  const disabledReason = config.disabled_reason?.(formData.academic_year!);
                  const isDisabled = !!disabledReason;
                  const isSelected = formData.learning_goals.includes(goal as LearningGoal);

                  return (
                    <motion.div
                      key={goal}
                      whileHover={{ scale: isDisabled ? 1 : 1.01 }}
                      onClick={() => !isDisabled && toggleLearningGoal(goal as LearningGoal)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        isDisabled
                          ? 'border-white/5 bg-[#16161d] cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'border-[#8b5cf6] bg-[#8b5cf6]/10 cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                          : 'border-white/10 bg-[#1c1c24] hover:border-white/20 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                              isSelected
                                ? 'bg-[#8b5cf6] border-[#8b5cf6]'
                                : 'border-white/20'
                            }`}>
                              {isSelected && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <h3 className="text-[#e8e8ee]">{goal}</h3>
                          </div>
                          <p className="text-[#a1a1b0] text-sm mb-2 ml-9">{config.description}</p>
                          <p className="text-[#6b6b7a] text-xs ml-9">
                            Category: {config.category}
                          </p>
                        </div>
                        {isDisabled && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="ml-4 flex items-start gap-2 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-xl px-4 py-2 backdrop-blur-xl"
                          >
                            <AlertCircle className="w-4 h-4 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                            <span className="text-[#fbbf24] text-sm">{disabledReason}</span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {formData.learning_goals.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-[#10b981]/10 border border-[#10b981]/20 rounded-2xl backdrop-blur-xl"
                >
                  <p className="text-[#34d399] text-sm">
                    {formData.learning_goals.length}{' '}
                    {formData.learning_goals.length === 1 ? 'goal' : 'goals'} selected
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-3xl p-8"
            >
              <h2 className="text-[#e8e8ee] text-2xl mb-2">Step 3: Constraints & Preferences</h2>
              <p className="text-[#a1a1b0] mb-8">
                Define geographical and travel preferences to optimize the circuit
              </p>

              <div className="space-y-8">
                <div>
                  <label className="block text-[#e8e8ee] mb-4">Geography (leave empty for all regions)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['North', 'South', 'East', 'West', 'Northeast', 'Islands'] as Region[]).map(region => (
                      <motion.button
                        key={region}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleRegion(region)}
                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm ${
                          formData.constraints.regions.includes(region)
                            ? 'border-[#8b5cf6] bg-[#8b5cf6]/10 text-[#8b5cf6]'
                            : 'border-white/10 text-[#a1a1b0] hover:border-white/20 bg-[#1c1c24]'
                        }`}
                      >
                        {region}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#e8e8ee] mb-4">Maximum Daily Travel</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[4, 6, 8].map(hours => (
                      <motion.button
                        key={hours}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            constraints: { ...formData.constraints, max_daily_travel_hours: hours }
                          })
                        }
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                          formData.constraints.max_daily_travel_hours === hours
                            ? 'border-[#8b5cf6] bg-[#8b5cf6]/10'
                            : 'border-white/10 bg-[#1c1c24] hover:border-white/20'
                        }`}
                      >
                        <span className="text-[#e8e8ee]">≤ {hours} hours</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#e8e8ee] mb-4">Preferred Travel Modes</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Train', 'Road', 'Flight'] as TravelMode[]).map(mode => (
                      <motion.button
                        key={mode}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTravelMode(mode)}
                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          formData.constraints.preferred_modes.includes(mode)
                            ? 'border-[#8b5cf6] bg-[#8b5cf6]/10 text-[#8b5cf6]'
                            : 'border-white/10 text-[#a1a1b0] hover:border-white/20 bg-[#1c1c24]'
                        }`}
                      >
                        {mode}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[#e8e8ee] mb-4">Academic Balance</label>
                  
                  <div className="mb-6 p-6 bg-[#1c1c24] rounded-2xl border border-white/10">
                    <div className="flex justify-between text-sm text-[#a1a1b0] mb-3">
                      <span>Urban</span>
                      <span>Rural</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.constraints.urban_rural_balance}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          constraints: {
                            ...formData.constraints,
                            urban_rural_balance: parseInt(e.target.value)
                          }
                        })
                      }
                      className="w-full h-2 bg-[#25252f] rounded-full appearance-none cursor-pointer accent-[#8b5cf6]"
                    />
                    <div className="flex justify-between text-xs text-[#6b6b7a] mt-2">
                      <span>Very Urban</span>
                      <span>Balanced</span>
                      <span>Very Rural</span>
                    </div>
                  </div>

                  <div className="p-6 bg-[#1c1c24] rounded-2xl border border-white/10">
                    <div className="flex justify-between text-sm text-[#a1a1b0] mb-3">
                      <span>Heritage</span>
                      <span>Contemporary</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.constraints.heritage_contemporary_balance}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          constraints: {
                            ...formData.constraints,
                            heritage_contemporary_balance: parseInt(e.target.value)
                          }
                        })
                      }
                      className="w-full h-2 bg-[#25252f] rounded-full appearance-none cursor-pointer accent-[#8b5cf6]"
                    />
                    <div className="flex justify-between text-xs text-[#6b6b7a] mt-2">
                      <span>Pure Heritage</span>
                      <span>Balanced</span>
                      <span>Contemporary</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={step === 1 ? onCancel : handleBack}
            className="px-8 py-4 bg-[#1c1c24] border border-white/10 rounded-2xl text-[#e8e8ee] hover:border-white/20 transition-all duration-300 flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            {step === 1 ? 'Cancel' : 'Back'}
          </motion.button>

          {step < 3 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="bg-gradient-to-r from-[#10b981] to-[#34d399] text-white px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300"
            >
              Generate Circuits
            </motion.button>
          )}
        </motion.div>
      </main>
    </div>
  );
}
