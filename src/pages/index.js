import * as React from "react"
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../context/GlobalContextProvider"
import * as styles from "./styles.module.scss"
import { graphql } from 'gatsby'
import Markdown from 'markdown-to-jsx';
import Item from "./components/item";
import { Link } from "gatsby"
import OrderModal from "./components/orderModal";


// markup
const IndexPage = ({ data }) => {
  const dispatch = React.useContext(GlobalDispatchContext)
  const state = React.useContext(GlobalStateContext)

  return (
    <>
      <title>Home Page</title>
      <div className={styles.container}>
        {/* 
        List of items 
        */}
        <ul className={styles.list}>
          {data.allMarkdownRemark.edges.map((edge, idx) => (
            // Item
            <Item key={idx} data={{ item: { slug: edge.node.fields.slug, ...edge.node.frontmatter } }} />
          ))}</ul>
      </div>
    </>
  )
}

// Query
export const query = graphql`
  query GetAllItemsQuery {
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
            id
          }
        }
      }
    }
  }
`

export default IndexPage
