/*
 * Engine: Candidate Management System (CMS)
 * Engineer: Eklavya 
 * Domain: Internal Tools & Tracking
 * Stack: React 18, Tailwind CSS, Client-Side Storage
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  base64Image: string | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, base64Image, onClose }) => {
  useEffect(() => {
    const bindEscapeKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', bindEscapeKeydown);
    return () => window.removeEventListener('keydown', bindEscapeKeydown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && base64Image && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl pointer-events-auto flex flex-col"
            >
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors backdrop-blur-md"
              >
                <X size={24} />
              </button>
              <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative shadow-[0_0_50px_rgba(37,99,235,0.1)]">
                <div className="p-3 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
                   <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest text-left">
                     Proof of Work Verification
                   </span>
                   <span className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">
                     Verified
                   </span>
                </div>
                <div className="p-2 backdrop-blur-xl bg-white/[0.01]">
                  <img 
                    src={base64Image} 
                    alt="Expanded Proof" 
                    className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
