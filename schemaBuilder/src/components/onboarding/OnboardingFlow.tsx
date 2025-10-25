import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectInfoStep } from './ProjectInfoStep';
import { DatabaseSelectionStep } from './DatabaseSelectionStep';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../ui/Toast';
import { schemaApi } from '../../services/api';
import { Waves } from '../animations/waves-background';

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
        <div className="absolute inset-0 z-0">
          <Waves
            lineColor={"rgba(0, 0, 0, 0.08)"}
            backgroundColor="transparent"
            waveSpeedX={0.015}
            waveSpeedY={0.008}
            waveAmpX={30}
            waveAmpY={15}
            friction={0.92}
            tension={0.008}
            maxCursorMove={100}
            xGap={14}
            yGap={40}
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent"></div>
            <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-background/80 to-transparent"></div>
            <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-background/80 to-transparent"></div>
          </div>
        </div>
        <div className="w-full max-w-md relative z-10">
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