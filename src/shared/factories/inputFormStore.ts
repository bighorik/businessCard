import { Mutation, createMutation } from "@farfetched/core";
import { Store, createEffect, createEvent, createStore, sample } from "effector";
import { delay, some } from "patronum";

import { createFactory } from '@withease/factories';
import { useUnit } from "effector-react";
import { useEffect } from "react";

interface CreateUseFormProps {
  $pending?: Store<boolean>,
  withoutErrorText?: boolean
}

interface UseFormProps<T> {
  initialState?: T,
  withLock?: boolean,
  entityId?: string
}

export enum SubmitStatusType {
  default,
  success,
  failure
}

export const SubmitStatusText = {
  [SubmitStatusType.default]: "Сохранить изменения",
  [SubmitStatusType.success]: "Успешно!",
  [SubmitStatusType.failure]: "Ошибка!",
}

interface FactoryProps<T> {
  initialState: T,
  submitHandler?: ({ id, payload }: { id?: string, payload: T }) => Promise<ResponseContract<T>>

}


export interface MutationPayload<T> {
  id?: string,
  payload: T
}


export const inputFormStore = createFactory(<T extends Object>({ initialState, submitHandler }: FactoryProps<T>) => {


  let mutation: Mutation<{ id?: string | undefined; payload: T; }, ResponseContract<T>, unknown> | undefined = undefined;

  if (submitHandler)
    mutation = createMutation({
      handler: submitHandler
    })


  const $values = createStore<T>(initialState);
  const $errors = createStore<T>(initialState);
  const $locked = createStore(false);
  const $entityId = createStore<string>("0")
  const $formError = createStore<string>("")
  const $submitStatus = createStore<SubmitStatusType>(0)

  const update = createEvent<React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>>()
  const submit = createEvent();
  const reset = createEvent();
  const init = createEvent<T>();
  const lock = createEvent<T | void>();
  const setId = createEvent<string>()
  const submitStatusChange = createEvent<SubmitStatusType>();

  const validateFx = createEffect<T, void, Error[]>((form) => {
    let errors = new Array<Error>
    Object.entries(form).forEach(e => { if (!e[1]) errors.push({ name: e[0], message: "Обязательное поле" }) })
    if (errors.length !== 0) throw errors;
  });

  $values
    .on(update, (form, event) => ({ ...form, [event.target.name]: event.target.value }))
    .on(reset, () => initialState)
    .on(init, (_, e) => e)

  $errors
    .on(update, (form, event) => ({ ...form, [event.target.name]: "" }))
    .on(validateFx.failData, (errors, event) => {
      event.forEach(e => errors = { ...errors, [e.name]: e.message })
      return errors
    })

  $formError
    .on(submit, _ => "")


  $entityId.on(setId, (_, e) => e)

  $submitStatus
    .on(submitStatusChange, (_, e) => e)
    .on(delay(submitStatusChange, 3000), _ => SubmitStatusType.default)


  sample({
    clock: submit,
    source: $values,
    target: validateFx
  })

  sample({
    clock: validateFx.failData,
    source: $errors,
    fn: (errors, event) => {
      event.forEach(e => errors = { ...errors, [e.name]: e.message })
      return errors
    },
    target: $errors
  })

  sample({
    clock: lock,
    fn: (clock) => clock === undefined || Object.entries(clock).every(e => e[1] !== ""),
    target: [$locked]
  })

  if (mutation) {
    sample({
      clock: validateFx.done,
      source: { payload: $values, id: $entityId },
      target: mutation.start
    })

    sample({
      clock: mutation!.finished.failure,
      fn: clock => {

        return "Неизвестная ошибка. Попробуйте позднее"

      },
      target: $formError
    })
  }



  const useSimpleForm = (initialState?: T, withLock?: boolean) => {
    if (initialState)
      useEffect(() => {
        init(initialState)
        if (withLock)
          lock(initialState)
      }, [])

    return useUnit({ $values, $errors, update })
  }

  const createUseForm = (params?: CreateUseFormProps) => {
    if (!params || !params.$pending) params = { ...params, $pending: mutation ? mutation.$pending : createStore(false) }

    return (useFormParams?: UseFormProps<T>) => {
      if (useFormParams) {
        const { initialState, withLock, entityId } = useFormParams

        useEffect(() => {
          if (initialState) {
            init(initialState)
            if (withLock)
              lock(initialState)
          }
          if (entityId)
            setId(entityId)
        }, [])
      }
      const getProps = useFieldProps(() => useUnit({ $values, $errors, update, disabled: some([params.$pending!, $locked], e => e) }), params.withoutErrorText)
      return { getProps: getProps, ...useUnit({ submit, $pending: params.$pending!, $locked, $formError, $submitStatus }) }
    }
  }

  return { useSimpleForm, createUseForm, validateFx, submit, $values, $errors, $entityId, update, reset, setId, lock, $formError, $submitStatus, submitStatusChange, mutation }
})

export const useFieldProps = <T extends Object>(useForm: () =>
  {
    $values: T, $errors: T, disabled?: boolean,
    update: (payload: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  }, withoutErrorText?: boolean) => {
  const { $values, $errors, update, disabled } = useForm();
  let valuesMap = new Map(Object.entries($values)) as Map<string, string>
  let errorsMap = new Map(Object.entries($errors)) as Map<string, string>

  const getProps = (fieldName: keyof T) => {
    let key = fieldName as string
    if (valuesMap.has(key)) {
      const error = withoutErrorText ? { isError: errorsMap.get(key) !== "" } : { errorText: errorsMap.get(key), }
      return { name: fieldName, onChange: update, ...error, value: valuesMap.get(key), disabled: disabled }
    }
  }

  return getProps;
}

