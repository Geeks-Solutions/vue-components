module.exports = {
  purge: {
    enabled: false
  },
  important: true,
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        '15': '3.9rem',
        '4.5': '1.1rem'
      }
    },
    colors: {
      Dark: "#00131F",
      TextColor: "#E3E3E3",
      SubText: "#E7E7E7",
      Blue: "#03B1C7",
      FieldGray: "#C2C2C2",
      TextGray: "#828282",
      SmallTextGray: "#BDBDBD",
      BorderGray: "#EEEEEE",
      white: "#FFFFFF",
      darkGray: "#737373",
      error: "#BA0202",
      grayText: "#7B7B7B",
      purpleInfo: "#61035B",
      mediaGrey: "#6E6E6E",
      mediaUnLocked: "#DDEBFF",
      mediaLocked: "#FFE5DD"
    },
    boxShadow: {
      DEFAULT: '4px 2px 10px rgba(0, 0, 0, 0.1)'
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-pixel-dimensions')({
      width: {
        total: 900, // 900 is the default
        // startingSize: 0, // default
      },
      height: {
        total: 900, // 900 is the default
        // startingSize: 0, // default
      },
    }),
  ],
}
