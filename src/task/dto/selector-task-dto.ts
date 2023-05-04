import { SelectAssignedTask } from "./selector-assigned-task-dto";

export const SelectorTaskDto = {
  id: true,
  title: true,
  description: true,
  creator: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  },
  workers: {select: SelectAssignedTask}
};
