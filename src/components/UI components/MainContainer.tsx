import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { returnsData } from "../../utils/returnsData";
import TradingChart from "../TradingChart";
import InformationTable from "./InformationTable";
import { ddPeriods } from "../../utils/ddPeriods";

const MainContainer: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        backgroundColor: "#EEEEEE",
        padding: 2,
      }}
    >
      <Card variant="outlined">
        <CardContent>
          <TradingChart
            data={returnsData.data.combined}
            referenceDate={ddPeriods.data}
          />
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 275, flex: 1 }} variant="outlined">
        <CardContent>
          <InformationTable />
        </CardContent>
      </Card>
    </Box>
  );
};

export default MainContainer;
