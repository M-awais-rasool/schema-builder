import { motion } from "motion/react";
import { CodeSnippet } from "./CodeSnippet";

export function DatabaseGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 70%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="hidden xl:block absolute top-16 left-[5%]">
        <CodeSnippet
          lines={[
            "CREATE TABLE users (",
            "  id SERIAL PRIMARY KEY,",
            "  email VARCHAR(255)",
          ]}
          delay={0.5}
        />
      </div>

      <motion.div 
        className="hidden xl:block absolute top-64 left-[6%] w-52 h-36 border-2 border-primary/20 rounded-xl backdrop-blur-sm bg-background/50 shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 0.5,
        }}
      >
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="h-10 bg-gradient-to-r from-primary/10 to-primary/5 border-b-2 border-primary/20 flex items-center px-4">
            <motion.div 
              className="w-3 h-3 rounded-full bg-primary/40 mr-2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="h-2 w-20 bg-primary/30 rounded" />
          </div>
          <div className="p-4 space-y-2.5">
            <div className="h-2 w-full bg-muted/50 rounded" />
            <div className="h-2 w-3/4 bg-muted/50 rounded" />
            <div className="h-2 w-5/6 bg-muted/50 rounded" />
          </div>
        </motion.div>
      </motion.div>

      <div className="hidden xl:block absolute top-[45%] right-[15%]">
        <CodeSnippet
          lines={[
            "SELECT * FROM orders",
            "WHERE user_id = $1",
            "ORDER BY created_at",
          ]}
          delay={0.7}
        />
      </div>

      <motion.div 
        className="hidden xl:block absolute bottom-24 right-[6%] w-52 h-36 border-2 border-primary/20 rounded-xl backdrop-blur-sm bg-background/50 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 0.7,
        }}
      >
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <div className="h-10 bg-gradient-to-r from-primary/10 to-primary/5 border-b-2 border-primary/20 flex items-center px-4">
            <motion.div 
              className="w-3 h-3 rounded-full bg-primary/40 mr-2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <div className="h-2 w-24 bg-primary/30 rounded" />
          </div>
          <div className="p-4 space-y-2.5">
            <div className="h-2 w-full bg-muted/50 rounded" />
            <div className="h-2 w-4/5 bg-muted/50 rounded" />
            <div className="h-2 w-2/3 bg-muted/50 rounded" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="hidden xl:block absolute top-32 right-[6%] w-48 h-36 border-2 border-primary/20 rounded-xl backdrop-blur-sm bg-background/50 shadow-xl"
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: 1, 
          x: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 0.6,
        }}
      >
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8
          }}
        >
          <div className="h-10 bg-gradient-to-r from-primary/10 to-primary/5 border-b-2 border-primary/20 flex items-center px-4">
            <motion.div 
              className="w-3 h-3 rounded-full bg-primary/40 mr-2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8
              }}
            />
            <div className="h-2 w-20 bg-primary/30 rounded" />
          </div>
          <div className="p-4 space-y-2.5">
            <div className="h-2 w-full bg-muted/50 rounded" />
            <div className="h-2 w-3/4 bg-muted/50 rounded" />
            <div className="h-2 w-5/6 bg-muted/50 rounded" />
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="hidden xl:block absolute top-[60%] left-[10%] w-44 h-32 border-2 border-primary/20 rounded-xl backdrop-blur-sm bg-background/50 shadow-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
        }}
        transition={{
          duration: 0.8,
          delay: 0.9,
        }}
      >
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <div className="h-9 bg-gradient-to-r from-primary/10 to-primary/5 border-b-2 border-primary/20 flex items-center px-3">
            <motion.div 
              className="w-2.5 h-2.5 rounded-full bg-primary/40 mr-2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <div className="h-1.5 w-16 bg-primary/30 rounded" />
          </div>
          <div className="p-3 space-y-2">
            <div className="h-1.5 w-full bg-muted/50 rounded" />
            <div className="h-1.5 w-3/5 bg-muted/50 rounded" />
            <div className="h-1.5 w-4/5 bg-muted/50 rounded" />
          </div>
        </motion.div>
      </motion.div>

      <svg
        className="hidden xl:block absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              className="fill-primary/30"
            />
          </marker>
        </defs>
        
        <motion.path
          d="M 10% 35%, Q 25% 50%, 85% 70%"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary/20"
          markerEnd="url(#arrowhead)"
          strokeDasharray="8,8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 2, delay: 1 },
            opacity: { duration: 0.5, delay: 1 }
          }}
        />
        
        <motion.path
          d="M 90% 45%, Q 70% 55%, 85% 85%"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary/20"
          markerEnd="url(#arrowhead)"
          strokeDasharray="8,8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 2, delay: 1.3 },
            opacity: { duration: 0.5, delay: 1.3 }
          }}
        />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03]" />
      
      <motion.div 
        className="absolute inset-0 opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5 }}
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.1) 100%)",
        }}
      />
    </div>
  );
}
