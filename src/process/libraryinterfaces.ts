import gql from "graphql-tag";

export interface LibraryTag {
  // Changes must also be reflected in gqlTypes and gqlFragments below!
  tagName: string;
  tagRelevance: number;  // increased every time a user clicks on a tag
}
export const gqlLibraryTypes = `     
  type LibraryTag {
    tagName: String!
    tagRelevance: Int
  }
`;

export const gqlLibraryFragments = gql`
  fragment LibraryTagFields on LibraryTag {
    tagName
    tagRelevance
  }
`;
export const gqlQueryLibraryTags = gql`
  query queryLibraryTags {
    libraryTags {
      ...LibraryTagFields
    }
  }
  ${gqlLibraryFragments}  
`;
export const gqlIncreaseTagRelevance = gql`
  mutation increaseTagRelevance($tagName: String!) {
    increaseTagRelevance(tagName: $tagName)
  }
`;