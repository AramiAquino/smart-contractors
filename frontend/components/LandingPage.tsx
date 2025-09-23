import { useState } from 'react';
import { LoginModal } from '@/components/LoginModal';
import { BackToTop } from '@/components/ui/BackToTop';
import { Button } from '@/components/ui/Button';
import { 
  ShieldCheckIcon, 
  CurrencyDollarIcon, 
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';

export const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-primary-600" />,
      title: "Pago Garantizado",
      description: "Tus fondos están seguros en escrow hasta que el trabajo esté completado y aprobado."
    },
    {
      icon: <CurrencyDollarIcon className="w-8 h-8 text-success-600" />,
      title: "Tarifas Transparentes", 
      description: "Solo 5% de comisión en transacciones exitosas. Sin costos ocultos ni suscripciones."
    },
    {
      icon: <ClockIcon className="w-8 h-8 text-blue-600" />,
      title: "Pagos con USDC",
      description: "Pagos seguros usando stablecoins USDC. Acceso a dólares digitales con paridad 1:1."
    },
    {
      icon: <UserGroupIcon className="w-8 h-8 text-purple-600" />,
      title: "Red Global de Talento",
      description: "Conecta con los mejores profesionales del mundo en tecnología y servicios digitales."
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "CEO, TechStart",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria&backgroundColor=3b82f6",
      quote: "Smart Contractors transformó nuestra forma de trabajar con freelancers. La seguridad del escrow nos da total tranquilidad.",
      rating: 5
    },
    {
      name: "Carlos Rodríguez", 
      role: "Desarrollador Full Stack",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos&backgroundColor=10b981",
      quote: "Como freelancer, finalmente tengo la garantía de que me van a pagar. Smart Contractors es increíblemente fácil de usar.",
      rating: 5
    },
    {
      name: "Ana Martínez",
      role: "Diseñadora UX/UI", 
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana&backgroundColor=f59e0b",
      quote: "Los pagos instantáneos han mejorado mi flujo de caja enormemente. Smart Contractors es el futuro del trabajo digital.",
      rating: 5
    }
  ];

  const stats = [
    { number: "10,000+", label: "Trabajos Completados" },
    { number: "$2.5M+", label: "Pagos Procesados" },
    { number: "5,000+", label: "Usuarios Activos" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">SC</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">Smart Contractors</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Características</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">Cómo Funciona</a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary-600 transition-colors">Testimonios</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors">Precios</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowLoginModal(true)}
              >
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => setShowLoginModal(true)}
                rightIcon={<ArrowRightIcon className="w-4 h-4" />}
              >
                Empezar Gratis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-blue-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
                Plataforma #1 en Contratación Inteligente
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Trabajo Digital
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600"> Seguro</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                La primera plataforma de freelancing con <strong>pagos garantizados por blockchain</strong>. 
                Conecta con talento global y trabaja con total confianza.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button 
                  size="xl"
                  onClick={() => setShowLoginModal(true)}
                  rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                  className="shadow-xl hover:shadow-2xl"
                >
                  Comenzar Ahora
                </Button>
                <Button 
                  size="xl" 
                  variant="outline"
                  leftIcon={<PlayCircleIcon className="w-5 h-5" />}
                >
                  Ver Demo
                </Button>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-success-500 mr-2" />
                  Conecta con MetaMask
                </div>
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-success-500 mr-2" />
                  Pagos garantizados
                </div>
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-success-500 mr-2" />
                  Contratos inteligentes
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-500">smartcontractors.com</div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4 border-l-4 border-primary-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Build React App</h4>
                        <p className="text-sm text-gray-600">Estado: En Progreso</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary-600">$500</div>
                        <div className="text-sm text-gray-500">USDC</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-success-50 to-emerald-50 rounded-lg p-4 border-l-4 border-success-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Smart Contract Audit</h4>
                        <p className="text-sm text-gray-600">Estado: Completado ✅</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-success-600">$300</div>
                        <div className="text-sm text-gray-500">Pagado</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-warning-50 to-orange-50 rounded-lg p-4 border-l-4 border-warning-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">UI/UX Design</h4>
                        <p className="text-sm text-gray-600">Estado: Abierto</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-warning-600">$250</div>
                        <div className="text-sm text-gray-500">En Escrow</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl animate-bounce-slow z-20">
                $2.5M+
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-success-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-xl animate-pulse-slow z-20">
                <ShieldCheckIcon className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          ¿Por qué elegir Smart Contractors?
        </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La única plataforma que garantiza pagos seguros usando tecnología blockchain, 
              eliminando riesgos tanto para clientes como trabajadores.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cómo Funciona
            </h2>
            <p className="text-xl text-gray-600">
              Proceso simple y seguro en 4 pasos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Publica tu Proyecto",
                description: "Describe tu trabajo y deposita los fondos en escrow seguro."
              },
              {
                step: "02", 
                title: "Encuentra Talento",
                description: "Freelancers calificados aplican a tu proyecto."
              },
              {
                step: "03",
                title: "Trabajo Completado", 
                description: "El freelancer entrega el trabajo según especificaciones."
              },
              {
                step: "04",
                title: "Pago Automático",
                description: "Aprueba el trabajo y el pago se libera instantáneamente."
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg relative z-20">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 -right-12 z-10">
                    <ArrowRightIcon className="w-6 h-6 text-primary-400 opacity-70" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-gray-600">
              Profesionales probando la nueva plataforma blockchain
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para trabajar con seguridad?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Experimenta el futuro del trabajo digital con contratos inteligentes en blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl"
              onClick={() => setShowLoginModal(true)}
              className="bg-white text-primary-600 hover:bg-gray-50 shadow-xl"
              rightIcon={<ArrowRightIcon className="w-5 h-5" />}
            >
              Probar Demo
            </Button>
            <Button 
              size="xl" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary-600"
            >
              Ver Documentación
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">SC</span>
                </div>
                <span className="ml-3 text-2xl font-bold">Smart Contractors</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                La plataforma líder en trabajo digital seguro. Conectamos talento global con 
                proyectos innovadores, garantizando pagos seguros para todos.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm font-bold">tw</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm font-bold">ln</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm font-bold">gh</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Smart Contractors. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacidad</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Términos</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};
