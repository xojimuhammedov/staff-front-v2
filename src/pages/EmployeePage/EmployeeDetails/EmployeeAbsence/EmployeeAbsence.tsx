import MyDivider from 'components/Atoms/MyDivider';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Create from './_components/Create';
import AbsenceCard, { AbsenceItem } from './_components/AbsenceCard';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import Loading from 'assets/icons/Loading';

const EmployeeAbsence = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data, isLoading, refetch } = useGetAllQuery<any>({
    key: KEYS.employeeAbsences,
    url: URLS.employeeAbsences,
    params: {
      employeeId: id ? Number(id) : undefined,
    },
  });
  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.employeeAbsences,
  });

  const rows: AbsenceItem[] = data?.data ?? data?.items ?? [];
  const handleDelete = (absenceId: number | string) => {
    deleteRequest(
      {
        url: `${URLS.employeeAbsences}/${absenceId}`,
      },
      {
        onSuccess: () => {
          refetch?.();
        },
      }
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="headers-core text-text-base dark:text-text-title-dark">{t('Employee absences')}</h1>
        <Create employeeId={id} refetch={refetch} />
      </div>
      <MyDivider />
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rows.map((item) => (
            <AbsenceCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </>
  );
};

export default EmployeeAbsence;