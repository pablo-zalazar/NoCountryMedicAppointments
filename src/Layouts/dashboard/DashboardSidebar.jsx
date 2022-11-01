import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Divider, Drawer, Typography, useMediaQuery } from "@mui/material";
import { Logo } from "../../components/ui/Logo";
import { NavItem } from "./NavItem";
import { useSelector } from "react-redux";

const Patientitems = [
  {
    href: "/dashboard",
    title: "Dashboard",
  },
  {
    href: "/dashboard/PatientProfile",
    title: "Profile",
  },
  {
    href: "/dashboard/appointments",
    title: "Appointments",
  },
  {
    href: "/dashboard/createAppointment",
    title: "New Appointment",
  },
];

const Professionalitems = [
  {
    href: "/dashboard",
    title: "Dashboard",
  },
  {
    href: "/dashboard/ProfessionalProfile",
    title: "Profile",
  },
  {
    href: "/dashboard/appointments",
    title: "Appointments",
  },
  {
    href: "/dashboard/clinicalHistory",
    title: "Clinical History",
  },
  {
    href: "/dashboard/updateClinicalHistory",
    title: "Update Clinical History",
  },
];

export const DashboardSidebar = (props) => {
  const { user } = useSelector((state) => state.users);
  const { open, onClose } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  const adminItems = [
    {
      href: "/dashboard",
      title: "Dashboard",
    },
    {
      href: "/dashboard/ProfessionalProfile",
      title: "Profile",
    },
    {
      href: "/admin/AllProfessionals",
      title: "Professionals List",
    },
    {
      href: "/dashboard/edit",
      title: "Change App Name",
    },
  ];

  useEffect(() => {
    if (user) setLoading(false);
  }, [user]);

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const itemsArray = () => {
    if (user) {
      if (user.isAdmin) {
        return adminItems;
      } else {
        return user.isProfessional ? Professionalitems : Patientitems;
      }
    } else {
      return [];
    }
  };

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink href="/dashboard" passHref>
              <a>
                <Logo variant="h5" />
              </a>
            </NextLink>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box
              className="animate__animated animate__fadeInLeft"
              sx={{
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                cursor: "default",
                display: "flex",
                justifyContent: "space-between",
                px: 3,
                py: "11px",
                borderRadius: 1,
              }}
            >
              <div>
                <Typography color="inherit" variant="subtitle1">
                  MediApp
                </Typography>
                <Typography color="neutral.400" variant="body2">
                  Medical Appointments
                </Typography>
              </div>
              {/* <SelectorIcon
                sx={{
                  color: 'neutral.500',
                  width: 14,
                  height: 14
                }}
              /> */}
            </Box>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: "#2D3748",
            my: 3,
          }}
        />
        {loading ? (
          <p></p>
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            {itemsArray().map((item) => (
              <NavItem key={item.title} href={item.href} title={item.title} />
            ))}
            <NavItem
              key="Change Password"
              title="Change Password"
              href={`/${user?._id}/NewPassword`}
            />
          </Box>
        )}
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
