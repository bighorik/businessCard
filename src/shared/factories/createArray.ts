import { createEvent, createStore, sample } from "effector";

import { createFactory } from '@withease/factories';
import { useUnit } from "effector-react";

interface FactoryProps<T> {
  initialState?: T[],
}

export const createArray = createFactory(<T>({ initialState = [] }: FactoryProps<T>) => {

  const add = createEvent<T>()
  const remove = createEvent<number>()

  const $state = createStore<T[]>(initialState)

  sample({
    clock: add,
    source: $state,
    fn: (s, c) => [...s, c],
    target: $state
  })

  sample({
    clock: remove,
    source: $state,
    fn: (s, c) => {
      let result = s.slice()
      result.splice(c, 1)
      return [...result]
    },
    target: $state
  })


  const useArray = () => {
    return useUnit({ add, remove, $state })
  }

  return { add, remove, $state, useArray }

})
