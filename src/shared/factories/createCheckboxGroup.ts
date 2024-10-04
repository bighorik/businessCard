import { createEffect, createEvent, createStore } from "effector";

import { createQuery } from "@farfetched/core";
import { createFactory } from '@withease/factories';
import { useUnit } from 'effector-react';
import { useEffect } from "react";

type internalItemType<T> = T & { checked: boolean }

interface FactoryProps<T> {
  source?: sourceType<T>,
  initialState?: internalItemType<T>[],
  typeConversion?: (item: T) => GuideItem
}



export const createCheckboxGroup = createFactory(<T>({ initialState = [], source, typeConversion = (item: any) => ({ id: item.id, name: item.name }) }: FactoryProps<T>) => {
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

  const getTitle = (i: internalItemType<T>) => typeConversion(i).name
  const getChecked = (i: internalItemType<T>) => i.checked
  const onClick = createEvent<number>()
  const $items = createStore<(T & { checked: boolean })[]>(initialState.map(e => ({ ...e, checked: false })))
    .on(onClick, (s, c) => {
      let res = s.slice()
      res[c].checked = !res[c].checked
      return [...res]
    })
    .on(getItemsQuery.finished.success, (s, c) => c.result.map(e => ({ ...e, checked: false })))



  const useCheckboxGroup = () => {
    useEffect(() => { getItemsQuery.start() }, [])
    const getProps = () => {
      const units = useUnit({ $items, onClick, $pending: getItemsQuery.$pending })
      return {
        items: units.$items, onClick: onClick,
        getTitle, getChecked, isLoading: units.$pending
      }
    }

    return { ...useUnit({ $items, onClick }), getProps }
  }


  return { onClick, $items, useCheckboxGroup }
})

