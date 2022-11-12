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
