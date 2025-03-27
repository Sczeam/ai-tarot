// "use client";

// import { useState, useMemo, useEffect } from "react";
// import { Form } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

// import { Button } from "@/components/ui/button";
// import { submitTarotReading } from "@/actions/generateInterpretationAction";
// import DynamicIcon from "./DynamicIcon";
// import FormField from "./FormField";
// import { Card } from "@/utils/types";
// import { shuffleDeck, drawCard } from "@/lib/drawCard";
// import { SPREAD_CONFIGS, SpreadType } from "@/lib/spreads/spreadConfigs";

// const formSchema = z.object({
//   focusArea: z.enum([
//     "Relationship",
//     "Career",
//     "Personal Growth",
//     "Health",
//     "Spirituality",
//   ]),
//   question: z.string().min(5, {
//     message: "Your question must be at least 5 characters.",
//   }),
//   spreadType: z.enum(
//     Object.keys(SPREAD_CONFIGS) as [SpreadType, ...SpreadType[]]
//   ),
// });

// type FormValues = z.infer<typeof formSchema>;

// export default function TarotReadingForm({ tarotData }: { tarotData: Card[] }) {
//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadingStep, setLoadingStep] = useState<string>("");
//   const [submission, setSubmission] = useState<FormValues | null>(null);

//   // Prepare shuffled deck once when component mounts
//   const shuffledDeck = useMemo(() => shuffleDeck(tarotData), [tarotData]);

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       focusArea: "Relationship",
//       question: "",
//       spreadType: "Quick Guidance",
//     },
//   });

//   function onSubmit(data: FormValues) {
//     setIsLoading(true);
//     setLoadingStep("Initiating reading...");
//     setSubmission(data);
//   }

//   useEffect(() => {
//     if (!submission) return;

//     const timeoutId = setTimeout(() => {
//       setIsLoading(false);
//       setLoadingStep("Taking too long. Please try again.");
//       setSubmission(null);
//     }, 10000);

//     async function processSubmission() {
//       try {
//         setLoadingStep("Drawing cards...");
//         const { cardCount } = SPREAD_CONFIGS[submission!.spreadType];
//         const drawnCards = await shuffledDeck
//           .slice(0, cardCount)
//           .map((card) => drawCard(card));

//         setLoadingStep("Generating interpretation...");
//         if (
//           submission?.focusArea &&
//           submission?.question &&
//           submission?.spreadType
//         ) {
//           await submitTarotReading({
//             focusArea: submission.focusArea,
//             question: submission.question,
//             spreadType: submission.spreadType,
//             cards: drawnCards,
//           });
//         } else {
//           throw new Error("Submission data is incomplete.");
//         }
//       } catch (error) {
//         console.error("Error submitting form:", error);
//         setLoadingStep("Error occurred. Please try again.");
//       } finally {
//         clearTimeout(timeoutId);
//         setIsLoading(false);
//         setLoadingStep("");
//         setSubmission(null);
//       }
//     }

//     processSubmission();

//     return () => clearTimeout(timeoutId);
//   }, [submission, shuffledDeck]);

//   const handleFocus = (fieldName: string) => {
//     setFocusedField(fieldName);
//   };

//   const handleBlur = () => {
//     setFocusedField(null);
//   };

//   return (
//     <div className="grid md:grid-cols-[1fr_2fr] h-full">
//       <div className="flex items-center justify-center bg-stone-200 p-8">
//         <DynamicIcon focusedField={focusedField} />
//       </div>

//       <div className="p-8">
//         <h1 className="text-2xl font-bold text-stone-800 mb-8 text-center">
//           TAROT READING
//         </h1>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField<FormValues>
//               control={form.control}
//               name="focusArea"
//               label="FOCUS AREA"
//               type="select"
//               options={[
//                 { value: "Relationship", label: "Relationship" },
//                 { value: "Career", label: "Career" },
//                 { value: "Personal Growth", label: "Personal Growth" },
//                 { value: "Health", label: "Health" },
//                 { value: "Spirituality", label: "Spirituality" },
//               ]}
//               onFocus={() => handleFocus("readingType")}
//               onBlur={handleBlur}
//             />

//             <FormField
//               control={form.control}
//               name="question"
//               label="YOUR QUESTION"
//               type="textarea"
//               placeholder="What would you like to know?"
//               onFocus={() => handleFocus("question")}
//               onBlur={handleBlur}
//             />

//             <FormField
//               control={form.control}
//               name="spreadType"
//               label="SPREAD TYPE"
//               type="select"
//               options={[
//                 { value: "Quick Guidance", label: "Quick Guidance" },
//                 { value: "3 Cards Spread", label: "3 Cards Spread" },
//                 { value: "Celtic Cross Spread", label: "Celtic Cross Spread" },
//               ]}
//               onFocus={() => handleFocus("spreadType")}
//               onBlur={handleBlur}
//             />

//             <Button
//               type="submit"
//               className="w-full bg-stone-800 hover:bg-stone-900 text-white"
//               disabled={isLoading}
//             >
//               {isLoading ? loadingStep : "Draw Cards"}
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }
