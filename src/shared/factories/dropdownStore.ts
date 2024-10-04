import { createEffect, createEvent, createStore, sample } from "effector";

import { createQuery } from "@farfetched/core";
import { createFactory } from '@withease/factories';
import { useUnit } from "effector-react";
import { useEffect } from "react";

interface FactoryProps<T> {
  source: sourceType<T>,
  typeConversion?: (item: T) => GuideItem,
  withClear?: boolean
}


export const dropdownStore = createFactory(<T>({ source, withClear, typeConversion = (item: any) => ({ id: item.id, name: item.name }) }: FactoryProps<T>) => {

  const getTitle = (i: T) => typeConversion(i).name
  const getKey = (i: T) => typeConversion(i).id

  const getItemsQuery = createQuery({
    effect: createEffect(async () => {
      if (typeof source === 'function')
        return source()
      return source
    })
  })

  const init = createEvent<T | null>()
  const select = createEvent<T>()
  const onClear = createEvent();
  const $selected = createStore<T | null>(null, { skipVoid: false })
    .on(onClear, _ => null)
  const $items = createStore<T[]>([])

  sample({
    clock: getItemsQuery.finished.success,
    fn: c => {
      return c.result
    },
    target: $items
  })

  sample({
    clock: select,
    target: $selected
  })


  const useDropdown = (props?: { initialState?: T, typeConversion?: (item: T) => GuideItem }) => {
    useEffect(() => {
      getItemsQuery.start();
      if (props) {
        const { initialState } = props
        if (initialState)
          init(initialState)
      }
    }, [])
    const getProps = () => {
      return ({
        ...useUnit({ items: $items, selected: $selected, pending: getItemsQuery.$pending, onChange: select, }), getTitle, getKey, onClear: withClear ? useUnit(onClear) : undefined
      })
    }
    return { ...useUnit({ $selected }), getProps }
  }

  return { useDropdown, $items, $selected, select }

}
)

