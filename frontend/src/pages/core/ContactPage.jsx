import { useForm, ValidationError } from '@formspree/react';
import { FaGithub, FaLinkedin, FaTimes } from 'react-icons/fa';
import { CONTACT_PAGE_CONFIG, getFormConfig, getSocialLinks } from '../local_config/contactPageConfig';
import { FORMSPREE_CODE } from '../local_config/userConfig';

const ContactPage = () => {
  const formConfig = getFormConfig();
  const socialLinks = getSocialLinks();

  const [state, handleSubmit] = useForm(FORMSPREE_CODE);

  // Success state - show thank you message
  if (state.succeeded) {
    return (
      <div className={`min-h-screen ${CONTACT_PAGE_CONFIG.theme.background} font-sans flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-4xl font-bold bg-gradient-to-r from-${CONTACT_PAGE_CONFIG.theme.colors.gradientFrom} to-${CONTACT_PAGE_CONFIG.theme.colors.gradientTo} bg-clip-text text-transparent mb-4`}>
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
    <div className={`min-h-screen ${CONTACT_PAGE_CONFIG.theme.background} font-sans`}>
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
          <h1 className={`text-6xl font-bold bg-gradient-to-r from-${CONTACT_PAGE_CONFIG.theme.colors.gradientFrom} to-${CONTACT_PAGE_CONFIG.theme.colors.gradientTo} bg-clip-text text-transparent mb-6`}>
            {CONTACT_PAGE_CONFIG.header.title}
          </h1>
          <div className={`w-24 h-1 bg-gradient-to-r from-${CONTACT_PAGE_CONFIG.theme.colors.gradientFrom} to-${CONTACT_PAGE_CONFIG.theme.colors.gradientTo} mx-auto rounded-full`}></div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor={formConfig.fields.name.id} className="block text-lg font-semibold text-gray-800 mb-2">
                  {formConfig.fields.name.label}
                </label>
                <input
                  type={formConfig.fields.name.type}
                  name={formConfig.fields.name.name}
                  id={formConfig.fields.name.id}
                  placeholder={formConfig.fields.name.placeholder}
                  required={formConfig.fields.name.required}
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
                <label htmlFor={formConfig.fields.email.id} className="block text-lg font-semibold text-gray-800 mb-2">
                  {formConfig.fields.email.label}
                </label>
                <input
                  type={formConfig.fields.email.type}
                  name={formConfig.fields.email.name}
                  id={formConfig.fields.email.id}
                  placeholder={formConfig.fields.email.placeholder}
                  required={formConfig.fields.email.required}
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
                <label htmlFor={formConfig.fields.message.id} className="block text-lg font-semibold text-gray-800 mb-2">
                  {formConfig.fields.message.label}
                </label>
                <textarea
                  rows={formConfig.fields.message.rows}
                  name={formConfig.fields.message.name}
                  id={formConfig.fields.message.id}
                  placeholder={formConfig.fields.message.placeholder}
                  required={formConfig.fields.message.required}
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
                name={formConfig.hiddenFields.subject.name}
                id={formConfig.hiddenFields.subject.id}
                value={formConfig.hiddenFields.subject.value}
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
                {state.submitting ? 'Sending...' : formConfig.submitButton.value}
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