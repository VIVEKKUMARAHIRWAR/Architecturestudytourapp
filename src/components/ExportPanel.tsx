import { useState } from 'react';
import { Circuit } from '../lib/types';
import { ExportUtils } from '../lib/exportUtils';
import { FileText, Users, Presentation, Link as LinkIcon, Download, Copy, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExportPanelProps {
  circuit: Circuit;
  onClose: () => void;
}

export function ExportPanel({ circuit, onClose }: ExportPanelProps) {
  const [shareLink, setShareLink] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleExportFacultyPDF = () => {
    const content = ExportUtils.generateFacultyPDF(circuit);
    ExportUtils.downloadTextFile(content, `${circuit.name}_Faculty_Brief.txt`);
  };

  const handleExportStudentBrief = () => {
    const content = ExportUtils.generateStudentBrief(circuit);
    ExportUtils.downloadTextFile(content, `${circuit.name}_Student_Brief.txt`);
  };

  const handleExportPPT = () => {
    const content = ExportUtils.generatePPTOutline(circuit);
    ExportUtils.downloadTextFile(content, `${circuit.name}_PPT_Outline.txt`);
  };

  const handleGenerateShareLink = () => {
    const link = ExportUtils.generateShareableLink(circuit.id);
    setShareLink(link);
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="sticky top-0 bg-[#16161d] border-b border-white/10 px-8 py-6 flex items-center justify-between backdrop-blur-xl">
            <h2 className="text-[#e8e8ee] text-2xl">Export Circuit</h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-[#a1a1b0] hover:text-[#e8e8ee] transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div>
              <h3 className="text-[#e8e8ee] text-xl mb-6">Export Formats</h3>
              <div className="grid grid-cols-1 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportFacultyPDF}
                  className="flex items-start gap-5 p-6 glass-hover rounded-2xl text-left group"
                >
                  <div className="bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#e8e8ee] mb-2">Faculty PDF</h4>
                    <p className="text-[#a1a1b0] text-sm">
                      Comprehensive planning document with circuit overview, learning outcomes,
                      day-wise academic plan, and evaluation mapping
                    </p>
                  </div>
                  <Download className="w-5 h-5 text-[#6b6b7a] group-hover:text-[#8b5cf6] flex-shrink-0 mt-1 transition-colors" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportStudentBrief}
                  className="flex items-start gap-5 p-6 glass-hover rounded-2xl text-left group"
                >
                  <div className="bg-gradient-to-br from-[#10b981] to-[#34d399] p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#e8e8ee] mb-2">Student Brief</h4>
                    <p className="text-[#a1a1b0] text-sm">
                      Student-facing document with what to observe, what to draw, daily expectations,
                      and documentation guidelines
                    </p>
                  </div>
                  <Download className="w-5 h-5 text-[#6b6b7a] group-hover:text-[#10b981] flex-shrink-0 mt-1 transition-colors" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportPPT}
                  className="flex items-start gap-5 p-6 glass-hover rounded-2xl text-left group"
                >
                  <div className="bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Presentation className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#e8e8ee] mb-2">PPT Outline</h4>
                    <p className="text-[#a1a1b0] text-sm">
                      Slide-ready structure for presentations with complete outline of circuit
                      overview, learnings, and activities
                    </p>
                  </div>
                  <Download className="w-5 h-5 text-[#6b6b7a] group-hover:text-[#fbbf24] flex-shrink-0 mt-1 transition-colors" />
                </motion.button>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h3 className="text-[#e8e8ee] text-xl mb-6">Share Circuit</h3>
              
              {!shareLink ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateShareLink}
                  className="w-full flex items-center justify-center gap-3 p-6 glass-hover rounded-2xl"
                >
                  <LinkIcon className="w-5 h-5 text-[#8b5cf6]" />
                  <span className="text-[#e8e8ee]">Generate Shareable Link</span>
                </motion.button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-5 bg-gradient-to-br from-[#10b981]/10 to-[#34d399]/10 border border-[#10b981]/30 rounded-2xl backdrop-blur-xl">
                    <p className="text-[#34d399] text-sm mb-3">Shareable link generated</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className="flex-1 px-4 py-3 bg-[#1c1c24] border border-[#10b981]/30 rounded-xl text-sm text-[#e8e8ee] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyLink}
                        className="px-5 py-3 bg-gradient-to-r from-[#10b981] to-[#34d399] text-white rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                  <p className="text-[#a1a1b0] text-sm">
                    This link provides view-only access to the circuit. Anyone with the link can view
                    the circuit details.
                  </p>
                </motion.div>
              )}
            </div>

            <div className="pt-8 border-t border-white/10">
              <div className="bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 border border-[#6366f1]/20 rounded-2xl p-6 backdrop-blur-xl">
                <h4 className="text-[#8b5cf6] mb-3">Export Notes</h4>
                <ul className="text-[#a1a1b0] text-sm space-y-2 list-disc list-inside">
                  <li>PDF exports are in text format for easy copying and formatting</li>
                  <li>All exports include complete academic justification and day-wise plans</li>
                  <li>PPT outline provides slide-by-slide structure for presentations</li>
                  <li>Shareable links remain active as long as the circuit exists</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-[#16161d] border-t border-white/10 px-8 py-6 backdrop-blur-xl">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full bg-[#1c1c24] text-[#e8e8ee] px-8 py-4 rounded-2xl hover:bg-[#25252f] border border-white/10 transition-all duration-300"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}