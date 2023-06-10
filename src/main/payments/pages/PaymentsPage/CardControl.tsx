import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Button from "src/shared/ui/Button";
import { Box, Chip, breadcrumbsClasses } from "@mui/material";
import BasicModal from "./ModalControl";
import { paymentStatuses } from "../../utils";
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

export default function PaymentCard({ payment }: any) {
  const { getChipColor, getPriorityText } = paymentStatuses;

  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  return (
    <Card
      sx={{
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `red !important`,
        },
        marginBottom: "20px",
      }}
    >
      <CardContent>
        <Typography paragraph>Payment ID: {payment?.id}</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <Typography paragraph>Payment name: {payment?.name}</Typography>

          <Typography paragraph color="text.secondary">
            Status: {payment?.status}
          </Typography>
        </Box>
        <Typography paragraph>
          Priority:{" "}
          <Chip
            label={getPriorityText(payment?.priority)}
            color={getChipColor(getPriorityText(payment?.priority))}
            style={{ minWidth: "60px", maxHeight: "25px" }}
          />
        </Typography>

        <Typography paragraph>Amount: {payment?.ammount}$</Typography>
      </CardContent>

      <CardActions>
        <Button type="submit" onClick={() => {}}>
          Pay
        </Button>

        <Button type="submit" onClick={() => setOpen(true)}>
          View Details
        </Button>
      </CardActions>

      <BasicModal
        payment={payment}
        parentOpen={open}
        parentHandleClose={() => setOpen(false)}
      ></BasicModal>
    </Card>
  );
}

const getChipColor = (prioprityText: any) => {
  switch (prioprityText) {
    case "Low":
      return "success";

    case "Medium":
      return "warning";

    case "High":
      return "error";
  }
};

const getPriorityText = (prioprityNumber: any) => {
  switch (prioprityNumber) {
    case 1:
      return "Low";

    case 2:
      return "Medium";

    case 3:
      return "High";
  }
};
