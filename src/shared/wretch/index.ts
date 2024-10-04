import wretch from 'wretch'
import QueryAddon from "wretch/addons/queryString"

let token = ''
try {
  if (window !== undefined)
    token = window.localStorage.getItem('token') || ""
}
catch { }
const fetcher = wretch(import.meta.env.PUBLIC_ENV__BASE_API_URL + import.meta.env.PUBLIC_ENV__BASE_API_URL_PREFIX, { mode: 'cors', credentials: 'omit' })
  .content("application/json")
  .auth(token)
  .addon(QueryAddon)
  .resolve(e => e.json<ResponseContract<any>>())



const fetchSource = (url: string, query?: object) => fetcher.query(query || {}).get<GuideItem[]>(url).then(e => e.data).catch(e => [])

export { fetchSource, fetcher }

