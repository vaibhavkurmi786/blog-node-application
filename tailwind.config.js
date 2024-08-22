module.exports = {
    content: [
      './views/**/*.ejs', // Ensure this path is correct for your EJS files
      // other paths...
    ],
    theme: {
      extend: {
        // Custom background images can also be added here if needed.
        backgroundImgae:{

           ' customImage': "url(../assets/bgimage.jpg)"
        }
      },
    },
    plugins: [],
  }
  