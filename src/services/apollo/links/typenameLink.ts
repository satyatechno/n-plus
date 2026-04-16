import { ApolloLink } from '@apollo/client';

const relationToTypeMap: Record<string, string> = {
  categories: 'Category',
  channels: 'Channel',
  topics: 'Topic',
  'live-blogs': 'LiveBlog',
  pages: 'Page',
  'press-room': 'PressRoom',
  productions: 'Production',
  programs: 'Program',
  provinces: 'Province',
  posts: 'Post',
  talents: 'Talent',
  videos: 'Video',
  videoRelatedVideoContents: 'VideoRelatedVideoContents'
};

const addTypenameToRelationValue = (obj: {
  relationTo?: string;
  value?: { __typename?: string | null; [key: string]: unknown };
}): { relationTo?: string; value?: { __typename?: string | null; [key: string]: unknown } } => {
  if (obj?.relationTo && obj?.value) {
    const typeName = relationToTypeMap['videoRelatedVideoContents'];

    if (typeName && obj.value.__typename === null) {
      return {
        ...obj,
        value: {
          ...obj.value,
          __typename: typeName
        }
      };
    }
  }
  return obj;
};

const addTypenameToSelectedItem = (obj: unknown): unknown => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(addTypenameToSelectedItem);
  }

  const result = { ...(obj as Record<string, unknown>) };

  if (result.relatedPosts && Array.isArray(result.relatedPosts)) {
    result.relatedPosts = result.relatedPosts.map(addTypenameToRelationValue);
  }

  const selectedItem = result.selectedItem as
    | {
        relationTo?: string;
        value?: { __typename?: string | null; [key: string]: unknown };
        [key: string]: unknown;
      }
    | undefined;

  if (selectedItem?.relationTo && selectedItem?.value) {
    const typeName = relationToTypeMap[selectedItem.relationTo];

    if (typeName && selectedItem.value.__typename === null) {
      result.selectedItem = {
        ...selectedItem,
        value: {
          ...selectedItem.value,
          __typename: typeName
        }
      };
    }
  }

  if (result.relationTo && result.value) {
    const updatedObj = addTypenameToRelationValue(
      result as {
        relationTo: string;
        value: { __typename?: string | null; [key: string]: unknown };
      }
    );
    result.relationTo = updatedObj.relationTo;
    result.value = updatedObj.value;
  }

  for (const key in result) {
    if (result[key] && typeof result[key] === 'object') {
      result[key] = addTypenameToSelectedItem(result[key]);
    }
  }

  return result;
};

const typenameLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    if (response.data) {
      response.data = addTypenameToSelectedItem(response.data) as typeof response.data;
    }
    return response;
  })
);

export default typenameLink;
