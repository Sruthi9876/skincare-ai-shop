"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "How does your skin feel a few hours after cleansing?",
    options: [
      { text: "Tight and flaky", type: "Dry" },
      { text: "Shiny and greasy all over", type: "Oily" },
      { text: "Oily in the T-zone, dry on cheeks", type: "Combination" },
      { text: "Itchy or red", type: "Sensitive" },
    ],
  },
  {
    id: 2,
    question: "How would you describe your pores?",
    options: [
      { text: "Almost invisible", type: "Dry" },
      { text: "Large and visible all over", type: "Oily" },
      { text: "Only visible on nose and forehead", type: "Combination" },
      { text: "Pores are fine, but skin is reactive", type: "Sensitive" },
    ],
  },
  {
    id: 3,
    question: "How does your skin react to new products?",
    options: [
      { text: "Usually fine, but feels dry", type: "Dry" },
      { text: "Tends to get more oily", type: "Oily" },
      { text: "Depends on the area of the face", type: "Combination" },
      { text: "Often stings or turns red", type: "Sensitive" },
    ],
  },
];

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ Dry: 0, Oily: 0, Combination: 0, Sensitive: 0 });
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (type: string) => {
  setScores((prev) => ({ ...prev, [type]: (prev as any)[type] + 1 }));
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate the winner (the skin type with most points)
      const winner = Object.keys(scores).reduce((a, b) => 
        (scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b)
      );
      setResult(winner);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-6 py-20">
        {!result ? (
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-emerald-100">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Skin Analysis — Step {currentStep + 1} of {questions.length}
              </span>
              <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 leading-tight">
                  {questions[currentStep].question}
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  {questions[currentStep].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option.type)}
                      className="text-left p-4 rounded-xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group flex justify-between items-center"
                    >
                      <span className="text-gray-700 group-hover:text-emerald-700 font-medium">{option.text}</span>
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-500" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-3xl shadow-2xl border border-emerald-100 text-center"
          >
            <div className="inline-block p-4 bg-emerald-100 rounded-full text-emerald-600 mb-6">
              <Sparkles size={40} />
            </div>
            <h2 className="text-3xl font-bold text-emerald-950 mb-2">Analysis Complete!</h2>
            <p className="text-gray-600 mb-4">Based on your answers, your skin type is:</p>
            <div className="text-5xl font-black text-emerald-600 mb la-10 uppercase tracking-tighter">
              {result}
            </div>
            <p className="text-slate-500 mb-10 leading-relaxed">
              We've found the perfect products for {result.toLowerCase()} skin. 
              Let our AI consultant build your routine.
            </p>
            <Link 
              href="/" 
              className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 inline-block"
            >
              Consult with AI Now
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}