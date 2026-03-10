import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery, usePutQuery } from 'hooks/api';
import { useTranslation } from 'react-i18next';

export interface OptionItem {
  type: string;
  useful: number[];
  unuseful: number[];
}

export const useEditGeneralDetails = () => {
  const { t } = useTranslation();
  const { id }: any = useParams();

  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [typeValue, setTypeValue] = useState<string | null>(null);

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

  const { data: getOnePolicy, refetch } = useGetOneQuery({
    id: id,
    url: URLS.getPolicyList,
    params: {},
    enabled: !!id
  });

  const { data: policyGroups } = useGetAllQuery<any>({
    key: KEYS.getPolicyGroups,
    url: URLS.getPolicyGroups,
    params: {
      type: typeValue === "WEBSNIFFER" ? "WEBSITE" : "APPLICATION"
    }
  });

  const { mutate: update } = usePutQuery({
    listKeyId: KEYS.getPolicyList,
    hideSuccessToast: true
  });

  const formMethods = useForm<any>({
    defaultValues: useMemo(() => {
      const data = get(getOnePolicy, 'data', {});
      const defaultData: any = {
        title: data.title,
        organizationId: data.organizationId,
        interval: 60,
        isGrayscale: false,
      };
      
      const modules = data.modules || [];
      modules.forEach((mod: any) => {
        defaultData[`module_${mod.type}_isEnabled`] = mod.isEnabled;
        if (mod.type === "SCREENSHOT") {
          defaultData.interval = mod.options?.interval || 60;
          defaultData.isGrayscale = mod.options?.isGrayscale || false;
        }
      });
      return defaultData;
    }, [getOnePolicy]),
    mode: 'onChange',
  });

  const { reset } = formMethods;

  useEffect(() => {
    if (getOnePolicy?.data) {
      const data = getOnePolicy.data;
      const initialOptions: OptionItem[] = [];
      const resetData: any = {
        title: data.title,
        organizationId: data.organizationId,
        interval: 60,
        isGrayscale: false,
      };

      const modules = data.modules || [];
      modules.forEach((mod: any) => {
        resetData[`module_${mod.type}_isEnabled`] = mod.isEnabled;
        if (mod.type === "SCREENSHOT") {
          resetData.interval = mod.options?.interval || 60;
          resetData.isGrayscale = mod.options?.isGrayscale || false;
        } else if (mod.type === "WEBSNIFFER" || mod.type === "ACTIVEWINDOW") {
          const rules = mod.rules || [];
          const usefulIds = rules.find((r: any) => r.type === "USEFUL")?.groupIds || [];
          const unusefulIds = rules.find((r: any) => r.type === "UNUSEFUL")?.groupIds || [];
          initialOptions.push({
            type: mod.type,
            useful: usefulIds,
            unuseful: unusefulIds
          });
        }
      });
      setOptions(initialOptions);
      reset(resetData);
    }
  }, [getOnePolicy, reset]);

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
      isDefault: get(getOnePolicy, 'data.isDefault', false),
      organizationId: data.organizationId,
      isActive: get(getOnePolicy, 'data.isActive', true),
      modules: modules
    };

    update(
      {
        url: `${URLS.getPolicyList}/${id}`,
        attributes: submitData
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully edited!'));
          refetch();
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message);
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
