import React, { useState, useEffect } from 'react';

export default function PriceCalculator() {
  const [mainTitle, setMainTitle] = useState('');
  const [rooms, setRooms] = useState(1);
  const [finishingLevel, setFinishingLevel] = useState('standard');
  const [ceiling, setCeiling] = useState(false);
  const [shades, setShades] = useState(1);
  const [customItems, setCustomItems] = useState([]);
  const [customTitle, setCustomTitle] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [price, setPrice] = useState(null);
  const [vat, setVat] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [savedCalculations, setSavedCalculations] = useState([]);

  useEffect(() => {
    // Load saved calculations from local storage
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    setSavedCalculations(calculations);
  }, []);

  const handleCustomItemAdd = () => {
    if (customTitle && customPrice && !isNaN(customPrice)) {
      setCustomItems([...customItems, { title: customTitle, price: parseFloat(customPrice) }]);
      setCustomTitle('');
      setCustomPrice('');
    }
  };

  const calculatePrice = () => {
    const basePricePerRoom = 400;
    const levelCost = 100;
    const ceilingCost = 100;
    const shadeCost = 200;
    const vatRate = 0.17;

    // Determine the cost based on finishing level
    const levelMap = {
      standard: 0,
      premium: 1,
      luxury: 2,
      deluxe: 3,
    };
    const finishingLevelIndex = levelMap[finishingLevel];

    // Calculate base price
    let priceWithoutVAT = (basePricePerRoom + finishingLevelIndex * levelCost) * rooms;
    if (ceiling) {
      priceWithoutVAT += ceilingCost * rooms;
    }
    priceWithoutVAT += (shades - 1) * shadeCost * rooms;

    // Add custom items
    const customItemsTotal = customItems.reduce((total, item) => total + item.price, 0);

    // Calculate total price before VAT
    const totalPriceBeforeVAT = priceWithoutVAT + customItemsTotal;

    // Calculate VAT
    const vatAmount = totalPriceBeforeVAT * vatRate;
    
    // Calculate total price
    const totalPrice = totalPriceBeforeVAT + vatAmount;

    // Set state values
    setPrice(priceWithoutVAT.toFixed(2));
    setVat(vatAmount.toFixed(2));
    setTotalPrice(totalPrice.toFixed(2));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculatePrice();
  };

  const saveCalculation = () => {
    const calculation = {
      title: mainTitle,
      rooms,
      finishingLevel,
      ceiling,
      shades,
      customItems,
      priceWithoutVAT: price,
      vatAmount: vat,
      totalPrice,
    };
    const savedCalculations = JSON.parse(localStorage.getItem('calculations')) || [];
    savedCalculations.push(calculation);
    localStorage.setItem('calculations', JSON.stringify(savedCalculations));
    setSavedCalculations(savedCalculations);
  };

  const loadCalculation = (index) => {
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    const savedCalculation = calculations[index];
    setMainTitle(savedCalculation.title)
    setRooms(savedCalculation.rooms);
    setFinishingLevel(savedCalculation.finishingLevel);
    setCeiling(savedCalculation.ceiling);
    setShades(savedCalculation.shades);
    setCustomItems(savedCalculation.customItems);
    setPrice(savedCalculation.priceWithoutVAT);
    setVat(savedCalculation.vatAmount);
    setTotalPrice(savedCalculation.totalPrice);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="col-span-2">
            <label htmlFor="mainTitle" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="mainTitle"
              value={mainTitle}
              onChange={(e) => setMainTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-gray-900"
            />
          </div>
          
          <div>
            <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
              Number of Rooms
            </label>
            <input
              type="number"
              id="rooms"
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-gray-900"
              min="1"
            />
          </div>
          
          <div>
            <label htmlFor="finishingLevel" className="block text-sm font-medium text-gray-700">
              Level of Finishing
            </label>
            <select
              id="finishingLevel"
              value={finishingLevel}
              onChange={(e) => setFinishingLevel(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-gray-900"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
              <option value="deluxe">Deluxe</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ceiling"
              checked={ceiling}
              onChange={() => setCeiling(!ceiling)}
              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
            />
            <label htmlFor="ceiling" className="ml-2 block text-sm text-gray-900">
              Ceiling (additional cost)
            </label>
          </div>
          
          <div>
            <label htmlFor="shades" className="block text-sm font-medium text-gray-700">
              Shades
            </label>
            <input
              type="number"
              id="shades"
              value={shades}
              onChange={(e) => setShades(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-gray-900"
              min="1"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Items</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="customTitle" className="block text-sm font-medium text-gray-700">
                Custom Item Title
              </label>
              <input
                type="text"
                id="customTitle"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                           focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="customPrice" className="block text-sm font-medium text-gray-700">
                Custom Item Price
              </label>
              <input
                type="number"
                id="customPrice"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                           focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-gray-900"
                min="0"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCustomItemAdd}
            className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Add Custom Item
          </button>

          {customItems.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Added Custom Items</h4>
              <ul className="list-disc pl-5 mt-2">
                {customItems.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {item.title}: ₪{item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Calculate
          </button>

          <button
            type="button"
            onClick={saveCalculation}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Save Calculation
          </button>
        </div>
      </form>
      
      {price !== null && (
        <div className="mt-8 bg-gray-50 p-6 rounded-md shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Results</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Price Without VAT: 
              <span className="font-medium text-gray-900 ml-2">₪{(parseFloat(price) + customItems.reduce((total, item) => total + item.price, 0)).toFixed(2)}</span>
            </p>
            {customItems.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Custom Items Total</h3>
                <p className="text-sm text-gray-600">
                  ₪{customItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-600">VAT (17%): <span className="font-medium text-gray-900 ml-2">₪{vat}</span></p>
            <p className="text-sm text-gray-600">Total Price: <span className="font-medium text-gray-900 ml-2">₪{totalPrice}</span></p>
          </div>
        </div>
      )}

{savedCalculations.length > 0 && (
  <div className="mt-8 bg-sky-50 p-6 rounded-md shadow-sm border border-sky-100">
    <h3 className="text-xl font-semibold text-sky-900 mb-4">Saved Calculations</h3>
    <ul className="divide-y divide-sky-200">
      {savedCalculations.map((calc, index) => (
        <li key={index} className="py-3 first:pt-0 last:pb-0">
          <button
            onClick={() => loadCalculation(index)}
            className="w-full text-left flex items-center justify-between group bg-blue-500"
          >
            <span className="text-white-700  font-medium">
              {calc.title || `Calculation ${index + 1}`}
            </span>
            <span className="text-white-500 ">
              Load &rarr;
            </span>
          </button>
        </li>
      ))}
    </ul>
  </div>
)}
</div>
);
}