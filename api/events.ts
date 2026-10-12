import { useAuthStore } from "@/store/auth";
import axios, { HttpStatusCode } from "axios";
import z from "zod";

export interface ActualTokens {
  access_token?: string;
  refresh_token?: string;
}

type Resolve = (value: ActualTokens | PromiseLike<ActualTokens>) => void;
type Reject = (reason?: any) => void;

interface WaitObject {
  resolve: Resolve;
  reject: Reject;
}

const waitObjects: WaitObject[] = [];
let updating: boolean = false;

export const getActualTokens = (): Promise<ActualTokens> => {
  return new Promise((resolve, reject) => {
    const auth = useAuthStore.getState();
    if (auth.access_token && !isTokenLive(auth.access_token)) {
      waitObjects.push({ resolve, reject });
      if (updating) return;

      updating = true;
      update(auth.refresh_token!);
      return;
    }

    resolve({
      access_token: auth.access_token,
      refresh_token: auth.refresh_token,
    });
  });
};

const baseURL = process.env.NEXT_PUBLIC_API_URL!;

export const update = async (refresh_token: string) => {
  const response = await axios
    .post(baseURL + "auth/token/refresh/", {
      refresh: refresh_token,
    })
    .catch(() => undefined);

  if (response && response.status === HttpStatusCode.Ok) {
    console.log("susccess refreshing tokens: ", response.data);
    useAuthStore.getState().setAuthData({
      access_token: response.data.access,
      refresh_token: response.data.refresh,
    });

    waitObjects.forEach((v) =>
      v.resolve({
        access_token: response.data.access,
        refresh_token: response.data.refresh,
      }),
    );
    waitObjects.length = 0;
    updating = false;
    return;
  }

  useAuthStore.setState({
    access_token: undefined,
    refresh_token: undefined,
    authificated: false,
  });

  waitObjects.forEach((v) => v.reject());
  waitObjects.length = 0;
  updating = false;
};

const validator = z.object({
  token_type: z.string().refine((s) => s === "access"),
  exp: z.number(),
  iat: z.number(),
  jti: z.string(),
  user_id: z.string(),
});

const isTokenLive = (access_token: string): boolean => {
  try {
    const [_, payload, __] = access_token.split(".");
    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);
    const validated = validator.parse(parsed);

    if (validated.exp * 1000 <= Date.now()) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};
