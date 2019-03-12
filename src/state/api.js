import { createAPIMiddleware, composeAdapters } from 'redux-api-call';
import fetchInterceptor from 'redux-api-call-adapter-fetch';
import jsonInterceptor from 'redux-api-call-adapter-json';

const transformers = [jsonInterceptor, fetchInterceptor];

const apiMiddleware = createAPIMiddleware(composeAdapters(...transformers));

export default apiMiddleware;
