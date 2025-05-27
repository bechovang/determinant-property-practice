import { create } from "zustand"
import { persist } from "zustand/middleware"

interface QuizState {
  answers: Record<number, string>
  startTime: number | null
  userInfo: { name: string; studentId: string }
  stats: Record<number, { attempts: number; correct: number }>
  questionTimes: Record<number, number> // questionId -> time in seconds
  setAnswer: (questionId: number, answer: string) => void
  setStartTime: (time: number) => void
  setUserInfo: (info: { name: string; studentId: string }) => void
  updateStats: (propertyId: number, isCorrect: boolean) => void
  storeQuestionTime: (questionId: number, timeInSeconds: number) => void
  resetQuiz: () => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      answers: {},
      startTime: null,
      userInfo: { name: "", studentId: "" },
      stats: {},
      questionTimes: {},

      setAnswer: (questionId, answer) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
        })),

      setStartTime: (time) => set({ startTime: time }),

      setUserInfo: (info) => set({ userInfo: info }),

      updateStats: (propertyId, isCorrect) =>
        set((state) => {
          const currentStats = state.stats[propertyId] || { attempts: 0, correct: 0 }
          return {
            stats: {
              ...state.stats,
              [propertyId]: {
                attempts: currentStats.attempts + 1,
                correct: currentStats.correct + (isCorrect ? 1 : 0),
              },
            },
          }
        }),

      storeQuestionTime: (questionId, timeInSeconds) =>
        set((state) => ({
          questionTimes: { ...state.questionTimes, [questionId]: timeInSeconds },
        })),

      resetQuiz: () =>
        set({
          answers: {},
          startTime: null,
          questionTimes: {},
        }),
    }),
    {
      name: "quiz-storage",
      partialize: (state) => ({
        userInfo: state.userInfo,
        stats: state.stats,
        questionTimes: state.questionTimes,
      }),
    },
  ),
)
