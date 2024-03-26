import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import { ddPeriods } from "../../utils/ddPeriods";

const InformationTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead style={{ backgroundColor: "lightgrey" }}>
          <TableRow>
            <TableCell style={{ borderRight: "1px solid #ddd" }}>
              Period
            </TableCell>
            <TableCell align="right" style={{ borderRight: "1px solid #ddd" }}>
              MaxDD
            </TableCell>
            <TableCell align="right">Days</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ddPeriods.data.map((period, index) => (
            <TableRow key={index}>
              <TableCell
                component="th"
                scope="row"
                style={{ borderRight: "1px solid #ddd" }}
              >
                {`${period.Start_Date} - ${period.End_Date}`}
              </TableCell>
              <TableCell
                align="right"
                sx={{ borderRight: "1px solid #ddd", color: "#f36361" }}
              >
                {(Math.round(period.Max_Drawdown * 100) / 100).toFixed(2)}
              </TableCell>
              <TableCell align="right">{period.Drawdown_days}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InformationTable;
