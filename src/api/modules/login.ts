import { Login } from "@/api/interface/index";
import authMenuList from "@/assets/json/authMenuList.json";
import authButtonList from "@/assets/json/authButtonList.json";
import http from "@/api";

/**
 * @name 登录模块
 */

// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(`/v1/admin/login`, params, { loading: false }); // 正常 post json 请求  ==>  application/json
};
// 获取菜单列表
export const getAuthMenuListApi = () => {
  // return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`, {}, { loading: false });
  // 如果想让菜单变为本地数据，注释上一行代码，并引入本地 authMenuList.json 数据

  return authMenuList;
};
// export const getAuthMenuListApi = async () => {
//   try {
//     // 调用 menuList 获取用户可展示菜单列表
//     const userMenuList = await menuList();
//     let loginData = userMenuList.data.menuList;
//     let menuData = JSON.parse(JSON.stringify(authMenuList.data));
//     console.log(menuData, "当前菜单");
//     // 使用 filter 和 map 过滤和提取数据，保留首页数据
//     const resultData = menuData
//       .map(item2 => {
//         if (item2.name === "home") {
//           return item2; // 保留首页数据
//         }

//         if (loginData.includes(item2.name)) {
//           // 过滤出在 array1 中存在的 name 字段的数据
//           if (item2.children) {
//             // 如果有子项，也过滤和提取子项
//             item2.children = item2.children.filter(child => loginData.includes(child.name));
//           }
//           return item2;
//         }

//         return null; // 过滤掉不匹配的数据
//       })
//       .filter(item => item !== null); // 去除 null 元素
//     // authMenuList.data = resultData;
//     // 返回菜单列表或进行其他操作
//     const finalResult = { data: resultData };
//     return finalResult;
//   } catch (error) {
//     // 处理错误
//     console.error(error);
//     throw error; // 可以选择抛出错误或者其他处理方式
//   }
// };
// 获取用户可展示菜单列表
export const menuList = () => {
  return http.post(`/auth/menuList`);
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  // return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`, {}, { loading: false });
  // 如果想让按钮权限变为本地数据，注释上一行代码，并引入本地 authButtonList.json 数据
  return authButtonList;
};

// 用户退出登录
export const logoutApi = () => {
  return http.post(`/auth/logout`);
};
