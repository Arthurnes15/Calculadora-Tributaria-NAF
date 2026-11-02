import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Cadastro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  /*
    As varíaveis abaixo (inputNameRef, inputEmailRef e inputPasswordRef, inputConfirmPasswordRef), são usadas no alerta das mensagens de erro pelos leitores de tela. O hook useRef pode ser usado particularmente para manipular a DOM. Nesse contexto de acessiblidade, os leitores de tela só conseguem ler as mensagens de erro se os inputs (com erros) estiverem com o atributo focus ativo, portanto, na ocorrência de algum erro, através das variáveis abaixo o atributo focus é ativado nos respectivos inputs.

    Para mais detalhes do hook useRef, consulte sua documentação no link abaixo: 
    https://react.dev/reference/react/useRef
  */
  const inputNameRef = useRef(null);
  const inputEmailRef = useRef(null);
  const inputPasswordRef = useRef(null);
  const inputConfirmPasswordRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};

    if (!name) {
      inputNameRef.current.focus();
      newErrors.name = "Por favor, preencha o campo de nome.";
    }
    if (!email) {
      inputEmailRef.current.focus();
      newErrors.email = "Por favor, preencha o campo de email.";
    } else if (!email.includes("@") || !email.includes(".")) {
      inputEmailRef.current.focus();
      newErrors.email = "Por favor, informe um email válido (contendo '@' e '.').";
    }
    if (!password) {
      inputPasswordRef.current.focus();
      newErrors.password = "Por favor, preencha o campo de senha.";
    }
    if (!confirmPassword) {
      inputConfirmPasswordRef.current.focus();
      newErrors.confirmPassword = "Por favor, confirme sua senha.";
    } else if (password !== confirmPassword) {
      inputConfirmPasswordRef.current.focus();
      newErrors.confirmPassword = "As senhas não coincidem.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});

    try {
      await api.post("/auth/register", { name, email, password });

      alert("Cadastro realizado com sucesso! Agora você pode fazer o login.");
      navigate("/login");

    } catch (error) {
      const mensagemErro = error.response?.data?.error || "Erro ao conectar com o servidor.";
      alert(mensagemErro);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <article className="flex flex-col items-center justify-center min-h-screen bg-naf-light p-4">
      <h1
        className={`text-3xl font-bold text-center mb-6 text-naf-blue transition-all duration-[700ms] ease-out delay-[100ms]`}
      >
        CALCULADORA DE IMPOSTO DE RENDA
      </h1>

      <main
        className={`w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl border border-naf-gray/30 transition-all duration-[700ms] ease-out`}
      >
        <h2
          className={`text-2xl font-bold text-center mb-6 text-naf-blue transition-all duration-[700ms] ease-out delay-[200ms]`}
        >
          Criar Conta
        </h2>
        {/* TODO: Change buttons to a list */}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div
            className={`transition-all duration-[700ms] ease-out delay-[300ms] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <label htmlFor="username" className="block mb-1 text-sm font-medium text-naf-blue">
              Nome Completo
            </label>
            <input
              id="username"
              type="text"
              placeholder="Digite seu nome"
              value={name}
              ref={inputNameRef}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 border border-naf-gray rounded-xl focus:ring-2 focus:ring-naf-blue ${errors.name ? "focus:ring-naf-red" : ""} outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:shadow-sm`}
              aria-invalid={errors.name}
              aria-errormessage="error_username"
            />
            {errors.name && (
              <p id="error_username" className="mt-1 text-xs text-naf-red font-medium">{errors.name}</p>
            )}
          </div>

          <div
            className={`transition-all duration-[700ms] ease-out delay-[400ms] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-naf-blue">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              ref={inputEmailRef}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border border-naf-gray rounded-xl focus:ring-2 focus:ring-naf-blue ${errors.email ? "focus:ring-naf-red" : ""} outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:shadow-sm`}
              aria-invalid={errors.email}
              aria-errormessage="error_email"
            />
            {errors.email && (
              <p id="error_email" className="mt-1 text-xs text-naf-red font-medium">{errors.email}</p>
            )}
          </div>

          <div
            className={`transition-all duration-[700ms] ease-out delay-[500ms] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-naf-blue">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="Crie uma senha segura"
              value={password}
              ref={inputPasswordRef}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border border-naf-gray rounded-xl focus:ring-2 focus:ring-naf-blue ${errors.password ? "focus:ring-naf-red" : ""} outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:shadow-sm`}
              aria-invalid={errors.password}
              aria-errormessage="error_password"
            />
            {errors.password && (
              <p id="error_password" className="mt-1 text-xs text-naf-red font-medium">{errors.password}</p>
            )}
          </div>

          <div
            className={`transition-all duration-[700ms] ease-out delay-[600ms] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-naf-blue">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repita a senha"
              value={confirmPassword}
              ref={inputConfirmPasswordRef}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2 border border-naf-gray rounded-xl focus:ring-2 focus:ring-naf-blue ${errors.confirmPassword ? "focus:ring-naf-red" : ""} outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:shadow-sm`}
              aria-invalid={errors.confirmPassword}
              aria-errormessage="error_confirmPassword"
            />
            {errors.confirmPassword && (
              <p id="error_confirmPassword" className="mt-1 text-xs text-naf-red font-medium">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div
            className={`pt-2 transition-all duration-[700ms] ease-out delay-[700ms] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <button
              type="submit"
              className="w-full bg-naf-red text-white font-bold py-3 rounded-xl hover:bg-[#a62b18] focus:ring-4 focus:ring-naf-blue outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:scale-105 shadow-md cursor-pointer"
            >
              Cadastrar
            </button>
          </div>
        </form>

        <p
          className={`text-center text-sm text-naf-blue mt-6 transition-all duration-[700ms] ease-out delay-[800ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Já tem conta?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-naf-red hover:underline font-bold bg-transparent border-none p-0 cursor-pointer"
          >
            Faça login
          </button>
        </p>
      </main>
    </article>
  );
}
