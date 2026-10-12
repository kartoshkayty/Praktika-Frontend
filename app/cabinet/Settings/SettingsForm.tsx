import { Open_Sans } from "next/font/google";
import MainSettingsForm from "./MainSettingsForm";
import EmailSettingsForm from "./EmailSettingsForm";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation";
import { logout } from "@/api/auth/logout";
import { concat } from "@/helpers/concat";

const open_sans = Open_Sans({
  weight: "700",
  subsets: ["cyrillic", "latin"],
});

interface SettingsFormProps {
  className?: string;
}

export default function SettingsForm({ className }: SettingsFormProps) {
  const refresh = useAuthStore((state) => state.refresh_token);
  const clearAuthData = useAuthStore((state) => state.clearAuthData);
  const setAuthificated = useAuthStore((state) => state.setAuthificated);

  const clearUserData = useUserStore((state) => state.clearData);

  const router = useRouter();

  const onLogoutClick = async () => {
    if (refresh) {
      await logout(refresh).catch(() => undefined);
    }

    clearUserData();
    clearAuthData();
    setAuthificated(false);
    router.replace("/auth/login");
    return;
  };

  return (
    <div
      className={concat(
        className,
        "bg-white px-15 pt-9.5 pb-15.5 max-w-280 w-full mx-auto",
      )}
    >
      <h1 className={`${open_sans.className} text-[16px] text-[#8AA382]`}>
        | Налаштування |
      </h1>

      <MainSettingsForm />
      <EmailSettingsForm />

      <hr className="max-w-246.25 w-full h-0.5 bg-[#8AA382] mt-13.25 border-none"></hr>

      <button
        className={`${open_sans.className} cursor-pointer mt-10 bg-[#F16F6F] py-2.75 px-11.5 rounded-[9px] text-white text-[16px]`}
        onClick={() => onLogoutClick()}
      >
        Вихід
      </button>
    </div>
  );
}
