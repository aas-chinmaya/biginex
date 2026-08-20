"use client";

import { cn } from "@/components/ui/utils";
import { WizardStep } from "../hooks/useBusinessSetup";
import { Check, ChevronRight } from "lucide-react";

interface Props {
  steps: WizardStep[];
  stepIndex: number;
  onStepClick: (index: number) => void;
}

export default function StepIndicator({
  steps,
  stepIndex,
  onStepClick,
}: Props) {
  const activeStep = steps[stepIndex] ?? steps[0];

  const progress =
    steps.length > 1
      ? Math.round((stepIndex / (steps.length - 1)) * 100)
      : 100;

  return (
    <header className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-4 sm:p-5">
        {/* Top section */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Current step */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-primary text-sm font-bold text-primary">
              {stepIndex + 1}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Business Setup
                </span>

                <span className="text-xs text-slate-300">
                  /
                </span>

                <span className="text-xs font-medium text-primary">
                  {progress}% complete
                </span>
              </div>

              <h1 className="mt-1 text-2xl xl:text-3xl font-bold text-black">
                {activeStep.title}
              </h1>

              <p className="mt-0.5 text-md text-slate-500">
                {activeStep.description}
              </p>
            </div>
          </div>

          {/* Progress information */}
          <div className="flex items-center gap-4 lg:min-w-[220px] lg:justify-end">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-400">
                Current step
              </p>

              <p className="text-sm font-semibold text-black">
                {stepIndex + 1} / {steps.length}
              </p>
            </div>

            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Step navigation */}
        <div className="mt-6 border-t border-slate-100 pt-5">
  <nav
    aria-label="Business setup progress"
    className="w-full overflow-x-auto"
  >
    <ol
      className={cn(
        "flex items-center w-full min-w-max",
        "lg:min-w-0"
      )}
    >
      {steps.map((step, index) => {
        const completed = index < stepIndex;
        const active = index === stepIndex;
        const reachable = index <= stepIndex;
        const last = index === steps.length - 1;

        return (
          <li
            key={step.key}
            className={cn(
              "flex items-center",
              !last && "flex-1"
            )}
          >
            {/* Step */}
            <button
              type="button"
              disabled={!reachable}
              onClick={() => onStepClick(index)}
              aria-current={active ? "step" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-2 py-2",
                "text-sm transition-colors duration-200",
                "sm:px-3",

                active && "bg-primary text-white",

                completed &&
                  !active &&
                  "text-black hover:bg-slate-100",

                !active &&
                  !completed &&
                  "text-slate-400",

                reachable &&
                  !active &&
                  "cursor-pointer",

                !reachable &&
                  "cursor-not-allowed"
              )}
            >
              {/* Number / Check */}
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center",
                  "rounded-full text-[11px] font-semibold",
                  "transition-colors duration-200",

                  active &&
                    "bg-white text-primary",

                  completed &&
                    !active &&
                    "bg-primary text-white",

                  !active &&
                    !completed &&
                    "border border-slate-300 bg-white text-slate-400"
                )}
              >
                {completed ? (
                  <Check
                    className="h-3.5 w-3.5"
                    strokeWidth={2.5}
                  />
                ) : (
                  index + 1
                )}
              </span>

              {/* Title */}
              <span className="whitespace-nowrap font-medium">
                {step.title}
              </span>
            </button>

            {/* Equal connector */}
            {!last && (
              <div className="flex flex-1 items-center px-2 sm:px-3">
                <div className="relative flex w-full items-center">
                  {/* Line */}
                  <div
                    className={cn(
                      "h-px w-full transition-colors duration-300",
                      completed
                        ? "bg-primary"
                        : "bg-slate-200"
                    )}
                  />

                  {/* Arrow */}
                  <span
                    className={cn(
                      "absolute right-0 translate-x-1/2",
                      completed
                        ? "text-primary"
                        : "text-slate-300"
                    )}
                  >
                    <ChevronRight
                      className="h-4 w-4"
                      strokeWidth={1.5}
                    />
                  </span>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
</div>
      </div>
    </header>
  );
}






// "use client";

// import { Check, ChevronRight } from "lucide-react";
// import { cn } from "@/components/ui/utils";
// import { WizardStep } from "../hooks/useBusinessSetup";

// interface Props {
//   steps: WizardStep[];
//   stepIndex: number;
//   onStepClick: (index: number) => void;
// }

// export default function StepIndicator({
//   steps,
//   stepIndex,
//   onStepClick,
// }: Props) {
//   const activeStep = steps[stepIndex] ?? steps[0];
//   const progress =
//     steps.length > 1 ? Math.round((stepIndex / (steps.length - 1)) * 100) : 100;

//   return (
//     <header className="border-b border-slate-200/80 bg-white rounded-2xl">
//       <div className="px-5 py-5 sm:px-7 lg:px-10 lg:py-6">
//         {/* Header */}
//         <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex min-w-0 items-center gap-4">
//             <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm sm:flex">
//               <span className="text-sm font-bold">
//                 {String(stepIndex + 1).padStart(2, "0")}
//               </span>
//             </div>

//             <div className="min-w-0">
//               <div className="flex items-center gap-2">
//                 <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
//                   Business setup
//                 </p>
//                 <span className="h-1 w-1 rounded-full bg-slate-300" />
//                 <span className="text-[11px] font-medium text-slate-400">
//                   {progress}% complete
//                 </span>
//               </div>

//               <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
//                 {activeStep.title}
//               </h1>

//               <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
//                 {activeStep.description}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 lg:min-w-[230px] lg:justify-end">
//             <div className="hidden text-right sm:block">
//               <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
//                 Current step
//               </p>
//               <p className="mt-0.5 text-sm font-semibold text-slate-800">
//                 {stepIndex + 1} of {steps.length}
//               </p>
//             </div>

//             <div className="h-10 w-10 rounded-full bg-slate-100 p-1">
//               <div
//                 className="flex h-full items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white transition-all duration-300"
//                 style={{
//                   width: `${Math.max(progress, 22)}%`,
//                   minWidth: "100%",
//                 }}
//               >
//                 {stepIndex + 1}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Progress bar */}
//         <div className="mt-6 h-1 overflow-hidden rounded-full bg-slate-100">
//           <div
//             className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
//             style={{ width: `${progress}%` }}
//           />
//         </div>

//         {/* Step rail */}
//         <nav
//           aria-label="Business setup progress"
//           className="mt-6 -mx-1 overflow-x-auto pb-1"
//         >
//           <ol className="flex min-w-max items-start px-1">
//             {steps.map((step, index) => {
//               const completed = index < stepIndex;
//               const active = index === stepIndex;
//               const reachable = index <= stepIndex;
//               const last = index === steps.length - 1;

//               return (
//                 <li
//                   key={step.key}
//                   className={cn(
//                     "flex items-start",
//                     !last && "w-[150px] sm:w-[180px] lg:flex-1 lg:w-auto"
//                   )}
//                 >
//                   <button
//                     type="button"
//                     disabled={!reachable}
//                     onClick={() => onStepClick(index)}
//                     aria-current={active ? "step" : undefined}
//                     className={cn(
//                       "group flex min-w-[120px] flex-col items-start text-left",
//                       !reachable && "cursor-not-allowed"
//                     )}
//                   >
//                     <div className="flex w-full items-center">
//                       <span
//                         className={cn(
//                           "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200",
//                           completed &&
//                             "border-primary bg-primary text-white shadow-sm",
//                           active &&
//                             "border-primary bg-white text-primary shadow-[0_0_0_4px_rgba(37,99,235,0.10)]",
//                           !completed &&
//                             !active &&
//                             "border-slate-200 bg-white text-slate-400",
//                           reachable &&
//                             !active &&
//                             "group-hover:border-primary/50"
//                         )}
//                       >
//                         {completed ? (
//                           <Check className="h-4 w-4" strokeWidth={2.7} />
//                         ) : (
//                           index + 1
//                         )}
//                       </span>

//                       {!last && (
//                         <span
//                           className={cn(
//                             "h-px flex-1 transition-colors duration-300",
//                             completed ? "bg-primary" : "bg-slate-200"
//                           )}
//                         />
//                       )}
//                     </div>

//                     <span
//                       className={cn(
//                         "mt-2 text-xs font-semibold transition-colors sm:text-sm",
//                         active
//                           ? "text-primary"
//                           : completed
//                             ? "text-slate-800"
//                             : "text-slate-400",
//                         reachable &&
//                           !active &&
//                           "group-hover:text-slate-700"
//                       )}
//                     >
//                       {step.title}
//                     </span>

//                     <span
//                       className={cn(
//                         "mt-0.5 text-[10px] font-medium sm:text-[11px]",
//                         active || completed
//                           ? "text-slate-500"
//                           : "text-slate-300"
//                       )}
//                     >
//                       {completed
//                         ? "Completed"
//                         : active
//                           ? "In progress"
//                           : "Upcoming"}
//                     </span>
//                   </button>

//                   {!last && (
//                     <ChevronRight className="mt-[9px] mr-2 h-3.5 w-3.5 shrink-0 text-slate-200 lg:hidden" />
//                   )}
//                 </li>
//               );
//             })}
//           </ol>
//         </nav>
//       </div>
//     </header>
//   );
// }