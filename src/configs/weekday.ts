import { useTranslation } from "react-i18next"

const useWeekDays = () => {
  const { t } = useTranslation()

  return [
    { id: 1, value: "Monday", label: t("Monday") },
    { id: 2, value: "Tuesday", label: t("Tuesday") },
    { id: 3, value: "Wednesday", label: t("Wednesday") },
    { id: 4, value: "Thursday", label: t("Thursday") },
    { id: 5, value: "Friday", label: t("Friday") },
    { id: 6, value: "Sunday", label: t("Sunday") },
    { id: 7, value: "Saturday", label: t("Saturday") }
  ]
}

export default useWeekDays
