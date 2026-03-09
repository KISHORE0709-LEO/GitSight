import { motion } from "framer-motion";

interface FlowStep {
  label: string;
  icon?: string;
  description?: string;
}

export function FlowDiagram({ steps, title }: { steps: FlowStep[]; title?: string }) {
  return (
    <div className="space-y-2">
      {title && <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">{title}</h3>}
      <div className="space-y-0">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-3 py-2">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center text-xs font-mono text-primary font-bold">
                  {step.icon || (i + 1)}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-4 bg-primary/30" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{step.label}</p>
                {step.description && (
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
