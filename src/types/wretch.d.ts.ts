//wretch.get<string>() => ResponseContract<string> 
//Вот что делает этот деклейр


declare module 'wretch' {
  interface Wretch<Self = unknown, Chain = unknown, Resolver = undefined> {
    get<T = Resolver>(this: Self & Wretch<Self, Chain, Resolver>, url?: string): Resolver extends undefined ? Chain & WretchResponseChain<Self, Chain, Resolver> : Promise<ResponseContract<T>>;
    delete<T = Resolver>(this: Self & Wretch<Self, Chain, Resolver>, url?: string): Resolver extends undefined ? Chain & WretchResponseChain<Self, Chain, Resolver> : Promise<ResponseContract<T>>;
    put<T = Resolver>(this: Self & Wretch<Self, Chain, Resolver>, body?: any, url?: string): Resolver extends undefined ? Chain & WretchResponseChain<Self, Chain, Resolver> : Promise<ResponseContract<T>>;
    post<T = Resolver>(this: Self & Wretch<Self, Chain, Resolver>, body?: any, url?: string): Resolver extends undefined ? Chain & WretchResponseChain<Self, Chain, Resolver> : Promise<ResponseContract<T>>;
    patch<T = Resolver>(this: Self & Wretch<Self, Chain, Resolver>, body?: any, url?: string): Resolver extends undefined ? Chain & WretchResponseChain<Self, Chain, Resolver> : Promise<ResponseContract<T>>;
    head<T = Resolver>(this: Self & Wretch<Self, Chain, Resolver>, url?: string): Resolver extends undefined ? Chain & WretchResponseChain<Self, Chain, Resolver> : Promise<ResponseContract<T>>;
  }
}

export { };

