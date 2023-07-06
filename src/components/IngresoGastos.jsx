import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { BalanceContext } from './Balances/BalanceContext';

const AddMovementForm = () => {
  const { setGastos } = useContext(BalanceContext);
  const [concepto, setConcepto] = useState('');
  const [tipo, setTipo] = useState('ingreso');
  const [cantidad, setCantidad] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const newGasto = {
      id: Math.random(), // Esto es solo un ejemplo, deberías usar una id única real
      concepto,
      tipo,
      cantidad: Number(cantidad),
      isChecked: false,
      agregado: false,
    };
    setGastos((prevGastos) => [...prevGastos, newGasto]);
    setConcepto('');
    setTipo('ingreso');
    setCantidad('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formConcepto">
        <Form.Label>Concepto</Form.Label>
        <Form.Control type="text" value={concepto} onChange={(e) => setConcepto(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formTipo">
        <Form.Label>Tipo</Form.Label>
        <Form.Control as="select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formCantidad">
        <Form.Label>Cantidad</Form.Label>
        <Form.Control type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Agregar Movimiento
      </Button>
    </Form>
  );
};

export default AddMovementForm;
