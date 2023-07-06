import React, { useContext, useEffect, useState } from 'react';
import { Card, Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { BalanceContext } from './BalanceContext';
import '../Balances/Balances.css';

const BalanceContainer = ({ month }) => {
  const { balances, setBalances, balanceMes, setBalanceMes, gastos, setGastos } = useContext(BalanceContext);
  const [montosSeleccionados, setMontosSeleccionados] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalEgresos, setTotalEgresos] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/${month}`);
        if (response.ok) {
          const data = await response.json();
          const copiedData = JSON.parse(JSON.stringify(data));
          setBalances(copiedData);
          setGastos(copiedData.gastos);
          let ingreso = 0;
          let egreso = 0;
          for (let gasto of copiedData.gastos) {
            if (gasto.tipo === 'ingreso') {
              ingreso += Number(gasto.cantidad);
            } else if (gasto.tipo === 'egreso') {
              egreso -= Number(gasto.cantidad);
            }
          }
          calcularBalance(ingreso, egreso);
          calcularIngresos(ingreso);
          calcularEgresos(egreso);
        } else {
          setBalances({});
        }
      } catch (error) {
        console.error('Error al obtener los balances:', error);
      }
    };

    fetchData();
  }, [month]);

  // Calcula el balance total sumando ingresos y egresos
  const calcularBalance = (ingreso, egreso) => {
    const balance = ingreso - egreso;
    setBalanceMes(balance.toFixed(2));
  };

  // Calcula el total de ingresos
  const calcularIngresos = (ingreso) => {
    setTotalIngresos(ingreso.toFixed(2));
  };

  // Calcula el total de egresos
  const calcularEgresos = (egreso) => {
    setTotalEgresos(egreso.toFixed(2));
  };

  // Cambia el estado de "isChecked" del gasto seleccionado
	const toggleCheck = (gasto) => {
		localStorage.setItem('isChecked_' + gasto.id, !gasto.isChecked);
		setGastos((prevGastos) =>
			prevGastos.map((prevGasto) =>
				prevGasto.id === gasto.id ? { ...prevGasto, isChecked: !prevGasto.isChecked } : prevGasto
			)
		);
	};

  // Agrega los montos seleccionados al balance total
  const agregarMontos = (event) => {
		event.preventDefault();
    let nuevoBalance = parseFloat(balanceMes);
    let nuevosIngresos = parseFloat(totalIngresos);
    let nuevosEgresos = parseFloat(totalEgresos);

    gastos.forEach((gasto) => {
			if (gasto.isChecked && !gasto.agregado) {
				if (gasto.tipo === 'ingreso') {
					nuevosIngresos += Number(gasto.cantidad);
					nuevoBalance += Number(gasto.cantidad);
				} else if (gasto.tipo === 'egreso') {
					nuevosEgresos -= Number(gasto.cantidad); // Resta el monto de egreso a los egresos
					nuevoBalance -= Number(gasto.cantidad); // Resta el monto de egreso al balance
					gasto.cantidad = Number(gasto.cantidad); // Actualiza el monto de egreso en los gastos
				}
			
				gasto.agregado = true;
			}
			
    });

    // Actualiza el balance del mes
    setBalanceMes(nuevoBalance.toFixed(2));

    // Actualiza los totales de ingresos y egresos en el estado
    setTotalIngresos(nuevosIngresos.toFixed(2));
    setTotalEgresos(nuevosEgresos.toFixed(2));

    // Restablece el estado de verificación de todos los gastos
    setGastos((prevGastos) =>
      prevGastos.map((prevGasto) => ({
        ...prevGasto,
        isChecked: false,
      }))
    );
  };

  // Calcula los totales de ingresos y egresos del balance
  const calcularTotalesBalance = () => {
    let totalIngresos = 0;
    let totalEgresos = 0;

    gastos.forEach((gasto) => {
      if (gasto.tipo === 'ingreso') {
        totalIngresos += Number(gasto.cantidad);
      } else if (gasto.tipo === 'egreso') {
        totalEgresos -= Number(gasto.cantidad);
      }
    });

    return { totalIngresos, totalEgresos };
  };

  return (
    <Container className="balance">
      {Object.keys(balances).length === 0? (
        <p>Aún no se han ingresado los datos para este mes.</p>
      ) : (
        <>
          <Card className="d-flex flex-column align-items-center  container-balances mt-3 increased-height">
            <h2 className="fs-6 mt-3 fw-bold">Balance del Mes</h2>
            <h1 className="text-primary mb-3 fw-bolder mt-3">${balanceMes}</h1>
            <div className="row mt-3 align-items-center w-100">
              <div className="col ingresos justify-content-center">
                <h1 className="text-success fs-6 texto-centrado">Ingresos</h1>
                <h1 className="text-success fs-2 fw-bolder texto-centrado">+${totalIngresos}</h1>
              </div>
              <div className="col gastos justify-content-center">
                <h1 className="text-danger fs-6 texto-centrado">Gastos</h1>
                <h1 className="text-danger fs-2 fw-bolder texto-centrado">${totalEgresos}</h1>
              </div>
              <div className="align-items-center texto-centrado mt-3 analiticas fs-7">
                <span>Ver Analiticas</span>
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
            </div>
          </Card>

          <div className="mt-3 mb-custom">
            {gastos.reduce((acc, gasto, index, arr) => {
              if (index > 0 && gasto.dia === arr[index - 1].dia) {
                acc.push(
                  <Card className="mb-1" key={index}>
                    <div className="card-conceptos">
                      <div className="check">
                         <input
														type="checkbox"
														className={`styled-checkbox ${gasto.agregado ? 'styled-checkbox--green' : ''}`}
														checked={gasto.isChecked}
														onChange={() => toggleCheck(gasto)}
													/>
                        {gasto.concepto}{' '}
                      </div>
                      <span className={gasto.tipo === 'ingreso' ? 'text-success' : 'text-danger'}>
                        {gasto.tipo === 'ingreso' ? `+${gasto.cantidad.toFixed(2)}` : `-${gasto.cantidad.toFixed(2)}`}{' '}
                        <FontAwesomeIcon icon={faAngleDown} />
                      </span>
                    </div>
                  </Card>
                );
              } else {
                acc.push(
                  <div key={index}>
                    <h2 className="fs-6 mt-3">
                      {gasto.dia} {month}.
                    </h2>
                    <Card className="mb-1" key={index}>
                      <div className="card-conceptos">
                        <div className="check">
													<input
														type="checkbox"
														className={`styled-checkbox ${gasto.agregado ? 'styled-checkbox--green' : ''}`}
														checked={gasto.isChecked}
														onChange={() => toggleCheck(gasto)}
													/>
                          <span>{gasto.concepto}{' '}</span>
                        </div>
                        <span className={gasto.tipo === 'ingreso' ? 'text-success' : 'text-danger'}>
                          {gasto.tipo === 'ingreso' ? `+${gasto.cantidad.toFixed(2)}` : `-${gasto.cantidad.toFixed(2)}`}{' '}
                          <FontAwesomeIcon icon={faAngleDown} />
                        </span>
                      </div>
                    </Card>
                  </div>
                );
              }
              return acc;
            }, [])}
          </div>
        </>
      )}

      <div
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}
      >
        <Button
          variant="primary"
          style={{ backgroundColor: 'blue', color: 'white' }}
          onClick={agregarMontos}
          disabled={!gastos.some((gasto) => gasto.isChecked && !gasto.agregado)}
          className="button"
        >
          Agregar Movimiento
        </Button>
      </div>
    </Container>
  );
};

export default BalanceContainer;
