import React, { useState, useRef, useEffect, useContext } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../SlideBar/SlideBar.css';

// Crear un nuevo contexto
const SliderBarContext = React.createContext();

const SliderBar = ({ meses, handleMonthChange }) => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const sliderRef = useRef(null);

  const settings = {
		dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  arrows: false,
  centerMode: true,
  beforeChange: (current, next) => setSelectedMonth(next),
  };

  useEffect(() => {
    sliderRef.current.slickGoTo(selectedMonth);
    handleMonthChange(selectedMonth);
  }, [selectedMonth, handleMonthChange]);

  const handleMonthClick = (index) => {
    setSelectedMonth(index);
  };

  return (
    <SliderBarContext.Provider value={{ selectedMonth }}>
      <Slider {...settings} ref={sliderRef} className="bc text-white slider">
        {meses.map((mes, index) => (
          <div
            key={index}
            className={`month ${selectedMonth === index ? 'active' : ''}`}
            onClick={() => handleMonthClick(index)}
          >
            {mes}
          </div>
        ))}
      </Slider>
    </SliderBarContext.Provider>
  );
};

// Ejemplo de uso del contexto dentro de otro componente
const ExampleComponent = () => {
  const { selectedMonth } = useContext(SliderBarContext);

  // Aquí puedes utilizar el valor de selectedMonth en tu componente

  return <div>Valor del mes seleccionado: {selectedMonth}</div>;
};

export default SliderBar;
