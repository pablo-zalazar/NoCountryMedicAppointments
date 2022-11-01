import { Grid } from "../components/auth";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { actionAuthenticateUser } from "../store/slices/user";
import { useRouter } from "next/router";
import { Logo } from "../components/ui/Logo";

export const Layout = ({ children, logoUrl }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        dispatch(actionAuthenticateUser(token));
      } catch (e) {
        console.log(e);
      }
    }
  }, [dispatch]);

  return (
    <Grid
      container
      justifyContent="space-between"
      flexDirection={{ xs: "column-reverse", md: "row" }}
      spacing={0}
      width={"100%"}
      height={{ xs: "100vh" }}
    >
      <Grid
        item
        xs={12}
        md={7}
        display="flex"
        padding={3}
        sx={{ position: "absolute" }}
        top={0}
      >
        <Logo logoUrl={logoUrl} />
      </Grid>

      <Grid
        item
        container
        justifyContent={"center"}
        alignItems={"center"}
        display="flex"
        flexGrow={1}
        xs={12}
        md={7}
        pt={{ xs: 12 }}
        pl={{ xs: 2 }}
        pr={{ xs: 2 }}
      >
        {children}
      </Grid>
      <Grid
        item
        md={5}
        xs={12}
        overflow="hidden"
        // width={"100%"}
        sx={{
          backgroundImage: "url(/images/hospital2.png)",
          backgroundSize: "calc(100vh - 16vh)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></Grid>
    </Grid>
  );
};
