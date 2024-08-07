import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
  id: "user",
  state: (): UserState => ({
    token: "",
    userInfo: { name: "" },
    orgId: 0
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    },
    // Set setOrgId
    setOrgId(orgId: UserState["orgId"]) {
      this.orgId = orgId;
    }
  },
  persist: piniaPersistConfig("geeker-user")
});
