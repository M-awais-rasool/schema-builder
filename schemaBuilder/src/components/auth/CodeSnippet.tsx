import { motion } from "motion/react";

interface CodeSnippetProps {
  lines: string[];
  className?: string;
  delay?: number;
}

export function CodeSnippet({ lines, className = "", }: CodeSnippetProps) {
  return (
    <motion.div
      className={`font-mono bg-background/60 backdrop-blur-sm border border-primary/20 rounded-lg p-3 shadow-lg ${className}`}
    >
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
      >
        {lines.map((line, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2 mb-1.5 last:mb-0"
          >
            <span className="text-primary/30 select-none">{index + 1}</span>
            <span className="text-primary/40">{line}</span>
          </motion.div>
        ))}
        <motion.div
          className="h-0.5 w-1 bg-primary/40 mt-1"
        />
      </motion.div>
    </motion.div>
  );
}
