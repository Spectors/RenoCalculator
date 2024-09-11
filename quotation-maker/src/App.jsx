import React from 'react';
import PriceCalculator from './components/PriceCalculator';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">House Coloring Price Calculator</h1>
          <PriceCalculator />
        </div>
      </div>
    </div>
  );
}

export default App;