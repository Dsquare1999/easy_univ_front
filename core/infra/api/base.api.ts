import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { userLogout } from "@/core/application/slices";
import { Mutex } from "async-mutex";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authConfig } from "../lib/auth";
import { createApi } from "@reduxjs/toolkit/query/react";

// create a new mutex
const mutex = new Mutex();
const baseURL = `${process.env.NEXT_PUBLIC_HOST}/api/v1`

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  prepareHeaders: async (headers) => {
    const session =
        typeof window !== "undefined"
            ? await getSession()
                    .then((session) => session)
                    .catch(() => {
                        console.log("No session found");
                    })
            : await getServerSession(authConfig);

    // const accessToken = session?.user?.token ?? undefined;
    // if (accessToken) {
    //     headers.set("Authorization", `Bearer ${accessToken}`);
    // }
    console.log("session", session);
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          "/v1/auth/refresh-token",
          api,
          extraOptions
        );
        console.log("refreshResult", refreshResult);
        // if (refreshResult.data) {
        //   api.dispatch(tokenReceived(refreshResult.data));
        //   // retry the initial query
        //   result = await baseQuery(args, api, extraOptions);
        // } else {
        //   api.dispatch(userLogout());
        // }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};


const api = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReauth,
	endpoints: builder => ({}),
});

export default api