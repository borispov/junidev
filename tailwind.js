module.exports = {
  theme: {
    extend: {
      inset: {
        '1/2': '50%',
        '1/4': '25%',
        '-16': '-4rem',
        '-1/2': '-50%',
        '60': '60%',
      },
      zIndex: {
        'neg1': '-1',
        '50': '50'
      },
      maxWidth: {
        'min': '8rem'
      },
      minWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '10': '10em',
        '15': '15em',
        'lg': '1024px'
      },
      screens: {
        '2xl': '1440px'
      }
    }
  },
  variants: {
    appearance: ['responsive', 'hover', 'focus'],
  },
  plugins: []
}
