import React, { createContext, useState } from 'react';

export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balances, setBalances] = useState({});
  const [balanceMes, setBalanceMes] = useState('0.00');
  const [gastos, setGastos] = useState([]);

  return (
    <BalanceContext.Provider value={{ balances, setBalances, balanceMes, setBalanceMes, gastos, setGastos }}>
      {children}
    </BalanceContext.Provider>
  );
};
