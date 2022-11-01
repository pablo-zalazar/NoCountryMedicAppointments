import axios from "axios";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "../../components/auth";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import * as React from "react";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { DashboardLayout } from "../../Layouts/dashboard/DashboardLayout";

export default function GetClinicHistories() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { user } = useSelector((state) => state.users);

  const { enqueueSnackbar } = useSnackbar();
  const [patientList, setPatientList] = useState([]);
  const [clinicHistory, setClinicHistory] = useState([]);
  const [patientClinicalRef, setPatientClinicalRef] = useState("");
  const [filteredList, setFilteredList] = useState(true);

  useEffect(() => {
    const getPatientList = async () => {
      const { data } = await axios.get(`/api/resources/getPatientList`);

      const newList = [];
      data.map((patient) => {
        newList.push(patient.patientRef);
      });

      setPatientList(newList);
    };
    getPatientList();
  }, []);

  const submit = async () => {
    try {
      const url = `/api/clinicHistory/getClinicHistory`;

      const response = await axios.post(url, {
        clinicHistoryRef: patientClinicalRef,
      });

      if (filteredList) {
        const filteredHistory = [];

        response.data.history.map((history) => {
          const filtered = history.details.filter(
            (detail) => detail.professionalRef == user.professionalRef
          );

          if (filtered.length > 0) {
            const newHistory = {
              speciality: history.speciality,
              details: filtered,
            };
            filteredHistory.push(newHistory);
          }
        });
        setClinicHistory(filteredHistory);
      } else {
        setClinicHistory(response.data.history);
      }

      reset();
    } catch (e) {
      enqueueSnackbar("Error, Try again in a few minutes", {
        variant: "error",
        autoHideDuration: 1500,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      console.log(e.message);
    }
  };

  return (
    <DashboardLayout>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
          width: "100%",
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(submit)}
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="calc(100vh - 64px)"
      >
        <Stack
          spacing={2}
          sx={{
            display: "flex",
            width: "100%",
            maxWidth: "600px",
            justifyContent: "center",
          }}
        >
          <FormLabel component="legend">Clinic History</FormLabel>
          <FormControlLabel
            control={
              <Switch
                onChange={(e) => {
                  setFilteredList(!filteredList);
                  setClinicHistory([]);
                }}
              />
            }
            label="All professionals"
          />
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="select-autowidth-label">Patient Name</InputLabel>
            <Select
              label="Patient Name"
              {...register("patientName", {
                required: {
                  value: true,
                  message: "This field is required",
                },
              })}
              defaultValue=""
              error={errors.patient ? true : false}
              onChange={(e) => {
                setPatientClinicalRef(e.target.value);
                setClinicHistory([]);
              }}
              MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {patientList.map((patient) => (
                <MenuItem
                  key={uuidv4()}
                  value={patient.clinicHistoryRef}
                  sx={{ textTransform: "capitalize" }}
                >
                  {`${patient.firstName} ${patient.lastName}`}
                </MenuItem>
              ))}
            </Select>
            {errors.patient && (
              <Typography variant="body2" component="p" color="error">
                {errors.speciality.message}
              </Typography>
            )}
          </FormControl>

          <Button type="submit" variant="contained">
            Show
          </Button>

          {clinicHistory.length > 0 && (
            <div>
              {clinicHistory.map((speciality) => (
                <Accordion key={uuidv4()}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography sx={{ textTransform: "capitalize" }}>
                      {speciality.speciality.toLowerCase()}
                    </Typography>
                  </AccordionSummary>

                  {speciality.details.map((detail) => (
                    <div key={uuidv4()}>
                      <Divider />
                      <ListItem>
                        <AccordionDetails>
                          <Typography>• Date: {detail.date}</Typography>
                          <Typography>
                            • Professional: {detail.professionalName}
                          </Typography>
                          <Typography>
                            • Observations: {detail.observations}
                          </Typography>
                        </AccordionDetails>
                      </ListItem>
                    </div>
                  ))}
                </Accordion>
              ))}
            </div>
          )}
        </Stack>
      </Box>
    </DashboardLayout>
  );
}
