export type change = {
    year: number;
    month: number;
    day: number;
    description: string;
};

export const CHANGES: change[] = [
  {
    year: 2025,
    month: 1,
    day: 22,
    description: 'Added a changelog'
  }
]