const { useEffect, useState } = require("react");

const useScreenSize = () => {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width,
    height,
  };
};

export default useScreenSize;
