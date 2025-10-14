import { motion } from "motion/react";

interface CodeSnippetProps {
  lines: string[];
  className?: string;
  delay?: number;
}

export function CodeSnippet({ lines, className = "", delay = 0 }: CodeSnippetProps) {
  return (
    <motion.div
      className={`font-mono bg-background/60 backdrop-blur-sm border border-primary/20 rounded-lg p-3 shadow-lg ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.5,
        }}
      >
        {lines.map((line, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2 mb-1.5 last:mb-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay + index * 0.1 }}
          >
            <span className="text-primary/30 select-none">{index + 1}</span>
            <span className="text-primary/40">{line}</span>
          </motion.div>
        ))}
        <motion.div
          className="h-0.5 w-1 bg-primary/40 mt-1"
          animate={{
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
