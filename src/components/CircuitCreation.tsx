import React, { useState } from 'react';
import { CircuitFormData, AcademicYear, Semester, LearningGoal, Region, TravelMode } from '../types';
import { StepOne } from './creation-steps/StepOne';
import { StepTwo } from './creation-steps/StepTwo';
import { StepThree } from './creation-steps/StepThree';
import { Button } from './Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CircuitCreationProps {
  onCancel: () => void;
  onGenerate: (formData: CircuitFormData) => void;
}

export function CircuitCreation({ onCancel, onGenerate }: CircuitCreationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CircuitFormData>({
    academic_year: null,
    semester: null,
    duration: 5,
    starting_city: '',
    learning_goals: [],
    constraints: {
      regions: [],
      max_daily_travel_hours: 6,
      preferred_modes: [],
      urban_rural_preference: 3,
      heritage_contemporary_preference: 3
    }
  });
  
  const updateFormData = (updates: Partial<CircuitFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };
  
  const updateConstraints = (constraintUpdates: Partial<CircuitFormData['constraints']>) => {
    setFormData(prev => ({
      ...prev,
      constraints: { ...prev.constraints, ...constraintUpdates }
    }));
  };
  
  const canProceedFromStep1 = formData.academic_year !== null;
  const canProceedFromStep2 = formData.learning_goals.length > 0;
  const canGenerate = canProceedFromStep1 && canProceedFromStep2;
  
  const handleNext = () => {
    if (currentStep === 1 && canProceedFromStep1) {
      setCurrentStep(2);
    } else if (currentStep === 2 && canProceedFromStep2) {
      setCurrentStep(3);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleGenerate = () => {
    if (canGenerate) {
      onGenerate(formData);
    }
  };
  
  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1>Create New Circuit</h1>
          <p className="meta-text mt-2">
            Define your academic requirements and constraints to generate optimal study tour circuits
          </p>
        </div>
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map(step => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                      currentStep === step
                        ? 'border-[var(--color-ink-blue)] bg-[var(--color-ink-blue)] text-white'
                        : currentStep > step
                        ? 'border-[var(--color-moss-green)] bg-[var(--color-moss-green)] text-white'
                        : 'border-[var(--color-slate-lighter)] text-[var(--color-slate-light)]'
                    }`}
                  >
                    {step}
                  </div>
                  <span className={`label-text ${currentStep >= step ? 'text-[var(--color-ink-blue)]' : 'text-[var(--color-slate-light)]'}`}>
                    {step === 1 ? 'Academic Year' : step === 2 ? 'Learning Goals' : 'Constraints'}
                  </span>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-0.5 ${currentStep > step ? 'bg-[var(--color-moss-green)]' : 'bg-[var(--color-slate-lighter)]'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Step Content */}
        <div className="bg-white rounded-lg border border-[var(--color-slate-lighter)] shadow-sm p-8 mb-6">
          {currentStep === 1 && (
            <StepOne
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          
          {currentStep === 2 && (
            <StepTwo
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          
          {currentStep === 3 && (
            <StepThree
              formData={formData}
              updateConstraints={updateConstraints}
            />
          )}
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={currentStep === 1 ? onCancel : handleBack}>
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </div>
          </Button>
          
          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !canProceedFromStep1) ||
                (currentStep === 2 && !canProceedFromStep2)
              }
            >
              <div className="flex items-center gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>
          ) : (
            <Button onClick={handleGenerate} disabled={!canGenerate}>
              Generate Circuits
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
