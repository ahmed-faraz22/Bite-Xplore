import React, { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import "../assets/style/Contact.css";
import Button from "../components/Button";

const Contact = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is your response time?",
      answer: "We typically respond within 48 hours.",
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes, we offer 24/7 customer support.",
    },
    {
      question: "How can I reach you?",
      answer: "You can reach us via email or phone.",
    },
    {
      question: "What are your working hours?",
      answer: "We are available from 9 AM to 6 PM (Mon-Fri).",
    },
    {
      question: "What areas do you serve?",
      answer:
        "We currently offer our services in select locations. Please check the availability in your area",
    },
  ];

  return (
    <section className="contact">
      <div className="container">
        <div className="inner">
          <h1>Contact Us</h1>
          <div className="about-content">
            <div className="faq">
              {faqs.map((faq, index) => (
                <div className="accordion" key={index}>
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion(index)}
                  >
                    <h4>{faq.question}</h4>
                    <span>
                      {openIndex === index ? (
                        <MdKeyboardArrowUp />
                      ) : (
                        <MdKeyboardArrowDown />
                      )}
                    </span>
                  </div>
                  <div
                    className={`accordion-content ${
                      openIndex === index ? "show" : ""
                    }`}
                  >
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
            <div className="about-form">
              <form>
                <label htmlFor="userName">Name: </label>
                <input type="text" name="userName" />

                <label htmlFor="userEmail">Email: </label>
                <input type="email" name="userEmail" />

                <label htmlFor="userSubject">Subject: </label>
                <input type="tel" name="userSubject" />

                <label htmlFor="userMessage">Message: </label>
                <textarea name="userMessage" rows={5}></textarea>
                <div className="form-btn">
                  <Button buttonLink={"#"} buttonText={`submit`} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
