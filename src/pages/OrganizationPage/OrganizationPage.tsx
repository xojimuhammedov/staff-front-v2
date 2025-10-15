import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useState } from 'react';
import OrganizationCard from './_components/OrganizationCard';
import { useDeleteQuery, useGetAllQuery, useGetOneQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Form from './_components/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { useTranslation } from 'react-i18next';
import MyModal from 'components/Atoms/MyModal';
import { Plus, Search, } from 'lucide-react';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import EditForm from './_components/EditForm';
import MyDivider from 'components/Atoms/MyDivider';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { MyInput } from 'components/Atoms/Form';
import { useLocation, useSearchParams } from 'react-router-dom';
import MyPagination from 'components/Atoms/MyPagination/Pagination';
import { Organization } from './interface/organization.interface';
import { useSearch } from 'hooks/useSearch';
import { paramsStrToObj } from 'utils/helper';

const OrganizationPage = () => {
    const {t} = useTranslation()
    const location = useLocation()
    const searchValue:any = paramsStrToObj(location.search)
    const { search, setSearch, handleSearch } = useSearch();
    const [showModal, setShowModal] = useState(false);
    const [open, setOpen] = useState(false)
    const [show, setShow] = useState(false)
    const [organizationId, setOrganizationId] = useState<any | null>(null)

    const {data, refetch} = useGetAllQuery<{ data: Organization[] }>({
        key:KEYS.getAllListOrganization,
        url:URLS.getAllListOrganization,
        params:{
          search: searchValue.search
        }
    })

    const breadCrumbs = [
        {
          label: t('Organization'),
          url: '#'
        }
    ];

    const { mutate: deleteRequest } = useDeleteQuery({
      listKeyId: KEYS.getAllListOrganization
    });
  
    const deleteItem = () => {
      deleteRequest(
        {
          url: `${URLS.getAllListOrganization}/${organizationId}`
        },
        {
          onSuccess: () => {
            refetch();
            setOpen(false)
          }
        }
      );
    };

    const { data:getOne } = useGetOneQuery({
      id: organizationId,
      url: URLS.getAllListOrganization,
      params: {},
      enabled: !!organizationId
    });

    return (
        <PageContentWrapper paginationProps={<MyPagination total={get(data, "total")} />}>
             <div className="flex flex-col">
                <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('Organization')}</h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>

            <MyDivider />
            <div className='flex items-center justify-between'>
              <MyInput
                  onKeyUp={(event) => {
                    if (event.key === KeyTypeEnum.enter) {
                      handleSearch();
                    } else {
                      setSearch((event.target as HTMLInputElement).value);
                    }
                  }}
                  defaultValue={search}
                  startIcon={<Search className="stroke-text-muted" onClick={handleSearch} />}
                  className="w-[300px] dark:bg-bg-input-dark"
                  placeholder={t('Search...')}
              />
              <div className='flex items-center gap-4'>
                <MyButton
                    startIcon={<Plus />}
                    onClick={() => setShowModal(true)}
                    variant="primary"
                    className="[&_svg]:stroke-bg-white text-sm w-[200px] dark:text-text-base">
                    {t('Add Organization')}
                </MyButton>
                <MyButton variant='secondary'>{t("Filters")}</MyButton>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
               {
                get(data, 'data')?.map((item:Organization) => (
                    <OrganizationCard setOrganizationId={setOrganizationId} setShow={setShow} setOpen={setOpen} item={item} />
                ))
               }
            </div>
            <MyDivider />
            <MyModal 
                modalProps={{
                    show: Boolean(showModal),
                    onClose: () => {
                        setShowModal(false)
                    }
                  }}
                  headerProps={{
                    children: <h2 className="text-xl font-semibold">{t('Create new organization')}</h2>,
                    className: 'px-6'
                  }}
                bodyProps={{
                    children: <Form refetch={refetch} onClose={() => setShowModal(false)} />
                }}
            />
            <ConfirmationModal 
              title={t("Bu tashkilotni o'chirmoqchimisiz?")}
              subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
              open={open} setOpen={setOpen} confirmationDelete={deleteItem} />
            <MyModal 
                modalProps={{
                    show: Boolean(show),
                    onClose: () => {
                        setShow(false)
                    }
                  }}
                  headerProps={{
                    children: <h2 className="text-xl font-semibold">{t('Edit organization')}</h2>,
                    className: 'px-6'
                  }}
                bodyProps={{
                    children: <EditForm 
                      organizationId={organizationId}
                      data={getOne} refetch={refetch} onClose={() => setShow(false)} />
                }}
            />
        </PageContentWrapper>
    );
}

export default OrganizationPage;
