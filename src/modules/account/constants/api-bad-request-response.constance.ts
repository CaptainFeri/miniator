export const DELETE_ACCOUNT_BAD = {
    schema: {
        type: 'object',
        example: {
            message: [
                {
                    target: {
                        password: 'string',
                    },
                    value: 'string',
                    property: 'string',
                    children: [],
                    constraints: {},
                },
            ],
            error: 'Bad Request',
        },
    },
    description: '400. ValidationException',
}

export const UPDATE_ACCOUNT_BAD = {
    schema: {
      type: 'object',
      example: {
        message: [
          {
            target: {
              email: 'string',
              password: 'string',
            },
            value: 'string',
            property: 'string',
            children: [],
            constraints: {},
          },
        ],
        error: 'Bad Request',
      },
    },
    description: '400. ValidationException',
  }