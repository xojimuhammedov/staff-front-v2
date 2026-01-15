import { useTranslation } from "react-i18next"

const useWeekDays = () => {
  const { t } = useTranslation()

  return [
    { id: 1, value: "Mon", label: t("Monday") },
    { id: 2, value: "Tue", label: t("Tuesday") },
    { id: 3, value: "Wed", label: t("Wednesday") },
    { id: 4, value: "Thur", label: t("Thursday") },
    { id: 5, value: "Fri", label: t("Friday") },
    { id: 6, value: "Sun", label: t("Sunday") },
    { id: 7, value: "Sat", label: t("Saturday") }
  ]
}

export default useWeekDays
