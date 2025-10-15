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
import { Plus, Search, } from 'lucide-react';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import EditForm from './_components/EditForm';
import MyDivider from 'components/Atoms/MyDivider';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { MyInput } from 'components/Atoms/Form';
import { useLocation, useSearchParams } from 'react-router-dom';
import MyPagination from 'components/Atoms/MyPagination/Pagination';
import { Organization } from './interface/visitor.interface';
import { useSearch } from 'hooks/useSearch';
import { paramsStrToObj } from 'utils/helper';
import VisitorTable from './_components/VisitorTable';

const VisitorPage = () => {
    const {t} = useTranslation()
    const location = useLocation()
    const searchValue:any = paramsStrToObj(location.search)
    const { search, setSearch, handleSearch } = useSearch();
    const [showModal, setShowModal] = useState(false);
    const [open, setOpen] = useState(false)

    const {data, refetch} = useGetAllQuery<{ data: Organization[] }>({
        key:KEYS.getAllListOrganization,
        url:URLS.getAllListOrganization,
        params:{
          search: searchValue.search
        }
    })

    const breadCrumbs = [
        {
          label: t('Visitor'),
          url: '#'
        }
    ];

    // const { mutate: deleteRequest } = useDeleteQuery({
    //   listKeyId: KEYS.getAllListOrganization
    // });
  
    // const deleteItem = () => {
    //   deleteRequest(
    //     {
    //       url: `${URLS.getAllListOrganization}/${organizationId}`
    //     },
    //     {
    //       onSuccess: () => {
    //         refetch();
    //         setOpen(false)
    //       }
    //     }
    //   );
    // };

    return (
        <PageContentWrapper>
             <div className="flex flex-col">
                <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('Visitor')}</h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <MyDivider />
            <VisitorTable />
            {/* <MyModal 
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
            /> */}
            {/* <ConfirmationModal 
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
            /> */}
        </PageContentWrapper>
    );
}

export default VisitorPage;
