import { Circuit } from '../lib/types';
import { CITIES } from '../lib/data';
import { ChevronLeft, Edit, Download, Share2, MapPin, Clock, Award, ArrowRight, Train, Plane, Car, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

interface CircuitDetailProps {
  circuit: Circuit;
  onBack: () => void;
  onCustomize: () => void;
  onExport: () => void;
  onShare: () => void;
}

export function CircuitDetail({ circuit, onBack, onCustomize, onExport, onShare }: CircuitDetailProps) {
  const cities = circuit.cities.map(id => CITIES.find(c => c.id === id)).filter(Boolean);

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
            className="text-[#a1a1b0] hover:text-[#e8e8ee] mb-4 flex items-center gap-2 transition-colors duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </motion.button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="gradient-text text-3xl mb-2">{circuit.name}</h1>
              <p className="text-[#a1a1b0]">
                Year {circuit.academic_year} · {circuit.duration} days · {circuit.cities.length}{' '}
                cities
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCustomize}
                className="px-5 py-3 bg-[#1c1c24] border border-white/10 rounded-xl text-[#e8e8ee] hover:border-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Customize
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExport}
                className="px-5 py-3 bg-[#1c1c24] border border-white/10 rounded-xl text-[#e8e8ee] hover:border-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShare}
                className="px-5 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-2 glass rounded-3xl p-8"
          >
            <h2 className="text-[#e8e8ee] text-2xl mb-6">Overview</h2>
            
            <div className="mb-8">
              <h3 className="text-[#e8e8ee] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#8b5cf6]" />
                Circuit Route
              </h3>
              <div className="bg-[#1c1c24] rounded-2xl p-6 border border-white/5">
                <div className="flex flex-col gap-4">
                  {cities.map((city, idx) => (
                    <motion.div
                      key={city?.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-[#e8e8ee]">{city?.city}</div>
                        <div className="text-[#a1a1b0] text-sm">{city?.state}</div>
                      </div>
                      {idx < cities.length - 1 && (
                        <div className="text-[#6b6b7a] text-2xl">→</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-2xl border border-[#8b5cf6]/20 backdrop-blur-xl">
              <h3 className="text-[#e8e8ee] mb-3">Academic Justification</h3>
              <p className="text-[#a1a1b0] leading-relaxed">
                {circuit.academic_justification}
              </p>
            </div>

            <div>
              <h3 className="text-[#e8e8ee] mb-4">Learning Goals</h3>
              <div className="flex flex-wrap gap-3">
                {circuit.learning_goals.map(goal => (
                  <motion.span
                    key={goal}
                    whileHover={{ scale: 1.05 }}
                    className="bg-[#10b981]/10 text-[#34d399] px-4 py-2 rounded-xl border border-[#10b981]/30 backdrop-blur-xl"
                  >
                    {goal}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-8"
          >
            <h2 className="text-[#e8e8ee] text-2xl mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#8b5cf6]" />
              Metrics
            </h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 rounded-2xl border border-[#8b5cf6]/30 backdrop-blur-xl">
                <div className="text-[#8b5cf6] text-5xl font-bold mb-2">{circuit.score.total}</div>
                <div className="text-[#a1a1b0] text-sm">Overall Academic Score</div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Academic Match', value: circuit.score.academic_match, color: '#10b981' },
                  { label: 'Travel Efficiency', value: circuit.score.travel_efficiency, color: '#6366f1' },
                  { label: 'Pedagogical Flow', value: circuit.score.pedagogical_progression, color: '#8b5cf6' },
                  { label: 'Preference Match', value: circuit.score.user_preference, color: '#f59e0b' }
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#a1a1b0]">{metric.label}</span>
                      <span className="text-[#e8e8ee] font-semibold">{metric.value}/100</span>
                    </div>
                    <div className="w-full bg-[#25252f] rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: metric.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-[#e8e8ee] mb-4">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#a1a1b0]">Duration</span>
                  <span className="text-[#e8e8ee]">{circuit.duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a1a1b0]">Cities</span>
                  <span className="text-[#e8e8ee]">{circuit.cities.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a1a1b0]">Status</span>
                  <span className={`px-3 py-1 rounded-xl text-xs ${
                    circuit.status === 'Approved'
                      ? 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30'
                      : circuit.status === 'Exported'
                      ? 'bg-[#6366f1]/20 text-[#8b5cf6] border border-[#6366f1]/30'
                      : 'bg-[#6b6b7a]/20 text-[#a1a1b0] border border-[#6b6b7a]/30'
                  }`}>
                    {circuit.status}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-8"
        >
          <h2 className="text-[#e8e8ee] text-2xl mb-8 flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#8b5cf6]" />
            Day-wise Academic Plan
          </h2>

          <div className="space-y-6">
            {circuit.day_plan.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="border-l-4 border-[#8b5cf6] pl-6 py-4"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[#e8e8ee] text-xl">Day {day.day}</h3>
                      <div className="flex items-center gap-2 text-[#a1a1b0]">
                        <MapPin className="w-4 h-4" />
                        <span>{day.city}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {day.learning_focus.map(focus => (
                        <span
                          key={focus}
                          className="bg-[#6b6b7a]/20 text-[#a1a1b0] px-3 py-1 rounded-lg text-xs border border-[#6b6b7a]/30"
                        >
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-[#f59e0b]/10 to-[#fbbf24]/10 border border-[#f59e0b]/20 rounded-2xl p-5 backdrop-blur-xl">
                    <h4 className="text-[#fbbf24] mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Morning (9:00 AM - 12:30 PM)
                    </h4>
                    {day.morning_site && (
                      <div className="mb-3 inline-flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                        <Building2 className="w-3 h-3 text-[#f59e0b]" />
                        <span className="text-[#e8e8ee] text-sm font-medium">{day.morning_site}</span>
                      </div>
                    )}
                    <p className="text-[#a1a1b0]">{day.morning}</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 border border-[#6366f1]/20 rounded-2xl p-5 backdrop-blur-xl">
                    <h4 className="text-[#8b5cf6] mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Afternoon (2:00 PM - 5:30 PM)
                    </h4>
                    {day.afternoon_site && (
                      <div className="mb-3 inline-flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                        <Building2 className="w-3 h-3 text-[#8b5cf6]" />
                        <span className="text-[#e8e8ee] text-sm font-medium">{day.afternoon_site}</span>
                      </div>
                    )}
                    <p className="text-[#a1a1b0]">{day.afternoon}</p>
                  </div>

                  {day.travel ? (
                    <div className="bg-gradient-to-br from-[#10b981]/10 to-[#34d399]/10 border border-[#10b981]/20 rounded-2xl p-5 backdrop-blur-xl">
                      <h4 className="text-[#34d399] mb-4 flex items-center gap-2">
                        {day.travel.mode === 'Flight' ? <Plane className="w-4 h-4" /> : 
                         day.travel.mode === 'Train' ? <Train className="w-4 h-4" /> : 
                         <Car className="w-4 h-4" />}
                        Travel to {day.travel.to}
                      </h4>
                      <div className="flex flex-wrap items-center gap-6 text-[#e8e8ee]">
                        <div className="flex flex-col">
                          <span className="text-[#a1a1b0] text-[10px] uppercase tracking-wider mb-1">From</span>
                          <span className="font-medium">{day.travel.from}</span>
                        </div>
                        <ArrowRight className="text-[#10b981] w-4 h-4" />
                        <div className="flex flex-col">
                          <span className="text-[#a1a1b0] text-[10px] uppercase tracking-wider mb-1">To</span>
                          <span className="font-medium">{day.travel.to}</span>
                        </div>
                        <div className="w-px h-8 bg-white/10 mx-2 hidden sm:block" />
                        <div className="flex flex-col">
                          <span className="text-[#a1a1b0] text-[10px] uppercase tracking-wider mb-1">Duration</span>
                          <span className="font-medium">{day.travel.duration}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#a1a1b0] text-[10px] uppercase tracking-wider mb-1">Distance</span>
                          <span className="font-medium">{day.travel.distance}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-[#8b5cf6]/10 to-[#a78bfa]/10 border border-[#8b5cf6]/20 rounded-2xl p-5 backdrop-blur-xl">
                      <h4 className="text-[#a78bfa] mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Evening (6:00 PM - 8:00 PM)
                      </h4>
                      <p className="text-[#a1a1b0]">{day.evening}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
