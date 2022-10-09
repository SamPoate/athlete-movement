type Class = BaseResponse<{
  title: string;
  description: string;
  workouts: {
    column_one: string;
    column_two: string;
    column_three: string;
  }[];
}>;

interface Item {
  id: string;
  attributes: BaseAttributes & {
    title: string;
    description: string;
    workouts: {
      column_one: string;
      column_two: string;
      column_three: string;
    }[];
  };
}
