import React, { useState, useEffect } from 'react';
import SliderBar from './components/SlideBar/SlideBar';
import BalanceContainer from './components/Balances/Balances';
import { BalanceProvider } from './components/Balances/BalanceContext';
import '../src/App.css'
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const [selectedMonth, setSelectedMonth] = useState(0);
  const [ingresos, setIngresos] = useState(0);
  const [gastos, setGastos] = useState(0);
	

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    setSelectedMonth(currentMonth);
  }, []);

  const handleMonthChange = (index) => {
    setSelectedMonth(index);
  };

  const handleFormSubmit = (newIngresos, newGastos) => {
    if (selectedMonth === new Date().getMonth()) {
      setIngresos(newIngresos);
      setGastos(newGastos);
    } else {
      console.log("Movimiento agregado")
    }
  };

	

  return (
    <div>
      <SliderBar meses={meses} selectedMonth={selectedMonth} handleMonthChange={handleMonthChange} />
      <BalanceProvider>
				<BalanceContainer
					month={meses[selectedMonth]}
					ingresos={ingresos}
					gastos={gastos}
				/>
			</BalanceProvider>
    </div>
  );
};

export default App;

