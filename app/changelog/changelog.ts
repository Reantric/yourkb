export type Change = {
  year: number;
  month: number;
  day: number;
  description: string;
};

export const CHANGES: Change[] = [
  {
    year: 2025,
    month: 1,
    day: 22,
    description:
      "Added a changelog, some visual updates and resolved some hidden warnings",
  },
  {
    year: 2025,
    month: 9,
    day: 6,
    description: "Added ability to like kilobytes and revamped the editor",
  },
];
