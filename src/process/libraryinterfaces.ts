import gql from "graphql-tag";

export interface LibraryCategory {
  // Changes must also be reflected in gqlTypes and gqlFragments below!
  categoryId: string;
  language: string;
  displayName: string;
  urlName: string;
  description?: string;
  icon?: string;
}
export const gqlLibraryTypes = `     
  type LibraryCategory {
    categoryId: String!
    language: String!
    urlName: String!
    displayName: String!
    description: String
    icon: String
  }
`;

export const gqlLibraryFragments = gql`
  fragment LibraryCategoryFields on LibraryCategory {
    categoryId
    language
    urlName
    displayName
    description
    icon
  }
`;
export const gqlQueryLibraryCategories = gql`
  query queryLibraryCategories {
    libraryCategories {
      ...LibraryCategoryFields
    }
  }
  ${gqlLibraryFragments}  
`;