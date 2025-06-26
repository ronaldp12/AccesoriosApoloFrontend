import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ContactAboutUsHelp.css';
import { Logo } from '../../Ui/Logo/Logo';
import img1 from '../../../assets/images/img1-background-about.png';
import img2 from '../../../assets/images/img1-aboutus.png';
import img3 from '../../../assets/images/img1-help.png';
import { ContactForm } from '../../Layouts/ContactForm/ContactForm';

export const ContactAboutUsHelp = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [animatedElements, setAnimatedElements] = useState(new Set());
  const location = useLocation();

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.classList.add('animate-in');

          const children = element.querySelectorAll('.animate-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-in');
            }, index * 200);
          });
        }
      });
    }, observerOptions);

    const elementsToObserve = document.querySelectorAll(
      '.hero-section, .about-section, .values-section, .faq-section, .value-item, .faq-category, .store-image, .mission, .vision'
    );

    elementsToObserve.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  // Animación inicial de la página
  useEffect(() => {
    document.body.classList.add('page-loaded');
  }, []);

  const faqCategories = [
    {
      category: "Envíos y entregas",
      questions: [
        {
          question: "¿Hacen envíos a todo el país?",
          answer: "Sí realizamos envíos a todo el país. Utilizamos Servientrega para envíos nacionales y Coordinadora."
        },
        {
          question: "¿Cuánto tarda en llegar mi pedido?",
          answer: "Depende de la ubicación, pero en promedio el envío tarda entre 3 y 5 días hábiles."
        },
        {
          question: "¿Cómo puedo recibir mi pedido?",
          answer: "Al recibirlo lo pueden recibir en mi casa con el número de guía y el código para confirmar el pedido."
        },
        {
          question: "¿Qué pasa si no estoy en casa cuando llega el pedido?",
          answer: "Si no estás en casa, el mensajero intentará entregarlo hasta 2 veces. Si no se puede entregar, el pedido regresará a nuestras instalaciones."
        }
      ]
    },
    {
      category: "Pagos",
      questions: [
        {
          question: "¿Qué métodos de pago aceptan?",
          answer: "Aceptamos transferencias bancarias, pagos en efectivo y plataformas como PayPal o Mercado Pago."
        },
        {
          question: "¿Es seguro comprar en su sitio web?",
          answer: "Sí, utilizamos protocolos de seguridad avanzados y encriptación SSL para proteger los datos."
        }
      ]
    },
    {
      category: "Cambios y devoluciones",
      questions: [
        {
          question: "¿Cuál es la política de devoluciones?",
          answer: "Tienes hasta 7 días naturales después de recibir tu pedido para solicitar un cambio o devolución. El producto debe estar sin uso y en su empaque original."
        },
        {
          question: "¿Qué hago si recibí un producto equivocado o dañado?",
          answer: "Comunícate de inmediato, nos haremos cargo del cambio en cada ubicación para ti."
        },
        {
          question: "¿En cuánto tiempo recibiré mi reembolso?",
          answer: "Una vez aprobada la devolución, el reembolso se procesa en un plazo de 3 a 5 días hábiles dependiendo del método de pago."
        }
      ]
    },
    {
      category: "Cuenta",
      questions: [
        {
          question: "¿Cómo creo una cuenta en su sitio?",
          answer: "Haz clic en Crear cuenta en la parte superior del sitio e ingresa tus datos. Es rápido y sencillo."
        },
        {
          question: "¿Olvidé mi contraseña, cómo la recupero?",
          answer: "En la página de inicio de sesión, haz clic en ¿Olvidaste tu contraseña? y sigue las instrucciones para restablecerla."
        },
        {
          question: "¿Puedo comprar sin registrarme?",
          answer: "Sí, puedes hacer compras como invitado, pero recomendamos registrarte para acceder a tus pedidos, seguimiento y promociones."
        }
      ]
    },
    {
      category: "Soporte y Contacto",
      questions: [
        {
          question: "¿Cómo puedo comunicarme con atención al cliente?",
          answer: "Puedes escribirnos por Instagram, correo electrónico o usar el formulario de contacto en la web. También atendemos por Facebook."
        },
        {
          question: "¿Cuál es su horario de atención?",
          answer: "Lunes a viernes de 9:00 a.m. a 6:00 p.m., y sábados de 10:00 a.m. a 2:00 p.m. (hora local)."
        }
      ]
    }
  ];

  return (
    <div className="sobre-nosotros-container">
      {/* Hero Section */}
      <section className="hero-section animate-on-load">
        <div className="hero-overlay">
          <h1 className="animate-child">¡BIENVENIDOS!</h1>
          <h2 id='about-us-section' className="animate-child">ACCESORIOS APOLO</h2>
          <Logo styleContainer="logo-contact-welcome-container animate-child" styleLogo="logo-contact-welcome" />
        </div>
      </section>

      {/* About Section */}
      <section className="about-section animate-on-scroll">
        <div className="container-about-us">
          <h2 className="section-title-about-us animate-child">SOBRE NOSOTROS</h2>

          <img className='img-background-about' src={img1} alt="img-background" />

          <div className="about-content">
            <div className="store-image animate-child">
              <img src={img2} alt="Tienda Accesorios Apolo" />
            </div>

            <div id='mision-vision' className="about-text animate-child">
              <div className="mission-vision">
                <div className="mission animate-child">
                  <h3>Misión</h3>
                  <p>
                    En nuestra empresa de accesorios para móviles, nos
                    comprometemos a ofrecer productos de alta calidad que
                    protejan la organización de los consumidores, garantizando
                    seguridad, comodidad y estilo. Nos enfocamos en proveer
                    soluciones innovadoras y funcionales que se adapten a las
                    necesidades de cada cliente.
                  </p>
                  <p>
                    Nuestro propósito es no solo ofrecer a los consumidores con
                    los mejores productos y servicios, sino también educar sobre
                    seguridad en la construcción, creando una comunidad
                    comprometida con la protección de la integridad física de
                    clientes.
                  </p>
                </div>

                <div className="vision animate-child">
                  <h3>Visión</h3>
                  <p>
                    Nos visualizamos como líderes en la industria de accesorios
                    para móviles, siendo reconocidos por nuestro compromiso a
                    promocional por nuestros productos, calidad y compromiso
                    con la seguridad. Buscamos expandir continuamente nuestra
                    presencia en el mercado nacional e internacional y
                    certificar de vanguardia para brindar soluciones
                    innovadoras a nuestros clientes.
                  </p>
                  <p>
                    Aspiramos a ser un referente en la comunidad multimodal,
                    no solo por nuestros productos, sino por nuestra
                    compromiso con la educación civil y la promoción de la
                    seguridad en la construcción. Queremos ser la opción
                    preferida de los consumidores donde se compensen los
                    fabricantes con calidad, seguridad y excelencia en el
                    servicio.
                  </p>
                </div>
              </div>
            </div>
            <div id='values'></div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section animate-on-scroll">
        <div className="container-about-us">
          <h2 className="values-title animate-child">5 valores</h2>
          <h3 className="values-subtitle animate-child">FUNDAMENTALES</h3>

          <div className="values-grid">
            <div className="value-item animate-child">
              <div className="value-number">1
                <span>CALIDAD</span>
              </div>
            </div>

            <div className="value-item animate-child">
              <div className="value-number">2
                <span>PASIÓN</span>
              </div>
            </div>

            <div className="value-item animate-child">
              <div className="value-number">3
                <span>ATENCIÓN</span>
              </div>
            </div>
            <div id='help-section' className="value-item animate-child">
              <div className="value-number">4
                <span>INNOVACIÓN</span>
              </div>
            </div>
            <div className="value-item animate-child">
              <div className="value-number">5
                <span>SEGURIDAD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section animate-on-scroll">
        <div className="container-about-us">
          <h2 className="faq-title animate-child">AYUDA</h2>
          <h3 className="faq-subtitle animate-child">Preguntas frecuentes (FAQ)</h3>

          <img src={img3} alt="background-help" className='img-background-help' />

          <div className="faq-categories">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="faq-category animate-child">
                <h4>{category.category}</h4>

                <div className="faq-list">
                  {category.questions.map((faq, questionIndex) => {
                    const uniqueIndex = `${categoryIndex}-${questionIndex}`;
                    return (
                      <div key={uniqueIndex} className="faq-item">
                        <button
                          className={`faq-question ${openFaq === uniqueIndex ? 'active' : ''}`}
                          onClick={() => toggleFaq(uniqueIndex)}
                        >
                          {faq.question}
                          <span className={`faq-arrow ${openFaq === uniqueIndex ? 'open' : ''}`}>
                            ▼
                          </span>
                        </button>
                        <div className={`faq-answer ${openFaq === uniqueIndex ? 'open' : ''}`}>
                          {faq.answer && (
                            <p>{faq.answer}</p>
                          )}
                        </div>
                      </div>
                      
                    );
                  })}
                </div>
                 
              </div>
            ))}
            <div id='contact-section'></div>
          </div>
         
        </div>
        
      </section>
      {/* Contact Section */}
      <ContactForm />
    </div>
  );
};