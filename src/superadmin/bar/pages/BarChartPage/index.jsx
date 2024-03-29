import { Box } from "@mui/material";
import Header from "../../../../shared/ui/components/Header";
import BarChart from "../../../../shared/ui/components/BarChart";

const BarChartPage = () => {
  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle="Simple Bar Chart" />
      <Box height="75vh">
        <BarChart />
      </Box>
    </Box>
  );
};

export default BarChartPage;
