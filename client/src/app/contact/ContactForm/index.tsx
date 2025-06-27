'use client';

import Link from 'next/link';
import { useForm, ValidationError } from '@formspree/react';
import type { ContactFormConfig, FormFieldUnion } from './types';
import { panel as glassPanel } from '@globals/styles';

type ContactFormProps = {
  formspreeCode: string;
};

export default function ContactForm({ formspreeCode }: ContactFormProps) {
  const FORM: ContactFormConfig['form'] = {
    fields: {
      name: {
        label: 'Your Name',
        placeholder: 'Enter your name',
        type: 'text',
        name: 'name',
        id: 'name',
        required: true,
      },
      email: {
        label: 'Your Email',
        placeholder: 'Enter your email',
        type: 'email',
        name: 'email',
        id: 'email',
        required: true,
      },
      message: {
        label: 'Your Message',
        placeholder: 'Type your message here...',
        type: 'textarea',
        name: 'message',
        id: 'message',
        required: true,
        rows: 4,
      },
    },
    hiddenFields: {
      subject: {
        name: 'subject',
        id: 'subject',
        value: 'New Contact Form Submission',
      },
    },
    submitButton: {
      value: 'Send Message',
    },
  };

  const [state, handleSubmit] = useForm(formspreeCode);

  if (state.succeeded) {
    return (
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Thank You!
        </h2>
        <p className="text-xl text-gray-300 mb-8">Your message has been sent successfully.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className={glassPanel}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {Object.values(FORM.fields).map((field: FormFieldUnion) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-lg font-semibold text-white mb-2">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
               <textarea
                rows={field.rows ?? 3}
                {...field}
                className="w-full p-3 border border-white/20 bg-white/10 backdrop-blur-sm 
                          rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-sm
                          focus:outline-none focus:ring-2 focus:ring-blue-400 
                          text-white placeholder-gray-300 resize-y resize-handle"
              />
              ) : (
                <input
                  {...field}
                  className="w-full p-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-300"
                />
              )}
              <ValidationError
                prefix={field.label}
                field={field.name}
                errors={state.errors}
                className="text-red-400 text-sm mt-1"
              />
              <hr className="border-white/20 mt-4" />
            </div>
          ))}

          <input {...FORM.hiddenFields.subject} type="hidden" />

          <button
            type="submit"
            disabled={state.submitting}
            className={`mt-4 px-6 py-3 font-semibold rounded-xl transition-all duration-200 ${
              state.submitting
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer hover:scale-105'
            }`}
          >
            {state.submitting ? 'Sending...' : FORM.submitButton.value}
          </button>
        </div>
      </form>
    </div>
  );
}
