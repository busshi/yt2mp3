module.exports = {
  content: [
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
  ],
  theme: {
    extend:{
      screens:{
        'light': {'raw':'(prefers-color-scheme: light)'}
      }
    },
  },
  plugins: [],
}