// import { useState } from "react";
// import FullCalendar, { formatDate } from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import listPlugin from "@fullcalendar/list";
// import {
//   Box,
//   List,
//   ListItem,
//   ListItemText,
//   Typography,
//   useTheme,
// } from "@mui/material";
// import Header from "src/shared/ui/components/Header";
// import { tokens } from "src/shared/global/theme";

import React, { useCallback, useEffect, useState } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { tokens } from "src/shared/global/theme";

import {
  Box,
  FormControl,
  InputLabel,
  TextField,
  Modal,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  Button as MuiButton,
  Paper,
  useTheme,
  Divider,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Formik, Form, Field, useFormikContext } from "formik";
import Button from "src/shared/ui/Button";
import Header from "src/shared/ui/components/Header";
import _ from "lodash";
import { v4 as uuid } from "uuid";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import useApi from "src/shared/agent";

const CalendarPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({});
  const [events, setEvents] = useState([]);

  const [open, setOpen] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { get, post, del } = useApi();

  useEffect(() => {
    get("/events").then((res) => {
      setEvents(res.data.data);
    });
  }, []);

  const handleAddEvenet = ({ title }) => {
    const calendarApi = currentEvent.view.calendar;
    calendarApi.unselect();

    if (title) {
      const requestData = {
        id: `${currentEvent.dateStr}-${title}`,
        title,
        start: new Date(currentEvent.startStr).toISOString(),
        end: new Date(currentEvent.endStr).toISOString(),
        allDay: currentEvent.allDay,
      };

      post("/events", { event: requestData }).then((res) => {
        calendarApi.addEvent(res.data.data);
      });

      handleClose();
    }
  };

  const handleDateClick = (selected) => {
    setCurrentEvent(selected);
    handleOpen();
  };

  const handleEventClick = (selected) => {
    setCurrentEvent(selected);
    setOpenConfirmation(true);
  };

  const handleDeleteEvent = () => {
    del(`/events/${currentEvent.event.id}`).then((res) => {
      if (res.status === 204) {
        const newCurrEvents = currentEvents.filter(
          (event) => event.id !== currentEvent.event.id
        );

        setEvents(newCurrEvents);
      }
      setOpenConfirmation(false);
    });
  };

  return (
    <Box m="20px">
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          sx={{ height: "75vh", overflow: "auto" }}
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            key={events.length}
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) => setCurrentEvents(events)}
            initialEvents={events}
          />
        </Box>
      </Box>

      <BasicModal
        open={open}
        addField={handleAddEvenet}
        handleClose={handleClose}
      ></BasicModal>
      <ConfirmationModal
        open={openConfirmation}
        event={currentEvent}
        onPerform={handleDeleteEvent}
        handleClose={() => setOpenConfirmation(false)}
      ></ConfirmationModal>
    </Box>
  );
};

const ConfirmationModal = ({ handleClose, open, event, onPerform }: any) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box marginBottom="10px">
            Are you sure you want to delete selected event?
          </Box>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            marginBottom="15px"
          >
            Event that will be deleted: {event?.event?.title}
          </Typography>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            styles={{ float: "right", backgroundColor: colors.redAccent[500] }}
            onClick={onPerform}
          >
            Yes
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const BasicModal = ({ handleClose, open, addField }: any) => {
  const handleChange = (event: SelectChangeEvent) => {
    // setSelectedType(event.target.value as string);
  };

  const handleFormSubmit = (values: any) => {
    addField(values);
    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Formik onSubmit={handleFormSubmit} initialValues={{ title: "" }}>
          {({
            errors,
            values,
            handleBlur,
            handleChange,
            touched,
            handleSubmit,
          }) => (
            <Form
              onSubmit={(e) => {
                e.stopPropagation();
                e.preventDefault();
                return handleSubmit(e);
              }}
            >
              <Box sx={style}>
                <Box marginBottom="10px">
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    marginBottom="15px"
                  >
                    Please enter a new title for your event
                  </Typography>
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Title"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      name="title"
                      helperText={touched.title && errors?.title}
                      sx={{
                        gridColumn: "span 2",
                        padding: "10px 0px 10px 0px",
                      }}
                    />
                  </FormControl>
                </Box>

                {values?.type === "drop-down" && (
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    placeholder="Write options using ';' as delimeter"
                    // onChange={(event) => setOptions(event.target.value)}
                    onChange={handleChange}
                    value={values.options}
                    name="options"
                    sx={{ gridColumn: "span 2", paddingBottom: "15px" }}
                  />
                )}

                <Button type="submit">Add</Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default CalendarPage;
