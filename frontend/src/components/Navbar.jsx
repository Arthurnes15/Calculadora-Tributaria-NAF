import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuMobileVisible, setMenuMobileVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="w-full bg-naf-blue shadow-lg border-b border-naf-gray/20">
      <div className={`max-w-7xl ${isMenuMobileVisible ? "max-h-96" : "max-h-16"} mx-auto px-4 overflow-hidden transition-all duration-500 ease-in-out`}>
        <div className="flex justify-between items-center h-16">
          
          <div 
            className="w-full lg:w-3xs flex justify-between items-center gap-1.5 shrink-0 text-xl font-bold text-white tracking-wide "
          >
            <span onClick={() => navigate('/Home')} title="Voltar para a Página Inicial" className="cursor-pointer hover:text-naf-gray transition-colors duration-300">Calculadora Tributária</span>

            <div className="block lg:hidden">
              {!isMenuMobileVisible && (
                <svg onClick={() => setMenuMobileVisible(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer transition">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
              {isMenuMobileVisible && (
                <svg onClick={() => setMenuMobileVisible(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          </div>

          <div className="hidden items-center lg:flex">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => navigate('/Home')}
                className="px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Página Inicial
              </button>

              <div className="h-5 w-px bg-naf-gray/50 opacity-40 mx-0.5" />

              <button
                onClick={() => navigate('/calculo-pf')}
                className="px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Cálculo PF
              </button>

              <div className="h-5 w-px bg-naf-gray/50 opacity-40 mx-0.5" />

              <button
                onClick={() => navigate('/calculo-pj')}
                className="px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Cálculo PJ
              </button>

              <div className="h-5 w-px bg-naf-gray/50 opacity-40 mx-0.5" />

              <button
                onClick={() => navigate('/comparativo')}
                className="px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Comparativo
              </button>

              <div className="h-5 w-px bg-naf-gray/50 opacity-40 mx-0.5" />

              <button
                onClick={() => navigate('/historico')}
                className="px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Histórico
              </button>

              <div className="h-5 w-px bg-naf-gray/50 opacity-40 mx-0.5" />

              <button
                onClick={() => navigate('/faq')}
                className="px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                FAQ
              </button>

               <div className="h-5 w-px bg-naf-gray/50 opacity-40 mx-0.5" />

              <button
                onClick={() => navigate('/sobre')}
                className="px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Sobre
              </button>

              <div className="h-5 w-px bg-naf-gray/50 opacity-40 mx-0.5" />

            </div>

            <button
              onClick={() => handleLogout()}
              className="ml-5 px-4 py-2 bg-transparent border-2 border-naf-red text-naf-light rounded-lg text-sm font-bold hover:bg-naf-red hover:text-white hover:scale-105
              focus:bg-naf-red transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              Sair
            </button>
          </div>
        </div>
        {isMenuMobileVisible && (
          <nav className="w-full">
          <div className="flex items-center flex-col py-2">
            <button onClick={() => navigate('/Home')}
              className="w-1/3 px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap">
                Página Inicial
            </button>
            <div className="w-25 h-0.5 bg-naf-gray/50 opacity-40 mx-0.5" />
            <button onClick={() => navigate('/calculo-pf')}
              className="w-1/3 px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap">
                Cálculo PF
            </button>
            <div className="w-25 h-0.5 bg-naf-gray/50 opacity-40 mx-0.5" />
            <button onClick={() => navigate('/calculo-pj')}
              className="w-1/3 px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap">
                Cálculo PJ
            </button>
            <div className="w-25 h-0.5 bg-naf-gray/50 opacity-40 mx-0.5" />
            <button onClick={() => navigate('/comparativo')}
              className="w-1/3 px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap">
                Comparativo
            </button>
            <div className="w-25 h-0.5 bg-naf-gray/50 opacity-40 mx-0.5" />
            <button onClick={() => navigate('/historico')}
              className="w-1/3 px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap">
                Histórico
            </button>
            <div className="w-25 h-0.5 bg-naf-gray/50 opacity-40 mx-0.5" />
            <button onClick={() => navigate('/faq')}
              className="w-1/3 px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap">
                FAQ
            </button>
            <div className="w-25 h-0.5 bg-naf-gray/50 opacity-40 mx-0.5" />
            <button onClick={() => navigate('/sobre')}
              className="w-1/3 px-2.5 py-2 rounded-lg text-sm font-medium text-naf-light hover:bg-naf-red hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap">
                Sobre
            </button>
            <button onClick={() => handleLogout()}
            className="w-1/3 mt-2 px-4 py-2 bg-naf-red border-none text-naf-light rounded-lg text-sm font-bold">
              Sair
            </button>
          </div>
        </nav>
        )}
      </div>
      
    </nav>
  );
}
