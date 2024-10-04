const { transform } = require('typescript');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'accent': 'var(--color-accent)',
      'on-accent': 'var(--color-on-accent)',
      'primary': 'var(--color-primary)',
      'on-primary': 'var(--color-on-primary)',
      'white': 'var(--color-white)',
      'bg': 'var(--color-bg)',
      'link': 'var(--color-link)',
      'transparent': "transparent",
      'footer': 'var(--color-footer)',
      'focus': 'var(--color-focus)',
      'warning': 'var(--color-yellow1)',

      'yellow-1': 'var(--color-yellow1)',

      'green': 'var(--color-green-text)',
      'green-1': 'var(--color-green1)',
      'green-2': 'var(--color-green2)',
      'green-3': 'var(--color-green3)',

      'red': 'var(--color-red-text)',
      'red-1': 'var(--color-red1)',
      'red-2': 'var(--color-red2)',
      'red-3': 'var(--color-red3)',

      'gray-1': 'var(--color-gray1)',
      'gray-2': 'var(--color-gray2)',
      'gray-3': 'var(--color-gray3)',
      'gray-4': 'var(--color-gray4)',

      'inherit': 'inherit',
    },

    borderRadius: {
      '0': '0',
      '4': '4px',
      '8': '8px',
      '12': '12px',
      '16': '16px',
      'full': '9999px'
    },
    backgroundImage: {
      'gradient-story': 'linear-gradient(63.11deg, #FFF8B8 47.509499999999996%, #FEEC37 100%)',
      'gradient-counter': 'linear-gradient(117deg, #FFF -5.13%, #FEE600 105.93%)',
      'gradient-yellow-4': 'linear-gradient(241deg, #FEE600 0.55%, #FEF16D 34.69%, #FFFBDB 82.41%, #FFF 107.47%)'
    },
    extend: {
      screens: {
        xl: { 'max': "1279px" },
        lg: { 'max': "1023px" },
        md: { 'max': "767px" },
        md2: { 'max': "590px" },
        sm: { 'max': "379px" },
        xs: { 'max': "319px" },

        mxl: { 'min': "1280px" },
        mlg: { 'min': "1024px" },
        mmd: { 'min': "768px" },
        msm: { 'min': "380px" },
        mxs: { 'min': "320px" },
      },
    },

    spacing: {
      '0': '0px',
      '1': '1px',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
      '10': '10px',
      '12': '12px',
      '16': '16px',
      '20': '20px',
      '22': '22px',
      '24': '24px',
      '28': '28px',
      '30': '30px',
      '32': '32px',
      '36': '36px',
      '40': '40px',
      '48': '48px',
      '52': '52px',
      '54': '54px',
      '56': '56px',
      '60': '60px',
      '72': '72px',
      '74': '74px',
      '76': '76px',
      '100': '100px',
      '200': "200px",
      'init': 'initial'
    },

    boxShadow: {
      'none': '0px 0px 0px 0px rgba(0, 0, 0, 0.00)',
      'l': '0px 4px 20px 0px rgba(0, 0, 0, 0.08)',
      'xl': ' 0px 8px 32px 0px rgba(0, 0, 0, 0.08)',
    },
    content: {

    },
    keyframes: {
      pump: {
        '0%': { transform: 'translateY(100%)' },
        '100%': { transform: 'translateY(0)' },
      },
      spin: {
        'from': { transform: 'rotate(0deg)' },
        'to': { transform: 'rotate(360deg)' }
      },
      animation: {
        pumpOut: 'pump 1s  ease-in-out reverse both',
        pumpIn: 'pump 1s ease-in-out  both',
        spin: 'spin 1s linear infinite',
        none: 'none'
      }
    },
    plugins: [],
  }

}