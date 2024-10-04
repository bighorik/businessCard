import { Store, createEffect, createEvent, createStore, sample } from "effector";

import { createQuery } from "@farfetched/core";
import { createFactory } from '@withease/factories';
import { useUnit } from "effector-react";
import { debounce } from "patronum";
import { useEffect } from "react";

interface FactoryProps<T> {
  source: sourceType<T>,
  withRefresh?: boolean,
  typeConversion?: (item: T) => GuideItem,
  withClear?: boolean,
  defaultValue?: T | null,
  addItemUrl?: string,
  $additionalSourceParams?: [Store<any>]
}


export const comboBoxStore = createFactory(<T>({ source, withRefresh, withClear, $additionalSourceParams, defaultValue = null, typeConversion = (item: any) => ({ id: item.id, name: item.name }) }: FactoryProps<T>) => {

  const getTitle = (i: T) => typeConversion(i).name
  const getKey = (i: T) => typeConversion(i).id

  const getItemsQuery = createQuery({
    effect: createEffect(async (props?: { query?: string, anyParams?: any }) => {
      if (typeof source === 'function')
        return source(props?.query, props?.anyParams)
      return source
    })
  })


  const init = createEvent<T>()
  const select = createEvent<T>()
  const onSearch = createEvent<string>()
  const onClear = createEvent();
  const onRefresh = createEvent();

  const $selected = createStore<T | null>(defaultValue)
    .on(select, (_, e) => e)
    .on(onClear, _ => defaultValue)
  const $query = createStore<string>("")
    .on(onSearch, (_, e) => e)
    .on(onClear, _ => "")
  const $items = createStore<T[]>([])
    .on(getItemsQuery.finished.success, (_, e) => e.result)
  const $filteredItems = createStore<T[]>([])
  const $notFound = createStore<boolean>(false)
    .on([onClear, select], _ => false)
    .on(getItemsQuery.finished.failure, _ => true)
    .on(getItemsQuery.finished.success, (_, e) => e.result.length === 0)
  const $isError = createStore<boolean>(false)
    .on([onSearch, select], _ => false)

  if (withRefresh) {

    if ($additionalSourceParams)
      sample({
        clock: debounce(onSearch, 300),
        source: $additionalSourceParams,
        filter: (s, c) => c.length >= 3,
        fn: (s, c) => ({ query: c, anyParams: s }),
        target: getItemsQuery.start
      })
    else sample({
      clock: debounce(onSearch, 300),
      filter: c => c.length >= 3,
      fn: c => ({ query: c }),
      target: getItemsQuery.start
    })

    sample({
      clock: onSearch,
      filter: c => c.length < 3,
      fn: _ => [],
      target: $items
    })
  }

  sample({
    clock: select,
    fn: c => typeConversion(c).name,
    target: onSearch
  })

  sample({
    clock: [$query, $items],
    source: { $query, $items },
    fn: s => s.$items.filter(e => getTitle(e).toLocaleLowerCase().includes(s.$query.toLocaleLowerCase())),
    target: $filteredItems
  })

  sample({
    clock: onRefresh,
    target: getItemsQuery.start
  })



  const useComboBox = (props?: { initialState?: T, }) => {
    useEffect(() => {
      if (!withRefresh)
        getItemsQuery.start();
      if (props) {
        const { initialState } = props
        if (initialState)
          init(initialState)
      }
    }, [])
    const getProps = () => {
      return ({ ...useUnit({ items: withRefresh ? $items : $filteredItems, selected: $selected, pending: getItemsQuery.$pending, onChange: select, onSearch, query: $query, notFound: $notFound, isError: $isError }), getTitle, getKey, withHide: withRefresh, onClear: withClear ? useUnit({ onClear }).onClear : undefined })
    }
    return { ...useUnit({ $selected, onSearch }), getProps }
  }

  return { useComboBox, $items, $selected, select, onRefresh, $isError, onClear }

})

interface MultiplyFactoryProps<T> {
  source: sourceType<T>,
  withRefresh?: boolean,
  typeConversion?: (item: T) => GuideItem,
  withClear?: boolean,
  defaultValue?: T[],
}


export const multipleComboBoxStore = createFactory(<T>({ source, withRefresh, withClear, defaultValue = [] as any, typeConversion = (item: any) => ({ id: item.id, name: item.name }) }: MultiplyFactoryProps<T>) => {

  const getTitle = (i: T) => typeConversion(i).name
  const getKey = (i: T) => typeConversion(i).id

  const getItemsQuery = createQuery({
    effect: createEffect(async (query?: string) => {
      if (typeof source === 'function')
        return source(query)
      return source
    })
  })


  const init = createEvent<T>()
  const select = createEvent<T[]>()
  const onSearch = createEvent<string>()
  const onClear = createEvent();
  const onRefresh = createEvent();

  const $selected = createStore<T[]>(defaultValue)
    .on(select, (_, e) => e)
    .on(onClear, _ => defaultValue)
  const $query = createStore<string>("")
    .on(onSearch, (_, e) => e)
    .on(onClear, _ => "")
  const $items = createStore<T[]>([])
    .on(getItemsQuery.finished.success, (_, e) => e.result)
  const $filteredItems = createStore<T[]>([])
  const $notFound = createStore<boolean>(false)
    .on([onClear, select], _ => false)
    .on(getItemsQuery.finished.failure, _ => true)
    .on(getItemsQuery.finished.success, (_, e) => e.result.length === 0)
  const $isError = createStore<boolean>(false)
    .on([onSearch, select], _ => false)

  if (withRefresh) {
    sample({
      clock: debounce(onSearch, 300),
      filter: c => c.length >= 3,
      target: getItemsQuery.start
    })
    sample({
      clock: onSearch,
      filter: c => c.length < 3,
      fn: _ => [],
      target: $items
    })
  }

  sample({
    clock: [$query, $items],
    source: { $query, $items },
    fn: s => s.$items.filter(e => getTitle(e).toLocaleLowerCase().includes(s.$query.toLocaleLowerCase())),
    target: $filteredItems
  })

  sample({
    clock: onRefresh,
    target: getItemsQuery.start
  })


  const useComboBox = (props?: { initialState?: T, }) => {
    useEffect(() => {
      if (!withRefresh)
        getItemsQuery.start();
      if (props) {
        const { initialState } = props
        if (initialState)
          init(initialState)
      }
    }, [])
    const getProps = () => {
      return ({ ...useUnit({ items: withRefresh ? $items : $filteredItems, selected: $selected, pending: getItemsQuery.$pending, onChange: select, onSearch, query: $query, notFound: $notFound, isError: $isError }), getTitle, getKey, withHide: withRefresh, onClear: withClear ? useUnit({ onClear }).onClear : undefined })
    }
    return { ...useUnit({ $selected, onSearch }), getProps }
  }

  return { useComboBox, $items, $selected, select, onRefresh, $isError }

})