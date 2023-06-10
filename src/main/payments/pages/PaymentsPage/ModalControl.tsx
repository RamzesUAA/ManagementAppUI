import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "src/shared/ui/Button";
import { tokens } from "src/shared/global/theme";
import { useTheme } from "@mui/material";
import { paymentStatuses } from "../../utils";
import { Chip } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({
  parentOpen = false,
  parentHandleClose = () => {},
  payment,
}: any) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = React.useState(parentOpen);
  const handleClose = () => setOpen(false);

  const { getChipColor, getPriorityText } = paymentStatuses;

  return (
    <div>
      <Modal
        open={parentOpen ?? open}
        onClose={parentHandleClose ?? handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" sx={{ mt: 2 }}>
            ID: {payment?.id}
          </Typography>

          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mt: 2 }}
          >
            Name: {payment?.name}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Description: {payment?.description}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Amount: {payment?.ammount}$
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Status: {payment?.status}
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Priority:{" "}
            <Chip
              label={getPriorityText(payment?.priority)}
              color={getChipColor(getPriorityText(payment?.priority))}
              style={{ minWidth: "60px", maxHeight: "25px" }}
            />
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Assigned: {payment?.assigned_user_name}
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Assignee: {payment?.assignee_user_name}
          </Typography>

          <Button
            styles={{
              backgroundColor: colors.greenAccent[500],
              marginRight: "10px",
              marginTop: "10px",
            }}
            onClick={() => {}}
          >
            Pay
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
