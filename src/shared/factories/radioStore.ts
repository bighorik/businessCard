import { createEffect, createEvent, createStore } from "effector";

import { createQuery } from "@farfetched/core";
import { createFactory } from '@withease/factories';
import { useUnit } from 'effector-react';
import { useEffect } from "react";

interface FactoryProps<T> {
  source?: sourceType<T>,
  initialState: T,
  typeConversion?: (item: T) => GuideItem
}



export const radioStore = createFactory(<T>({ initialState, source, typeConversion = (item: any) => ({ id: item.id, name: item.name }) }: FactoryProps<T>) => {
  const getItemsQuery = createQuery({
    effect: createEffect(async () => {
      if (source) {
        if (typeof source === 'function')
          return source()
        return source
      }
      else return []
    }),
    initialData: []
  })

  const getTitle = (i: T) => typeConversion(i).name
  const switched = createEvent<T>()
  const $state = createStore<T>(initialState)
    .on(switched, (_, e) => e)



  const useRadioField = () => {
    useEffect(() => { getItemsQuery.start() }, [])
    const getProps = () => {
      const { $state: state, switched: onClick, items } = useUnit({ $state, switched, items: getItemsQuery.$data })
      return {
        selected: state, onClick: onClick,
        items: items, getTitle: getTitle
      }
    }

    return { ...useUnit({ $state, switched }), getProps }
  }

  const useRadio = () => {
    const getProps = (key: T) => {
      const { $state: state, switched: onClick } = useUnit({ $state, switched })
      return {
        checked: state === key, onClick: () => onClick(key),
      }
    }

    return { ...useUnit({ $state, switched }), getProps }
  }

  return { switched, $state, useRadio, useRadioField }
})

