import { useState, useEffect, useRef } from 'react';
import './ContactForm.css';
import img1 from '../../../assets/images/img1-background-contact.png'
import wheelIcon from '../../../assets/icons/img1-loader.png';

export const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        contactMethod: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [animatedElements, setAnimatedElements] = useState(new Set());
    const sectionRef = useRef(null);

    const animateInternalElements = () => {
        if (!sectionRef.current) return;

        const elements = [
            sectionRef.current.querySelector('.logo-contact-form h1'),
            sectionRef.current.querySelector('.logo-contact-form .img-background-contact-form'),
            sectionRef.current.querySelector('.contact-form-container form'),
            ...sectionRef.current.querySelectorAll('.form-row'),
            sectionRef.current.querySelector('.contact-method'),
            sectionRef.current.querySelector('.submit-btn-contact-form')
        ].filter(Boolean);

        elements.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
            }
        });

        setTimeout(() => {
            const img = sectionRef.current?.querySelector('.logo-contact-form .img-background-contact-form');
            if (img) {
                img.style.opacity = '1';
                img.style.transform = 'translateY(0)';
            }
        }, 100);

        setTimeout(() => {
            const title = sectionRef.current?.querySelector('.logo-contact-form h1');
            if (title) {
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }
        }, 200);

        setTimeout(() => {
            const form = sectionRef.current?.querySelector('.contact-form-container form');
            if (form) {
                form.style.opacity = '1';
                form.style.transform = 'translateY(0)';
            }
        }, 300);

        const formRows = sectionRef.current?.querySelectorAll('.form-row');
        formRows?.forEach((row, index) => {
            setTimeout(() => {
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, 400 + (index * 100));
        });

        setTimeout(() => {
            const contactMethod = sectionRef.current?.querySelector('.contact-method');
            if (contactMethod) {
                contactMethod.style.opacity = '1';
                contactMethod.style.transform = 'translateY(0)';

                const options = contactMethod.querySelectorAll('.contact-option');
                options.forEach((option, index) => {
                    setTimeout(() => {
                        option.style.opacity = '1';
                        option.style.transform = 'translateY(0)';
                    }, 100 + (index * 50));
                });
            }
        }, 700);

        setTimeout(() => {
            const submitBtn = sectionRef.current?.querySelector('.submit-btn-contact-form');
            if (submitBtn) {
                submitBtn.style.opacity = '1';
                submitBtn.style.transform = 'translateY(0)';
            }
        }, 800);
    };

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.classList.add('animate-in');

                    if (element.classList.contains('contact-form-container')) {
                        setTimeout(() => {
                            animateInternalElements();
                        }, 200);
                    }

                    setAnimatedElements(prev => new Set([...prev, element]));
                }
            });
        }, observerOptions);

        if (sectionRef.current) {
            const elementsToObserve = sectionRef.current.querySelectorAll(
                '.contact-section, .logo-contact-form, .contact-form-container'
            );
            elementsToObserve.forEach((el) => observer.observe(el));
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (sectionRef.current) {
            const contactSection = sectionRef.current.querySelector('.contact-section');
            if (contactSection) {
                contactSection.classList.add('animate-on-scroll');
            }

            const logoContactForm = sectionRef.current.querySelector('.logo-contact-form');
            if (logoContactForm) {
                logoContactForm.classList.add('animate-on-scroll');
            }

            const contactFormContainer = sectionRef.current.querySelector('.contact-form-container');
            if (contactFormContainer) {
                contactFormContainer.classList.add('animate-on-scroll');
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        e.target.style.transform = 'scale(1.02)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 150);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        const requiredFields = ['name', 'email', 'phone', 'message'];
        let isValid = true;

        requiredFields.forEach(field => {
            if (!formData[field]) {
                const input = sectionRef.current.querySelector(`[name="${field}"]`);
                if (input) {
                    input.style.borderColor = '#ef4444';
                    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    input.style.animation = 'shake 0.5s ease-in-out';
                    setTimeout(() => {
                        input.style.borderColor = '#e5e7eb';
                        input.style.boxShadow = 'none';
                        input.style.animation = 'none';
                    }, 1000);
                }
                isValid = false;
            }
        });

        if (!formData.contactMethod) {
            const contactOptions = sectionRef.current.querySelector('.contact-options');
            if (contactOptions) {
                contactOptions.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    contactOptions.style.animation = 'none';
                }, 500);
            }
            isValid = false;
        }

        if (!isValid) {
            setSubmitMessage('Por favor, completa todos los campos requeridos.');
            setTimeout(() => setSubmitMessage(''), 3000);
            return;
        }

        setIsSubmitting(true);

        try {
            const apiData = {
                nombre: formData.name,
                correo: formData.email,
                telefono: formData.phone,
                mensaje: formData.message,
                metodo_contacto: formData.contactMethod
            };

            const response = await fetch('https://accesoriosapolobackend.onrender.com/contacto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSubmitMessage('¡Mensaje enviado correctamente! Te contactaremos pronto.');

                setTimeout(() => {
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        message: '',
                        contactMethod: ''
                    });

                    setSubmitMessage('');
                }, 3000);

            } else {
                throw new Error(result.message || 'Error al enviar el mensaje');
            }

        } catch (error) {
            console.error('Error al enviar formulario:', error);

            setSubmitMessage('Error al enviar el mensaje. Por favor, intenta nuevamente.');

        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFocus = (e) => {
        const formGroup = e.target.closest('.contact-form-group');
        if (formGroup) {
            formGroup.style.transform = 'translateY(-2px)';
            formGroup.style.transition = 'all 0.3s ease';
        }
    };

    const handleBlur = (e) => {
        const formGroup = e.target.closest('.contact-form-group');
        if (formGroup) {
            formGroup.style.transform = 'translateY(0)';
        }
    };

    return (
        <div ref={sectionRef}>
            <section className='contact-section animate-on-scroll'>
                <div className="logo-contact-form animate-on-scroll">
                    <img src={img1} alt="img background contact form" className='img-background-contact-form' />
                    <h1>Contáctanos</h1>
                </div>

                <div className="contact-form-container animate-on-scroll">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="contact-form-group">
                                <label htmlFor="name">Nombre:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder='Escribe aquí tu nombre'
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="contact-form-group">
                                <label htmlFor="email">Correo electrónico:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder='tu@email.com'
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="contact-form-group">
                                <label htmlFor="phone">Teléfono:</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder='Número de teléfono'
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="contact-form-group full-width">
                                <label htmlFor="message">Mensaje:</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder='Escribe tu mensaje aquí...'
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    rows="4"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="contact-method">
                            <h3>¿Cómo prefieres que te contactemos?</h3>
                            <div className="contact-options">
                                <div className="contact-option">
                                    <input
                                        type="radio"
                                        id="email-contact"
                                        name="contactMethod"
                                        value="correo"
                                        checked={formData.contactMethod === 'correo'}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                    <label htmlFor="email-contact">Correo electrónico</label>
                                </div>
                                <div className="contact-option">
                                    <input
                                        type="radio"
                                        id="phone-contact"
                                        name="contactMethod"
                                        value="telefono"
                                        checked={formData.contactMethod === 'telefono'}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                    <label htmlFor="phone-contact">Teléfono</label>
                                </div>
                                <div className="contact-option">
                                    <input
                                        type="radio"
                                        id="whatsapp-contact"
                                        name="contactMethod"
                                        value="whatsapp"
                                        checked={formData.contactMethod === 'whatsapp'}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                    />
                                    <label htmlFor="whatsapp-contact">WhatsApp</label>
                                </div>
                            </div>
                        </div>

                        {submitMessage && (
                            <div className={`submit-message ${submitMessage.includes('Error') || submitMessage.includes('completa') ? 'error' : 'success'}`}>
                                {submitMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="submit-btn-contact-form"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    ENVIANDO...
                                    <img src={wheelIcon} alt="cargando" className="wheel-loader" />
                                </>
                            ) : (
                                'ENVIAR'
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};