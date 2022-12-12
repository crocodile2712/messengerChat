import type { FormLabelProps } from '@mui/material/FormLabel';
import MuiFormLabel, { formLabelClasses } from '@mui/material/FormLabel';
import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';

interface LabelProps extends FormLabelProps {
  title: string;
  name: string;
  required?: boolean;
  gutterBottom?: boolean;
  gutterLeft?: boolean;
  noWrap?: boolean;
  TypographyProps?: TypographyProps;
}

const FormLabel = (props: LabelProps) => {
  const {
    title,
    name,
    required,
    gutterBottom,
    gutterLeft,
    noWrap,
    TypographyProps,
    ...rest
  } = props;

  return (
    <MuiFormLabel
      sx={{
        display: 'block',
        mb: gutterBottom ? '0.35em' : 0,
        ml: gutterLeft ? '0.75em' : 0,
        [`& .${formLabelClasses.asterisk}`]: {
          color: 'error.light',
        },
        ...(noWrap && {
          whiteSpace: 'nowrap',
        }),
      }}
      htmlFor={name}
      required={required}
      {...rest}
    >
      <Typography
        component="span"
        variant="body2"
        sx={{ fontWeight: 'bold' }}
        {...TypographyProps}
      >
        {title}
      </Typography>
    </MuiFormLabel>
  );
};

export default FormLabel;
