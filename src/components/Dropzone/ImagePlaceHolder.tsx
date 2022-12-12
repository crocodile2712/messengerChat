import ImageIcon from '@mui/icons-material/Image';
import Avatar from '@mui/material/Avatar';

interface ImagePlaceHolderProps {
  src: string | null;
}

const ImagePlaceHolder = (props: ImagePlaceHolderProps) => {
  const { src } = props;

  return (
    <Avatar
      alt="Image"
      src={src || void 0}
      sx={{
        width: 178,
        height: 100,
        '& > img': {
          objectFit: 'contain',
        },
      }}
    >
      <ImageIcon />
    </Avatar>
  );
};

export default ImagePlaceHolder;
