<template>
  <el-card class="mr10 mb10 ml10 mt10 edit-box">
    <el-row>
      <el-col :span="3">
        <el-menu style="position: fixed" :default-active="activeIndex" @select="handleOpen">
          <el-menu-item index="1">
            <template #title>
              <el-icon><Warning /></el-icon>
              <span style="font-size: 14px">基础信息</span>
            </template>
          </el-menu-item>
          <el-menu-item index="6">
            <el-icon><Postcard /></el-icon>
            <span style="font-size: 14px">观看权限</span>
          </el-menu-item>
          <el-menu-item index="7">
            <el-icon><DocumentCopy /></el-icon>
            <span style="font-size: 14px">服务设置</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><VideoPlay /></el-icon>
            <span style="font-size: 14px">回放设置</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><User /></el-icon>
            <span style="font-size: 14px">互动设置</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><setting /></el-icon>
            <span style="font-size: 14px">营销内容</span>
          </el-menu-item>
          <el-menu-item index="5">
            <el-icon><BrushFilled /></el-icon>
            <span style="font-size: 14px">直播间装修</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="21">
        <div>
          <!-- 根据activeIndex显示不同的内容 -->
          <div v-if="activeIndex === '1'" class="pl15 pr15">
            <CustTitle>
              <template #icon>
                <span class="icon-tips"></span>
              </template>
              <template #title>直播类型</template>
            </CustTitle>
            <el-form ref="ruleFormPageRef" label-width="120px" label-position="top" :rules="rulesPage" :model="formPage.row">
              <!-- <el-form-item label="电脑端观看" prop="pcSwitch">
            <el-switch v-model="formPage.row!.pcSwitch" :active-value="1" :inactive-value="0" />
          </el-form-item> -->
              <el-form-item label="直播类型" prop="videoType">
                <el-radio-group v-model="formPage.row!.videoType" @change="handleRadioChange">
                  <div v-for="item in LIVETYPE" :key="item.key" class="mr20">
                    <el-card :body-style="{ padding: 0 }" class="mb10" shadow="never">
                      <div class="card-content">
                        <div class="card-content-head flx-center">
                          <template v-if="item.key == 1">
                            <SvgIcon
                              v-if="formPage.row!.videoType == 1"
                              name="liveing"
                              :icon-style="{ width: '24px', height: '24px' }"
                            ></SvgIcon>
                            <SvgIcon v-else name="liveingFill" :icon-style="{ width: '24px', height: '24px' }"></SvgIcon>
                          </template>
                          <template v-if="item.key == 2">
                            <SvgIcon
                              v-if="formPage.row!.videoType == 2"
                              name="video"
                              :icon-style="{ width: '24px', height: '24px' }"
                            ></SvgIcon>
                            <SvgIcon v-else name="videoFill" :icon-style="{ width: '24px', height: '24px' }"></SvgIcon>
                          </template>
                          <span class="ml8" :style="{ color: getTextColor(item.key) }">{{ item.tip }}</span>
                        </div>
                        <div
                          class="card-content-body"
                          :style="{backgroundColor: formPage.row!.videoType == item.key ? '#3370ff1a' : ''}"
                        >
                          <el-radio :label="item.key" disabled>{{ item.name }}</el-radio>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="直播延迟" prop="livingType">
                <el-select
                  v-model="formPage.row!.livingType"
                  placeholder="请选择"
                  size="large"
                  style="width: 40%"
                  @change="onChange"
                  disabled
                >
                  <el-option v-for="item in LIVINGTYPE" :key="item.value" :label="item.name + ':' + item.tip" :value="item.key" />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="PAD(PC)端模板" prop="sharePwd">
              <el-radio-group v-model="formPage.row!.padPcLayout">
                <el-radio v-for="item in PADPCLAYOUT" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
              </el-radio-group>
            </el-form-item> -->
              <CustTitle class="CustTitle">
                <template #icon>
                  <span class="icon-tips"></span>
                </template>
                <template #title>配置基础</template>
              </CustTitle>
              <el-form-item label="直播名称" prop="name">
                <el-input
                  v-model="formPage.row!.name"
                  placeholder="请输入直播名称（建议输入15字以内，不超过30个字）"
                  maxlength="30"
                  show-word-limit
                  style="width: 40%"
                ></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="livingTime">
                <el-date-picker
                  v-model="formPage.row!.livingTime"
                  type="date"
                  placeholder="选择日期"
                  size="default"
                  :disabled-date="disabledPastDate"
                ></el-date-picker>
                <el-time-picker
                  v-model="formPage.row!.livingTime"
                  placeholder="选择时间"
                  :disabled-hours="disabledHours"
                  :disabled-minutes="disabledMinutes"
                  :disabled-seconds="disabledSeconds"
                ></el-time-picker>
              </el-form-item>
              <el-form-item label="直播封面" prop="cover">
                <ImageUpload v-model:value="formPage.row!.cover" :show-extra-btn="true" />
              </el-form-item>
              <el-form-item label="直播LOGO" prop="logo">
                <ImageUpload
                  text="建议上传图片比例为1:1，大小2M以内，支持JPG、JPEG、PNG格式"
                  v-model:value="formPage.row!.logo"
                  :show-extra-btn="true"
                />
              </el-form-item>
              <el-form-item label="直播简介" prop="remark">
                <el-input
                  v-model="formPage.row!.remark"
                  maxlength="256"
                  style="width: 40%"
                  placeholder="请输入直播简介"
                  show-word-limit
                  type="textarea"
                />
              </el-form-item>
              <div class="save-btn">
                <el-button type="primary" class="ml30" @click="submitPage()" round>保存</el-button>
              </div>
            </el-form>
          </div>
          <div v-else-if="activeIndex === '2'" class="pl15 pr15">
            <CustTitle class="CustTitle">
              <template #icon>
                <span class="icon-tips"></span>
              </template>
              <template #title>回放设置</template>
            </CustTitle>
            <el-form
              ref="ruleFormInteractRef"
              label-position="top"
              label-width="120PX"
              :rules="rulesInteract"
              :model="formPlayback.row"
            >
              <el-form-item prop="swich">
                <el-row>
                  <el-col :span="24"><el-switch v-model="formPlayback.row!.swich" active-text="同步录制" disabled /></el-col>
                  <el-col :span="24">
                    <div class="tips">开启后，直播间开播将默认录制视频，且支持在主播端开启/关闭同步录制功能</div></el-col
                  >
                </el-row>
              </el-form-item>
              <el-form-item prop="playback">
                <el-col :span="24"><el-switch v-model="formPlayback.row!.playback" active-text="开启回放" disabled /></el-col>
              </el-form-item>
              <el-form-item label="回放有效期" prop="validity">
                <el-radio-group v-model="formPlayback.row!.validity" class="ml-4" disabled>
                  <el-radio size="large" v-for="item in VALIDITY" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
                  <el-date-picker
                    v-model="formPlayback.row!.appointedDay"
                    type="date"
                    placeholder="选择日期"
                    :size="size"
                    v-if="formPlayback.row!.validity == 2"
                  />
                </el-radio-group>
                <div class="tips">到期后，学员无法观看回放视频，但仍可查看聊天内容、带货信息、共享文件等</div>
              </el-form-item>
              <el-form-item label="倍速播放" prop="speed">
                <el-radio-group v-model="formPlayback.row!.speed" class="ml-4" disabled>
                  <el-radio size="large" v-for="item in SPEED" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
                </el-radio-group>
                <div class="tips">禁止时，回放视频不支持倍速播放、拖动进度条</div>
              </el-form-item>
              <el-form-item label="回放内容" prop="playBack">
                <el-radio-group v-model="formPlayback.row!.playBack" class="ml-4" disabled>
                  <el-radio size="large" v-for="item in PLAYBACK" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
                </el-radio-group>
                <div v-if="formPlayback.row!.playBack == 2" style="display: flex">
                  <UploadImg v-model:image-url="formPlayback.row!.avatar" width="280px" height="135px" :file-size="3">
                    <template #empty>
                      <el-icon><VideoCameraFilled /></el-icon>
                      <span>请上传视频</span>
                    </template>
                  </UploadImg>
                  <el-button style="align-items: end; height: 135px" type="primary" link @click="addVideo" round>
                    添加视频
                  </el-button>
                  <PlayBackDialog v-model:visible="dialogVisible" ref="child"></PlayBackDialog>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div v-else-if="activeIndex === '3'" class="pl15 pr15">
            <CustTitle class="CustTitle">
              <template #icon>
                <span class="icon-tips"></span>
              </template>
              <template #title>互动设置</template>
            </CustTitle>
            <el-form
              label-position="top"
              ref="ruleFormInteractRef"
              :rules="formInteractRules"
              label-width="120px"
              :model="formInteract.row"
            >
              <el-form-item prop="loginTips">
                <el-col :span="24"
                  ><el-switch
                    v-model="formInteract.row!.loginTips"
                    :active-value="1"
                    :inactive-value="0"
                    active-text="观众登入提示"
                /></el-col>
                <el-col :span="24"
                  ><div class="tips">开启后，观众进入直播间后，在消息列表中会显示“欢迎xxx进入直播间”</div></el-col
                >
              </el-form-item>
              <el-form-item prop="msgApprove">
                <el-col :span="24"
                  ><el-switch v-model="formInteract.row!.msgApprove" :active-value="1" :inactive-value="0" active-text="消息审核"
                /></el-col>
                <el-col :span="24">
                  <div class="tips">
                    如开启敏感词库，则观众发送消息涉及敏感词汇，会自动过滤，不予展示（即除发送者外无人可见）
                  </div></el-col
                >
              </el-form-item>
              <el-form-item label="免审词库" prop="exemptEnable">
                <el-col :span="24">
                  <el-select
                    v-model="formInteract.row!.exemptEnable"
                    placeholder="请选择"
                    size="large"
                    style="width: 40%"
                    @change="onChange"
                  >
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                  <br />

                  <el-select
                    v-if="formInteract.row!.exemptEnable == 1"
                    v-model="formInteract.row!.exemptWordId"
                    placeholder="请选择"
                    size="large"
                    style="width: 40%; margin-top: 10px"
                    @change="onChange"
                  >
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-col>
                <el-col :span="24">
                  <div class="tips">如观众发送消息为免审词，则无需审核，直接展示（即所有观众可见）</div></el-col
                >
              </el-form-item>
              <el-form-item label="直播间人数显示" prop="tupleEnable">
                <el-radio-group v-model="formInteract.row!.tupleEnable" class="ml-4">
                  <el-radio v-for="item in PEOPLENUMBER" :key="item.key" :label="item.key">
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="直播间人数显示"
                prop="tupleNum"
                v-if="formInteract.row!.tupleEnable == 1"
                style="height: 126px; padding: 20px; background-color: #f8f9fd"
              >
                <el-col :span="24">
                  <el-input v-model="formInteract.row!.tupleNum" style="width: 240px" placeholder="数值范围1~9999（整数）"
                /></el-col>
                <el-col :span="24"> <div class="tips">如直播间实时观看人数为10人，设置10倍人气后，展示为100人</div></el-col>
              </el-form-item>
              <div class="save-btn">
                <el-button type="primary" class="ml30" @click="submitInteract()" round>保存</el-button>
              </div>
            </el-form>
          </div>
          <div v-else-if="activeIndex === '4'" class="pl15 pr15">
            <el-tabs v-model="activeName">
              <el-tab-pane label="商品" name="first">
                <el-form
                  label-position="top"
                  ref="ruleFormGoodsAsteriskRef"
                  :rules="rulesGoodsAsterisk"
                  label-width="120px"
                  :model="formGoodsAsterisk.row"
                >
                  <el-form-item style="margin-left: 16px">
                    <div style="width: 876px; height: 36px; background: #f8f9fd; border-radius: 4px">
                      <span style="margin-left: 12px"> 选择用于本直播间的商品，用于直播间内分享，仅可选择已上架的商品</span
                      ><span> <el-button type="primary" link @click="goCommodity"> 配置商品 </el-button></span>
                    </div>
                  </el-form-item>
                  <el-form-item label="推荐商品弹框" prop="showStyle" style="margin-left: 40px">
                    <el-radio-group v-model="formGoodsAsterisk.row!.showStyle" class="ml-4">
                      <el-radio v-for="item in MARKETING" :key="item.key" :label="item.key">
                        {{ item.name }}
                      </el-radio>
                      <el-button type="primary" link @click="examples"> 查看示例 </el-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-button :icon="Plus" @click="addCommodity" round style="margin-bottom: 20px">添加商品</el-button>
                  <AddGoodsDialog
                    v-model:visible="addGoodsDialogVisible"
                    :get-list="getList"
                    ref="addGoodsDialogRef"
                  ></AddGoodsDialog>
                  <div class="pro-table-box">
                    <ProTable
                      ref="goodsProTable"
                      :pagination="status"
                      :columns="goodsColumns"
                      :data="goodsAllData"
                      :data-callback="dataCallback"
                    >
                      <template #price="scope"> ¥ {{ scope.row.price / 100 }} </template>
                      <template #originalPrice="scope"> ¥ {{ scope.row.originalPrice / 100 }}</template>
                      <!-- 表格操作 -->
                      <template #operation="scope">
                        <el-button type="primary" link @click="deleteGoodsItem(scope.row)">删除</el-button>
                      </template>
                      <!-- 菜单图标 -->
                      <template #icon="scope">
                        <el-icon :size="18">
                          <component :is="scope.row.meta.icon"></component>
                        </el-icon>
                      </template>
                    </ProTable>
                  </div>
                </el-form>
                <div class="save-btn">
                  <el-button type="primary" class="ml30" @click="submitGoodsAsterisk()" round>保存</el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="礼物" name="second">
                <el-form label-position="top" :rules="formInteractRules" label-width="120px" :model="formMarketing.row">
                  <el-form-item style="margin-left: 16px">
                    <div style="width: 876px; height: 36px; background: #f8f9fd; border-radius: 4px">
                      <span style="margin-left: 20px"> 选择用于本直播间的礼物，用于直播间内使用</span
                      ><span> <el-button type="primary" link @click="goGift"> 配置礼物 </el-button></span>
                    </div>
                  </el-form-item>
                  <el-button style="margin-bottom: 20px; margin-left: 16px" round :icon="CirclePlus" @click="openDrawer('新增')"
                    >新增礼物</el-button
                  >
                  <div class="pro-table-box">
                    <ProTable
                      ref="giftProTable"
                      :pagination="status"
                      :columns="giftColumns"
                      :request-api="getTableList"
                      :data="giftData"
                      :data-callback="dataCallback"
                    >
                      <template #price="scope"> ¥ {{ scope.row.price / 100 }} </template>
                      <!-- 表格操作 -->
                      <template #operation="scope">
                        <!-- <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button> -->

                        <el-button type="primary" link @click="deleteGiftItem(scope.row)">删除</el-button>
                      </template>
                      <!-- 菜单图标 -->
                      <template #icon="scope">
                        <el-icon :size="18">
                          <component :is="scope.row.meta.icon"></component>
                        </el-icon>
                      </template>
                    </ProTable>
                  </div>
                  <AddGiftDialog
                    v-model:visible="addGiftDialogVisible"
                    ref="addGiftDialogRef"
                    @update="getList(roomId)"
                  ></AddGiftDialog>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="优惠券" name="third">
                <div style="text-align: center">
                  <img style="width: 320px; height: 320px" src="@/assets/images/coming_soon@2x.png" />
                  <div>敬请期待</div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="观看奖励" name="fourth">
                <div style="text-align: center">
                  <img style="width: 320px; height: 320px" src="@/assets/images/coming_soon@2x.png" />
                  <div>敬请期待</div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div v-else-if="activeIndex === '5'" class="pl15 pr15">
            <div style="text-align: center">
              <img style="width: 320px; height: 320px" src="@/assets/images/coming_soon@2x.png" />
              <div>敬请期待</div>
            </div>
          </div>
          <div v-else-if="activeIndex === '6'" class="pl15 pr15">
            <CustTitle class="CustTitle">
              <template #icon>
                <span class="icon-tips"></span>
              </template>
              <template #title>观看权限</template>
            </CustTitle>
            <el-form label-position="top" ref="refPermission" :model="formPermission.row" :rules="rulesPermission">
              <el-form-item label="观看权限" prop="permissionType">
                <el-radio-group v-model="formPermission.row!.permissionType" class="ml-4" @change="permissionChange">
                  <el-radio v-for="item in PERMISSION" :key="item.key" :label="item.key">
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="价格设置" prop="permissionJsonPrice" v-if="formPermission.row!.permissionType == 2">
                <el-input
                  placeholder="请输入价格"
                  v-model="formPermission.row!.permissionJsonPrice"
                  style="width: 40%"
                  onkeyup="value=value.replace(/[^1-9]/g,'','')"
                >
                  <template #append>元</template></el-input
                >
              </el-form-item>
              <el-form-item label="密码设置" prop="permissionJsonPassword" v-if="formPermission.row!.permissionType == 3">
                <el-input
                  placeholder="请输入密码"
                  v-model="formPermission.row!.permissionJsonPassword"
                  show-password
                  style="width: 40%"
                  onkeyup="value=value.replace(/[\u4E00-\u9FA5]/g,'')"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="save-btn">
              <el-button type="primary" class="ml30" @click="submitPermission()" round>保存</el-button>
            </div>
          </div>
          <div v-else-if="activeIndex === '7'" class="pl15 pr15">
            <CustTitle class="CustTitle">
              <template #icon>
                <span class="icon-tips"></span>
              </template>
              <template #title>服务设置</template>
            </CustTitle>
            <el-form ref="ruleFormPageRef" label-width="120px" label-position="top" :rules="rulesPage" :model="formService.row">
              <el-form-item label="直播模式" prop="mobileLayout">
                <el-radio-group v-model="formService.row!.mobileLayout" @change="handleRadioChange">
                  <div v-for="item in MOBILELAYOUT" :key="item.key" class="mr20">
                    <el-card :body-style="{ padding: 0 }" class="mb10" shadow="never">
                      <div class="card-content">
                        <div class="card-content-head2 flx-center">
                          <template v-if="item.key === '1'">
                            <SvgIcon name="one" :icon-style="{ width: '52px', height: '52px' }"></SvgIcon>
                          </template>
                          <template v-if="item.key === '2'">
                            <SvgIcon name="two" :icon-style="{ width: '52px', height: '52px' }"></SvgIcon>
                          </template>
                          <template v-if="item.key === '3'">
                            <SvgIcon name="three" :icon-style="{ width: '52px', height: '52px' }"></SvgIcon>
                          </template>
                        </div>
                        <div class="card-content-head3 flx-center">
                          <span :style="{ color: formService.row!.mobileLayout == item.key ? '#71C3FF' : '#8b8e9a' }">
                            {{ item.tip }}
                          </span>
                        </div>
                        <div
                          class="card-content-body"
                          :style="{backgroundColor: formService.row!.mobileLayout == item.key ? '#3370ff1a' : ''}"
                        >
                          <el-radio :label="item.key">{{ item.name }}</el-radio>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否开启白板" prop="showDraw">
                <el-switch
                  v-model="formService.row!.showDraw"
                  :active-value="1"
                  :inactive-value="0"
                  :disabled="formService.row!.mobileLayout != 2"
                />
              </el-form-item>
              <el-form-item>
                <div class="white">开启白板后，主播端默认开启白板配置，且主播不可关闭</div>
              </el-form-item>
              <el-form-item label="是否展示课件" prop="showPpt">
                <el-switch
                  v-model="formService.row!.showPpt"
                  :active-value="1"
                  :inactive-value="0"
                  :disabled="formService.row!.mobileLayout == 1"
                />
              </el-form-item>
              <el-form-item>
                <div class="white">展示课件后，学员可在观看端自由查看主播端上传的课件</div>
              </el-form-item>
            </el-form>
            <div class="save-btn">
              <el-button type="primary" class="ml30" @click="submitService()" round>保存</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
  <GiftDrawer ref="drawerRef" />
  <viewExamples v-model:visible="drawViewExamples" ref="examplesRef" />
</template>

<script setup lang="tsx" name="edit">
import { CirclePlus } from "@element-plus/icons-vue";
import CustTitle from "@/components/CustTitle/index.vue";
import { FormInstance } from "element-plus";
import { getExtendList } from "@/api/modules/extend";
import { onMounted } from "vue";
import { getGoodsList } from "@/api/modules/goods";
import { GOODSTYPE, GOODS_BOUNDS } from "@/views/goods/constants";
import dayjs from "dayjs";

import { getGiftList } from "@/api/modules/gift";

import { PLAYBACK, SPEED, VALIDITY, LIVETYPE, MOBILELAYOUT, LIVINGTYPE, PERMISSION, PEOPLENUMBER, MARKETING } from "./constants";
import ImageUpload from "@/components/ImageUpload.vue";
// import bindingGoods from "./binding.vue";
// import bindingGift from "./binding.vue";
import { extendPage, extendInteract, extendPermission, extendGoods, extendGoodsItem, extendGiftItem } from "@/api/modules/extend";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { User, Warning, Setting, VideoPlay, Plus, BrushFilled, Postcard, DocumentCopy } from "@element-plus/icons-vue";
import UploadImg from "@/components/Upload/Img.vue";
import PlayBackDialog from "./PlayBackDialog.vue";
import AddGoodsDialog from "./AddGoodsDialog.vue";
import AddGiftDialog from "./AddGiftDialog.vue";
import GiftDrawer from "../gift/components/GiftDrawer.vue";
// import { useHandleData } from "@/hooks/useHandleData";
import { getRoomList, updateRoom } from "@/api/modules/room";
import { useRouter } from "vue-router";
import { Gift } from "@/api/interface";
import viewExamples from "./components/examples.vue";
import { getWordList } from "@/api/modules/exempt";
import imgDefault from "@/assets/images/default@2x.png";

const router = useRouter();

const userStore = useUserStore();
const activeName = ref("first");
const route = useRoute();
const roomId = ref();
// const date = ref<Date | null>(null);
const disabledPastDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7; //8.64e7是一天的毫秒数（24小时 * 60分钟 * 60秒 * 1000毫秒）
};
const makeRange = (start: number, end: number) => {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};
const disabledHours = () => {
  const hourTime = new Date().getHours() - 1;
  return makeRange(0, hourTime);
};
const disabledMinutes = (hour: number) => {
  const hourTime = new Date().getHours();
  const minutesTime = new Date().getMinutes() - 1;
  if (hour == hourTime) {
    return makeRange(0, minutesTime);
  } else {
    // return makeRange(0, minutesTime);
  }
};
const disabledSeconds = () => {
  // const secondsTime = new Date().getSeconds() - 1;
  // return makeRange(1, 59);
};

const getTextColor = (key: any) => {
  if (key == 1) {
    return formPage.value.row!.videoType == 1 ? "#71C3FF" : "#8b8e9a";
  }
  if (key == 2) {
    return formPage.value.row!.videoType == 2 ? "#C687FF" : "#8b8e9a";
  }
};
const goCommodity = () => {
  router.push(`/goods/index`);
};
const goGift = () => {
  router.push(`/gift/index`);
};
const giftProTable = ref<ProTableInstance>();
const goodsProTable = ref<ProTableInstance>();
const giftColumns = reactive<ColumnProps<Gift.GiftList>[]>([
  {
    prop: "img",
    label: "礼物图片",
    render: scope => {
      return h("img", {
        src: scope.row.img,
        style: "width:30px;height:30px;"
      });
    }
  },
  { prop: "name", label: "礼物名称", search: { el: "input" } },

  { prop: "price", label: "礼物价格" },
  { prop: "operation", label: "操作", width: 280, fixed: "right" }
]);
const goodsColumns = reactive<ColumnProps<Goods.GoodsList>[]>([
  {
    prop: "img",
    label: "商品图片",
    align: "left",
    width: 120,
    render: scope => {
      return h("img", {
        src: scope.row.img,
        style: "width:52px;height:52px;"
      });
    }
  },
  { prop: "name", label: "商品名称", search: { el: "input" }, align: "left" },
  {
    prop: "goodType",
    label: "商品类型",
    enum: GOODSTYPE,
    fieldNames: { label: "name", value: "key" },
    width: 120,
    align: "left"
  },
  { prop: "bounds", label: "是否限单", enum: GOODS_BOUNDS, fieldNames: { label: "name", value: "key" } },
  { prop: "originalPrice", label: "原价" },
  { prop: "price", label: "现价(促销价)" },
  { prop: "operation", label: "操作", width: 280, fixed: "right" }
]);
const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.page,
    pageSize: data.pageSize
  };
};
// 删除信息
const deleteGiftItem = async (params: Gift.GiftList) => {
  let a: any = [];
  // let b: any = [];
  giftData.value.forEach(element => {
    console.log(params.id, element.id, element.giftLibId);
    if (element.id != params.id) {
      a.push(element.giftLibId);
    }
  });
  const newItem = {
    roomId: roomId.value,
    orgId: params.orgId,
    giftLibIds: a == "" ? [] : a
  };
  ElMessageBox.confirm(`确定删除礼物${params.name}吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      await extendGiftItem(roomId.value, newItem).then(() => {
        getList(route.params.id);
        ElMessage.success({ message: `删除成功！` });
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除"
      });
    });
};
const deleteGoodsItem = async (params: Gift.GiftList) => {
  let a: any = [];
  goodsAllData.value.forEach(element => {
    if (element.id != params.id) {
      a.push(element.goodsLibId);
    }
  });
  const newItem = {
    roomId: roomId.value,
    orgId: params.orgId,
    goodsLibIds: a
  };
  ElMessageBox.confirm(`确定删除商品${params.name}吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      await extendGoodsItem(roomId.value, newItem).then(() => {
        getList(route.params.id);
        ElMessage.success({ message: `删除成功！` });
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除"
      });
    });
};
// 定义 props，包括 id 和 visible
const options = [
  {
    value: 1,
    label: "开启"
  },
  {
    value: 0,
    label: "关闭"
  }
];
const options2 = ref([] as any);
const examplesRef = ref<InstanceType<typeof viewExamples> | null>(null);
const drawViewExamples = ref(false);
const examples = () => {
  drawViewExamples.value = true;
  // examplesRef.value.getList =
};
const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  visible: Boolean
});
const emit = defineEmits(["update:visible"]);
// const goodsTitle = ["商品列表", "绑定商品"];
// const giftTitle = ["礼品列表", "绑定礼品"];
// 使用 internalValue 来存储组件内部的值
const internalValue = ref(props.visible);

// 监听外部值的变化，更新内部值
watch(
  () => props.visible,
  newValue => {
    internalValue.value = newValue;
  }
);

// 监听内部值的变化，触发更新外部值的事件
watch(
  () => internalValue.value,
  newValue => {
    emit("update:visible", newValue);
  }
);
const dialogVisible = ref(false);
const addGoodsDialogVisible = ref(false);
const addGiftDialogVisible = ref(false);
const activeIndex = ref("1");
const addVideo = () => {
  dialogVisible.value = true;
};
const addGoodsDialogRef = ref();
const addCommodity = () => {
  addGoodsDialogVisible.value = true;
  // goodsAllData.value.showStyle = formMarketing.row!.showStyle;
  addGoodsDialogRef.value.liveParams(roomId.value, goodsAllData.value);
};
const drawerRef = ref<InstanceType<typeof GiftDrawer> | null>(null);
const status = ref(true);
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  console.log(newParams, "newParams");
  status.value = false;
  return getGiftList(newParams);
};
const addGiftDialogRef = ref();
const openDrawer = async (title: string, row: Partial<Gift.GiftList> = {}) => {
  console.log(title, row, giftData.value, "5555555-----");

  addGiftDialogVisible.value = true;
  addGiftDialogRef.value?.liveParams(roomId.value, giftData.value);
};
const handleOpen = async (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
  activeIndex.value = key;
  if (key == "3") {
    let exempt = await getWordList();
    exempt.data.forEach(item => {
      options2.value.push({
        label: item.name,
        value: item.id
      });
    });
    console.log(options2.value);
  }
};

//观看开始
const formPage = ref<any>({
  row: {
    bgImage: ref(""), // 假设 bgImage 是一个字符串类型的变量
    cover: ref(imgDefault),
    logo: ref("")
  }
});
const formService = ref<any>({
  row: {
    bgImage: ref("") // 假设 bgImage 是一个字符串类型的变量
  }
});

const rulesPage = reactive({
  mobileLayout: [{ required: true, message: "请输入" }],
  liveType: [{ required: true, message: "请输入" }],
  orgId: [{ required: true, message: "请输入" }],
  name: [{ required: true, message: "请输入" }],
  liveDelay: [{ required: true, message: "请输入" }],
  time: [{ required: true, message: "请输入" }],
  permission: [{ required: true, message: "请输入" }],
  videoType: [{ required: true, message: "请选择直播类型" }],
  livingType: [{ required: true, message: "请输入" }],
  livingTime: [{ required: true, message: "请选择开始时间" }]
  // permissionType: [{ required: true, message: "选择观看权限" }]
});

const formInteractRules = reactive({
  tupleNum: [{ required: true, message: "请输入" }]
});

const ruleFormPageRef = ref<FormInstance>();
const submitPage = () => {
  console.log(formPage.value!.row.livingTime, "formPage.value!.row");
  formPage.value!.row.livingTime = dayjs(formPage.value.row.livingTime).format("YYYY-MM-DD HH:mm:ss");
  ruleFormPageRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      let orgStoreId = userStore.orgId;
      const data = {
        ...formPage.value.row,
        roomId: roomId.value,
        orgId: orgStoreId,
        showDraw: formPage.value.row!.mobileLayout === "1" ? 0 : formPage.value.row.showDraw,
        showPpt: formPage.value.row!.mobileLayout === "1" ? 0 : formPage.value.row.showPpt
      };
      await updateRoom(data);
      // router.go(0);
      ElMessage.success({ message: `保存成功！` });
    } catch (error) {
      console.log(error);
    }
  });
};
//观看结束
const handleRadioChange = (value: any) => {
  if (value === "3") {
    formService.value.row!.showDraw = 1;
  }
  if (value === "1") {
    formService.value.row!.showDraw = 0;
    formService.value.row!.showDraw = 0;
  }
};
const onChange = (value: any) => {
  formPage.liveDelay = value;
  console.log(value);
};
// formPlayback
const formPlayback = ref<any>({
  row: {}
});
//互动开始
const formInteract = ref<any>({
  row: {}
});
const formMarketing = ref<any>({
  row: {}
});

const rulesInteract = reactive({
  orgId: [{ required: true, message: "请输入" }],
  name: [{ required: true, message: "请输入" }]
});

const ruleFormInteractRef = ref<FormInstance>();
const submitInteract = async () => {
  ruleFormInteractRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      let orgStoreId = userStore.orgId;
      const data = {
        ...formInteract.value.row,
        roomId: roomId.value,
        orgId: orgStoreId
      };
      await extendInteract(roomId.value, data);
      ElMessage.success({ message: `保存成功！` });
    } catch (error) {
      console.log(error);
    }
  });
};
//互动结束
//权限开始
const formPermission = ref<any>({
  row: {}
});
// const rulesPermission = reactive({
//   orgId: [{ required: true, message: "请输入" }],
//   name: [{ required: true, message: "请输入" }]
// });
// const ruleFormPermissionRef = ref<FormInstance>();
// const submitPermission = () => {
//   ruleFormPermissionRef.value!.validate(async valid => {
//     if (!valid) return;
//     try {
//       let orgStoreId = userStore.orgId;
//       const data = {
//         ...formPermission.value.row,
//         roomId: props.id,
//         orgId: orgStoreId
//       };
//       await extendPermission(props.id, data);
//       ElMessage.success({ message: `保存成功！` });
//     } catch (error) {
//       console.log(error);
//     }
//   });
// };
//权限结束
//选购商品配置开始
const formGoodsAsterisk = ref<any>({
  row: {}
});
const rulesGoodsAsterisk = reactive({
  orgId: [{ required: true, message: "请输入" }],
  name: [{ required: true, message: "请输入" }]
});
const ruleFormGoodsAsteriskRef = ref<FormInstance>();
const submitGoodsAsterisk = () => {
  ruleFormGoodsAsteriskRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      let orgStoreId = userStore.orgId;
      const data = {
        ...formGoodsAsterisk.value.row,
        roomId: roomId.value,
        orgId: orgStoreId
      };
      await extendGoods(roomId.value, data);
      ElMessage.success({ message: `保存成功！` });
    } catch (error) {
      console.log(error);
    }
  });
};
//选购商品配置结束
//商品开始
// ProTable 实例 禁用 INVALID / 正常 (启用) (激活)  VALID

const goodsData = ref([]);
const goodsAllData = ref([]);

const getGoodsData = async (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  let { data } = await getGoodsList(newParams);
  let arr = [];
  for (let item of data) {
    arr.push({
      key: item.id,
      label: item.name
    });
  }
  // goodsAllData.value = data;
  console.log(data, "567");
};

//商品结束t
//礼品开始
const giftData = ref([]);
const giftAllData = ref([]);
const total = ref("");
const getGiftData = async (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  let { data } = await getGiftList(newParams);
  let arr = [];
  for (let item of data) {
    arr.push({
      key: item.id,
      label: item.name
    });
  }
  console.log(data, 6666);
  console.log(giftData.value, 6666);
  giftAllData.value = data;
  total.value = data.length;

  console.log(giftAllData.value);
};

onMounted(() => {
  console.log("组件挂载完成后调用", route.params.id);
  const id = route.params.id;
  const name = route.params.name;
  roomId.value = id;
  getRoom(name, id);
  getList(id);
});
//基础信息
const getRoom = async (name: string | string[], id: string | string[]) => {
  let data = await getRoomList({ name: name });
  data.data.forEach(item => {
    if (item.id == id) {
      formPage.value = { row: item };
      if (!formPage.value.row!.cover) {
        formPage.value.row!.cover = ref(imgDefault);
      }
    }
  });
};
//礼品结束
const getList = async (id: string | string[]) => {
  let dataList = await getExtendList(id);

  let rowData = { ...dataList?.data };
  formInteract.value = { row: rowData.interact };
  formPermission.value = { row: rowData.permission };
  formGoodsAsterisk.value = { row: rowData.goods };
  goodsAllData.value = rowData.goodsItems;
  formMarketing.value = { row: rowData.goods };
  formService.value = { row: rowData.page };
  if (formPermission.value.row!.permissionType == 2) {
    formPermission.value.row!.permissionJsonPrice = formPermission.value!.row.permissionJson;
  } else if (formPermission.value.row!.permissionType == 3) {
    formPermission.value.row!.permissionJsonPassword = formPermission.value!.row.permissionJson;
  }
  let goodsArr = [];
  for (let item of rowData.goodsItems) {
    goodsArr.push(item.goodsLibId);
  }
  goodsData.value = goodsArr;
  console.log(goodsData.value, "goodsData");

  getGoodsData("");
  // let giftArr = [];
  // for (let item of rowData.giftItems) {
  //   giftArr.push(item.giftLibId);
  // }
  giftData.value = rowData.giftItems;
  // console.log(giftData.value);

  getGiftData("");
};
const refPermission = ref<FormInstance>();
const rulesPermission = reactive({
  permissionType: [{ required: true, message: "选择观看权限" }],
  permissionJsonPassword: [{ required: true, message: "请输入密码" }],
  permissionJsonPrice: [{ required: true, message: "请输入价格" }]
});
const submitPermission = () => {
  if (formPermission.value.row!.permissionType == 2) {
    formPermission.value.row!.permissionJson = formPermission.value.row!.permissionJsonPrice;
  } else if (formPermission.value.row!.permissionType == 3) {
    formPermission.value.row!.permissionJson = formPermission.value.row!.permissionJsonPassword;
  }
  refPermission.value!.validate(async valid => {
    if (!valid) return;
    try {
      await extendPermission(roomId.value, formPermission.value!.row).then(() => {
        ElMessage({
          message: "添加成功",
          type: "success"
        });
      });
    } catch (error) {
      console.log(error);
    }
  });
};

const submitService = () => {
  extendPage(roomId.value, formService.value!.row).then(() => {
    ElMessage({
      message: "添加成功",
      type: "success"
    });
  });
};
defineExpose({
  getList
});
</script>

<style lang="scss" scoped>
.white {
  width: 300px;
  height: 18px;
  margin-bottom: 20px;
  font-family: PingFangSC, "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: #8b8e9a;
  text-align: left;
}
.custom-block {
  padding: 8px 16px;
  margin: 20px 0;
  background-color: var(--block-tip-bg-color);
  border-left: 5px solid var(--el-color-primary);
  border-radius: 4px;
}
img {
  width: 50px;
}
.el-radio-group {
  width: 100%;
}
.el-form-item {
  margin-left: 40px;
}
.col {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 84px;
  text-align: center;
  border-top: 1px solid #dfe4ee;
  border-right: 1px solid #dfe4ee;
  border-left: 1px solid #dfe4ee;
  border-radius: 8px 8px 0 0;
}

/* 覆盖选中状态下的el-radio背景颜色 */
.radio {
  /* height: 84px; */
  background: "#dfe4ee";
  border: 1px solid #dfe4ee;
  border-radius: 0 0 8px 8px;
}
.el-radio {
  margin-left: 10px;
}
.tips {
  width: 414px;
  height: 18px;
  margin-top: 20px;
  font-family: PingFangSC, "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: #8b8e9a;
  text-align: left;
  white-space: nowrap;
}
.commodity {
  width: 372px;
  height: 18px;
  font-family: PingFangSC, "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: #2e2f33;
  text-align: left;
}
:deep(.el-card) {
  border-radius: 8px;
}
.card-content {
  width: 280px;
  .card-content-head {
    height: 64px;
    span {
      font-family: PingFangSC, "PingFang SC";
      font-size: 14px;
      font-weight: 600;
      color: #b9becd;
    }
  }
  .card-content-head2 {
    height: 64px;
    span {
      font-family: PingFangSC, "PingFang SC";
      font-size: 12px;
      font-weight: 400;
      color: #8b8e9a;
    }
  }
  .card-content-head3 {
    span {
      font-family: PingFangSC, "PingFang SC";
      font-size: 12px;
      font-weight: 400;
      color: #8b8e9a;
    }
  }
  .card-content-body {
    box-sizing: border-box;
    height: 36px;
    padding: 0 8px;
    line-height: 36px;
    border-top: 1px solid #dfe4ee;
    :deep(.el-radio) {
      height: 100%;
    }
  }
}
.el-menu-item {
  // width: 144px;
  // height: 36px;
  margin-bottom: 4px;
  border-radius: 4px;
}
.el-menu-item.is-active::before {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 4px;
  content: "";
  background-color: #ffffff;
}

.edit-box {
  height: calc(100vh - 110px);
  overflow: auto;
}

.pro-table-box {
  height: calc(100vh - 490px);
  overflow: auto;
}
.save-btn {
  margin-top: 20px;
  text-align: center;
  // margin-left: 30%;
  button {
    width: 150px;
  }
}
@import "./index.scss";
</style>
