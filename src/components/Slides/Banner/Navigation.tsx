import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { svgIconClasses } from '@mui/material/SvgIcon';
import type { ChangeEvent } from 'types/react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Props {
  length: number;
  index: number;
  scrollTo: (index: number) => void;
}

const Navigation = (props: Props) => {
  const { length, index, scrollTo } = props;
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange: (index: number) => ChangeEvent = (index) => () => {
    scrollTo(index);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'absolute',
        left: '50%',
        bottom: sm ? 2 : 5,
        transform: 'translateX(-50%)',
        color: 'common.white',
        zIndex: 2,
      }}
    >
      <FormControl>
        <RadioGroup row>
          {Array.from(Array(length).keys()).map((i) => (
            <Radio
              key={i}
              onChange={handleChange(i)}
              checked={index === i}
              sx={{
                p: 0.5,
                color: 'common.white',
                '&.Mui-checked': {
                  color: 'common.white',
                },
                [`& .${svgIconClasses.root}`]: {
                  fontSize: sm ? 10 : 15,
                },
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default Navigation;
