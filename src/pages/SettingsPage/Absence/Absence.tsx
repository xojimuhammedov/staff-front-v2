import AbsenseList from './_components/AbsenseList';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { MyInput } from 'components/Atoms/Form';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { useLocation } from 'react-router-dom';
import { useSearch } from 'hooks/useSearch';
import { searchValue } from 'types/search';
import { paramsStrToObj } from 'utils/helper';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import Create from './_components/Create';

const Absence = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const { search, setSearch, handleSearch } = useSearch();
    const searchValue: searchValue = paramsStrToObj(location.search)
    const { data, isLoading, refetch } = useGetAllQuery({
        key: KEYS.absences,
        url: URLS.absences,
        params: {
            search: searchValue?.search
        }
    });
    return (
        <>
            <div className={'flex justify-between'}>
                <LabelledCaption
                    title={t('Absence')}
                    subtitle={t('Employee list for absence type')}
                />
                <div className='flex items-center gap-4'>
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
                        className="dark:bg-bg-input-dark"
                        placeholder={t('Search...')}
                    />
                    <Create refetch={refetch} />
                </div>
            </div>
            <AbsenseList data={data} isLoading={isLoading} refetch={refetch} />
        </>
    );
}

export default Absence;
