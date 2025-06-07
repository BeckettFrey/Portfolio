import { useForm, ValidationError } from '@formspree/react';
import { FaGithub, FaLinkedin, FaTimes } from 'react-icons/fa';
import { GITHUB_USERNAME, LINKEDIN_URL, FORMSPREE_CODE } from './config';

// Define constants directly in this file
export const contactConstants = {
  header: {
    title: "Contact"
  },
  form: {
    fields: {
      name: {
        label: "Full Name",
        placeholder: "First and Last",
        type: "text",
        name: "name",
        id: "full-name",
        required: true
      },
      email: {
        label: "Email Address",
        placeholder: "***@domain",
        type: "email",
        name: "email",
        id: "email-address",
        required: true
      },
      message: {
        label: "Message",
        placeholder: "Tell me what's on your mind...",
        type: "textarea",
        name: "message",
        id: "message",
        rows: 5,
        required: true
      }
    },
    hiddenFields: {
      subject: {
        name: "_subject",
        id: "email-subject",
        value: "Contact Form Submission"
      }
    },
    submitButton: {
      value: "Send Message"
    }
  },
  socialLinks: [
    {
      platform: "GitHub",
      url: `https://github.com/${GITHUB_USERNAME}`,
      icon: "FaGithub",
      backgroundColor: "bg-gray-800",
      hoverColor: "hover:bg-gray-900",
      textColor: "text-white"
    },
    {
      platform: "LinkedIn",
      url: LINKEDIN_URL,
      icon: "FaLinkedin",
      backgroundColor: "bg-blue-700",
      hoverColor: "hover:bg-blue-800",
      textColor: "text-white"
    }
  ],
  theme: {
    colors: {
      primary: "blue-600",
      secondary: "purple-600",
      gradientFrom: "blue-600",
      gradientTo: "purple-600",
      focusRing: "focus:ring-blue-600"
    },
    background: "bg-gradient-to-br from-slate-50 to-slate-100"
  }
};

export const getFormConfig = () => contactConstants.form;
export const getSocialLinks = () => contactConstants.socialLinks;

const ContactPage = () => {
  const socialLinks = getSocialLinks();
  const [state, handleSubmit] = useForm(FORMSPREE_CODE);

  if (state.succeeded) {
    return (
      <div className={`min-h-screen ${contactConstants.theme.background} font-sans flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-4xl font-bold bg-gradient-to-r from-${contactConstants.form.theme?.colors?.gradientFrom || contactConstants.theme.colors.gradientFrom} to-${contactConstants.form.theme?.colors?.gradientTo || contactConstants.theme.colors.gradientTo} bg-clip-text text-transparent mb-4`}>
            Thank You!
          </h2>
          <p className="text-xl text-gray-700 mb-8">Your message has been sent successfully.</p>
          <a 
            href="/" 
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${contactConstants.theme.background} font-sans`}>
      {/* Close Button */}
      <div className="absolute top-6 left-6 z-50 w-full">
        <a 
          href="/" 
          className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <FaTimes className="text-xl" />
        </a>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className={`text-6xl font-bold bg-gradient-to-r from-${contactConstants.theme.colors.gradientFrom} to-${contactConstants.theme.colors.gradientTo} bg-clip-text text-transparent mb-6`}>
            {contactConstants.header.title}
          </h1>
          <div className={`w-24 h-1 bg-gradient-to-r from-${contactConstants.theme.colors.gradientFrom} to-${contactConstants.theme.colors.gradientTo} mx-auto rounded-full`}></div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor={contactConstants.form.fields.name.id} className="block text-lg font-semibold text-gray-800 mb-2">
                  {contactConstants.form.fields.name.label}
                </label>
                <input
                  type={contactConstants.form.fields.name.type}
                  name={contactConstants.form.fields.name.name}
                  id={contactConstants.form.fields.name.id}
                  placeholder={contactConstants.form.fields.name.placeholder}
                  required={contactConstants.form.fields.name.required}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <ValidationError 
                  prefix="Name" 
                  field="name"
                  errors={state.errors}
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <hr className="border-gray-200" />

              {/* Email Field */}
              <div>
                <label htmlFor={contactConstants.form.fields.email.id} className="block text-lg font-semibold text-gray-800 mb-2">
                  {contactConstants.form.fields.email.label}
                </label>
                <input
                  type={contactConstants.form.fields.email.type}
                  name={contactConstants.form.fields.email.name}
                  id={contactConstants.form.fields.email.id}
                  placeholder={contactConstants.form.fields.email.placeholder}
                  required={contactConstants.form.fields.email.required}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <ValidationError 
                  prefix="Email" 
                  field="email"
                  errors={state.errors}
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <hr className="border-gray-200" />

              {/* Message Field */}
              <div>
                <label htmlFor={contactConstants.form.fields.message.id} className="block text-lg font-semibold text-gray-800 mb-2">
                  {contactConstants.form.fields.message.label}
                </label>
                <textarea
                  rows={contactConstants.form.fields.message.rows}
                  name={contactConstants.form.fields.message.name}
                  id={contactConstants.form.fields.message.id}
                  placeholder={contactConstants.form.fields.message.placeholder}
                  required={contactConstants.form.fields.message.required}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
                <ValidationError 
                  prefix="Message" 
                  field="message"
                  errors={state.errors}
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Hidden Subject Field */}
              <input
                type="hidden"
                name={contactConstants.form.hiddenFields.subject.name}
                id={contactConstants.form.hiddenFields.subject.id}
                value={contactConstants.form.hiddenFields.subject.value}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={state.submitting}
                className={`mt-4 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  state.submitting 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                }`}
              >
                {state.submitting ? 'Sending...' : contactConstants.form.submitButton.value}
              </button>
            </div>
          </form>
        </div>

        {/* Social Links */}
        <div className="fixed bottom-2 right-4 flex space-x-4">
          {socialLinks.map((link) => {
            const IconComponent = link.icon === 'FaGithub' ? FaGithub : FaLinkedin;
            return (
              <a 
                key={link.platform}
                href={link.url} 
                className={`${link.textColor} ${link.backgroundColor} ${link.hoverColor} p-3 rounded-full transition-all duration-300`}
              >
                <IconComponent className="text-xl" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;