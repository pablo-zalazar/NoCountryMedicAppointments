import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { AccessibleForwardIcon, Box, Typography } from '../auth';

export const Logo = ({
  color = 'primary',
  variant = 'h3',
  component = 'h3',
  logoUrl = '/',
}) => {
  const { name } = useSelector((state) => state.ui);
  const router = useRouter();

  return (
    <Box
      onClick={() => router.push(logoUrl)}
      sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'row' }}
      className="animate__animated animate__fadeInLeft"
    >
      <Typography variant={variant} component={component}>
        <AccessibleForwardIcon sx={{ fontSize: 40 }} color={color} />
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {name}
      </Typography>
    </Box>
  );
};
