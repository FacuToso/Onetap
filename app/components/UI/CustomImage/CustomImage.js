import Image from "next/image";

const CustomImage = ({ src, noImageFallback, noPlaceholder = false, ...rest }) => {
  return (
    <Image
      src={src || noImageFallback || '/images/general/no-image-available.webp'}
      alt="Image"
      quality={100}
      {...(!noPlaceholder && {
        placeholder: 'blur',
        blurDataURL: '/images/general/spinningwheel.gif', // TODO: change placeholder
      })}
      {...rest}
    />
  );
};

export default CustomImage;
