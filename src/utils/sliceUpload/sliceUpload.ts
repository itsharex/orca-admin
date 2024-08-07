import http from "@/api";
import { baseChunkSize, uploadUrl, vertifyUrl, mergeUrl, cancelUrl } from "@/config/sliceUpload";
import { ElLoading } from "element-plus";
//所有分片 ArrayBuffer[]
let allChunkList: string | any[] = [];
//已上传分片 ArrayBufferNum
let uploadedChunkNum = 0;
//上传进度
let progress = 0;
let fileId = "";
let bucket = "";
let key = "";
let fileName = "";
/**
 * @param {File} targetFile 目标上传文件
 * @returns
 */
async function uploadFile(
  file: { name: string; size: any },
  progress_cb: (arg: { progress: number; fileId: any; bucket: string; key: string; fileName: string; cancel: boolean }) => void
) {
  const loading = ElLoading.service({
    lock: true,
    text: "文件解析中,请耐心等候...",
    background: "rgba(0, 0, 0, 0.7)"
  });
  allChunkList = [];
  const sliceFileWorker = new Worker(new URL("./sliceFileWorker.ts", import.meta.url), { type: "module" }) as any;
  sliceFileWorker.postMessage({ targetFile: file, baseChunkSize });
  sliceFileWorker.onmessage = async (e: { data: { chunkList: any; fileHash: any; length: any } }) => {
    // 分批次接收chunkList
    const { chunkList, fileHash, length } = e.data;
    allChunkList = [...allChunkList, ...chunkList];
    if (allChunkList.length != length) return;
    uploadedChunkNum = 0;
    progress = 0;
    fileId = "";
    bucket = "";
    key = "";
    fileName = file.name;

    //发送请求,获取文件上传状态
    if (vertifyUrl) {
      try {
        const { data } = (await http.post(
          vertifyUrl,
          {
            fileMd5: fileHash,
            fileSize: file.size,
            filePart: allChunkList.length,
            fileName: file.name
          },
          { loading: false }
        )) as { data: { fileId: string; bucket: string; key: string; fastStatus: number } };
        loading.close();
        fileId = data.fileId;
        bucket = data.bucket;
        key = data.key;
        if (data.fastStatus == 1) {
          return progress_cb({
            progress: 100,
            fileId,
            bucket,
            key,
            fileName: file.name,
            cancel: false
          });
        }
        asyncPool(allChunkList, fileId, progress_cb)
          .then(async () => {
            //发送请求，通知后端进行合并
            const res = await http.post(mergeUrl, { fileId }, { loading: false });
            if (String(res.code) !== "200") {
              progress_cb({
                progress: 0,
                fileId,
                bucket,
                key,
                fileName: fileName,
                cancel: true
              });
            }
          })
          .catch(async () => {
            allChunkList = [];
            // 取消上传
            await http.post(cancelUrl, { fileId: fileId }, { loading: false });
            progress_cb({
              progress: 0,
              fileId,
              bucket,
              key,
              fileName: fileName,
              cancel: true
            });
          });
      } catch (error) {
        console.log("error", error);
        loading.close();
      }
    }
  };
}

async function uploadChunk(
  chunk: BlobPart,
  index: string | Blob,
  fileId: string | Blob,
  uploadUrl: string,
  progress_cb: (arg: { progress: number; fileId: any; bucket: string; key: string; fileName: string; cancel: boolean }) => void
) {
  let formData = new FormData();
  //注意这里chunk在之前切片之后未ArrayBuffer，而formData接收的数据类型为 blob|string
  formData.append("file", new Blob([chunk]));
  formData.append("partNum", index);
  formData.append("fileId", fileId);
  const response = await http.post(uploadUrl, formData, { loading: false });
  //上传成功后，更新已上传分片数
  uploadedChunkNum++;
  //上传进度
  progress = Math.ceil((uploadedChunkNum / allChunkList.length) * 100);
  if (progress >= 100) progress = 100;
  progress_cb({
    progress,
    fileId,
    bucket,
    key,
    fileName: fileName,
    cancel: false
  });
  return response;
}
/**
 * @param {number} poolLimit 限制的并发数
 * @param {array} array 任务数组
 * @returns
 */
async function asyncPool(
  array: any[],
  fileId: string | Blob,
  progress_cb: (arg: { progress: number; fileId: any; bucket: string; key: string; fileName: string; cancel: boolean }) => void
) {
  // Math.ceil(100 / allChunkList.length)
  const poolLimit = 2; // 并发数
  const ret = []; // 存储所有的异步任务
  const executing: any[] = []; // 存储正在执行的异步任务
  for (const [index, item] of array.entries()) {
    const p = Promise.resolve().then(() => uploadChunk(item, String(index + 1), fileId, uploadUrl, progress_cb));
    ret.push(p); // 保存新的异步任务

    // 当poolLimit值小于或等于总任务个数时，进行并发控制
    if (poolLimit <= array.length) {
      // 当任务完成后，从正在执行的任务数组中移除已完成的任务
      const e: any = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e); // 保存正在执行的异步任务
      if (executing.length >= poolLimit) {
        await Promise.race(executing); // 等待较快的任务执行完成
      }
    }
  }
  return Promise.all(ret);
}
export { uploadFile };
