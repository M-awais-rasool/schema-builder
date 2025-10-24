import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, ArrowRight, User, Calendar, Lock, Globe } from 'lucide-react';
import type { ProjectInfo } from './OnboardingFlow';

interface ProjectInfoStepProps {
  initialData: ProjectInfo;
  onNext: (data: ProjectInfo) => void;
}

export const ProjectInfoStep: React.FC<ProjectInfoStepProps> = ({ 
  initialData, 
  onNext 
}) => {
  const [projectName, setProjectName] = useState(initialData.name);
  const [projectDescription, setProjectDescription] = useState(initialData.description);
  const [isPublic, setIsPublic] = useState(initialData.isPublic || false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};
    
    if (!projectName.trim()) {
      newErrors.name = 'Project name is required';
    } else if (projectName.trim().length < 2) {
      newErrors.name = 'Project name must be at least 2 characters';
    }
    
    if (!projectDescription.trim()) {
      newErrors.description = 'Project description is required';
    } else if (projectDescription.trim().length < 10) {
      newErrors.description = 'Project description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext({
        name: projectName.trim(),
        description: projectDescription.trim(),
        isPublic: isPublic
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleNext();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.3
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const title = "Let's start with your project";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 max-w-md mx-auto"
    >
      {/* Header Section */}
      <div className="text-center mb-8">
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl mb-4 shadow-md"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
        
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          {title.split('').map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>
        
        <motion.p
          variants={itemVariants}
          className="text-gray-600 text-sm"
        >
          Tell us about your database project
        </motion.p>
      </div>

      <motion.div variants={itemVariants} className="space-y-6" onKeyDown={handleKeyPress}>
        <div className="relative">
          <motion.div 
            className="flex items-center mb-2"
            whileHover={{ x: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FileText className="w-4 h-4 text-gray-600 mr-2" />
            <label htmlFor="projectName" className="text-sm font-medium text-gray-700">
              Project Name *
            </label>
          </motion.div>
          
          <div className="relative">
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 text-sm placeholder-gray-400 ${
                errors.name 
                  ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-500' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              placeholder="Enter project name"
              maxLength={50}
              autoFocus
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {projectName.length}/50
            </div>
          </div>
          
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs mt-1"
            >
              {errors.name}
            </motion.p>
          )}
        </div>

        <div className="relative">
          <motion.div 
            className="flex items-center mb-2"
            whileHover={{ x: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <User className="w-4 h-4 text-gray-600 mr-2" />
            <label htmlFor="projectDescription" className="text-sm font-medium text-gray-700">
              Project Description *
            </label>
          </motion.div>
          
          <div className="relative">
            <textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 resize-none text-sm placeholder-gray-400 ${
                errors.description 
                  ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-500' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              placeholder="Describe your database project..."
              rows={3}
              maxLength={200}
            />
            <div className="absolute right-3 bottom-2 text-xs text-gray-400">
              {projectDescription.length}/200
            </div>
          </div>
          
          {errors.description && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs mt-1"
            >
              {errors.description}
            </motion.p>
          )}
        </div>

        <div className="relative">
          <motion.div 
            className="flex items-center mb-3"
            whileHover={{ x: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Globe className="w-4 h-4 text-gray-600 mr-2" />
            <label className="text-sm font-medium text-gray-700">
              Visibility
            </label>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <motion.label 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                name="visibility"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center transition-all duration-200 ${
                !isPublic 
                  ? 'border-black bg-black' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}>
                {!isPublic && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <div className="flex items-center">
                <Lock className="w-3 h-3 text-gray-600 mr-1" />
                <span className="text-sm text-gray-700">Private</span>
              </div>
            </motion.label>

            <motion.label 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                name="visibility"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center transition-all duration-200 ${
                isPublic 
                  ? 'border-black bg-black' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}>
                {isPublic && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <div className="flex items-center">
                <Globe className="w-3 h-3 text-gray-600 mr-1" />
                <span className="text-sm text-gray-700">Public</span>
              </div>
            </motion.label>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            {isPublic 
              ? 'Anyone can view and discover your schema' 
              : 'Only you can access this schema'
            }
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200"
      >
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          Step 1 of 2
        </div>
        
        <motion.button
          onClick={handleNext}
          whileHover={{ scale: projectName.trim() && projectDescription.trim() ? 1.02 : 1 }}
          whileTap={{ scale: 0.98 }}
          disabled={!projectName.trim() || !projectDescription.trim()}
          className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            projectName.trim() && projectDescription.trim()
              ? 'bg-black text-white hover:bg-gray-800 shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span className="flex items-center">
            Continue
            <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </motion.button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-center mt-6"
      >
        <div className="flex items-center space-x-2">
          <motion.div 
            className="w-2 h-2 bg-black rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="w-6 h-0.5 bg-gray-200 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};