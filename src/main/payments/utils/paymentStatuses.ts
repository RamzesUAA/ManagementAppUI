const getChipColor = (prioprityText: string) => {
  switch (prioprityText) {
    case "Low":
      return "success";

    case "Medium":
      return "warning";

    case "High":
      return "error";

    default:
      return "default";
  }
};

const getPriorityText = (prioprityNumber: number) => {
  switch (prioprityNumber) {
    case 1:
      return "Low";

    case 2:
      return "Medium";

    case 3:
      return "High";

    default:
      return "Unknown";
  }
};

export default { getChipColor, getPriorityText };
