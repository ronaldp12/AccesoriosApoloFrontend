import { useState } from 'react';
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
  };

  return (
    <section className='contact-section'>
        <div className="logo-contact-form">
            <img src={img1} alt="img background contact form" className='img-background-contact-form' />
          <h1>Contáctanos</h1>
        </div>

        <div className="contact-form-container">
          <div onSubmit={handleSubmit}>
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
                />
              </div>
              <div className="contact-form-group">
                <label htmlFor="email">Correo:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder='Escribe aquí tu correo'
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='form-row'>
              <div className="contact-form-group">
                <label htmlFor="phone">Teléfono:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder='Escribe aquí tu teléfono'
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="contact-form-group">
              <label htmlFor="message">Escribe aquí tu mensaje:</label>
              <textarea
                id="message"
                name="message"
                placeholder="Mensaje"
                value={formData.message}
                onChange={handleInputChange}
              />
            </div>

            <div className="contact-method">
              <h3>¿Cómo quieres que te contactemos?</h3>
              <div className="contact-options">
                <div className="contact-option">
                  <input
                    type="radio"
                    id="correo"
                    name="contactMethod"
                    value="correo"
                    onChange={handleInputChange}
                  />
                  <label htmlFor="correo">Correo</label>
                </div>
                <div className="contact-option">
                  <input
                    type="radio"
                    id="whatsapp"
                    name="contactMethod"
                    value="whatsapp"
                    onChange={handleInputChange}
                  />
                  <label htmlFor="whatsapp">WhatsApp</label>
                </div>
                <div className="contact-option">
                  <input
                    type="radio"
                    id="llamada"
                    name="contactMethod"
                    value="llamada"
                    onChange={handleInputChange}
                  />
                  <label htmlFor="llamada">Llamada</label>
                </div>
              </div>
            </div>

            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
              />
              <label htmlFor="terms">
                Acepto Términos y Condiciones
              </label>
            </div>

            <button onClick={handleSubmit} className="submit-btn-contact-form">
              Enviar
            </button>
          </div>
        </div>

      </section >
  );
}