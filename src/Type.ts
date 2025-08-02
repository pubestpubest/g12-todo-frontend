export interface Task {
  status: string;
  message: string;
  data: Data;
}

export interface Data {
  taskId: number;
  title: string;
  description: string;
  status: boolean;
  createdAt: Date;
  updateAt: Date;
}
