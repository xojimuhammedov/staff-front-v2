/* eslint-disable no-undef */
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');
const { parseColor } = require('tailwindcss/lib/util/color');

/** Converts HEX color to RGB */
const toRGB = (value) => {
  return parseColor(value).color.join(' ');
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js'
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      inter: ['Inter', 'sans-serif']
    },
    container: {
      screens: {
        '2xl': '1320px'
      }
    },
    extend: {
      // NOTE imported from Figma 👉 https://www.figma.com/file/71ymV744Lh9WoMCtrsPdLT/Base-%E2%9C%A8?node-id=24%3A2969&mode=dev
      borderRadius: {
        '2xs': 'var(--border-radius-2xs)',
        xs: 'var(--border-radius-xs)',
        sm: 'var(--border-radius-small)',
        m: 'var(--border-radius-m)',
        l: 'var(--border-radius-l)',
        xl: 'var(--border-radius-xl)'
      },
      // NOTE imported from Figma 👉 "https://www.figma.com/file/71ymV744Lh9WoMCtrsPdLT/Base-%E2%9C%A8?node-id=24%3A30&mode=dev"
      fontSize: {
        'c-xl-p': [
          '1.125rem',
          {
            lineHeight: '1.25rem',
            fontWeight: '500'
          }
        ],
        'c-xl': ['1.125rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'c-l-p': ['1rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        'c-l': ['1rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'c-m-p': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        'c-m': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'c-s-p': ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        'c-s': ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'c-xs-p': ['0.75rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        'c-xs': ['0.75rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'xl-p': ['1.125rem', { lineHeight: '2rem', fontWeight: '500' }],
        xl: ['1.125rem', { lineHeight: '2rem', fontWeight: '400' }],
        'l-p': ['1rem', { lineHeight: '1.75rem', fontWeight: '500' }],
        l: ['1rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'm-p': ['0.875rem', { lineHeight: '1.5rem', fontWeight: '500' }],
        m: ['0.875rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        's-p': ['0.8125rem', { lineHeight: '1.375rem', fontWeight: '500' }],
        s: ['0.8125rem', { lineHeight: '1.375rem', fontWeight: '400' }],
        'xs-p': ['0.75rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        xs: ['0.75rem', { lineHeight: '1.25rem', fontWeight: '400' }]
      },
      screens: {
        '3xl': '1600px'
      },
      // NOTE imported from Figma 👉 https://www.figma.com/file/71ymV744Lh9WoMCtrsPdLT/Base-%E2%9C%A8?type=design&node-id=18-1798&mode=dev
      boxShadow: {
        base: 'var(--box-shadow-base)',
        'card-hover': 'var(--box-shadow-card-hover)',
        modal: 'var(--box-shadow-modal)',
        flyout: 'var(--box-shadow-flyout)',
        tooltip: 'var(--box-shadow-tooltip)',
        'border-base': '0px 0px 0px 1px rgba(3, 7, 18, 0.08), 0px 1px 2px 0px rgba(3, 7, 18, 0.12)',
        'border-focus': 'var(--box-shadow-border-focus)',
        'border-interactive-shadow': 'var(--box-shadow-border-interactive-shadow)',
        'custom-border-error': '0px 0px 0px 3px rgba(225, 29, 72, 0.15), 0px 0px 0px 1px #E11D48',
        'border-interactive-focus': 'var(--box-shadow-border-interactive-focus)',
        'border-interactive-active': 'var(--box-shadow-border-interactive-active)',
        'border-interactive': '0px 0px 0px 1px #3B82F6, 0px 1px 2px 0px rgba(30, 58, 138, 0.50)',
        'button-primary': 'var(--box-shadow-primary-button)',
        'button-destructive': 'var(--box-shadow-destructive-button)'
      },
      // NOTE imported from Figma 👉 https://www.figma.com/file/71ymV744Lh9WoMCtrsPdLT/Base-%E2%9C%A8?type=design&node-id=24-3080&mode=dev
      spacing: {
        '7xs': 'var(--spacing-7xs)',
        '6xs': 'var(--spacing-6xs)',
        '5xs': 'var(--spacing-5xs)',
        '4xs': 'var(--spacing-4xs)',
        '3xs': 'var(--spacing-3xs)',
        '2xs': 'var(--spacing-2xs)',
        xs: 'var(--spacing-xs)',
        m: 'var(--spacing-m)',
        l: 'var(--spacing-l)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
        '4xl': 'var(--spacing-4xl)',
        '5xl': 'var(--spacing-5xl)',
        '6xl': 'var(--spacing-6xl)'
      },
      colors: {
        activeBar: '#F1F3F6',
        resultActiveBar: '#FFC318',
        dashboardChart: '#DBEAFE',
        dashboardChartHover: '#9EC8FE',
        modalInput: '#F9FAFB',
        textAreaBorder: 'rgba(3, 7, 18, 0.08)',
        dwnText: '#9CA3AF',
        pointBg: '#D6D8DE',
        addBtn: '#3B82F6',
        avatarBg: '#F9FAFB',
        theme: {
          1: 'rgb(var(--color-theme-1) / <alpha-value>)',
          2: 'rgb(var(--color-theme-2) / <alpha-value>)'
        },
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        pending: 'rgb(var(--color-pending) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        light: 'rgb(var(--color-light) / <alpha-value>)',
        dark: 'rgb(var(--color-dark) / <alpha-value>)',
        darkmode: {
          50: 'rgb(var(--color-darkmode-50) / <alpha-value>)',
          100: 'rgb(var(--color-darkmode-100) / <alpha-value>)',
          200: 'rgb(var(--color-darkmode-200) / <alpha-value>)',
          300: 'rgb(var(--color-darkmode-300) / <alpha-value>)',
          400: 'rgb(var(--color-darkmode-400) / <alpha-value>)',
          500: 'rgb(var(--color-darkmode-500) / <alpha-value>)',
          600: 'rgb(var(--color-darkmode-600) / <alpha-value>)',
          700: 'rgb(var(--color-darkmode-700) / <alpha-value>)',
          800: 'rgb(var(--color-darkmode-800) / <alpha-value>)',
          900: 'rgb(var(--color-darkmode-900) / <alpha-value>)'
        },
        // NOTE imported from Figma 👉 https://www.figma.com/file/71ymV744Lh9WoMCtrsPdLT/Base-%E2%9C%A8?node-id=13%3A1113&mode=dev
        ['btn-bg-dark']: 'rgb(var(--color-bg-btn-dark))',
        ['avatar-bg']: 'rgb(var(--color-avatar-bg))',
        ['dark-text']: 'rgb(var(--color-dark-text))',
        ['dark-dashboard-cards']: 'rgb(var(--color-input-bg-dark))',
        ['bg-base']: 'rgb(var(--color-background-base) / <alpha-value>)',
        ['bg-dark-bg']: 'rgb(var(--color-bg-black-dark))',
        ['bg-darkBg']: 'rgb(var(--color-bg-bgblack-dark))',
        ['bg-button']: 'rgb(var(--color-bg-button-dark) / <alpha-value>))',
        ['bg-dark-theme']: 'rgb(var(--color-bg-dark-theme))',
        ['bg-input-dark']: 'rgb(var(--color-input-bg-dark))',
        ['dark-line']: 'rgb(var(--color-dark-line))',
        ['bg-subtle']: 'rgb(var(--color-background-subtle) / <alpha-value>)',
        ['bg-field']: 'rgb(var(--color-background-field) / <alpha-value>)',
        ['bg-field-hover']: 'rgb(var(--color-background-field-hover) / <alpha-value>)',
        ['bg-overlay']: 'rgb(var(--color-background-overlay) / <alpha-value>)',
        ['bg-disabled']: 'rgb(var(--color-background-disabled) / <alpha-value>)',
        ['border-base']: 'rgb(var(--color-border-base) / <alpha-value>)',
        ['border-strong']: 'rgb(var(--color-border-strong) / <alpha-value>)',
        ['border-loud']: 'rgb(var(--color-border-loud) / <alpha-value>)',
        ['border-interactive']: 'rgb(var(--color-border-interactive) / <alpha-value>)',
        ['border-error']: 'rgb(var(--color-border-error) / <alpha-value>)',
        ['border-danger']: 'rgb(var(--color-border-danger) / <alpha-value>)',
        ['border-transparent']: 'rgb(var(--color-border-transparent) / <alpha-value>)',
        ['text-base']: 'rgb(var(--color-text-base) / <alpha-value>)',
        ['text-subtle']: 'rgb(var(--color-text-subtle) / <alpha-value>)',
        ['text-muted']: 'rgb(var(--color-text-muted) / <alpha-value>)',
        ['text-title-dark']: 'rgb(var(--color-text-dark))',
        ['subtext-color-dark']: 'rgb(var(--color-subtext-dark))',
        ['text-disabled']: 'rgb(var(--color-text-disabled) / <alpha-value>)',
        ['text-link']: 'rgb(var(--color-text-link) / <alpha-value>)',
        ['text-error']: 'rgb(var(--color-text-error) / <alpha-value>)',
        ['text-on-color']: 'rgb(var(--color-text-on-color) / <alpha-value>)',
        ['tag-neutral-hover']: 'rgb(var(--color-tag-neutral-hover) / <alpha-value>)',
        ['tag-neutral-bg']: 'rgb(var(--color-tag-neutral-bg) / <alpha-value>)',
        ['tag-neutral-icon']: 'rgb(var(--color-tag-neutral-icon) / <alpha-value>)',
        ['tag-neutral-text']: 'rgb(var(--color-tag-neutral-text) / <alpha-value>)',
        ['tag-orange-hover']: 'rgb(var(--color-tag-orange-hover) / <alpha-value>)',
        ['tag-orange-bg']: 'rgb(var(--color-tag-orange-bg) / <alpha-value>)',
        ['tag-orange-icon']: 'rgb(var(--color-tag-orange-icon) / <alpha-value>)',
        ['tag-orange-text']: 'rgb(var(--color-tag-orange-text) / <alpha-value>)',
        ['tag-red-hover']: 'rgb(var(--color-tag-red-hover) / <alpha-value>)',
        ['tag-red-bg']: 'rgb(var(--color-tag-red-bg) / <alpha-value>)',
        ['tag-red-icon']: 'rgb(var(--color-tag-red-icon) / <alpha-value>)',
        ['tag-red-text']: 'rgb(var(--color-tag-red-text) / <alpha-value>)',
        ['tag-blue-hover']: 'rgb(var(--color-tag-blue-hover) / <alpha-value>)',
        ['tag-blue-bg']: 'rgb(var(--color-tag-blue-bg) / <alpha-value>)',
        ['tag-blue-icon']: 'rgb(var(--color-tag-blue-icon) / <alpha-value>)',
        ['tag-blue-text']: 'rgb(var(--color-tag-blue-text) / <alpha-value>)',
        ['tag-green-hover']: 'rgb(var(--color-tag-green-hover) / <alpha-value>)',
        ['tag-green-bg']: 'rgb(var(--color-tag-green-bg) / <alpha-value>)',
        ['tag-green-icon']: 'rgb(var(--color-tag-green-icon) / <alpha-value>)',
        ['tag-purple-icon']: 'rgb(var(--color-tag-purple-icon) / <alpha-value>)',
        ['tag-purple-text']: 'rgb(var(--color-tag-purple-text) / <alpha-value>)',
        ['tag-green-text']: 'rgb(var(--color-tag-green-text) / <alpha-value>)',
        ['button-inverted-default']: 'rgb(var(--color-button-inverted-default) / <alpha-value>)',
        ['button-inverted-hover']: 'rgb(var(--color-button-inverted-hover) / <alpha-value>)',
        ['button-inverted-pressed']: 'rgb(var(--color-button-inverted-pressed) / <alpha-value>)',
        ['button-neutral-default']: 'rgb(var(--color-button-neutral-default) / <alpha-value>)',
        ['button-neutral-hover']: 'rgb(var(--color-button-neutral-hover) / <alpha-value>)',
        ['button-neutral-pressed']: 'rgb(var(--color-button-neutral-pressed) / <alpha-value>)',
        ['button-danger-default']: 'rgb(var(--color-button-danger-default) / <alpha-value>)',
        ['button-danger-hover']: 'rgb(var(--color-button-danger-hover) / <alpha-value>)',
        ['button-danger-pressed']: 'rgb(var(--color-button-danger-pressed) / <alpha-value>)',
        ['bg-brand']: 'rgb(var(--color-bg-brand) / <alpha-value>)',
        ['bg-switch']: 'rgb(var(--color-bg-switch) / <alpha-value>)',
        ['bg-form']: 'rgb(var(--color-bg-form-dark))',
        ['shadow-pagination-dark']: 'rgb(var(--box-shadow-dark-pagination) / <alpha-value>)',
        ['pagination-background-dark']: 'rgb(var(--pagination-button-background) / <alpha-value>)'
      },
      fontFamily: {
        'public-sans': ['Public Sans'],
        'dm-sans': ['DM Sans']
      },
      backgroundImage: {
        'texture-black':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2346.899' height='1200.894' viewBox='0 0 2346.899 1200.894'%3E%3Cg id='Group_369' data-name='Group 369' transform='translate(-33.74 508.575)'%3E%3Cg id='Group_366' data-name='Group 366' transform='translate(33.74 -458.541)'%3E%3Crect id='Rectangle_492' data-name='Rectangle 492' width='745.289' height='650.113' transform='matrix(0.978, 0.208, -0.208, 0.978, 296.729, 261.648)' fill='rgba(30,41,59,0.01)'/%3E%3Crect id='Rectangle_491' data-name='Rectangle 491' width='1335.276' height='650.113' transform='translate(0 543.106) rotate(-24)' fill='rgba(30,41,59,0.01)'/%3E%3C/g%3E%3Cg id='Group_367' data-name='Group 367' transform='translate(1647.456 1026.688) rotate(-128)'%3E%3Crect id='Rectangle_492-2' data-name='Rectangle 492' width='745.289' height='650.113' transform='matrix(0.978, 0.208, -0.208, 0.978, 296.729, 261.648)' fill='rgba(30,41,59,0.01)'/%3E%3Crect id='Rectangle_491-2' data-name='Rectangle 491' width='1335.276' height='650.113' transform='translate(0 543.106) rotate(-24)' fill='rgba(30,41,59,0.01)'/%3E%3C/g%3E%3Cg id='Group_368' data-name='Group 368' transform='matrix(-0.656, -0.755, 0.755, -0.656, 1017.824, 1042.94)'%3E%3Crect id='Rectangle_492-3' data-name='Rectangle 492' width='745.289' height='650.113' transform='matrix(0.978, 0.208, -0.208, 0.978, 296.729, 261.648)' fill='rgba(30,41,59,0.01)'/%3E%3Crect id='Rectangle_491-3' data-name='Rectangle 491' width='1335.276' height='650.113' transform='translate(0 543.106) rotate(-24)' fill='rgba(30,41,59,0.01)'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A\")",
        'texture-white':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2346.899' height='1200.894' viewBox='0 0 2346.899 1200.894'%3E%3Cg id='Group_369' data-name='Group 369' transform='translate(-33.74 508.575)'%3E%3Cg id='Group_366' data-name='Group 366' transform='translate(33.74 -458.541)'%3E%3Crect id='Rectangle_492' data-name='Rectangle 492' width='745.289' height='650.113' transform='translate(296.729 261.648) rotate(12.007)' fill='rgba(255,255,255,0.01)'/%3E%3Crect id='Rectangle_491' data-name='Rectangle 491' width='1335.276' height='650.113' transform='translate(0 543.106) rotate(-24)' fill='rgba(255,255,255,0.01)'/%3E%3C/g%3E%3Cg id='Group_367' data-name='Group 367' transform='translate(1647.456 1026.688) rotate(-128)'%3E%3Crect id='Rectangle_492-2' data-name='Rectangle 492' width='745.289' height='650.113' transform='translate(296.729 261.648) rotate(12.007)' fill='rgba(255,255,255,0.01)'/%3E%3Crect id='Rectangle_491-2' data-name='Rectangle 491' width='1335.276' height='650.113' transform='translate(0 543.106) rotate(-24)' fill='rgba(255,255,255,0.01)'/%3E%3C/g%3E%3Cg id='Group_368' data-name='Group 368' transform='matrix(-0.656, -0.755, 0.755, -0.656, 1017.824, 1042.94)'%3E%3Crect id='Rectangle_492-3' data-name='Rectangle 492' width='745.289' height='650.113' transform='translate(296.729 261.648) rotate(12.007)' fill='rgba(255,255,255,0.01)'/%3E%3Crect id='Rectangle_491-3' data-name='Rectangle 491' width='1335.276' height='650.113' transform='translate(0 543.106) rotate(-24)' fill='rgba(255,255,255,0.01)'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A\")",
        'chevron-white':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff95' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
        'chevron-black':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2300000095' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")"
      },
      width: {
        orgChartWidth: '320px'
      },
      translate: {
        avatar: '73px'
      },
      container: {
        center: true
      }
    }
  },
  plugins: [
    require('flowbite/plugin')({ charts: true }),
    require('@tailwindcss/forms'),
    plugin(function ({ addBase, matchUtilities }) {
      addBase({
        // Default colors
        ':root': {
          '--color-dark-chart': toRGB('#524531'),
          '--color-dark-text': toRGB('#D7D7D7'),
          '--color-avatar-bg': toRGB('#F7F7F7'),
          '--color-bg-dark-dashboard-cards': toRGB('#434349'),
          '--color-bg-btn-dark': toRGB('#F2B811'),
          '--color-text-dark': toRGB('#EDEEF0'),
          '--color-subtext-dark': toRGB('#ADB1B8'),
          '--color-bg-form-dark': toRGB('#27282D'),
          '--color-bg-button-dark':
            '0deg, rgba(24, 24, 26, 0.12) 0%, rgba(24, 24, 26, 0.00) 99%, #EDEEF0',
          '--color-bg-black-dark': toRGB('#1B1B1F'),
          '--color-bg-bgblack-dark': toRGB('#18181A'),
          '--color-bg-dark-theme': toRGB('#18181A'),
          '--color-input-bg-dark': toRGB('#27282D'),
          '--color-dark-line': toRGB('#2E3035'),
          '--color-white': toRGB('#FFFFFF'),
          '--color-theme-1': toRGB(colors.indigo['800']),
          '--color-theme-2': toRGB(colors.blue['900']),
          '--color-primary': toRGB(colors.indigo['800']),
          '--color-secondary': toRGB(colors.slate['200']),
          '--color-success': toRGB(colors.teal['600']),
          '--color-info': toRGB(colors.cyan['600']),
          '--color-warning': toRGB(colors.yellow['600']),
          '--color-pending': toRGB(colors.orange['700']),
          '--color-danger': toRGB(colors.red['700']),
          '--color-light': toRGB(colors.slate['100']),
          '--color-dark': toRGB(colors.slate['800']),
          // NOTE imported from Figma 👉 https://www.figma.com/file/71ymV744Lh9WoMCtrsPdLT/Base-%E2%9C%A8?node-id=13%3A1540&mode=dev
          '--color-tag-neutral-bg': toRGB('#F3F4F6'),
          '--color-tag-neutral-hover': toRGB('#E5E7EB'),
          '--color-tag-neutral-text': toRGB('#4B5563'),
          '--color-tag-neutral-icon': toRGB('#6B7280'),
          '--color-tag-blue-bg': toRGB('#DBEAFE'),
          '--color-tag-blue-hover': toRGB('#BFDBFE'),
          '--color-tag-blue-text': toRGB('#1D4ED8'),
          '--color-tag-blue-icon': toRGB('#2563EB'),
          '--color-tag-green-bg': toRGB('#D1FAE5'),
          '--color-tag-green-hover': toRGB('#A7F3D0'),
          '--color-tag-green-text': toRGB('#047857'),
          '--color-tag-green-icon': toRGB('#059669'),
          '--color-tag-orange-bg': toRGB('#FEF4C7'),
          '--color-tag-orange-hover': toRGB('#FDE68A'),
          '--color-tag-orange-text': toRGB('#B45309'),
          '--color-tag-orange-icon': toRGB('#D97706'),
          '--color-tag-red-bg': toRGB('#FFE4E6'),
          '--color-tag-red-hover': toRGB('#881337'),
          '--color-tag-red-text': toRGB('#BE123C'),
          '--color-tag-red-icon': toRGB('#E11D48'),
          '--color-tag-purple-icon': toRGB('#7C3AED'),
          '--color-tag-purple-text': toRGB('#6D28D9'),
          '--color-text-base': toRGB('#030712'),
          '--color-text-subtle': toRGB('#4B5563'),
          '--color-text-muted': toRGB('#9CA3AF'),
          // '--color-bg-switch': toRGB('#E5E7EB'),
          '--color-bg-switch': toRGB('#3f4040'),
          // NOTE
          '--color-text-link': toRGB('#3B82F6'),
          '--color-text-error': toRGB('#E11D48'),
          '--color-text-on-color': toRGB('#ffff'),
          '--color-border-base': toRGB('#E5E7EB'),
          '--color-border-strong': toRGB('#D1D5DB'),
          '--color-border-loud': toRGB('#030712'),
          '--color-border-interactive': toRGB('#3B82F6'),
          '--color-border-error': toRGB('#E11D48'),
          '--color-border-danger': toRGB('#BE123C'),
          '--color-border-transparent': 'rgb(3, 7, 18, .0)',
          '--color-background-base': toRGB('#FFFFFF'),
          '--color-background-disabled': toRGB('#F3F4F6'),
          '--color-background-subtle': toRGB('#F9FAFB'),
          '--color-background-field': toRGB('#F9FAFB'),
          '--color-background-field-hover': toRGB('#F3F4F6'),
          '--color-background-overlay': 'rgb(3, 7, 18, .4)',
          '--color-button-inverted-default': toRGB('#E86B35'),
          '--color-button-inverted-hover': toRGB('#F7773F'),
          // '--color-button-inverted-pressed': toRGB('#E0642F'),
          '--color-button-inverted-pressed': toRGB('#000000'),
          '--color-button-neutral-default': toRGB('#FFFFFF'),
          '--color-button-neutral-hover': toRGB('#F3F4F6'),
          '--color-button-neutral-pressed': toRGB('#F9FBFE'),
          '--color-button-danger-default': toRGB('#E11D48'),
          '--color-button-danger-hover': toRGB('#BE123C'),
          '--color-button-danger-pressed': toRGB('#9F1239'),
          '--color-text-disabled': toRGB('#C3C6CC'),
          // '--color-bg-brand': toRGB('#E86B35'),
          '--color-bg-brand': toRGB('#000000'),
          '--border-radius-2xs': '2px',
          '--border-radius-xs': '4px',
          '--border-radius-small': '6px',
          '--border-radius-m': '8px',
          '--border-radius-l': '16px',
          '--border-radius-xl': '9999px',
          '--spacing-7xs': '1px',
          '--spacing-6xs': '2px',
          '--spacing-5xs': '3px',
          '--spacing-4xs': '4px',
          '--spacing-3xs': '6px',
          '--spacing-2xs': '8px',
          '--spacing-xs': '10px',
          '--spacing-m': '16px',
          '--spacing-l': '24px',
          '--spacing-xl': '32px',
          '--spacing-2xl': '40px',
          '--spacing-3xl': '48px',
          '--spacing-4xl': '64px',
          '--spacing-5xl': '96px',
          '--spacing-6xl': '112px',
          '--box-shadow-border-focus': '0px 0px 0px 2px rgba(247, 123, 69, 0.60)',
          '--box-shadow-border-interactive-shadow':
            '0px 0px 0px 1px #F77B45, 0px 1px 2px 0px rgba(206, 106, 63, 0.50)',
          '--box-shadow-border-interactive-active':
            '0px 0px 0px 4px rgba(247, 123, 69, 0.20), 0px 0px 0px 1px #F77B45',
          '--box-shadow-border-interactive-focus':
            '0px 0px 0px 4px rgba(247, 123, 69, 0.60), 0px 0px 0px 2px #FFF, 0px 0px 0px 1px #F77B45, 0px 1px 2px 0px rgba(206, 106, 63, 0.50)',
          '--box-shadow-base':
            '0px 2px 4px 0px rgba(3, 7, 18, 0.04), 0px 1px 2px -1px rgba(3, 7, 18, 0.08), 0px 0px 0px 1px rgba(3, 7, 18, 0.08)',
          '--box-shadow-card-hover':
            '0px 2px 8px 0px rgba(3, 7, 18, 0.10), 0px 1px 2px -1px rgba(3, 7, 18, 0.08), 0px 0px 0px 1px rgba(3, 7, 18, 0.08)',
          '--box-shadow-modal':
            '0px 2px 24px 0px rgba(3, 7, 18, 0.08), 0px 16px 32px 0px rgba(3, 7, 18, 0.08), 0px 0px 0px 1px rgba(3, 7, 18, 0.08), 0px 0px 0px 2px rgba(229, 231, 235, 0.40) inset, 0px 0px 0px 1px #FFF inset',
          '--box-shadow-flyout':
            '0px 8px 16px 0px rgba(3, 7, 18, 0.08), 0px 0px 0px 1px rgba(3, 7, 18, 0.08)',
          '--box-shadow-tooltip':
            '0px 4px 8px 0px rgba(3, 7, 18, 0.08), 0px 0px 0px 1px rgba(3, 7, 18, 0.08)',
          '--box-shadow-primary-button': '0px 2px 2px -1px rgba(0, 0, 0, 0.10)',
          '--box-shadow-destructive-button':
            '0px 0px 0px 1px rgba(190, 18, 60, 0.80), 0px 1px 2px 0px rgba(190, 18, 60, 0.40), 0px 0.75px 0px 0px rgba(255, 255, 255, 0.20) inset',
          '--box-shadow-dark-pagination': '0px 0px 0px 1px rgba(3, 7, 18, 0.08)',
          '--pagination-button-background':
            'linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, rgba(35, 38, 45, 0.05) 100%), #262628'
        },
        // Default dark-mode colors
        '.dark': {
          '--color-primary': toRGB(colors.blue['700']),
          '--color-darkmode-50': '87 103 132',
          '--color-darkmode-100': '74 90 121',
          '--color-darkmode-200': '65 81 114',
          '--color-darkmode-300': '53 69 103',
          '--color-darkmode-400': '48 61 93',
          '--color-darkmode-500': '41 53 82',
          '--color-darkmode-600': '40 51 78',
          '--color-darkmode-700': '35 45 69',
          '--color-darkmode-800': '27 37 59',
          '--color-darkmode-900': '15 23 42',
          '--color-bg': 'red'
        }
      });
    })
  ]
};

// background: var(--buttons-button-neutral-dark, linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, rgba(35, 38, 45, 0.05) 100%), #262628);
// box-shadow: 0px 0px 0px 1px rgba(3, 7, 18, 0.08);
