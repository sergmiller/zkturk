export interface ProblemModelInterface {
  id: number;
  owner: string;
  title: string;
  description: string;
  urlToTask: string[];
  asnwers: string[];
  workersMax: number;
  taskPriceWei: number;
  answersMax: number;

}
