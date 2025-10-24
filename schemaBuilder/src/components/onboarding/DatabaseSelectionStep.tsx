import React from 'react';
import { motion } from 'framer-motion';
import { Database, Zap, ArrowLeft, CheckCircle, Clock } from 'lucide-react';

interface DatabaseSelectionStepProps {
  onSelect: (databaseType: 'mysql' | 'graphql') => void;
  onBack: () => void;
  isCreating?: boolean;
}

export const DatabaseSelectionStep: React.FC<DatabaseSelectionStepProps> = ({ 
  onSelect, 
  onBack,
  isCreating = false
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl mb-4 shadow-md"
        >
          <Database className="w-6 h-6 text-white" />
        </motion.div>
        
        <motion.h2
          variants={itemVariants}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Choose Your Database
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-gray-600 text-sm"
        >
          Select the database technology for your project
        </motion.p>
      </div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <motion.div
          variants={cardVariants}
          whileHover={!isCreating ? { 
            scale: 1.02,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
          } : {}}
          whileTap={!isCreating ? { scale: 0.98 } : {}}
          onClick={() => !isCreating && onSelect('mysql')}
          className={`relative bg-white p-6 rounded-xl border-2 border-gray-200 transition-all duration-200 group ${
            isCreating ? 'cursor-wait opacity-60' : 'cursor-pointer hover:border-gray-400'
          }`}
        >
          {isCreating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-700 font-medium">Creating...</span>
              </div>
            </div>
          )}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-black rounded-lg flex items-center justify-center shadow-md">
              <Database className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">MySQL</h3>
            <p className="text-gray-600 text-sm mb-4">
              Robust relational database with full SQL support
            </p>
            
            <div className="space-y-1 mb-4 text-xs">
              <div className="flex items-center justify-center text-gray-600">
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                ACID Compliance
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                Full SQL Support
              </div>
            </div>
            
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 border border-green-200">
              <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
              <span className="text-xs font-medium text-green-800">Ready</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          className={`bg-gray-50 p-6 rounded-xl border-2 border-gray-200 cursor-not-allowed relative ${
            isCreating ? 'opacity-30' : 'opacity-60'
          }`}
          title="GraphQL support is coming soon"
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-400 rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="text-lg font-bold text-gray-600 mb-2">GraphQL</h3>
            <p className="text-gray-500 text-sm mb-4">
              Modern query language for flexible data fetching
            </p>
            
            <div className="space-y-1 mb-4 text-xs">
              <div className="flex items-center justify-center text-gray-500">
                <Clock className="w-3 h-3 text-gray-400 mr-1" />
                Flexible Queries
              </div>
              <div className="flex items-center justify-center text-gray-500">
                <Clock className="w-3 h-3 text-gray-400 mr-1" />
                Real-time Updates
              </div>
            </div>
            
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 border border-orange-200">
              <Clock className="w-3 h-3 text-orange-600 mr-1" />
              <span className="text-xs font-medium text-orange-800">Coming Soon</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-between pt-6 border-t border-gray-200"
      >
        <motion.button
          whileHover={!isCreating ? { scale: 1.02 } : {}}
          whileTap={!isCreating ? { scale: 0.98 } : {}}
          onClick={() => !isCreating && onBack()}
          disabled={isCreating}
          className={`flex items-center px-4 py-2 transition-colors group ${
            isCreating 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back
        </motion.button>
        
        <div className="text-sm text-gray-500 font-medium">
          Step 2 of 2
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-center mt-6"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-6 h-0.5 bg-gray-300 rounded-full"></div>
          <motion.div 
            className="w-2 h-2 bg-black rounded-full"
            animate={{ 
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DatabaseSelectionStep;