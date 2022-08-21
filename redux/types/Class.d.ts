type Class = BaseResponse<{
  title: string;
  description: string;
  workouts: {
    title: string;
    description: string;
  }[];
}>;
