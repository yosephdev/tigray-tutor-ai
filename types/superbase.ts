export type Tables = {
    lessons: {
      id: string;
      title: string;
      content: string;
      pdf_url?: string;
      created_at: string;
    };
    progress: {
      user_id: string;
      lesson_id: string;
      completed: boolean;
      score: number;
      last_accessed: string;
    };
    exercises: {
      id: string;
      lesson_id: string;
      question: string;
      options: string[];
      correct_answer: string;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
    };
  };