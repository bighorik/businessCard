declare global {
  type sourceType<T> = T[] | ((query?: string, anyParams?: any) => Promise<T[]>)
  type Id = string | number

  interface ResponseContract<T> {
    apiResponseId: string, //Идентификатор ошибки (всегда разный)
    isSuccess: boolean, // Признак успешности выполнения запроса (true - успех)
    isError: boolean, // Признак ошибки выполнения запроса (true - запрос выполнен с ошибкой)
    data: T, // Содержит данные если запрос их возвращает. Подробнее в документации к запросам
    errors: {
      code: string,  // Код ошибки (подробнее в списке кодов и ошибок)
      text: string,  // Текст ошибки
      description: string  // Описание ошибки
    }[] // Список ошибок
  }
}

export { }

