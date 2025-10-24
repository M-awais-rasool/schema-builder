import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectInfoStep } from './ProjectInfoStep';
import { DatabaseSelectionStep } from './DatabaseSelectionStep';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../ui/Toast';
import { schemaApi } from '../../services/api';

export interface ProjectInfo {
  name: string;
  description: string;
  isPublic: boolean;
}

interface OnboardingFlowProps {
  onComplete: (projectInfo: ProjectInfo, databaseType: 'mysql' | 'graphql', schemaId?: string) => void;
  initialProjectInfo?: ProjectInfo;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ 
  onComplete, 
  initialProjectInfo 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(
    initialProjectInfo || { name: '', description: '', isPublic: false }
  );

  const [isCreating, setIsCreating] = useState(false);
  const { toasts, removeToast, success, error, info } = useToast();

  const handleProjectInfoNext = (info: ProjectInfo) => {
    setProjectInfo(info);
    setCurrentStep(2);
  };

  const handleDatabaseSelection = async (databaseType: 'mysql' | 'graphql') => {
    if (databaseType === 'graphql') {
      error('Coming Soon', 'GraphQL support is currently under development. Please select MySQL for now.');
      return;
    }
    
    try {
      setIsCreating(true);
      info('Creating Schema', 'Setting up your new database schema...');
      
      const schemaData = {
        name: projectInfo.name,
        description: projectInfo.description,
        database_type: databaseType,
        is_public: projectInfo.isPublic,
        tables: [], 
        relationships: []
      };
      
      const createdSchema = await schemaApi.create(schemaData);
      success('Schema Created!', `${projectInfo.name} has been successfully created and is ready to use.`);
      setTimeout(() => {
        onComplete(projectInfo, databaseType, createdSchema.data.id);
      }, 1500);
      
    } catch (err: any) {
      error('Creation Failed', err.response?.data?.message || 'Failed to create schema. Please try again.');
      setIsCreating(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !isCreating) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="project-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <ProjectInfoStep
                  initialData={projectInfo}
                  onNext={handleProjectInfoNext}
                />
              </motion.div>
            )}
            
            {currentStep === 2 && (
              <motion.div
                key="database-selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <DatabaseSelectionStep
                  onSelect={handleDatabaseSelection}
                  onBack={handleBack}
                  isCreating={isCreating}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};