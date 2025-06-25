
'use client';
import { useForm, ValidationError } from '@formspree/react';
import { contactConstants } from './config';
import { ContactFormConfig } from './types';
import { CorePage } from '@layout';
import { FORMSPREE_CODE } from '@/globals/config/identity';
import Link from 'next/link';

const ContactForm = () => {
  const formConfig: ContactFormConfig['form'] = contactConstants.form;
  const [state, handleSubmit] = useForm(FORMSPREE_CODE);

  if (state.succeeded) {
    return (
      <CorePage header="Contact">
        <div className="text-center mt-24">
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
      </CorePage>
    );
  }

  return (
    <>
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-12 border border-white/10">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {Object.values(formConfig.fields).map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-lg font-semibold text-white mb-2">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={'rows' in field ? (field as { rows: number }).rows : 3}
                    {...field}
                    className="w-full p-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-300"
                  />
                ) : (
                  <input
                    {...field}
                    className="w-full p-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-300"
                  />
                )}
                <ValidationError prefix={field.label} field={field.name} errors={state.errors} className="text-red-400 text-sm mt-1" />
                <hr className="border-white/20 mt-4" />
              </div>
            ))}

            <input {...formConfig.hiddenFields.subject} type="hidden" />

            <button
              type="submit"
              disabled={state.submitting}
              className={`mt-4 px-6 py-3 font-semibold rounded-xl transition-all duration-200 ${
                state.submitting
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer hover:scale-105'
              }`}
            >
              {state.submitting ? 'Sending...' : formConfig.submitButton.value}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ContactForm;