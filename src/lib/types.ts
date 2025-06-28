export type SalesEntry = {
  id: string;
  date: Date;
  salesValue: number;
  ticketAverage: number;
  productsPerService: number;
};

export type Seller = {
  id: string;
  name: string;
  salesValue: number;
  ticketAverage: number;
  pa: number;
  points: number;
};

export type GoalLevels = {
  metinha: number;
  meta: number;
  metona: number;
  lendaria: number;
};

export type Goals = {
  salesValue: GoalLevels;
  ticketAverage: GoalLevels;
  pa: GoalLevels;
  points: GoalLevels;
};

export type QuizQuestion = {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

export type CourseModule = {
  title: string;
  content: string; // Markdown content
};

export type Course = {
  id: string;
  title: string;
  description: string;
  points: number;
  modules?: CourseModule[];
  quiz?: {
    title: string;
    questions: QuizQuestion[];
  };
};

export type Mission = {
  id: string;
  name: string;
  description: string;
  points: number;
  startDate: Date;
  endDate: Date;
};
