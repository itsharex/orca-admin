<template>
  <div class="tips mb15 pl6">免审词库可用于直播间，如观众发送消息为免审词，则无需审核，直接展示（即所有观众可见）</div>
  <el-form class="mb15 pl6" ref="ruleFormRef" label-width="120px" label-position="top" require-asterisk-position="left">
    <el-form-item label="免审词">
      <div style="display: flex; width: 100%">
        <el-input v-model="formInline.name" placeholder="请输入" clearable style="width: 320px"></el-input>
        <div class="search-btn">
          <el-button round color="rgba(51,112,255,0.1)" @click="search"> 搜索 </el-button>
          <el-button round @click="reset"> 重置 </el-button>
        </div>
        <div class="add-btn">
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" round>新增免审词库</el-button>
        </div>
      </div>
    </el-form-item>
  </el-form>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :init-param="formInline"
      :request-api="getTableList"
      :data-callback="dataCallback"
    >
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="openDrawer('编辑', scope.row)">配置</el-button>

        <el-popconfirm
          title="你确定要删除吗?"
          :icon="WarningFilled"
          width="250"
          confirm-button-text="删除"
          cancel-button-type="default"
          icon-color="#FF8800"
          @confirm="deleteItem(scope.row)"
        >
          <template #reference>
            <el-button type="primary" link>删除</el-button>
          </template>
        </el-popconfirm>
      </template>
      <template #name="scope">
        <div class="words-box">
          <div>
            <span class="words-title">{{ scope.row.name }}</span>
            <el-popover
              :ref="el => (popoverRef[scope.row.id] = el)"
              @show="wordsName = scope.row.name"
              @hide="wordsName = ''"
              placement="top"
              :width="240"
              trigger="click"
            >
              <el-input
                v-model="wordsName"
                maxlength="30"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
              />
              <div style="text-align: right; margin-top: 10px">
                <el-button size="small" round @click="popoverRef[scope.row.id].hide()">取消</el-button>
                <el-button size="small" round type="primary" @click="onEditWords(scope.row)">保存</el-button>
              </div>
              <template #reference>
                <el-icon color="#3370FF" size="12" class="cursor-pointer"><EditPen /></el-icon>
              </template>
            </el-popover>
          </div>
          <span class="words-text">{{ scope.row.words.join("；") }}</span>
        </div>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
    </ProTable>
    <WordDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="exemptList">
import { CirclePlus, WarningFilled } from "@element-plus/icons-vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { getWordList, WordDelete, addWord, updateWord } from "@/api/modules/exempt";
import { Gift } from "@/api/interface";
import WordDrawer from "./components/WordDrawer.vue";
const popoverRef = ref([]);
const wordsName = ref("");
// ProTable 实例 禁用 INVALID / 正常 (启用) (激活)  VALID
const proTable = ref<ProTableInstance>();
const columns = reactive<ColumnProps<Gift.GiftList>[]>([
  { prop: "name", label: "免审词库", align: "left" },
  { prop: "operation", label: "操作", width: 280, fixed: "right" }
]);
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.page,
    pageSize: data.pageSize
  };
};
// 删除信息
const deleteItem = async (params: Gift.GiftList) => {
  await useHandleData(WordDelete, params.id, `删除免审词库组${params.name}`, "warning", false);
  proTable.value?.getTableList();
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  console.log(newParams, "newParams");
  return getWordList(newParams);
};
const onEditWords = async (row: any) => {
  if (!wordsName.value) {
    return ElMessage.warning("请输入免审词名称");
  }
  const params = {
    id: row.id,
    orgId: row.orgId,
    words: row.words,
    name: wordsName.value
  };
  const res: any = await updateWord(params);
  if (res.code === 200) {
    ElMessage.success("编辑成功");
    popoverRef.value[row.id].hide();
    proTable.value?.getTableList();
    wordsName.value = "";
  }
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof WordDrawer> | null>(null);
const openDrawer = async (title: string, row: Partial<Gift.GiftList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row, name: row.name, words: row.words ? row.words : [""] },
    api: title === "新增" ? addWord : title === "编辑" ? updateWord : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
const formInline = reactive({
  page: 1,
  pageSize: 10,
  name: ""
});
const search = () => {
  proTable.value?.search();
};
const reset = () => {
  formInline.name = "";
};
</script>

<style lang="scss" scoped>
* {
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 13px;
}

.table-box {
  height: calc(100vh - 300px);
  overflow: auto;
}

.tips {
  margin-top: 10px;
  color: #8b8e9a;
}

.words-box {
  display: flex;
  flex-direction: column;
  .words-title {
    color: #2e2f33;
  }
  .words-text {
    color: #8b8e9a;
  }
}

.add-btn {
  width: 50%;
  text-align: end;
  button {
    font-size: 14px;
  }
}

.search-btn {
  width: 50%;
  margin-left: 10px;
  button {
    color: #3370ff;
    border: 1px solid rgba(51, 112, 255, 0.4);
    font-size: 14px;
  }
}
</style>
