"use client";

export interface AuthData {
  refresh_token: string;
  access_token: string;
}

export function getAuthData(): AuthData | undefined {
  const encoded = localStorage.getItem("authorization");
  if (!encoded) {
    return undefined;
  }

  const decoded = atob(encoded);
  const deserialized = JSON.parse(decoded) as AuthData;

  return deserialized;
}

export function setAuthData(data: AuthData | undefined) {
  if (!data) {
    localStorage.removeItem("authorization");
    return;
  }

  const serialized = JSON.stringify(data);
  const encoded = btoa(serialized);

  localStorage.setItem("authorization", encoded);
}
