import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useState } from 'react';
import { useDeleteQuery, useGetAllQuery, useGetOneQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Form from './_components/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { useTranslation } from 'react-i18next';
import MyModal from 'components/Atoms/MyModal';
import { Plus, Search } from 'lucide-react';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import EditForm from './_components/EditForm';
import DepartmentCard from './_components/DepartmentCard';
import MyDivider from 'components/Atoms/MyDivider';
import { MyInput } from 'components/Atoms/Form';
import MyPagination from 'components/Atoms/MyPagination/Pagination';
import { Department } from './interface/department.interface';

const OrganizationPage = () => {
    const {t} = useTranslation()
    const [showModal, setShowModal] = useState(false);
    const [open, setOpen] = useState(false)
    const [show, setShow] = useState(false)
    const [departmentId, setDepartmentId] = useState<any | null>(null)

    const {data, refetch} = useGetAllQuery<{data: Department[]}>({
        key:KEYS.getAllListDepartment,
        url:URLS.getAllListDepartment,
        params:{}
    })

    const breadCrumbs = [
        {
          label: t('Department'),
          url: '#'
        }
    ];

    const { mutate: deleteRequest } = useDeleteQuery({
      listKeyId: KEYS.getAllListDepartment
    });
  
    const deleteItem = () => {
      deleteRequest(
        {
          url: `${URLS.getAllListDepartment}/${departmentId}`
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
      id: departmentId,
      url: URLS.getAllListDepartment,
      params: {},
      enabled: !!departmentId
    });

    return (
        <PageContentWrapper paginationProps={<MyPagination total={get(data, 'total')} />} >
            <div className="flex flex-col">
              <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('Department')}</h1>
              <MyBreadCrumb items={breadCrumbs} />
          </div>
          <MyDivider />
          <div className='flex items-center justify-between'>
            <MyInput
                // onKeyUp={(event) => {
                //   if (event.key === KeyTypeEnum.enter) {
                //     handleSearch();
                //   } else {
                //     setSearch(get(event, 'target.value', ''));
                //   }
                // }}
                startIcon={<Search className="stroke-text-muted" />}
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
              get(data, 'data')?.map((item:Department) => (
                  <DepartmentCard setDepartmentId={setDepartmentId} setShow={setShow} setOpen={setOpen} item={item} />
              ))
              }
          </div>
          <MyModal 
              modalProps={{
                  show: Boolean(showModal),
                  onClose: () => {
                      setShowModal(false)
                  }
                }}
                headerProps={{
                  children: <h2 className="text-xl font-semibold">{t('Create new department')}</h2>,
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
                  children: <h2 className="text-xl font-semibold">{t('Edit department')}</h2>,
                  className: 'px-6'
                }}
              bodyProps={{
                  children: <EditForm 
                  departmentId={departmentId}
                    data={getOne} refetch={refetch} onClose={() => setShow(false)} />
              }}
          />
        </PageContentWrapper>
    );
}

export default OrganizationPage;
