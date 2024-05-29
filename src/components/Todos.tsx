'use client';

import { useState } from 'react';
import { Heart } from '@/components/icons/Heart';
import { Close } from '@/components/icons/Close';
import { AddTodo } from '@/components/AddTodo';

import { gql } from 'graphql-request';
import { client } from '@/lib/client';

export type Todo = {
  id: number;
  desc: string;
  finished: boolean;
};

type TodosProps = {
  listId: number;
  list: Todo[];
};

const ADD_TODO = gql`
  mutation Mutation($listId: Int!, $desc: String!) {
    addTODO(listId: $listId, desc: $desc) {
      desc
      id
      desc
    }
  }
`;

const FINSH_TODO = gql`
mutation Mutation($finishTodoId: Int!, $listId: Int!) {
  finishTODO(id: $finishTodoId, listId: $listId) {
    id
    finished
    desc
  }
}
`;

const REMOVE_TODO = gql`
mutation Mutation($removeTodoId: Int!, $listId: Int!) {
  removeTODO(id: $removeTodoId, listId: $listId)
}
`;


export const Todos = ({ list = [], listId }: TodosProps) => {
  const [todos, setTodos] = useState<Todo[]>(list);
  const [loading, setLoading] = useState<boolean>(false);

  const onAddHandler = (desc: string) => {
    client
      .request<{ addTODO: Todo }>(ADD_TODO, {
        listId: listId,
        desc: desc,
      })
      .then((data) => {
        setTodos([...todos, data.addTODO]);
        setLoading(false);
      });
    setLoading(true);
  };

  const onRemoveHandler = (id: number) => {
    client
      .request<{ removeTODO: boolean }>(REMOVE_TODO, {
        listId: listId,
        removeTodoId: id,
      })
      .then((data) => {
        if (data.removeTODO)
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setLoading(false);
      });
    setLoading(true);
  };

  const onFinishHandler = (id: number) => {
    client
      .request<{ finishTODO: Todo }>(FINSH_TODO, {
        listId: listId,
        finishTodoId: id,
      })
      .then((data) => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === data.finishTODO.id ? { ...todo, finished: true } : todo
          )
        );
        setLoading(false);
      });
    setLoading(true);
  };

  return (
    <div>
      <h2 className="text-center text-5xl mb-10">My TODO list</h2>
      <ul>
        {todos.map((item) => (
          <li
            key={item.id}
            className="py-2 pl-4 pr-2 bg-gray-900 rounded-lg mb-4 flex justify-between items-center min-h-16"
          >
            <p className={item.finished ? 'line-through' : ''}>{item.desc}</p>
            {!item.finished && (
              <div className="flex gap-2">
                <button
                  className="btn btn-square btn-accent"
                  onClick={() => onFinishHandler(item.id)}
                >
                  <Heart />
                </button>
                <button
                  className="btn btn-square btn-error"
                  onClick={() => onRemoveHandler(item.id)}
                  disabled={loading}
                >
                  <Close />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <AddTodo onAdd={onAddHandler} loading={loading} />
    </div>
  );
};
