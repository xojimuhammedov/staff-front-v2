import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

interface SidebarMenu {
  title: string;
  stepper_title: string;
  items: SidebarItem[];
}

interface StepperProps {
  steps: SidebarMenu[];
}

interface SidebarItem {
  icon: string;
  name: string;
  path: string;
  isSwitch: boolean;
}

const Stepper = ({ steps, currentStep, complete }: any | boolean) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="mt-10 flex justify-between">
        <ul className="flex  w-full flex-col">
          {steps?.map((step: any, i: number) => (
            <li key={i} className={twMerge('flex items-center')}>
              <div className="flex gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={twMerge(
                      'flex h-[32px] w-[32px] items-center justify-center rounded-[100%] bg-bg-subtle text-text-subtle',
                      (i + 1 <= currentStep || complete) && 'bg-bg-brand text-text-on-color'
                    )}>
                    {i + 1}
                  </div>
                  {i + 1 !== steps.length && (
                    <div
                      className={twMerge(
                        ' mx-[9px] h-[30px] w-[1px] bg-border-base',
                        (i + 1 <= currentStep || complete) && 'h-[60px] bg-bg-brand'
                      )}
                    />
                  )}
                </div>
                <div className={twMerge('mt-4xs flex flex-col')}>
                  <p className="text-base font-medium dark:text-text-title-dark">
                    {step.stepper_title}
                  </p>
                  <p className="text-xs font-normal dark:text-text-title-dark"> {step.title}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Stepper;
