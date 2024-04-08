/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      backdropBlur: {
        5: '5px',
        8: '8px',
        20: '20px',
      },
      fontFamily: {
        'login-title': 'Roboto',
      },
      colors: {
        primary: {
          DEFAULT: '#5A5C85',
          lighter: '#BABBE1',
          light: '#A09BAF',
          hover: '#8486B4',
          heavy: '#4D4F79',
        },
        secondary: {
          DEFAULT: '#FBBE21',
          hover: '#FFD874',
          line: '#EEB13C',
          'line-base': '#F2EFE8',
          light: '#FFFBF1',
          'new-light': '#EAF1FF',
          new: '#6182C3',
          'new-300': '#9AA9C7',
          'new-bg': '#F1F5FC',
          'new-dark': '#445B89',
        },
        third: {
          DEFAULT: '#82CDDB',
          hover: '#4EA3B6',
          line: '#69B590',
          'line-base': '#E8F2ED',
          light: '#F9FFF1',
          7: '#4C8098',
        },
        four: {
          DEFAULT: '#FEABBF',
          hover: '#EC6F8D',
          'line-base': '#FAE7F0',
        },
        danger: {
          DEFAULT: '#F35A5A',
          hover: '#FE7D7D',
        },
        red: {
          DEFAULT: '#EB5757',
        },
        cancel: {
          DEFAULT: '#E0E0E0',
          hover: '#CCCCCC',
        },
        gray: {
          1: '#333333',
          2: '#4F4F4F',
          3: '#828282',
          4: '#BDBDBD',
          5: '#E0E0E0',
          6: '#F2F2F2',
          DEFAULT: '#FBFBFB',
        },
        blue: {
          1: '#2F80ED',
          2: '#2D9CDB',
          3: '#332FED',
          4: '#110DFB',
        },
        orange: {
          DEFAULT: '#F48A28',
        },
        'edit-purple': '#6E6BDD',
        bg: {
          DEFAULT: '#E8EAF2',
          middle: '#F3F4F8',
        },
        line: 'rgba(229, 230, 244, 0.5)',
        border: {
          DEFAULT: '#A09BAF',
        },
        card: {
          'primary-light': '#F9F9FF',
          'secondary-light': '#FFFBF1',
          'third-light': '#F9FFF1',
          'lightpr-bg': '#FBFCFF',
        },
        insight: {
          title: '#696CBA',
          'title-line': '#9B74DA',
          'hint-line': '#ADB4F5',
          'web-comment-border-start': '#39BBE4',
          'web-comment-border-end': 'rgb(144 128 241/0.74)',
          'web-1-layer': '#64C2FD',
          'web-2-layer': '#5966D0',
          'web-3-layer': '#8191F4',
          'web-4-layer': '#838BB9',
          'web-1-start': '#24afdd',
          'web-1-end': '#5e5bf4',
          'web-2-start': '#4953B0',
          'web-2-end': '#5A68E8',
          'web-3-start': '#6775F4',
          'web-3-end': '#4F79E5',
          'web-4-start': '#838bb9',
          'web-4-end': '#5c89fa',
          'web-border-1': '#AEBFFD',
          'web-border-2': '#7181C7',
          'web-title-start': '#39BBE4',
          'web-title-end': 'rgb(144 128 241/0.74)',
          'poi-comment-border-start': '#FF835C',
          'poi-comment-border-end': 'rgb(120 91 207/0.74)',
          'poi-1-layer': '#A444D1',
          'poi-2-layer': '#D87BAA',
          'poi-3-layer': '#F7A175',
          'poi-4-layer': '#EEBD5C',
          'poi-1-start': '#FF5252',
          'poi-1-end': '#8631F1',
          'poi-2-start': '#FB715E',
          'poi-2-end': '#B86EE4',
          'poi-3-start': '#FE9960',
          'poi-3-end': '#AB8DFF',
          'poi-4-start': '#ffb23f',
          'poi-4-end': '#c9b5f8',
          'poi-border-1': '#FFD3E3',
          'poi-border-2': '#F66C95',
          'poi-title-start': 'rgb(255 131 92/0.7)',
          'poi-title-end': 'rgb(120 91 207/0.74)',
          yellow: '#FDB242',
          'highlight-brand': '#4C49D2',
          'section-bg': '#FDFDFF',
        },
        backdrop: {
          DEFAULT: '#47485A',
        },
        'login-bg': {
          DEFAULT: '#fefefe',
        },
        popup: {
          DEFAULT: '#5a5c85',
        },
        up: {
          DEFAULT: '#6EC393',
          word: '#27AE60',
          bg: '#E8F2EB',
        },
        down: {
          DEFAULT: '#FE8678',
          word: '#F35A5A',
          bg: '#FE8678'
        },
        chart: {
          'horizontal-line': '#E5E6F4',
        },
      },
      boxShadow: {
        DEFAULT: '0px 2px 4px rgba(111, 111, 111, 0.2)',
        md: '0px 2px 8px rgba(88, 82, 103, 0.25)',
        inline: 'inset 0px -1px 0px rgba(186, 187, 225, 0.8)',
        'second-inline': 'inset 0px -1px 0px rgba(238, 177, 60, 0.8)',
        'header-drop': '0px 5px 12px rgba(88, 82, 103, 0.45)',
        'popup-sm':
          '0px 5px 5px -3px rgba(88, 82, 103, 0.2), 0px 3px 14px 2px rgba(88, 82, 103, 0.12)',
        'popup-lg': '0px 5px 12px rgba(88, 82, 103, 0.45)',
        login: '2px 5px 20px rgba(107, 91, 141, 0.45)',
        'insight-layer': '0px 4px 4px rgba(70, 56, 107, 0.25)',
        'insight-comment': '0px 4px 12px rgba(37, 35, 143, 0.25)',
        'insight-card': '0px 4px 12px rgba(77, 45, 147, 0.25)',
        'insight-card-lg': '0px 4px 20px 0px rgba(0, 0, 0, 0.10)',
        'small-card': '2px 2px 4px rgba(0, 0, 0, 0.1)',
        'float-actions': '0px -6px 12px 0px rgba(90, 92, 133, 0.10)',
      },
      fontSize: {
        sm: ['0.875rem', '1.1875rem'],
        md: ['0.9375rem', '1.25rem'],
        base: ['1rem', '1.3125rem'],
        lg: ['1.25rem', '1.6875rem'],
        '0.75xl': ['1.0625rem', '1.75rem'],
        '2.25xl': ['1.5625rem', '1.8125rem'],
        '2.67xl': ['1.75rem', '2rem'],
        '3.33xl': ['2rem', '2.6875rem'],
        '3.67xl': ['2.125rem', '2.4175rem'],
        '7.17xl': '4.75rem',
        '16xl': ['4rem', '4.625rem'],
        '18xl': ['4.5rem', '6rem'],
      },
      lineHeight: {
        3.5: '0.875rem',
        4.25: '1.0625rem',
        4.5: '1.125rem',
        4.75: '1.1875rem',
        5.75: '1.4375rem',
        6.5: '1.625rem',
        6.75: '1.6875rem',
        7: '1.75rem',
        7.25: '1.8125rem',
        7.5: '1.875rem',
        9.25: '2.3125rem',
        10.5: '2.625rem',
        12: '3rem',
        13.75: '3.3475rem',
        16: '4rem',
        24: '6rem',
        normal: '1.3125',
      },
      spacing: {
        0.75: '0.1875rem',
        1.25: '0.3125rem',
        1.75: '0.4375rem',
        2.25: '0.5625rem',
        2.75: '0.6875rem',
        3.25: '0.8125rem',
        3.75: '0.9375rem',
        4.75: '1.1875rem',
        5.5: '1.375rem',
        6: '1.5rem',
        6.5: '1.625rem',
        7.25: '1.8125rem',
        7.5: '1.875rem',
        7.75: '1.9375rem',
        9.5: '2.375rem',
        10.5: '2.625rem',
        12.5: '3.125rem',
        13.5: '3.375rem',
        15: '3.75rem',
        17.75: '4.4375rem',
        21.5: '5.375rem',
        22.75: '5.6875rem',
        23: '5.76rem',
        30: '7.5rem',
        31.75: '7.9375rem',
        38.5: '9.625rem',
        44.75: '11.1875rem',
        67.75: '16.9375rem',
        68: '17rem',
        78: '19.5rem',
        89.5: '22.375rem',
        96: '24rem',
        142: '35.5rem',
      },
      minWidth: {
        52.5: '13.125rem',
        57.5: '14.375rem',
        63: '15.75rem',
      },
      maxWidth: {
        55: '13.75rem',
        63.75: '15.9375rem',
        68: '17rem',
        70: '17.5rem',
        96: '24rem',
        114.5: '28.625rem',
        117.5: '29.375rem',
        134.5: '33.625rem',
        149.5: '37.375rem',
        150: '37.5rem',
        208: '52rem',
      },
      minHeight: {
        18: '4.5rem',
        52: '13rem',
        52.25: '13.0625rem',
        57.75: '14.4375rem',
        76: '19rem',
      },
      transitionProperty: {
        'input-focus':
          'margin, padding, color, font-size, line-height, background-color',
        'app-header': 'margin, width',
        width: 'width',
        height: 'height',
        margin: 'margin',
        'font-size': 'font-size',
        padding: 'padding',
        'siderbar-nav-item': 'border-radius, width',
        'siderbar-nav-item-icon': 'width, height, font-size',
        'border-radius': 'border-radius',
      },
      opacity: {
        81: '0.81',
      },
      textShadow: {
        default: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        md: '0px 2px 8px rgba(88, 82, 103, 0.25)',
      },
      zIndex: {
        60: '60',
      },
    },
  },
  plugins: [require('tailwindcss-textshadow')],
};
