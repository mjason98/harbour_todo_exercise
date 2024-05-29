import { Todos } from '@/components/Todos';
import { gql } from 'graphql-request';
import { client } from '@/lib/client';
import { Todo } from '@/components/Todos';

type MyListPageMetadata = {
  params: { listId: string };
};

export async function generateMetadata({ params }: MyListPageMetadata) {
  return {
    title: `TODO List ${params.listId}`,
  };
}

type MyListPageProps = MyListPageMetadata;

const GET_TODO_LIST_QUERY = gql`
  query GetTODOLists($listId: Int!) {
    getTODOs(listId: $listId) {
      desc
      id
      finished
      todo_list_id
    }
  }
`;

export default async function MyListPage({
  params: { listId },
}: MyListPageProps) {
  const { getTODOs } = await client.request<{ getTODOs: Todo[] }>(
    GET_TODO_LIST_QUERY,
    {
      listId: parseInt(listId),
    },
  );

  return (
    <div className="flex align-center justify-center p-16 sm:p-8">
      <Todos
        listId={parseInt(listId)}
        list={getTODOs ?? []}
      />
    </div>
  );
}
