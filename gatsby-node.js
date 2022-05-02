const path = require(`path`)

module.exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === "MarkdownRemark") {
    const slug = path.basename(node.fileAbsolutePath, '.md')

    createNodeField({
      node,
      name: 'slug',
      value: slug
    })
  }
}

module.exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const template = path.resolve('./src/templates/itemPage/index.js')

  const res = await graphql(`
  query getItemData {
    allMarkdownRemark {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            description
            img
            title
          }
          html
        }
      }
    }
  }
`)


  res.data.allMarkdownRemark.edges.forEach((edge) => {
    createPage({
      path: `/items/${edge.node.fields.slug}`,
      component: template,
      context: {
        data: { item: { text: edge.node.html, ...edge.node.frontmatter } },
      },
    })
  })
}

