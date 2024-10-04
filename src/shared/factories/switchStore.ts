import { createEvent, createStore } from "effector";

import { createFactory } from '@withease/factories';
import { useUnit } from 'effector-react';

interface FactoryProps {
  initialState: boolean
}



export const createSwitch = createFactory(({ initialState }: FactoryProps) => {

  const switched = createEvent()
  const off = createEvent()
  const on = createEvent()
  const $state = createStore(initialState)
    .on(switched, s => !s)
    .on(on, _ => true)
    .on(off, _ => false)


  const getProps = () => {
    return useUnit({ checked: $state, onClick: switched })
  }

  const useSwitch = () => ({ ...useUnit({ $state, switched }), getProps })

  return { switched, $state, useSwitch, on, off }
})

