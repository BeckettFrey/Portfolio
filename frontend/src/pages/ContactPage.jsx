import React from 'react';
import { FaGithub, FaLinkedin, FaTimes } from 'react-icons/fa';
import { CONTACT_PAGE_CONTENT, getFormConfig, getSocialLinks } from './constants/contactPageConstants';

const ContactPage = () => {
  const content = CONTACT_PAGE_CONTENT;
  const formConfig = getFormConfig();
  const socialLinks = getSocialLinks();

  return (
    <div className={`min-h-screen ${content.theme.background} font-sans`}>
      {/* Close Button */}
      <div className="fixed top-6 left-6 z-50">
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
          <h1 className={`text-6xl font-bold bg-gradient-to-r from-${content.theme.colors.gradientFrom} to-${content.theme.colors.gradientTo} bg-clip-text text-transparent mb-6`}>
            {content.header.title}
          </h1>
          <div className={`w-24 h-1 bg-gradient-to-r from-${content.theme.colors.gradientFrom} to-${content.theme.colors.gradientTo} mx-auto rounded-full`}></div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <form action={formConfig.action} method={formConfig.method}>
            <fieldset className="space-y-6">
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
              </div>
              <hr className="border-gray-200" />
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
              </div>
              <hr className="border-gray-200" />
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
                <input
                  type="hidden"
                  name={formConfig.hiddenFields.subject.name}
                  id={formConfig.hiddenFields.subject.id}
                  value={formConfig.hiddenFields.subject.value}
                />
              </div>
              <input
                type="submit"
                value={formConfig.submitButton.value}
                className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 cursor-pointer"
              />
            </fieldset>
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