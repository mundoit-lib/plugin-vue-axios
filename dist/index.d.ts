import axios from 'axios';
import { z } from 'zod';

declare let axiosInstance: axios.AxiosInstance;
declare const AxiosConfig: z.ZodObject<{
    baseURL: z.ZodString;
    db: z.ZodString;
    clientID: z.ZodString;
    clientSecret: z.ZodString;
    fixURL: z.ZodString;
    updateToken: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
    onError: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    baseURL: string;
    db: string;
    clientID: string;
    clientSecret: string;
    fixURL: string;
    updateToken?: ((...args: unknown[]) => unknown) | undefined;
    onError?: ((...args: unknown[]) => unknown) | undefined;
}, {
    baseURL: string;
    db: string;
    clientID: string;
    clientSecret: string;
    fixURL: string;
    updateToken?: ((...args: unknown[]) => unknown) | undefined;
    onError?: ((...args: unknown[]) => unknown) | undefined;
}>;
type AxiosConfig = z.infer<typeof AxiosConfig>;
declare const getAxiosInstance: () => axios.AxiosInstance;
declare const initializeAxios: (config: AxiosConfig) => void;

declare const install: (Vue: any, options: AxiosConfig) => void;

declare const _default: {
    install: (Vue: any, options: {
        baseURL: string;
        db: string;
        clientID: string;
        clientSecret: string;
        fixURL: string;
        updateToken?: ((...args: unknown[]) => unknown) | undefined;
        onError?: ((...args: unknown[]) => unknown) | undefined;
    }) => void;
};

export { AxiosConfig, axiosInstance, _default as default, getAxiosInstance, initializeAxios, install };
