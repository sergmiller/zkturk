export interface Problem {
  id?: string;
  title: string;
  priceForOne: number;
  overlap: string;
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
}
