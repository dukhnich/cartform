import { useState, useRef, useEffect } from 'react';
import './App.css';

const filterNonDigits = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 16) || '';
};

interface CardTypes {
  mastercard: boolean;
  visa: boolean;
  amex: boolean;
  discover: boolean;
  diners: boolean;
}

const getCartStyles = (str: string): CardTypes => {
  const number: number = Number(str.substring(0, 4).padEnd(4, '0'));

  const isMaster = (fourDigit: number): boolean =>
    (Math.floor(fourDigit / 100) > 50 && Math.floor(fourDigit / 100) < 56) || (fourDigit > 2220 && fourDigit < 2720);
  const isVisa = (fourDigit: number): boolean => Math.floor(fourDigit / 1000) === 4;
  const isAmericanExpress = (fourDigit: number): boolean =>
    Math.floor(fourDigit / 100) === 34 || Math.floor(fourDigit / 100) === 37;
  const isDiscover = (fourDigit: number): boolean =>
    fourDigit === 6011 || Math.floor(fourDigit / 100) === 65 || (fourDigit > 643 && fourDigit < 650);
  const isDinersClub = (fourDigit: number): boolean =>
    Math.floor(fourDigit / 100) === 36 || Math.floor(fourDigit / 100) === 55;

  return {
    mastercard: isMaster(number),
    visa: isVisa(number),
    amex: isAmericanExpress(number),
    discover: isDiscover(number),
    diners: isDinersClub(number),
  };
};

const INPUT_COUNT = Array.from(Array(4).keys());
console.log(INPUT_COUNT);
function App() {
  const [cartNumber, setCartNumber] = useState<string[]>(['']);
  const [currentInputNumber, setCurrentInputNumber] = useState(0);
  const [cartTypes, setCartTypes] = useState<CardTypes>(getCartStyles(''));

  const currentInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentInput?.current) {
      currentInput.current.focus();
    }
  }, [currentInputNumber]);

  const inputHandler = (e: React.FormEvent<HTMLInputElement>, n: number) => {
    const value = (e.target as HTMLInputElement).value || '';
    const fullValue = [...cartNumber];
    fullValue[n] = value;
    const stringNumbers: string = filterNonDigits(fullValue.join(''));
    const newNumber = stringNumbers.match(/.{1,4}/g) || [];
    setCartNumber(newNumber);
    setCartTypes(getCartStyles(stringNumbers));
    setCurrentInputNumber(n === INPUT_COUNT.length - 1 || value.length < 4 ? n : n + 1);
  };

  return (
    <div className="container">
      <h1>Your Payment</h1>
      <p>Enter your card number:</p>
      <div className="inputs">
        {INPUT_COUNT.map((n) => (
          <input
            key={n}
            ref={n === currentInputNumber ? currentInput : null}
            type="text"
            className="card-input"
            placeholder="XXXX"
            disabled={n > 0 && cartNumber[n - 1]?.length !== 4}
            onInput={(e) => inputHandler(e, n)}
            value={cartNumber[n] || ''}
          />
        ))}
      </div>
      <div className="cards">
        {Object.entries(cartTypes).map(([type, status]) => (
          <div key={type} className={`card-icon icon-${type} ${status ? 'active' : ''}`}></div>
        ))}
      </div>
    </div>
  );
}

export default App;
