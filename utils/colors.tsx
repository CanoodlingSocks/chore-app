export const getAssignButtonColor = (user: string): string => {
  switch (user) {
    case "User 1":
      return "#e8831b";
    case "User 2":
      return "#4d6d7e";
    default:
      return "#000000";
  }
};
