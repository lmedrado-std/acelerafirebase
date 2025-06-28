'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateQuiz } from '@/ai/flows/generate-quiz-flow';
import type { GenerateQuizOutput } from '@/lib/types';
import { Loader2, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Question = GenerateQuizOutput['questions'][0];

export default function Quiz() {
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const { toast } = useToast();

  const handleStartQuiz = async () => {
    setIsLoading(true);
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsFinished(false);

    try {
      const result = await generateQuiz({
        topic: 'Técnicas de Venda e Conhecimento de Produtos em Lojas de Calçados',
        numberOfQuestions: 5,
      });
      if (result.questions.length > 0) {
        setQuiz(result);
      } else {
        throw new Error('No questions were generated.');
      }
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      toast({
        variant: 'destructive',
        title: 'Falha ao Gerar Quiz',
        description: 'Não foi possível carregar as perguntas. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    setShowFeedback(true);
    if (selectedAnswer === quiz!.questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  const currentQuestion: Question | null = quiz ? quiz.questions[currentQuestionIndex] : null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-semibold">Gerando um novo quiz para você...</p>
        <p className="text-sm">Isso pode levar alguns segundos.</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Trophy className="h-16 w-16 text-yellow-400" />
        <h2 className="mt-4 text-2xl font-bold">Quiz Finalizado!</h2>
        <p className="text-muted-foreground mt-2">
          Você acertou {score} de {quiz!.questions.length} perguntas.
        </p>
        <Button onClick={handleStartQuiz} className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground font-semibold">
           <RotateCcw className="mr-2"/> Tentar Novamente
        </Button>
      </div>
    );
  }
  
  if (!quiz || !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold">Teste seus Conhecimentos</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          Clique no botão abaixo para gerar um quiz aleatório sobre técnicas de vendas e produtos de calçados.
        </p>
        <Button onClick={handleStartQuiz} className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground font-semibold">
          <Sparkles className="mr-2" /> Iniciar Quiz
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
             <CardTitle className="text-xl">Quiz: {quiz.title}</CardTitle>
             <div className="text-sm font-medium text-muted-foreground">Pergunta {currentQuestionIndex + 1} de {quiz.questions.length}</div>
        </div>
      
      <div>
        <h3 className="text-lg font-semibold">{currentQuestion.questionText}</h3>
        <RadioGroup 
            value={selectedAnswer?.toString()} 
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            disabled={showFeedback}
            className="mt-4 space-y-3"
        >
            {currentQuestion.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correctAnswerIndex;
                const isSelected = index === selectedAnswer;
                
                let variant = '';
                if(showFeedback) {
                    if(isCorrect) variant = 'border-green-500 bg-green-500/10';
                    else if (isSelected) variant = 'border-destructive bg-destructive/10';
                }

                return (
                    <Label 
                        key={index} 
                        htmlFor={`option-${index}`}
                        className={cn(
                            "flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors",
                            "hover:bg-accent/50",
                             variant
                        )}
                    >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <span className="ml-4 text-base">{option}</span>
                    </Label>
                )
            })}
        </RadioGroup>
      </div>
      
      {showFeedback && (
        <Card className={cn(
            "border-2",
            selectedAnswer === currentQuestion.correctAnswerIndex ? 'border-green-500' : 'border-destructive'
        )}>
            <CardHeader>
                <CardTitle className={cn(
                    "text-lg",
                     selectedAnswer === currentQuestion.correctAnswerIndex ? 'text-green-500' : 'text-destructive'
                )}>
                    {selectedAnswer === currentQuestion.correctAnswerIndex ? 'Resposta Correta!' : 'Resposta Incorreta!'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{currentQuestion.explanation}</p>
            </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
          {showFeedback ? (
            <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < quiz.questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
            </Button>
          ) : (
            <Button onClick={handleAnswerSubmit} disabled={selectedAnswer === null}>
                Confirmar Resposta
            </Button>
          )}
      </div>
    </div>
  );
}
