export const validation = {
    data() {
      return {
        rules: {
          required: value => !!value || 'This field is required.',
          email(v) {
            return (
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) ||
                !v ||
                'Invalid email format'
            );
          },
          minLength: min => value => {
            return value.length >= min || `Minimum length is ${min} characters.`;
          },
          maxLength: max => value => {
            return value.length <= max || `Maximum length is ${max} characters.`;
          }        
        }
      };
    },
  };
  