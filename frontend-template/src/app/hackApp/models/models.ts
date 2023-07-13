export interface Problem {
  id?: number;
  title: string;
  priceForOne: number;
  overlap: number;
  description: string;
  images: string[];
  variants: string[];
}

export interface ProblemTask {
  problemId: number;
  taskId: number;
  worker: string;
  cipheredAnswer: string;
  answer: string;
}

export interface ProblemTaskLite {
  taskId: number;
  image: string;
  answered: boolean;
}
