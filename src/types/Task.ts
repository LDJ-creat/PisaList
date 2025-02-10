export interface Task {
  id: string;
  event: string;
  completed: boolean;
  is_cycle: boolean;
  description: string;
  importanceLevel: number;
  completed_date: string;
} 