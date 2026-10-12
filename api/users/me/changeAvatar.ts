import { http } from "@/api/http";

export interface AvatarResponse {
  avatar: string;
}

export const changeAvatar = (avatar: File): Promise<AvatarResponse> => {
  const body = new FormData();
  body.append("avatar", avatar);

  return new Promise((resolve, reject) => {
    http
      .put("users/me/avatar/", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        authorization: true,
      })
      .then((res) => resolve(res.data))
      .catch(reject);
  });
};
