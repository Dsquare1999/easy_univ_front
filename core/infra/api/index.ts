import { authApi } from './auth.api';


export { default as api } from './base.api';
export const { 
    useLoginMutation, 
    useLogoutMutation, 
    useRefreshTokenMutation 
} = authApi;