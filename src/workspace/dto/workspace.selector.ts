export class SelectWorkspaceDto {
  id: boolean = true;
  title: boolean = true;
  cover: boolean = true;
  owner = {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  };
  members = {
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
  };
  _count = {
    select: {
      members: true,
      projects: true,
    },
  };
}
