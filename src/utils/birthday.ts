export interface BirthdayEmployee {
  daysUntilBirthday: number;
  upcomingBirthdayDate: Date;
  age: number;
}

export function getAge(birthdayStr: string): number {
  const today = new Date();
  const birthday = new Date(birthdayStr);
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
}

export function getUpcomingBirthdays(
  employees: any[],
  withinDays: number = 30
): BirthdayEmployee[] {
  return employees
    .map((employee) => {
      const daysUntilBirthday = getDaysUntilBirthday(employee.birthday);
      const birthday = new Date(employee.birthday);
      const today = new Date();
      const upcomingBirthdayDate = new Date(
        today.getFullYear(),
        birthday.getMonth(),
        birthday.getDate()
      );
      if (upcomingBirthdayDate < today) {
        upcomingBirthdayDate.setFullYear(today.getFullYear() + 1);
      }

      return {
        ...employee,
        daysUntilBirthday,
        upcomingBirthdayDate,
        age: getAge(employee.birthday),
      };
    })
    .filter((e) => e.daysUntilBirthday <= withinDays)
    .sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);
}

export function formatBirthdayDate(date: Date): string {
  return date?.toLocaleDateString('uz-UZ', {
    day: 'numeric',
    month: 'long',
  });
}

export function getBirthdayStatus(daysUntil: number): 'today' | 'soon' | 'upcoming' {
  if (daysUntil === 0) return 'today';
  if (daysUntil <= 7) return 'soon';
  return 'upcoming';
}

export function getDaysUntilBirthday(birthday: any) {
  const today:any = new Date();
  const birthDate = new Date(birthday);

  // Joriy yilni olamiz
  const currentYear = today.getFullYear();

  // Tug'ilgan kunni joriy yilga moslab olamiz
  let nextBirthday: any = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

  // Agar bu yilgi tug'ilgan kun o'tib ketgan bo'lsa
  if (nextBirthday < today) {
    nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
  }

  // Millisekund farq
  const diffTime = nextBirthday - today;

  // Kunlarga o'tkazamiz
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
