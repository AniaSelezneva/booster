import * as React from "react";
import * as styles from "./styles.module.scss";
import { graphql } from "gatsby";
import Item from "./components/item";

const IndexPage = ({ data }) => {
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
            <Item
              key={idx}
              data={{
                item: { slug: edge.node.fields.slug, ...edge.node.frontmatter },
              }}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

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
`;

export default IndexPage;
