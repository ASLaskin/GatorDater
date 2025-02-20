"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Heart } from "lucide-react"

interface Question {
  id: number
  text: string
  answers: {
    text: string
    type: "romantic" | "adventurous" | "practical" | "independent"
  }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "What's your ideal first date?",
    answers: [
      { text: "Candlelit dinner with soft music", type: "romantic" },
      { text: "Spontaneous road trip to somewhere new", type: "adventurous" },
      { text: "Coffee and getting to know each other", type: "practical" },
      { text: "Activity-based date like rock climbing", type: "independent" },
    ],
  },
  {
    id: 2,
    text: "How do you prefer to show affection?",
    answers: [
      { text: "Grand romantic gestures", type: "romantic" },
      { text: "Surprising them with new experiences", type: "adventurous" },
      { text: "Small, thoughtful acts of service", type: "practical" },
      { text: "Quality time while respecting space", type: "independent" },
    ],
  },
  {
    id: 3,
    text: "What's most important in a relationship?",
    answers: [
      { text: "Deep emotional connection", type: "romantic" },
      { text: "Shared adventures and growth", type: "adventurous" },
      { text: "Trust and stability", type: "practical" },
      { text: "Personal freedom and understanding", type: "independent" },
    ],
  },
  {
    id: 4,
    text: "How do you handle relationship conflicts?",
    answers: [
      { text: "Heart-to-heart conversations", type: "romantic" },
      { text: "Try something new together", type: "adventurous" },
      { text: "Logical problem-solving approach", type: "practical" },
      { text: "Take space to process individually", type: "independent" },
    ],
  },
  {
    id: 5,
    text: "What's your idea of a perfect weekend together?",
    answers: [
      { text: "Cuddling and watching movies", type: "romantic" },
      { text: "Exploring a new city together", type: "adventurous" },
      { text: "Doing household projects together", type: "practical" },
      { text: "Balance of together and alone time", type: "independent" },
    ],
  },
  {
    id: 6,
    text: "How do you communicate in a relationship?",
    answers: [
      { text: "Long, heartfelt messages", type: "romantic" },
      { text: "Sharing exciting stories and plans", type: "adventurous" },
      { text: "Clear and direct communication", type: "practical" },
      { text: "Mindful and respectful dialogue", type: "independent" },
    ],
  },
  {
    id: 7,
    text: "What attracts you most in a partner?",
    answers: [
      { text: "Their passionate nature", type: "romantic" },
      { text: "Their spontaneity", type: "adventurous" },
      { text: "Their reliability", type: "practical" },
      { text: "Their self-confidence", type: "independent" },
    ],
  },
  {
    id: 8,
    text: "How do you envision your future together?",
    answers: [
      { text: "Living our own fairy tale", type: "romantic" },
      { text: "Traveling the world together", type: "adventurous" },
      { text: "Building a stable home", type: "practical" },
      { text: "Growing while maintaining individuality", type: "independent" },
    ],
  },
  {
    id: 9,
    text: "What's your love language?",
    answers: [
      { text: "Words of affirmation", type: "romantic" },
      { text: "Physical touch and energy", type: "adventurous" },
      { text: "Acts of service", type: "practical" },
      { text: "Giving personal space", type: "independent" },
    ],
  },
  {
    id: 10,
    text: "How do you celebrate anniversaries?",
    answers: [
      { text: "Elaborate romantic surprise", type: "romantic" },
      { text: "Unique experience together", type: "adventurous" },
      { text: "Meaningful traditional celebration", type: "practical" },
      { text: "Flexible plans based on mood", type: "independent" },
    ],
  },
]

const personalityTypes = {
  romantic: {
    title: "The Hopeless Romantic",
    description:
      "You believe in true love and fairy-tale endings. Your relationships are filled with passion, deep emotional connections, and grand romantic gestures.",
  },
  adventurous: {
    title: "The Adventure Seeker",
    description:
      "You thrive on spontaneity and new experiences. Your ideal relationship is one filled with excitement, growth, and shared adventures.",
  },
  practical: {
    title: "The Steady Partner",
    description:
      "You value stability and authenticity in relationships. Your practical approach creates strong, lasting bonds built on trust and understanding.",
  },
  independent: {
    title: "The Free Spirit",
    description:
      "You cherish personal freedom while maintaining deep connections. Your relationships are based on mutual respect and individual growth.",
  },
}

export default function LoveQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [showResults, setShowResults] = useState(false)

  const calculatePersonality = () => {
    const counts: { [key: string]: number } = {
      romantic: 0,
      adventurous: 0,
      practical: 0,
      independent: 0,
    }

    answers.forEach((answer, index) => {
      const question = questions[index]
      const selectedAnswer = question.answers.find((a) => a.text === answer)
      if (selectedAnswer) {
        counts[selectedAnswer.type]++
      }
    })

    const personalityType = Object.entries(counts).reduce((a, b) =>
      b[1] > a[1] ? b : a,
    )[0] as keyof typeof personalityTypes
    return personalityTypes[personalityType]
  }

  const handleNext = () => {
    if (selectedAnswer) {
      setAnswers([...answers, selectedAnswer])
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer("")
      } else {
        setShowResults(true)
      }
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer("")
    setShowResults(false)
  }

  const question = questions[currentQuestion]
  const personality = calculatePersonality()

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="text-center space-y-1">
        <Heart className="w-8 h-8 mx-auto text-pink-500" />
        <h1 className="text-2xl font-bold text-pink-600">Style Of Love Quiz</h1>
      </div>

      {!showResults ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Q{currentQuestion + 1}/{questions.length}
              </span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500 transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-medium">{question.text}</h2>
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-2">
              {question.answers.map((answer, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                    selectedAnswer === answer.text
                      ? "border-pink-500 bg-pink-50 dark:bg-pink-950"
                      : "hover:border-pink-200 dark:hover:border-pink-800"
                  }`}
                  onClick={() => setSelectedAnswer(answer.text)}
                >
                  <RadioGroupItem value={answer.text} id={`answer-${index}`} className="text-pink-500" />
                  <Label htmlFor={`answer-${index}`} className="flex-grow cursor-pointer text-sm">
                    {answer.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button onClick={handleNext} disabled={!selectedAnswer} className="w-full bg-pink-500 hover:bg-pink-600">
            {currentQuestion === questions.length - 1 ? "See Results" : "Next"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-950 space-y-2">
            <h2 className="text-xl font-bold text-pink-600">{personality.title}</h2>
            <p className="text-sm text-muted-foreground">{personality.description}</p>
          </div>
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full border-pink-500 text-pink-500 hover:bg-pink-50"
          >
            Retake Quiz
          </Button>
        </div>
      )}
    </div>
  )
}

