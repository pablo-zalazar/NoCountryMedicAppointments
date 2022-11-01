import { useForm } from "react-hook-form";
import axios from "axios";
import { useSnackbar } from "notistack";

import {
  Button,
  Stack,
  FormLabel,
  Box,
  FormControl,
  InputLabel,
  Typography,
  Select,
  MenuItem,
} from "../../components/auth";

import { DashboardLayout } from "../../Layouts/dashboard/DashboardLayout";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Calendar from "./calendar";

export default function NewAppointment() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();
  const { user } = useSelector((state) => state.users);
  const [professionals, setProfessionals] = useState([]);
  const [speciality, setSpeciality] = useState("");

  const [professional, setProfessional] = useState("");
  const [availability, setAvailability] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [date, setDate] = useState({ date: "", hour: "" });
  const [specialities, setSpecialities] = useState([]);


  useEffect(() => {
    const getResources = async () => {
      const { data: specialitiesList } = await axios.get(
        `/api/resources/getProfessionalSpecialitiesList`
      );

      specialitiesList.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

      setSpecialities(specialitiesList);
    };

    getResources();
  }, []);

  useEffect(() => {
    getData(speciality);
    setProfessional("");
    setAvailability([]);
    setAppointmentsList([]);
  }, [speciality]);

  useEffect(() => {
    if (professional) {
      async function fetchData() {
        try {
          const result = await axios.post(
            `/api/appointments/availableAppointments`,
            {
              professionalRef: professional,
            }
          );

          setAvailability(result.data[0]);
          setAppointmentsList(result.data[1]);
        } catch (e) {
          console.log(e);
        }
      }
      fetchData();
    }
  }, [professional]);

  const getData = async (speciality = "") => {
    const { data } = await axios.get(`/api/professionals/allProfessionals`);
    data = data.filter(
      (professional) =>
        professional.professionalRef.speciality.toLowerCase() ===
        speciality.toLowerCase()
    );
    setProfessionals(data);
  };

  const submit = async (values) => {
    values = {
      ...date,
      professionalRef: values.professionalRef,
      patientRef: user.patientRef,
      patientEmail: user.email,
    };
    try {
      const url = `/api/appointments/newAppointment`;
      await axios.post(url, values);
      reset();
      enqueueSnackbar("Appointment Created", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      router.push("/dashboard");
    } catch (e) {
      enqueueSnackbar("Error, Try again in a few minutes", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center", 
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
          <FormLabel component="legend">New Appointment</FormLabel>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Speciality
            </InputLabel>
            <Select
              label="Speciality"
              {...register("speciality", {
                required: {
                  value: true,
                  message: "This field is required",
                },
              })}
              error={errors.speciality ? true : false}
              onChange={(e) => setSpeciality(e.target.value)}
              MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
              defaultValue=""
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {specialities.map((speciality) => (
                <MenuItem key={speciality._id} value={speciality.name}>
                  {speciality.name}
                </MenuItem>
              ))}
            </Select>
            {errors.speciality && (
              <Typography variant="body2" component="p" color="error">
                {errors.speciality.message}
              </Typography>
            )}
          </FormControl>

          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Professional
            </InputLabel>
            <Select
              label="Professional"
              {...register("professionalRef", {
                required: {
                  value: true,
                  message: "This field is required",
                },
              })}
              error={errors.professionalRef ? true : false}
              defaultValue=""
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {professionals?.map(({ professionalRef }) => (
                <MenuItem
                  key={professionalRef?._id}
                  value={`${professionalRef?._id}`}
                  onClick={() => setProfessional(professionalRef._id)}
                >{`${professionalRef?.firstName} ${professionalRef?.lastName}`}</MenuItem>
              ))}
            </Select>
            {errors.professionalRef && (
              <Typography variant="body2" component="p" color="error">
                {errors.professionalRef.message}
              </Typography>
            )}
          </FormControl>

          <FormControl sx={{ width: "100%" }}>
            <Calendar
              availability={availability}
              appointmentsList={appointmentsList}
              date={date}
              setDate={setDate}
            />
          </FormControl>

          <Button type="submit" variant="contained">
            Create
          </Button>
        </Stack>
      </Box>
    </DashboardLayout>
  );
}
