export const CredentialsSchema = {
  type: 'object',
  required: ['clientid'],
  properties: {
    clientid: {
      type: 'array',
    }
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};
