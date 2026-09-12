"use client";

import { useState } from "react";
import { CONTACT_EMAIL, CONTACT_WHATSAPP, CONTACT_WHATSAPP_URL } from "@/lib/site";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Support");
  const [message, setMessage] = useState("");

  function onSubmit(event) {
    event.preventDefault();
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;
  }

  return (
    <div className="wrap" style={{ padding: "32px 0 64px" }}>
      <h1>Contact</h1>
      <p className="lede">
        Email or WhatsApp if a tool failed, a guide is wrong, or you have a privacy question.
      </p>
      <div className="workspace" style={{ marginBottom: 24 }}>
        <p>
          Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <p>
          WhatsApp: <a href={CONTACT_WHATSAPP_URL}>{CONTACT_WHATSAPP}</a>
        </p>
      </div>
      <form className="workspace" onSubmit={onSubmit}>
        <label className="field">
          Your name
          <input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" />
        </label>
        <label className="field">
          Your email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
        </label>
        <label className="field">
          Subject
          <select value={subject} onChange={(event) => setSubject(event.target.value)}>
            <option>Support</option>
            <option>Privacy</option>
            <option>Guide correction</option>
            <option>Tool suggestion</option>
            <option>Other</option>
          </select>
        </label>
        <label className="field">
          Message
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} required />
        </label>
        <button className="btn btn-primary" type="submit">
          Open email draft
        </button>
        <p className="help">The button opens your email app with a prefilled draft. Nothing is stored on this website.</p>
      </form>
    </div>
  );
}
