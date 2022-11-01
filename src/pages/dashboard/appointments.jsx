import Head from "next/head";
import {
  Box,
  Container,
  Grid,
  Table,
  TableHead,
  TableRow,
  Typography,
  TableCell,
  Tooltip,
  TableSortLabel,
  CardContent,
  TableBody,
  Card,
  CardHeader,
  Button,
} from "../../components/auth";

import { DashboardLayout } from "../../Layouts/dashboard/DashboardLayout";
import { SeverityPill } from "../../components/dashboard";
import { useSelector } from "react-redux";
import { capitalize, CardActions } from "@mui/material";
import { useEffect, useState } from "react";
import { compareDesc } from "date-fns";
import axios from "axios";

export default function AppointmentsPage({ token }) {
  const { user } = useSelector((state) => state.users);
  const [isSorted, setIsSorted] = useState(true);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    const getDayMonthYear = (appointment) => {
      return appointment.date.split("/");
    };

    const appointmentsArray = user?.appointmentsRef
      ? [...user.appointmentsRef]
      : [];
    appointmentsArray?.sort((appointmentA, appointmentB) => {
      const [dayA, monthA, yearA] = getDayMonthYear(appointmentA);
      const [dayB, monthB, yearB] = getDayMonthYear(appointmentB);
      const appointmentADate = new Date(yearA, monthA - 1, dayA);
      const appointmentBDate = new Date(yearB, monthB - 1, dayB);
      return compareDesc(appointmentADate, appointmentBDate);
    });
    setAppointmentsList(appointmentsArray);
  }, [user]);

  const hourFormat = (hour) => {
    const turn = hour.split(":")[0];
    if (turn < 12) return "am";
    else return "pm";
  };

  const updateAppointment = () => {
    axios
      .put(`/api/appointments/updateAppointment`, {
        id,
        confirmed: false,
      })
      .finally(() => {
        setAppointmentsList(
          appointmentsList.map((a) =>
            a._id === id ? { ...a, confirmed: false } : a
          )
        );
        setId("");
        setShowOverlay(false);
        // location.reload();
      });
  };

  const onClick = async (data) => {
    if (!data.confirmed) return;
    setId(data._id);
    setShowOverlay(true);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Appointments</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container>
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <Card sx={{ position: "relative" }}>
                <CardHeader title="Your Appointments" />
                <Box
                  sx={{
                    overflowX: "auto",
                  }}
                >
                  {showOverlay && (
                    <Card
                      sx={{
                        position: "absolute",
                        backgroundColor: "#0009",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "column",
                        alignItems: "center",
                        zIndex: 10,
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h5"
                          component="h3"
                          textAlign={"center"}
                          color={"white"}
                        >
                          Are your sure to delete this appointment?
                        </Typography>
                      </CardContent>
                      <CardActions
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          maxWidth: "400px",
                        }}
                      >
                        <Button
                          size="small"
                          variant={"contained"}
                          color="secondary"
                          onClick={updateAppointment}
                        >
                          CONFIRM
                        </Button>
                        <Button
                          size="small"
                          variant={"contained"}
                          color="error"
                          onClick={() => setShowOverlay(false)}
                        >
                          CANCEL
                        </Button>
                      </CardActions>
                    </Card>
                  )}
                  {!user?.isProfessional ? (
                    <Table sx={{ whiteSpace: "nowrap" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Professional</TableCell>
                          <TableCell>Speciality</TableCell>
                          <TableCell>
                            <Tooltip enterDelay={300} title="Sort">
                              <TableSortLabel
                                active
                                direction={isSorted ? "asc" : "desc"}
                                onClick={() => setIsSorted(!isSorted)}
                              >
                                Date
                              </TableSortLabel>
                            </Tooltip>
                          </TableCell>
                          <TableCell>schedule</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {isSorted
                          ? appointmentsList
                              .map((appointment) => (
                                <TableRow hover key={appointment._id}>
                                  <TableCell>
                                    {`${capitalize(
                                      appointment.professionalRef.lastName
                                    )} ${capitalize(
                                      appointment.professionalRef.firstName
                                    )}`}
                                  </TableCell>
                                  <TableCell>
                                    {appointment.professionalRef.speciality}
                                  </TableCell>
                                  <TableCell>{appointment.date}</TableCell>
                                  <TableCell>
                                    {appointment.hour}{" "}
                                    {hourFormat(appointment.hour)}
                                  </TableCell>
                                  <TableCell>
                                    <SeverityPill
                                      color={
                                        appointment.confirmed
                                          ? "success"
                                          : "error"
                                      }
                                      onClick={() => onClick(appointment)}
                                      sx={{ cursor: "pointer" }}
                                    >
                                      {appointment.confirmed
                                        ? "Confirmed"
                                        : "Cancelled"}
                                    </SeverityPill>
                                  </TableCell>
                                </TableRow>
                              ))
                              .reverse()
                          : appointmentsList.map((appointment) => (
                              <TableRow hover key={appointment._id}>
                                <TableCell>
                                  {`${capitalize(
                                    appointment.professionalRef.lastName
                                  )} ${capitalize(
                                    appointment.professionalRef.firstName
                                  )}`}
                                </TableCell>
                                <TableCell>
                                  {appointment.professionalRef.speciality}
                                </TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>
                                  {appointment.hour}{" "}
                                  {hourFormat(appointment.hour)}
                                </TableCell>
                                <TableCell>
                                  <SeverityPill
                                    color={
                                      appointment.confirmed
                                        ? "success"
                                        : "error"
                                    }
                                    onClick={() => onClick(appointment)}
                                    sx={{ cursor: "pointer" }}
                                  >
                                    {appointment.confirmed
                                      ? "Confirmed"
                                      : "Cancelled"}
                                  </SeverityPill>
                                </TableCell>
                              </TableRow>
                            ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Table sx={{ whiteSpace: "nowrap" }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Patient</TableCell>
                          <TableCell>
                            <Tooltip enterDelay={300} title="Sort">
                              <TableSortLabel
                                active
                                direction={isSorted ? "asc" : "desc"}
                                onClick={() => setIsSorted(!isSorted)}
                              >
                                Date
                              </TableSortLabel>
                            </Tooltip>
                          </TableCell>
                          <TableCell>schedule</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {isSorted
                          ? appointmentsList
                              .map((appointment) => (
                                <TableRow hover key={appointment._id}>
                                  <TableCell>
                                    {`${capitalize(
                                      appointment.patientRef.lastName
                                    )} ${capitalize(
                                      appointment.patientRef.firstName
                                    )}`}
                                  </TableCell>
                                  <TableCell>{appointment.date}</TableCell>
                                  <TableCell>
                                    {appointment.hour}{" "}
                                    {hourFormat(appointment.hour)}
                                  </TableCell>
                                  <TableCell>
                                    <SeverityPill
                                      color={
                                        appointment.confirmed
                                          ? "success"
                                          : "error"
                                      }
                                      onClick={() => onClick(appointment)}
                                      sx={{ cursor: "pointer" }}
                                    >
                                      {appointment.confirmed
                                        ? "Confirmed"
                                        : "Cancelled"}
                                    </SeverityPill>
                                  </TableCell>
                                </TableRow>
                              ))
                              .reverse()
                          : appointmentsList.map((appointment) => (
                              <TableRow hover key={appointment._id}>
                                <TableCell>
                                  {`${capitalize(
                                    appointment.patientRef.lastName
                                  )} ${capitalize(
                                    appointment.patientRef.firstName
                                  )}`}
                                </TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>
                                  {appointment.hour}{" "}
                                  {hourFormat(appointment.hour)}
                                </TableCell>
                                <TableCell>
                                  <SeverityPill
                                    color={
                                      appointment.confirmed
                                        ? "success"
                                        : "error"
                                    }
                                    onClick={() => onClick(appointment)}
                                    sx={{ cursor: "pointer" }}
                                  >
                                    {appointment.confirmed
                                      ? "Confirmed"
                                      : "Cancelled"}
                                  </SeverityPill>
                                </TableCell>
                              </TableRow>
                            ))}
                      </TableBody>
                    </Table>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </DashboardLayout>
  );
}
