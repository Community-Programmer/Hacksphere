import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useParams } from "react-router-dom";
import { getQuiz } from "@/api/aiTutorApi";

// const questions = [
//     {
//       id: 1,
//       question: "What is the capital of France?",
//       options: ["Paris", "London", "Berlin", "Madrid"],
//       correct: "Paris"
//     },
//     {
//       id: 2,
//       question: "Who wrote 'Hamlet'?",
//       options: ["William Shakespeare", "Charles Dickens", "J.K. Rowling", "Ernest Hemingway"],
//       correct: "William Shakespeare"
//     },
//     {
//       id: 3,
//       question: "What is the chemical symbol for water?",
//       options: ["O2", "H2O", "CO2", "NaCl"],
//       correct: "H2O"
//     }
//   ];

const QuizQuestion:React.FC = () => {

    const { quizId } = useParams<{ quizId: string }>();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [answers, setAnswers] = useState({});
    const [questions, setQuestions] = useState([])
    const [elapsedTime, setElapsedTime] = useState(0);

    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        const fetchQuiz = async () => {
          const response = await getQuiz(quizId);
          setQuestions(response.data.questions);
          console.log(response.data.questions);
        };
        fetchQuiz();
      }, [quizId]);

      useEffect(() => {
        const timer = setInterval(() => {
          setElapsedTime(prevTime => prevTime + 1);
        }, 1000);
    
        return () => clearInterval(timer);
      }, []);
    
      const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      };
    
  
    const handleOptionChange = (value) => {
      setSelectedAnswer(value);
    };
  
    const handleSubmitAnswer = () => {
      setAnswers({ ...answers, [currentQuestion.questionNo]: selectedAnswer });
      setSelectedAnswer("");
    };
  
    const handleNext = () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    };
  
    const handlePrevious = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    };

  return (
    <>
     <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid flex-1 auto-rows-max gap-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Quiz Title
                </h1>
              </div>
              <div className="flex gap-6">
                <Button size="sm" onClick={handlePrevious}>Previous</Button>
                <Button size="sm" onClick={handleNext}>Next</Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 h-full">
                <div className="border rounded-md shadow-md p-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Question <span>{currentQuestionIndex + 1}</span> of <span>{questions.length}</span>
                    </h2>
                    <p className="text-sm mb-4">
                      {currentQuestion?.question}
                    </p>
                  </div>
                  <div className="mb-4">
                    <RadioGroup
                      value={selectedAnswer}
                      onValueChange={handleOptionChange}
                    >
                      {currentQuestion?.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`r${index}`} />
                          <Label htmlFor={`r${index}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="flex justify-evenly border-t pt-4">
                    <Button size="sm" onClick={handleSubmitAnswer}>Submit Answer</Button>
                    <Button size="sm" onClick={() => setSelectedAnswer("")}>Reset Answer</Button>
                    <Button size="sm">Finish Now</Button>
                  </div>
                </div>
              </div>

              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-3">
                  <CardHeader>
                    <CardTitle>Time Taken</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 font-medium text-6xl">
                      <span>{formatTime(elapsedTime)}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className="overflow-hidden"
                  x-chunk="dashboard-07-chunk-4"
                >
                  <CardHeader>
                    <CardTitle>Questions</CardTitle>
                    <CardDescription>
                      Navigate through questions here!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                      {questions.map((q, index) => (
                        <Button
                          key={index}
                          size="icon"
                          variant="outline"
                          className={answers[q.questionNo] ? "bg-green-400" : "bg-gray-400"}
                          onClick={() => setCurrentQuestionIndex(index)}
                        >
                          {index + 1}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default QuizQuestion