import { useState, useEffect, useRef } from 'react';
import './ContactForm.css';
import img1 from '../../../assets/images/img1-background-contact.png'

export const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        contactMethod: '',
        acceptTerms: false
    });

    const [animatedElements, setAnimatedElements] = useState(new Set());
    const sectionRef = useRef(null);

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
                            const formRows = element.querySelectorAll('.form-row');
                            formRows.forEach((row, index) => {
                                setTimeout(() => {
                                    row.classList.add('animate-in');
                                }, index * 100);
                            });
                        }, 300);

                        setTimeout(() => {
                            const contactMethod = element.querySelector('.contact-method');
                            if (contactMethod) {
                                contactMethod.classList.add('animate-in');

                                const options = contactMethod.querySelectorAll('.contact-option');
                                options.forEach((option, index) => {
                                    setTimeout(() => {
                                        option.classList.add('animate-in');
                                    }, index * 100);
                                });
                            }
                        }, 600);

                        setTimeout(() => {
                            const termsCheckbox = element.querySelector('.terms-checkbox');
                            if (termsCheckbox) termsCheckbox.classList.add('animate-in');
                        }, 900);

                        setTimeout(() => {
                            const submitBtn = element.querySelector('.submit-btn-contact-form');
                            if (submitBtn) submitBtn.classList.add('animate-in');
                        }, 1000);
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
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        e.target.style.transform = 'scale(1.02)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 150);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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

        if (!formData.acceptTerms) {
            const termsCheckbox = sectionRef.current.querySelector('.terms-checkbox');
            if (termsCheckbox) {
                termsCheckbox.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    termsCheckbox.style.animation = 'none';
                }, 500);
            }
            isValid = false;
        }

        if (isValid) {
            const submitBtn = sectionRef.current.querySelector('.submit-btn-contact-form');
            if (submitBtn) {
                submitBtn.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
                submitBtn.textContent = '¡ENVIADO!';
                submitBtn.style.transform = 'scale(1.05)';

                setTimeout(() => {
                    submitBtn.style.background = 'linear-gradient(135deg, #1e40af, #3b82f6)';
                    submitBtn.textContent = 'ENVIAR';
                    submitBtn.style.transform = 'scale(1)';
                }, 2000);
            }

            console.log('Form submitted:', formData);

            setTimeout(() => {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    message: '',
                    contactMethod: '',
                    acceptTerms: false
                });
            }, 2000);
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
                                        value="email"
                                        checked={formData.contactMethod === 'email'}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="email-contact">Correo electrónico</label>
                                </div>
                                <div className="contact-option">
                                    <input
                                        type="radio"
                                        id="phone-contact"
                                        name="contactMethod"
                                        value="phone"
                                        checked={formData.contactMethod === 'phone'}
                                        onChange={handleInputChange}
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
                                    />
                                    <label htmlFor="whatsapp-contact">WhatsApp</label>
                                </div>
                            </div>
                        </div>

                        <div className="terms-checkbox">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="acceptTerms">
                                Acepto los términos y condiciones y autorizo el tratamiento de mis datos personales
                                de acuerdo con la política de privacidad.
                            </label>
                        </div>

                        <button type="submit" className="submit-btn-contact-form">
                            ENVIAR
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );

}