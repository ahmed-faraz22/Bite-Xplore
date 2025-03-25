import React, { useState } from "react";
import "../assets/style/Contact.css";

const Contact = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <section className="contact">
        <div className="container">
          <div className="inner">
            <h1>Contact Us</h1>
            <div className="about-content">
              <div className="faq">
                <div className="accordion">
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion(0)}
                  >
                    What is your response time?
                  </div>
                  {openIndex === 0 && (
                    <div className="accordion-content">
                      We typically respond within 24 hours.
                    </div>
                  )}
                </div>

                <div className="accordion">
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion(1)}
                  >
                    Do you offer customer support?
                  </div>
                  {openIndex === 1 && (
                    <div className="accordion-content">
                      Yes, we offer 24/7 customer support.
                    </div>
                  )}
                </div>

                <div className="accordion">
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion(2)}
                  >
                    How can I reach you?
                  </div>
                  {openIndex === 2 && (
                    <div className="accordion-content">
                      You can reach us via email or phone.
                    </div>
                  )}
                </div>

                <div className="accordion">
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion(3)}
                  >
                    How can I reach you?
                  </div>
                  {openIndex === 3 && (
                    <div className="accordion-content">
                      You can reach us via email or phone.
                    </div>
                  )}
                </div>

                <div className="accordion">
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion(4)}
                  >
                    How can I reach you?
                  </div>
                  {openIndex === 4 && (
                    <div className="accordion-content">
                      You can reach us via email or phone.
                    </div>
                  )}
                </div>
              </div>
              <div className="about-form">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
                repudiandae soluta similique sed rerum explicabo laudantium
                eveniet reiciendis minima sequi, assumenda in tempore maxime
                quaerat sunt porro, temporibus ratione! Deserunt?
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
