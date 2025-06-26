// config.ts
import { ContactFormConfig } from './types';

export const contactConstants: ContactFormConfig = {
  form: {
    fields: {
      name: {
        label: 'Full Name',
        placeholder: 'First and Last',
        type: 'text',
        name: 'name',
        id: 'full-name',
        required: true
      },
      email: {
        label: 'Email Address',
        placeholder: '***@domain',
        type: 'email',
        name: 'email',
        id: 'email-address',
        required: true
      },
      message: {
        label: 'Message',
        placeholder: "Tell me what's on your mind...",
        type: 'textarea',
        name: 'message',
        id: 'message',
        rows: 5,
        required: true
      }
    },
    hiddenFields: {
      subject: {
        name: '_subject',
        id: 'email-subject',
        value: 'Contact Form Submission'
      }
    },
    submitButton: {
      value: 'Send Message'
    }
  },
  socialLinks: [
    {
      platform: 'GitHub',
      url: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}`,
      icon: 'FaGithub',
      backgroundColor: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600',
      textColor: 'text-gray-100'
    },
    {
      platform: 'LinkedIn',
      url: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
      icon: 'FaLinkedin',
      backgroundColor: 'bg-blue-700',
      hoverColor: 'hover:bg-blue-800',
      textColor: 'text-white'
    }
  ]
};
