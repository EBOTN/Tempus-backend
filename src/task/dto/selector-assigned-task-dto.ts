export const SelectAssignedTask = {
  id: true,
  member: {
    select: {
      member: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      role: true,
    },
  },
  workTime: true,
  isComplete: true,
};
