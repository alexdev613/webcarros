import { useEffect, useState } from 'react';

interface ZoomImageProps {
  src: string;
}

export function ZoomImage({ src }: ZoomImageProps) {
  const [zoomed, setZoomed] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});

  useEffect(() => {
    if (zoomed) {
      const handleMouseMove = (event: MouseEvent) => {
        const target = event.target as HTMLElement; // Convertendo event.target para HTMLElement
        const { clientX, clientY } = event;
        const { left, top, width, height } = target.getBoundingClientRect(); // Usando getBoundingClientRect no elemento HTMLElement

        const xPercent = (clientX - left) / width;
        const yPercent = (clientY - top) / height;

        setZoomStyle({
          backgroundPosition: `${xPercent * 100}% ${yPercent * 100}%`,
        });
      };

      document.addEventListener('mousemove', handleMouseMove);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [zoomed]);

  const toggleZoom = () => {
    setZoomed(!zoomed);
  };

  return (
    <div
      className='relative cursor-zoom-in overflow-hidden rounded-lg'
      style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
      onClick={toggleZoom}
    >
      <img src={src} alt='Zoomed Image' className='w-full h-auto transition-transform duration-300' style={zoomStyle} />
    </div>
  );
}
