import * as yup from 'yup';

export const visitorSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  middleName: yup.string(),
  birthday: yup.object().nullable(),
  additionalDetails: yup.string(),
  phone: yup.string(),
  passportNumberOrPinfl: yup.string().required(),
  workPlace: yup.string(),
  attachedId: yup.number().required(),
  gateId: yup.number().required(),
  organizationId: yup
    .number()
    .when('$role', (role: any, schema) =>
      role === 'ADMIN' ? schema.required() : schema.optional()
    ),
});

export const visitorEditSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  middleName: yup.string(),
  birthday: yup.object().nullable(),
  additionalDetails: yup.string(),
  phone: yup.string(),
  passportNumberOrPinfl: yup.string().required(),
  workPlace: yup.string(),
  gateId: yup.number().required(),
});

export const onetimeCodeSchema = yup.object().shape({
  codeType: yup.string().required(),
  startDate: yup.mixed().required(),
  endDate: yup.mixed().required(),
  additionalDetails: yup.string(),
  isActive: yup.boolean(),
  carNumber: yup.string(),
});