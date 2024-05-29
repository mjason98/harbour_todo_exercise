"use client";

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


export const Todos = ({ list = [], listId }: TodosProps) => {
  const [todos, setTodos] = useState<Todo[]>(list);
  const [loading, setLoading] = useState<boolean>(false);

  const onAddHandler = (desc: string) => {
    client.request<{ addTODO: Todo }>(
      ADD_TODO,
      {
        listId: listId,
        desc: desc,
      },
    ).then(data => {
      setTodos([...todos, data.addTODO]);
    });
  };

  const onRemoveHandler = (id: number) => {
    console.log(`Remove todo ${id}`);
  };

  const onFinishHandler = (id: number) => {
    console.log(`Mark todo ${id} as finished`);
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
      <AddTodo onAdd={onAddHandler} loading={loading}/>
    </div>
  );
};
