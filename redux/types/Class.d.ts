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

interface IClassWorkout {
  name: string;
  description: string;
  order: number;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface IClass {
  name: string;
  published: boolean;
  created_at: FieldValue;
  updated_at?: FieldValue;
  isNew?: boolean;
}
