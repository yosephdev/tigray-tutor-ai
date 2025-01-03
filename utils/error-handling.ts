export class AppError extends Error {
    constructor(
      public message: string,
      public statusCode: number = 500,
      public code?: string
    ) {
      super(message);
      this.name = 'AppError';
    }
  }
  
  export const handleApiError = (error: unknown) => {
    if (error instanceof AppError) {
      return { error: error.message, code: error.code, status: error.statusCode };
    }
    
    console.error('Unexpected error:', error);
    return { 
      error: 'An unexpected error occurred', 
      code: 'INTERNAL_ERROR', 
      status: 500 
    };
  };