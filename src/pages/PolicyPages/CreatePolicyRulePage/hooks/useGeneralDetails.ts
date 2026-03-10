import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import storage from 'services/storage';

export interface OptionItem {
  type: string;
  useful: number[];
  unuseful: number[];
}

export const useGeneralDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userData: any = storage.get("userData");
  const userRole = JSON.parse(userData)?.role;

  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [typeValue, setTypeValue] = useState<string | null>(null);

  const schema = object().shape({
    title: string().required(),
    description: string(),
    organizationId: yup
      .number()
      .when('$role', (role: any, schema) =>
        role === 'ADMIN' ? schema.required() : schema.optional()
      ),
    interval: yup.number(),
  });

  const formMethods = useForm<any>({
    defaultValues: {
      interval: 60,
      isGrayscale: false,
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
    context: { role: userRole }
  });

  const { data: orgData } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    params: {},
    hideErrorMsg: true
  });

  const { data: enumData } = useGetAllQuery({
    key: KEYS.getPolicyEnum,
    url: URLS.getPolicyEnum,
    params: {}
  });

  const { data: policyGroups } = useGetAllQuery<any>({
    key: KEYS.getPolicyGroups,
    url: URLS.getPolicyGroups,
    params: {
      type: typeValue === "WEBSNIFFER" ? "WEBSITE" : "APPLICATION"
    }
  });

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.getPolicyList,
    hideSuccessToast: true
  });

  const handleChange = (type: string, field: "useful" | "unuseful", values: number[]) => {
    setOptions((prev) => {
      const exists = prev.find((item) => item.type === type);
      if (exists) {
        return prev.map((item) =>
          item.type === type ? { ...item, [field]: values } : item
        );
      } else {
        return [...prev, { type, useful: [], unuseful: [], [field]: values }];
      }
    });
  };

  const getValues = (type: string, field: "useful" | "unuseful") => {
    const found = options.find((item) => item.type === type);
    return found ? found[field] : [];
  };

  const onSubmit = (data: any) => {
    const modules: any[] = [];
    const enums: any = enumData || {};

    Object.keys(enums).forEach((type) => {
      const isEnabled = Boolean(data[`module_${type}_isEnabled`]);

      const modulePayload: any = {
        type: type,
        isEnabled: isEnabled,
        options: {},
        rules: []
      };

      if (type === "SCREENSHOT") {
        modulePayload.options = {
          interval: Number(data.interval) || 60,
          isGrayscale: Boolean(data.isGrayscale)
        };
      } else if (type === "WEBSNIFFER" || type === "ACTIVEWINDOW") {
        const option = options.find(o => o.type === type);
        if (option?.useful && option.useful.length > 0) {
          modulePayload.rules.push({ type: "USEFUL", groupIds: option.useful });
        }
        if (option?.unuseful && option.unuseful.length > 0) {
          modulePayload.rules.push({ type: "UNUSEFUL", groupIds: option.unuseful });
        }
      }

      modules.push(modulePayload);
    });

    const submitData = {
      title: data.title,
      description: data.description || "",
      isDefault: false,
      organizationId: data.organizationId,
      isActive: true,
      modules: modules
    };

    create(
      {
        url: URLS.getPolicyList,
        attributes: submitData
      },
      {
        onSuccess: (res) => {
          navigate(`/policy/create?current-step=1&current-rule=employee-groups&policyId=${res?.data?.id}`);
          toast.success(t('Successfully created!'));
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message || 'ERROR');
        }
      }
    );
  };

  const selectOptions = policyGroups?.data?.map((evt: any) => ({
    label: evt.name,
    value: evt.id,
  })) || [];

  return {
    t,
    show,
    setShow,
    open,
    setOpen,
    typeValue,
    setTypeValue,
    formMethods,
    orgData,
    enumData,
    selectOptions,
    handleChange,
    getValues,
    onSubmit
  };
};
