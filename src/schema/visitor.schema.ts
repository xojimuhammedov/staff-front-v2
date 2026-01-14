import * as yup from 'yup';

export const visitorSchema = yup.object().shape({
  firstName: yup.string() ,
  lastName: yup.string().required(),
  middleName: yup.string(),
  birthday: yup.object().nullable(),
  additionalDetails: yup.string(),
  phone: yup.string(),
  pinfl: yup.string(),
  workPlace: yup.string(),
  passportNumber: yup.string(),
  attachId: yup.number(),
  organizationId: yup
    .number()
    .when('$role', (role: any, schema) =>
      role === 'ADMIN' ? schema.required() : schema.optional()
    ),
});

export const onetimeCodeSchema = yup.object().shape({
  codeType: yup.string().required(),
  startDate: yup.mixed().required(),
  endDate: yup.mixed().required(),
  additionalDetails: yup.string(),
  isActive: yup.boolean(),
});