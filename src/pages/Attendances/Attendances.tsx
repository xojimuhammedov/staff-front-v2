import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import AttendanceList from './_components/AttendanceList';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { useForm } from 'react-hook-form';
import { Calendar, Search } from 'lucide-react';
import { useSearch } from 'hooks/useSearch';
import { MyInput } from 'components/Atoms/Form';
import { KeyTypeEnum } from 'enums/key-type.enum';
import ColumnsButton from 'components/Atoms/DataGrid/ColumnsButton';


const Attendances = () => {
    const { t } = useTranslation();
    const { control, watch }: any = useForm()
    const { search, setSearch, handleSearch } = useSearch();
    const breadCrumbs = [
        {
            label: t('Attendances'),
            url: '#'
        }
    ];
    return (
        <PageContentWrapper>
            <div className='flex justify-between items-center'>
                <div className="flex flex-col">
                    <h1 className="headers-core dark:text-text-title-dark text-text-base">
                        {t('Attendances')}
                    </h1>
                    <MyBreadCrumb items={breadCrumbs} />
                </div>
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
                    <ColumnsButton />
                    <MyTailwindPicker
                        useRange={true}
                        name='date'
                        asSingle={false}
                        control={control}
                        placeholder={t('Today')}
                        startIcon={<Calendar stroke="#9096A1" />}
                    />
                </div>
            </div>
            <AttendanceList watch={watch} />
        </PageContentWrapper>
    );
}

export default Attendances;
