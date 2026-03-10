import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface FlowStep {
  label: string;
  icon?: string;
  description?: string;
}

export function FlowDiagram({ steps, title }: { steps: FlowStep[]; title?: string }) {
  return (
    <div className="space-y-3">
      {title && (
        <h3 className="text-xs font-mono text-primary uppercase tracking-widest font-bold mb-6">{title}</h3>
      )}
      <div className="space-y-0">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-start gap-4 group">
              <div className="flex flex-col items-center">
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-xs font-mono text-primary font-bold group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                  {step.icon || (i + 1)}
                </div>
                {i < steps.length - 1 && (
                  <div className="flex flex-col items-center py-1">
                    <div className="w-px h-3 bg-gradient-to-b from-primary/40 to-primary/10" />
                    <ArrowDown className="h-3 w-3 text-primary/30" />
                    <div className="w-px h-3 bg-gradient-to-b from-primary/10 to-transparent" />
                  </div>
                )}
              </div>
              <div className="pt-1.5">
                <p className="text-sm font-semibold text-foreground leading-tight">{step.label}</p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
