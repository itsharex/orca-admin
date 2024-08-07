// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  page: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  page: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    account: string;
    password: string;
  }
  export interface ResLogin {
    token: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

//礼物模块
export namespace Gift {
  export interface GiftList {
    id: number;
    orgId: number;
    name: string;
    img: any;
    price: number;
    giftType: number;
  }
}
//商品模块
export namespace Goods {
  export interface GoodsList {
    id: number;
    orgId: number;
    name: string;
    img: string;
    originalPrice: number;
    price: number;
    payType: number;
    miniPage: string;
    jumpPage: string;
  }
}
//渠道管理模块
export namespace Channel {
  export interface ChannelList {
    id: number;
    channelId: number;
    channelName: string;
    channelDescription: string;
    channelOwner: string;
    contactPhone: number;
    commissionRatio: number;
    commissionMethod: number;
    commissionPeriod: number;
    bankAccountType: number;
    bankAccountName: string;
    receivingUnit: string;
    bankAccount: string;
    bankName: string;
    bankBranch: string;
    bankAccountNumber: string;
    settlementCurrency: string;
    sysInner: number;
  }
}

export namespace Order {
  export interface OrderInfo {
    id: number;
    channelId: number;
    channelName: string;
    actualAccountingAmount: number;
    commissionRatio: number;
    coupon: string;
    goodsId: number;
    goodsImage: string;
    goodsName: string;
    type: number;
    originalPrice: number;
    paymentFee: number;
    price: number;
    recipientAddress: string;
    recipientName: string;
    recipientPhone: string;
    refundTime: string;
    tradeTime: string;
    roomId: number;
    roomName: string;
    subCommission: number;
    transactionId: string;
    userName: string;
    userId: number;
    orderStatus: number;
  }
}

//机器人模块
export namespace Robot {
  export interface RobotList {
    id: number;
    orgId: number;
    code: string;
    nickname: string;
    headIco: string;
  }
}
//客服模块
export namespace CS {
  export interface CSList {
    id: number;
    orgId: number;
    qrCode: string;
    nickname: string;
  }
}
//房间模块
export namespace Room {
  export interface RoomList {
    id: number;
    orgId: number;
    name: string;
    anchorPwd: number;
    nickname: string;
    assistantPwd: number;
    sharePwd: number;
    livingTime: string;
    livingStatus: number;
    cover: number;
    remark: number;
    livingType: number;
    videoQuality: number;
  }
}
//客服模块
export namespace CS {
  export interface CSList {
    id: number;
    orgId: number;
    qrCode: string;
    nickname: string;
  }
} //机构模块
export namespace Info {
  export interface InfoList {
    orgId: number;
    name: string;
    orgCode: string;
    orgLogo: string;
    orgRoomBg: string;
  }
}

export namespace Video {
  export interface VideoList {
    id: number;
    orgId: number;
    name: string;
    fileName: string;
    bucket: string;
    pathName: string;
    duration: number;
    image: string;
    mediaType: number;
    roomId: number;
    roomRecordId: number;
    roomName: string;
    startDate: Date;
    beginTime: Date;
    stopDate: Date;
    endTime: Date;
    cost: number;
    uploadFiles: any;
  }

  export interface VideoLog {
    orgId: number;
    bizType: number;
    pushTaskId: number;
    status: number;
    roomId: number;
    duration: number;
    msg: string;
  }
}
