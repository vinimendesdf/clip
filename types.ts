export interface Caption {
  startTime: number;
  endTime: number;
  text: string;
}

export interface Clip {
  title: string;
  startTime: string;
  endTime: string;
  summary: string;
  viralityScore: number;
  captions: Caption[];
}
