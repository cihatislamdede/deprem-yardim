/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        '108': '27rem',
      },
      fontSize: {
        'xxs': '0.6rem',
      },
      colors: {
        "primary-black": "#272727",
        "primary-white": "#F4F6FF",
        "primary-green": "#50D890",
        "primary-blue": "#6EC1E4",
        "primary-yellow": "#FFC000",
        "primary-red": "#BB000E",
        "primary-brown" : "#8A5431",
        "nude" : "#F2D2BD",
        "secondary-black": "#120605",
        "secondary-blue" : "#0072CE",
        "seconday-green": "#00D350"
      },
      screens: {
        sm1: "410px",
      },
    },
    fontFamily: {
      'roboto': ['Roboto', 'sans-serif'],
    }
  },
  plugins: [],
};
