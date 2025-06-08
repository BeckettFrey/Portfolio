import { useForm, ValidationError } from '@formspree/react';
import { FaGithub, FaLinkedin, FaTimes } from 'react-icons/fa';
import { GITHUB_USERNAME, LINKEDIN_URL, FORMSPREE_CODE } from './config';
import { useMemo } from 'react';

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
      backgroundColor: "bg-gray-500",         // deep dark background
      hoverColor: "hover:bg-gray-600",        // subtle hover
      textColor: "text-gray-100"              // light text for contrast
    },
    {
      platform: "LinkedIn",
      url: LINKEDIN_URL,
      icon: "FaLinkedin",
      backgroundColor: "bg-blue-700",
      hoverColor: "hover:bg-blue-800",
      textColor: "text-white"
    }
  ]
};

export const getFormConfig = () => contactConstants.form;
export const getSocialLinks = () => contactConstants.socialLinks;

const ContactPage = () => {
  const socialLinks = useMemo(() => getSocialLinks(), []);
  const formConfig = useMemo(() => getFormConfig(), []);
  const [state, handleSubmit] = useForm(FORMSPREE_CODE);

  if (state.succeeded) {
    return (
      <div className="relative min-h-screen text-white font-sans overflow-hidden">
        <style jsx>{`
          .success-container {
            transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
          }
          @media (max-width: 767px) {
            .container {
              padding-left: 8px;
              padding-right: 8px;
              padding-top: 8px;
              padding-bottom: 8px;
            }
          }
        `}</style>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center success-container">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Thank You!
            </h2>
            <p className="text-xl text-gray-300 mb-8">Your message has been sent successfully.</p>
            <a 
              href="/" 
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
      <style jsx>{`
        .form-container {
          transition: opacity 0.2s ease-in-out;
        }
        .close-button {
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
        }
        .social-link {
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
        }
        .input-field {
          transition: border-color 0.2s ease-in-out, ring-color 0.2s ease-in-out;
        }
        .submit-button {
          transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
        }
        @media (max-width: 767px) {
          .container {
            padding-left: 8px;
            padding-right: 8px;
            padding-top: 8px;
            padding-bottom: 8px;
          }
        }
      `}</style>

      {/* Close Button */}
      <div className="absolute top-2 left-2 z-50">
        <a 
          href="/" 
          className="flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg close-button hover:scale-110"
          onTouchStart={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.location.href = '/';
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            window.location.href = '/';
          }}
        >
          <FaTimes className="text-lg" />
        </a>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl relative z-10 form-container">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            {contactConstants.header.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Form Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-12 border border-white/10">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor={formConfig.fields.name.id} className="block text-lg font-semibold text-white mb-2">
                  {formConfig.fields.name.label}
                </label>
                <input
                  type={formConfig.fields.name.type}
                  name={formConfig.fields.name.name}
                  id={formConfig.fields.name.id}
                  placeholder={formConfig.fields.name.placeholder}
                  required={formConfig.fields.name.required}
                  className="w-full p-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-300 input-field"
                />
                <ValidationError 
                  prefix="Name" 
                  field="name"
                  errors={state.errors}
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <hr className="border-white/20" />

              {/* Email Field */}
              <div>
                <label htmlFor={formConfig.fields.email.id} className="block text-lg font-semibold text-white mb-2">
                  {formConfig.fields.email.label}
                </label>
                <input
                  type={formConfig.fields.email.type}
                  name={formConfig.fields.email.name}
                  id={formConfig.fields.email.id}
                  placeholder={formConfig.fields.email.placeholder}
                  required={formConfig.fields.email.required}
                  className="w-full p-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-300 input-field"
                />
                <ValidationError 
                  prefix="Email" 
                  field="email"
                  errors={state.errors}
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              <hr className="border-white/20" />

              {/* Message Field */}
              <div>
                <label htmlFor={formConfig.fields.message.id} className="block text-lg font-semibold text-white mb-2">
                  {formConfig.fields.message.label}
                </label>
                <textarea
                  rows={formConfig.fields.message.rows}
                  name={formConfig.fields.message.name}
                  id={formConfig.fields.message.id}
                  placeholder={formConfig.fields.message.placeholder}
                  required={formConfig.fields.message.required}
                  className="w-full p-3 border border-white/20 bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-300 input-field"
                ></textarea>
                <ValidationError 
                  prefix="Message" 
                  field="message"
                  errors={state.errors}
                  className="text-red-400 text-sm mt-1"
                />
              </div>

              {/* Hidden Subject Field */}
              <input
                type="hidden"
                name={formConfig.hiddenFields.subject.name}
                id={formConfig.hiddenFields.subject.id}
                value={formConfig.hiddenFields.subject.value}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={state.submitting}
                className={`mt-4 px-6 py-3 font-semibold rounded-xl submit-button ${
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

        {/* Social Links */}
        <div className="fixed bottom-2 right-4 flex space-x-4 z-20">
          {socialLinks.map((link) => {
            const IconComponent = link.icon === 'FaGithub' ? FaGithub : FaLinkedin;
            return (
              <a 
                key={link.platform}
                href={link.url} 
                className={`${link.textColor} ${link.backgroundColor} ${link.hoverColor} p-3 rounded-full social-link hover:scale-110`}
              >
                <IconComponent className="text-xl" />
              </a>
            );
          })}
          
        </div>
        <div className="text-center text-sm text-gray-400">
  <p>Every exchange leaves a trace—subtle, unseen, but shaping. Reach out, and let the unknown begin to unfold.</p>
</div>
        
      </div>

      
    </div>
  );
};

export default ContactPage;