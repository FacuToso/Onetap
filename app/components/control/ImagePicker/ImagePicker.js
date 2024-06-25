import ImagePickerCard from "./ImagePickerCard";
import classes from 'styles/image-picker.module.css';

const ImagePicker = ({ images, selectedImageUrl, onChangeSelectedImage }) => {
  return (
    <div className={classes.container}>
      {images.map((image) => (
        <ImagePickerCard
          key={image.imageUrl}
          selected={selectedImageUrl === image.imageUrl}
          imageUrl={image.imageUrl}
          onSelect={onChangeSelectedImage}
        />
      ))}
    </div>
  )
};

export default ImagePicker;
