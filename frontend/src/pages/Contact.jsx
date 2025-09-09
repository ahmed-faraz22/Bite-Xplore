import React, { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import "../assets/style/Contact.css";
import Button from "../components/Button";

const Contact = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userSubject: "",
    userMessage: "",
  });

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/v1/users/addNewsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Form submitted successfully!");
        setFormData({
          userName: "",
          userEmail: "",
          userSubject: "",
          userMessage: "",
        });
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting form");
    }
  };

  const faqs = [
    { question: "What is your response time?", answer: "We typically respond within 48 hours." },
    { question: "Do you offer customer support?", answer: "Yes, we offer 24/7 customer support." },
    { question: "How can I reach you?", answer: "You can reach us via email or phone." },
    { question: "What are your working hours?", answer: "We are available from 9 AM to 6 PM (Mon-Fri)." },
    { question: "What areas do you serve?", answer: "We currently offer our services in select locations." },
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
                      {openIndex === index ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                    </span>
                  </div>
                  <div className={`accordion-content ${openIndex === index ? "show" : ""}`}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>

            <div className="about-form">
              <form onSubmit={handleSubmit}>
                <label htmlFor="userName">Name: </label>
                <input type="text" name="userName" value={formData.userName} onChange={handleChange} required />

                <label htmlFor="userEmail">Email: </label>
                <input type="email" name="userEmail" value={formData.userEmail} onChange={handleChange} required />

                <label htmlFor="userSubject">Subject: </label>
                <input type="text" name="userSubject" value={formData.userSubject} onChange={handleChange} required />

                <label htmlFor="userMessage">Message: </label>
                <textarea name="userMessage" rows={5} value={formData.userMessage} onChange={handleChange} required />

                <div className="form-btn">
                  <Button type="submit" buttonText="Submit" />
                  {/* <button type="submit">Submit</button> */}
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