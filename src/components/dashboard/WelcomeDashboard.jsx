import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  PeopleIcon,
} from '../../components/auth';
// import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import { capitalize } from '@mui/material';

import { useSelector } from 'react-redux';

export const WelcomeDashboard = (props) => {
  const { user } = useSelector((state) => state.users);

  return (
    <Card {...props} className="animate__animated animate__fadeIn">
      <CardContent sx={{ minHeight: 200 }}>
        <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              Welcome 👋
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {user?.firstName &&
                `${capitalize(user.firstName || '')} ${capitalize(
                  user.lastName || ''
                )}`}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: 'success.main',
                height: 56,
                width: 56,
              }}
            >
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
