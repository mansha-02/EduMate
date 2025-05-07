import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does the AI-powered study planning work?",
    answer: "EduMate generates a dynamic study plan based on your subjects, exam dates, and learning pace.It provides weekly milestones and real-time progress tracking."
  },
  {
    question: "What types of subjects can I study?",
    answer: "Mind Mentor supports a wide range of subjects including sciences, mathematics, languages, humanities, and professional skills. Our AI can help create study plans for any subject you're interested in learning."
  },
  {
    question: "What types of study resources are available?",
    answer: "EduMate curates high-quality study materials, including video tutorials, online courses, documentation, practice exercises, and academic papers. AI-powered filters help you find the most relevant resources."
  },
  {
    question: "Who can use EduMate?",
    answer: "It is designed for students, professionals, and lifelong learners of all levels. Whether you're preparing for exams, learning new skills, or pursuing personal development, Mind Mentor can help optimize your learning journey."
  },
  {
    question: "Can I interact with PDF documents?",
    answer: "Yes! You can upload PDFs, ask AI questions about the content, highlight key excerpts, and navigate through pages seamlessly. The PDF chat assistant provides context-aware answers."
  }
]

export function FaqSection() {
  return (
    <section className="py-12 sm:py-20 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-lg font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
} 