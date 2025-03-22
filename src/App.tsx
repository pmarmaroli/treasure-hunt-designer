import React, { useState } from 'react';
import { Gift } from 'lucide-react';

type Child = {
  name: string;
  code: string;
  message: string;
};

const children: Child[] = [
  {
    name: 'Malik',
    code: '362480',
    message: 'Bravo Malik ! Ton cadeau est caché sous la boîte à outil dans le garage !',
  },
  {
    name: 'Naïm',
    code: '03624',
    message: 'Bravo Naïm ! Ton cadeau est caché dans les t-shirts de Papa.',
  },
  {
    name: 'Layla',
    code: '80362',
    message: 'Bravo Layla ! Ton cadeau est caché dans le frigo !',
  },
  {
    name: 'Assya',
    code: '48036',
    message: 'Bravo Assya ! Ton cadeau est caché dans le coffre de ton lit !',
  },
  {
    name: 'Sohan',
    code: '684840',
    message: 'Bravo Sohan ! Ton cadeau est caché dans la baignoire !',
  },
];

function App() {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [code, setCode] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState(false);

  const handleChildSelect = (child: Child) => {
    setSelectedChild(child);
    setCode('');
    setShowMessage(false);
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChild && code === selectedChild.code) {
      setShowMessage(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 820);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-12 drop-shadow-lg">
          Chasse au Trésor 
          <Gift className="inline-block ml-4 animate-bounce" />
        </h1>

        {!selectedChild ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child) => (
              <button
                key={child.name}
                onClick={() => handleChildSelect(child)}
                className="bg-white rounded-xl p-6 text-2xl font-bold text-purple-600 shadow-lg 
                         hover:transform hover:scale-105 transition-all duration-300
                         hover:bg-purple-600 hover:text-white"
              >
                {child.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto">
            <button
              onClick={() => setSelectedChild(null)}
              className="mb-4 text-purple-600 hover:text-purple-800"
            >
              ← Retour
            </button>
            
            <h2 className="text-2xl font-bold text-purple-600 mb-6">
              {selectedChild.name}
            </h2>

            {!showMessage ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Entre ton code secret à {selectedChild.code.length} chiffres :
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg ${
                      error 
                        ? 'border-red-500 animate-shake' 
                        : 'border-purple-300 focus:border-purple-500'
                    }`}
                    maxLength={selectedChild.code.length}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg
                           hover:bg-purple-700 transition-colors duration-300"
                >
                  Valider
                </button>
              </form>
            ) : (
              <p className="text-lg text-gray-800 animate-reveal">
                {selectedChild.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;