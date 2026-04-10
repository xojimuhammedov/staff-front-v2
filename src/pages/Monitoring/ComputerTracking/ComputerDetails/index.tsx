import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft as ArrowLeftIcon, Calendar
} from "lucide-react";
import { useGetAllQuery } from "@/hooks/api";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import PageContentWrapper from "@/components/Layouts/PageContentWrapper";
import MainContent from "./_components/MainContent";
import Sidebar from "./_components/Sidebar/Sidebar";
import { ComputerSidebarProfile } from "./_components/ComputerSidebarProfile";
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function ComputerDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const computer = location.state?.computer || {
    pcName: t("Unknown computer"),
    ipAddress: t("Unknown IP"),
    version: "",
    os: ""
  };

  const { data, isLoading } = useGetAllQuery<any>({
    key: KEYS.getComputerUserList,
    url: URLS.getComputerUserList,
    params: {
      page: 1,
      limit: 10,
      computerId: id,
    }
  });

  const allUsers = data?.data || [];

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    if (allUsers.length > 0 && selectedUserId === null) {
      setSelectedUserId(allUsers[0].id);
    }
  }, [allUsers, selectedUserId]);

  const user = allUsers.find((u: any) => u.id === selectedUserId) || allUsers[0];

  const handleUserSwitch = (uId: number) => {
    setSelectedUserId(uId);
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const { control, watch } = useForm({
    defaultValues: {
      date: {
        endDate: searchParams.get('endDate') || dayjs().format('YYYY-MM-DD'),
        startDate: searchParams.get('startDate') || dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      },
    },
  });

  useEffect(() => {
    const dateVal = watch('date');
    if (dateVal?.startDate && dateVal?.endDate) {
      const start = dayjs(dateVal.startDate).format('YYYY-MM-DD');
      const end = dayjs(dateVal.endDate).format('YYYY-MM-DD');
      if (searchParams.get('startDate') !== start || searchParams.get('endDate') !== end) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('startDate', start);
        newParams.set('endDate', end);
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [watch('date'), searchParams, setSearchParams]);


  if (isLoading) return <div className="p-8 text-center text-sm">{t('Loading...')}</div>;

  return (
    <PageContentWrapper>
      <div className="flex ">
        {/* Sidebar */}
        <aside className="w-72 bg-white dark:bg-[rgb(var(--color-bg-bgblack-dark))] border-r border-gray-200 dark:border-[rgb(var(--color-dark-line))] flex flex-col flex-shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-[rgb(var(--color-dark-line))]">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-700 dark:text-neutral-300 hover:text-blue-600 transition-colors">
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="text-sm">{t('Back')}</span>
            </button>
          </div>

          <ComputerSidebarProfile 
            computer={computer} 
            user={user} 
            allUsers={allUsers} 
            selectedUserId={selectedUserId} 
            onUserSwitch={handleUserSwitch} 
          />

          {/* Navigation */}
          <nav className="flex-1">
            <Sidebar />
          </nav>
        </aside>

        <main className="flex-1 flex flex-col p-6 overflow-auto relative">
           <div className="absolute top-6 right-6 z-10 w-[240px]">
             <MyTailwindPicker
               useRange={true}
               name="date"
               asSingle={false}
               control={control}
               placeholder={t('Today')}
               showShortcuts={true}
               startIcon={<Calendar className="stroke-[#9096A1]" />}
             />
           </div>
           <MainContent user={user} />
        </main>
      </div>
    </PageContentWrapper>
  );
}
