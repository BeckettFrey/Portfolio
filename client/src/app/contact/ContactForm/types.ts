export interface FormField {
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'textarea';
  name: string;
  id: string;
  required: boolean;
  rows?: number;
}

export interface HiddenField {
  name: string;
  id: string;
  value: string;
}

export interface ContactFormConfig {
  form: {
    fields: {
      name: FormField;
      email: FormField;
      message: FormField;
    };
    hiddenFields: {
      subject: HiddenField;
    };
    submitButton: {
      value: string;
    };
  };
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: 'FaGithub' | 'FaLinkedin';
    backgroundColor: string;
    hoverColor: string;
    textColor: string;
  }>;
}

export type FormFieldUnion =
  ContactFormConfig['form']['fields'][keyof ContactFormConfig['form']['fields']];