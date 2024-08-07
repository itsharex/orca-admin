//"livingType": 1, //直播类型: 1 标准延迟(标准直播), 2 超低延迟(快直播)
//"videoQuality": 3 //清晰度: 1 流畅270p 2 标清480p 3 准高清720p 4 高清1080p 5 超高清2K÷
export const VIDEOQUALITY = [
  { key: 1, name: "流畅270p" },
  { key: 2, name: "标清480p" },
  { key: 3, name: "准高清720p" },
  { key: 4, name: "高清1080p" },
  { key: 5, name: "超高清2K" }
] as const;

export const STANDARDLIVE = [
  { key: 2, name: "标准直播：延迟3~5秒" },
  { key: 1, name: "快直播：延迟0~2秒" }
] as const;
export const LIVINGTYPE = [
  { key: 1, name: "标准延迟", tip: "电脑网页、APP端延迟3-5秒，手机浏览器延迟9-15秒" },
  { key: 2, name: "超低延迟", tip: "电脑网页、APP端、手机浏览器延迟1-2秒左右" }
] as const;

export const LIVINGVIDEOTYPE = [
  { key: 1, name: "真人直播" },
  { key: 2, name: "视频直播" }
] as const;

export const VALIDITY = [
  { key: 1, name: "永久" },
  { key: 2, name: "有效日期" }
] as const;

export const SPEED = [
  { key: 1, name: "允许" },
  { key: 2, name: "禁止" }
] as const;

export const LIVETYPE = [
  { key: 1, name: "老师实时直播上课", tip: "实况直播" },
  { key: 2, name: "使用视频进行仿直播", tip: "录播直播" }
] as const;

export const PLAYBACK = [
  { key: 1, name: "以直播间最后一次直播作为回放" },
  { key: 2, name: "添加回放视频" }
] as const;
export const PEOPLENUMBER = [
  { key: 0, name: "实时观看人数" },
  { key: 1, name: "虚拟人数" }
] as const;
export const MARKETING = [
  { key: 1, name: "右下角弹窗" },
  { key: 2, name: "居中大弹窗" }
] as const;

export const MOBILELAYOUT = [
  { key: "1", name: "竖屏", tip: "视频比例 9:16" },
  { key: "2", name: "二分屏", tip: "视频比例 16:9" },
  { key: "3", name: "三分屏", tip: "屏幕三分" }
] as const;

export const PADPCLAYOUT = [
  { key: "1", name: "PAD端模版" },
  { key: "2", name: "PC端模版" }
] as const;

export const PERMISSIONTYPE = [
  { key: 1, name: "无密码" },
  { key: 2, name: "密码" },
  { key: 3, name: "付费（敬请期待）" }
] as const;

export const SHOWSTYLE = [
  { key: 1, name: "小弹框" },
  { key: 2, name: "大弹框" }
] as const;
//倒计时(秒): 0 不设置, 60 1分钟, 120 2分钟, 300 5分钟, 600 10分钟
export const COUNTDOWN = [
  { key: 60, name: "1分钟" },
  { key: 120, name: "2分钟" },
  { key: 300, name: "5分钟" },
  { key: 600, name: "10分钟" }
] as const;
export const LIVESTATUS = [
  { key: 0, name: "直播中" },
  { key: 1, name: "未开播" }
] as const;
export const PERMISSION = [
  { key: 1, name: "免费观看" },
  { key: 2, name: "付费观看" },
  { key: 3, name: "密码观看" }
] as const;
export const URLTEXE = [
  // { key: "adminUrl", name: "管理端" },
  { key: "anchorUrl", name: "网页主播端" },
  { key: "assistantUrl", name: "助理端" },
  // { key: "shareUrl", name: "观看端" },
  { key: "shortUrl", name: "观看短链" },
  { key: "shortUrl", name: "观看二维码" },
  { key: "obsServer", name: "服务器", type: 1 },
  { key: "obsStreamCode", name: "推流码", type: 1 },
  // { key: "rtmp", name: "rtmp" },
  { key: "whipServer", name: "服务器", type: 2 },
  { key: "webrtc", name: "Bearer令牌", type: 2 }
  // { key: "srt", name: "srt" },
  // { key: "rtmpOverSrt", name: "rtmpOverSrt" },
] as const;
