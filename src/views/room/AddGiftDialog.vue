<template>
  <el-dialog v-model="dialogTableVisible" title="添加礼物" width="1200" style="border-radius: 8px">
    <el-input
      v-model="input1"
      style="width: 240px; margin-bottom: 10px"
      size="large"
      placeholder="礼物名称"
      :suffix-icon="Search"
    />
    <ProTable
      ref="proTable"
      :pagination="status"
      :columns="columns"
      :request-api="getTableList"
      :data-callback="dataCallback"
      @selection-change="handleSelectionChange"
      height="300px"
    >
      <template #price="scope"> ¥ {{ scope.row.price / 100 }} </template>
      <!-- 表格 header 按钮 -->
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
    </ProTable>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogTableVisible = false" round> 取消 </el-button>
        <el-button color="#3370FF" @click="submit" round>确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getGiftList } from "@/api/modules/gift";
import { Gift } from "@/api/interface";
import { extendGiftItem } from "@/api/modules/extend";
import { ColumnProps } from "@/components/ProTable/interface";
// import { ElTable } from "element-plus";
const props = defineProps({
  visible: Boolean
});
const roomId = ref();
const idList = ref([]);
const orgStoreId = ref();
const buttonShow = ref(true);
const handleSelectionChange = (val: string[]) => {
  let a = [];
  if (val != "") {
    buttonShow.value = false;
    orgStoreId.value = val[0].orgId;
    val.forEach(item => {
      a.push(item.id);
      idList.value = a;
    });
  } else {
    buttonShow.value = true;
    idList.value = val;
  }
  console.log(idList.value);
};
const submit = async () => {
  const newItem = {
    roomId: roomId.value,
    orgId: orgStoreId.value,
    giftLibIds: idList.value
  };
  await extendGiftItem(roomId.value, newItem).then(() => {
    ElMessage.success({ message: `保存成功！` });
    dialogTableVisible.value = false;
    emit("update");
  });
};
const input1 = ref("");
const emit = defineEmits(["update:visible", "update"]);
// 使用 dialogTableVisible 来存储组件内部的值
const dialogTableVisible = ref(props.visible);

const columns = reactive<ColumnProps<Gift.GiftList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  // { prop: "id", label: "序号" },
  // { prop: "orgId", label: "机构ID" },
  { prop: "name", label: "礼物名称", search: { el: "input" } },
  {
    prop: "img",
    label: "礼物图",
    render: scope => {
      return h("img", {
        src: scope.row.img,
        style: "width:30px;height:30px;"
      });
    }
  },
  { prop: "price", label: "礼物价格" }
]);
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const status = ref(true);
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  console.log(newParams, "newParams");
  status.value = false;
  return getGiftList(newParams);
};
const dataCallback = (data: any) => {
  console.log(data, "dataCallback");
  let list = [];
  giftDataList.value.forEach(item => {
    data.data.forEach(val => {
      if (val.id === item.giftLibId) {
        list.push(val);
      }
    });
    list.forEach(row => {
      proTable.value?.element.toggleRowSelection(row, true);
    });
  });
  return {
    list: data.data,
    total: data.total,
    pageNum: data.page,
    pageSize: data.pageSize
  };
};
const giftDataList = ref();
// const proTable = ref<InstanceType<typeof ElTable>>();
const proTable = ref();
const liveParams = (params: any, giftData: any) => {
  roomId.value = params;
  giftDataList.value = giftData;
};

// 监听外部值的变化，更新内部值
watch(
  () => props.visible,
  newValue => {
    dialogTableVisible.value = newValue;
  }
);

// 监听内部值的变化，触发更新外部值的事件
watch(
  () => dialogTableVisible.value,
  newValue => {
    emit("update:visible", newValue);
  }
);
defineExpose({
  liveParams
});
</script>

<style scoped>
.demo-tabs > .el-tabs__content {
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}
.table-empty {
  line-height: 30px;
}
</style>
