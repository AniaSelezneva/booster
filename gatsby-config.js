module.exports = {
  siteMetadata: {
    siteUrl: `https://web-booster.netlify.app`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "webbooster task",
        icon: "src/images/icon.svg",
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-layout`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/markdown-items`,
      },
    },
    `gatsby-transformer-remark`,
  ],
};
